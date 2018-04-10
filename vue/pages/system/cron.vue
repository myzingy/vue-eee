<style>

</style>
<template>
    <v-layout>
        <div slot="main">
            <el-select v-model="query.cron.path" placeholder="cron 路径" clearable @change="getData">
                <el-option
                        v-for="(item,key) in getCronActs"
                        :key="key"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select v-model="query.cron.crontime.gt"
                       placeholder="任务分类"
                       style="width: 100px;"
                       clearable @change="getData">
                <el-option
                        v-for="(item,key) in [{label:'全部',val:-1},{label:'计划任务',val:0}]"
                        :key="key"
                        :label="item.label"
                        :value="item.val">
                </el-option>
            </el-select>
            <el-select v-model="query.cron.status"
                       placeholder="任务状态"
                       style="width: 100px;"
                       clearable @change="getData">
                <el-option
                        v-for="(item,key) in [{label:'未执行',val:0},{label:'执行成功',val:2},{label:'执行失败',val:-1}]"
                        :key="key"
                        :label="item.label"
                        :value="item.val">
                </el-option>
            </el-select>
            <el-input :placeholder="$t('模糊搜索 Params')" v-model="query.cron.param.like"
                      @keyup.enter.native="getData"
                      style="width: 300px"
                      >
                <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
            </el-input>
            <el-button @click="getData('running')" type="primary">{{$t('正在执行的任务')}}</el-button>
            <div style="margin-top: 10px">
                <el-pagination style=" margin: 20px auto 0; width:300px;"
                               @current-change="handleCurrentChange"
                               :page-size="pager.limit"
                               layout="slot, prev, pager, next"
                               :total="total"
                               slot="total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:total})}}</span>
                    </template>
                </el-pagination>
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%" :stripe="true">
                    <el-table-column
                            prop="id"
                            label="ID"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            prop="path"
                            label="Path"
                            width="180">
                        <template slot-scope="scope">
                            {{scope.row.path.replace('api/cron.','')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="param"
                            label="Params"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="Status/Retry"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-tag type="danger" v-if="scope.row.retry==0">未执行</el-tag>
                            <el-tag type="success" v-else-if="scope.row.status==2">成功</el-tag>
                            <el-tag type="info" v-else-if="scope.row.status==-1">错误</el-tag>
                            <el-tag v-else="">重试中</el-tag>
                            &nbsp;({{scope.row.retry}})
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="retry"
                            label="Created/Updated At"
                            width="150"
                    >
                        <template slot-scope="scope">
                            <span v-date="['',scope.row.created_at]"></span>
                            <br/>
                            <span v-date="['',scope.row.updated_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="retry"
                            label="crontime"
                            width="150"
                    >
                        <template slot-scope="scope">
                            <span v-date="['',scope.row.crontime]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            width="130" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="openDialog(scope.row,true)" type="text" size="small">
                                {{$t('执行任务')}}
                            </el-button>
                            <el-button type="text" size="small"
                                       v-if="scope.row.retry>0"
                                       @click="openDialog(scope.row)">
                                {{$t('查看结果')}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style=" margin: 20px auto 0; width:300px;"
                               @current-change="handleCurrentChange"
                               :page-size="pager.limit"
                               layout="slot, prev, pager, next"
                               :total="total"
                               slot="total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:total})}}</span>
                    </template>
                </el-pagination>
            </div>
            <el-dialog :title="$t('Cron Data')" :visible.sync=" dialogTableVisible " :close-on-click-modal="false"
                       :close-on-press-escape="false" width="80%">
                <div style="width: 100%; max-height: 200px; overflow-y: auto;">
                    {{cronData.path}}
                    <br>
                    {{cronData.param}}
                </div>
                <el-button @click="retryCron" type="primary" v-if="retryCronBut">{{$t('执行任务')}}</el-button>
                <textarea style="width:100%; height:300px; margin-top: 10px">{{cronData.message||'未执行'}}</textarea>
                <span slot="footer" class="dialog-footer">
                            <el-button @click="closeDialog">{{$t('关 闭')}}</el-button>
                          </span>
            </el-dialog>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    var App= {
        data () {
            return {
                dialogTableVisible:false,
                tableData:[],
                total:0,
                pager:{
                    page:1,
                    offset:0,
                    limit:30,
                    orderby:'cron.id desc',
                },
                query:{
                    'this':{},
                    'cron':{
                        path:'',
                        param:{
                            like:'',
                        },
                        status:'',
                        crontime:{
                            'gt':-1,
                        }
                    },
                },
                getCronActs:[],
                cronData:{},
                retryCronBut:false,
            };
        },
        mounted(){
            vk.http(uri.getCronActs,{},this.then);
            this.getData();

        },
        methods: {
            ...vk,
            then(json,code){
                switch(code){
                    case uri.getCrons.code:
                        this.tableData = json.list;
                        this.total=0;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.getCronActs.code:
                        this.getCronActs=json.data;
                        break;
                    case uri.runCron.code:
                        this.cronData.message=json.info;
                        this.getData();
                        break;
                }
            },
            getData(type=""){
                this.pager.offset=(this.pager.page-1)*this.pager.limit;
                this.query['this']=this.pager;
                let query=JSON.parse(JSON.stringify(this.query));
                if('running'==type){
                    query.this.offset=0;
                    query.cron={'running':'running'};
                }
                vk.http(uri.getCrons,query,this.then);
            },
            openDialog(row,retry=false){
                this.retryCronBut=retry;
                this.cronData=row;
                this.dialogTableVisible=true;
            },
            closeDialog(){
                this.dialogTableVisible=false;
            },
            handleCurrentChange(page){
                this.pager.page=page;
                this.getData();
            },
            retryCron(){
                vk.http(uri.runCron,{id:this.cronData.id},this.then);
            }
        }
    }
    export default {i18n,...App}
</script>