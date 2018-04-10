<style lang="stylus" rel="stylesheet/scss">
    .input-with-select .el-select .el-input {
        width: 130px;
    }
    
    .el-form-item__error{
        line-height: 1;
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <div >
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-input :placeholder="$t('扫码录入物流编号')" v-model="track_no"
                                  @keyup.enter.native="trackNoPush"
                                  class="input-with-select" ref="track_no">
                        </el-input>
                    </el-col>
                    <el-col :span="2">
                        &nbsp;
                    </el-col>
                    <el-col :span="14">
                        <el-input :placeholder="$t('请输入内容后回车')" v-model="searchArgs.value"
                                  @keyup.enter.native="search"
                                  class="input-with-select">
                            <span slot="prepend">{{$t('物流编号')}}</span>
                            <el-button slot="append" icon="el-icon-search" @click="search">Query</el-button>
                        </el-input>
                    </el-col>
                </el-row>

                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: 10px;"
                        :height="height(160)"
                        :default-expand-all="false"
                        :row-class-name="tableRowClassName"
                        @filter-change="filterChange"
                        ref="tableData"
                >
                    <el-table-column
                            prop="shipping_track_no"
                            :label="$t('物流单号')"
                    ></el-table-column>
                    <el-table-column
                            :label="$t('操作人')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <div>{{getUserName(scope.row.uid)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipment_return_count"
                            :label="$t('匹配数量')"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shipment_return_id"
                            :label="$t('退回 IDS')"
                            width="150"
                    >
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
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    var App= {
        props:['query'],
        components:{},
        data () {
            return {
                tableData:[],
                total:0,
                searchArgs:{
                    key:"shipping_track_no",
                    value:"",
                },
                filterArgs:{},
                operationData:{},
                outerDialogVisible:false,
                outerDialogSaveButton:false,
                outerDialogFull:false,
                outerDialogType:"",
                cateStr:"",
                outerCommonDialogVisible:false,
                pager:{
                    page:1,
                    offset:0,
                    limit:30,
                    orderby:'orderreturntrackno.created_at desc',
                },
                track_no:"",
            };
        },
        mounted(){
            this.$refs['track_no'].focus();
            this.search();
        },
//        watch:{
//            'query':function(newVal){
//                this.search();
//            }
//        },
        methods: {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.getReturnTrackno.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.pushReturnTrackno.code:
                        this.track_no="";
                        this.search();
                        break;
                }
            },
            handleCurrentChange(page){
                this.pager.page=page;
                this.search();
            },
            removePower(data){
                let that=this;
                vk.confirm(i18n.t('确认删除吗?'),function(){
                    vk.http(uri.deletePower,{id:data.id},that.then);
                });
            },
            closeDialog(){
                this.outerDialogVisible=false;
            },
            tableRowClassName({row, rowIndex}) {
                return 'success-row';
            },
            operationCommand(param){
                this.operationData=this.tableData[param.index];
                switch (param.command){
                    case '查看':
                        this.outerDialogType='orderInfoPack';
                        this.outerDialogFull=true;
                        this.outerDialogVisible=true;
                        this.outerDialogSaveButton=false;
                        var that=this;
                        setTimeout(function(){
                            that.$refs.orderInfoPack.initPage();
                        },0);
                        break;
                    case '备注':
                        this.openCommentDialog('222');
                        break;
                    case 'STATUS':
                        vk.http(uri.setReturnStatus,{
                            return_id:this.operationData.id,
                            status:param.status,
                        },this.then);
                        break;
                }
            },
            openCommentDialog(cateStr,params={}){
                var that=this;
                setTimeout(function(){
                    that.$refs.DialogOrderComment.openCommentDialog(cateStr,params);
                },0);
            },
            search(){
                let query={
                    orderreturntrackno:{}
                };
                query.this=this.pager;
                //let query=this.$refs.query.getQuery(this.pager);
                if(this.searchArgs.value){
                    query.orderreturntrackno[this.searchArgs.key]={like:this.searchArgs.value};
                }
                vk.http(uri.getReturnTrackno,query,this.then);
            },
            filterChange(filters){
                let filterArgs={};
                for(var key in filters){
                    filterArgs[key]=filters[key][0];
                }
                console.log(filterArgs);
                this.filterArgs=filterArgs;
                this.search();
            },
            commentSaveAfter(obj){
                this.search();
            },
            openQuery(){
                this.$refs.query.openQuery();
            },
            updatePen(val,params){
                console.log(val,params);
                params.row.newVal=val;
                this.openCommentDialog(230,params);
            },
            trackNoPush(){
                vk.http(uri.pushReturnTrackno,{
                    track_no:this.track_no
                },this.then);
            }
        }
    }
    export default {i18n,...App}
</script>