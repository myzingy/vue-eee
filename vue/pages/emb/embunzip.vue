<style>

</style>
<template>
    <v-layout>
        <div slot="main">
            <el-input :placeholder="$t('请输入内容后回车')" v-model="query.emb.name.like"
                      @keyup.enter.native="getData"
                      class="input-with-select">
                <span slot="prepend">{{$t('名称')}}</span>
                <el-button slot="append" icon="el-icon-search" @click="getData">Query</el-button>
            </el-input>
                <div style="padding: 10px;">

                    <template v-for="(row,i) in tableData">
                        <el-steps :active="row.status">
                            <el-step>
                                <div slot="title">
                                    {{row.name || row.shipping_method}}
                                </div>
                                <div slot="description">
                                    <div>ID:{{row.id}},{{$t('线路')}}:{{row.shipping_method}}</div>
                                    <div v-date="[,row.created_at]"></div>
                                </div>
                            </el-step>
                            <el-step :title="$t('扫码打包')">
                                <div slot="description">
                                    Total: {{row.total_in}}
                                </div>
                            </el-step>
                            <el-step :title="$t('发送物流')">
                                <div slot="description">
                                    {{row.shipping_track_method}}
                                    <br/>
                                    {{row.shipping_track_no}}
                                </div>
                            </el-step>
                            <el-step :title="$t('扫码解包')">
                                <div slot="description">
                                    <el-button type="primary" round size="mini"
                                               @click="openScanDialog(row,true)">{{$t('扫码 打面单 发货')}}</el-button>
                                </div>
                            </el-step>
                            <el-step>
                                <div slot="description" style="margin-left: -20px; margin-top: 10px; text-align: center">

                                    <el-progress type="circle" :percentage="percentage(row)" :width="60"></el-progress>
                                    <div>
                                        <el-button type="text" icon="el-icon-view"
                                                   @click="openScanDialog(row,true,true)">
                                            {{row.total_out}}/{{row.total_in}}
                                        </el-button>
                                    </div>
                                </div>
                            </el-step>
                        </el-steps>
                    </template>
                    <el-pagination style=" margin: 20px auto 0; width:300px;" v-if="tableData.length>0"
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
                <el-dialog :title="$t('编辑')" :visible.sync=" dialogTableVisible " :close-on-click-modal="false"
                           :close-on-press-escape="false">
                    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                        <el-form-item :label="$t('线路')" prop="shipping_method">
                            <el-select v-model="form.shipping_method" :placeholder="$t('请选择线路')">
                                <el-option
                                        v-for="item in shipments"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('包裹名称')" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('物流单号')" prop="shipping_track_no" v-if="shipping_track_no">
                            <el-input v-model="form.shipping_track_no"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeDialog">{{$t('取 消')}}</el-button>
                        <el-button type="primary" @click="updateDialog">{{$t('确 定')}}</el-button>
                      </span>
                </el-dialog>
                <el-dialog :title="$t('扫码')" :visible.sync=" dialogScanVisible " :close-on-click-modal="false"
                           :close-on-press-escape="false">
                    <scan ref="scan" :emb="form" :unzip="unzip" :disopc="disopc" @closeScanAfter="closeScanAfter"></scan>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogScanVisible=false">{{$t('关 闭')}}</el-button>
                      </span>
                </el-dialog>
            </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import scan from './scan/scan.vue';
    var App= {
        components:{
            scan
        },
        data () {
            return {
                form:{},
                dialogTableVisible:false,
                rules:{
                    shipping_method:[
                        {required: true, message: i18n.t('请选择线路'), trigger: 'blur'}
                    ],
                },
                shipments:[],
                pager:{
                    page:1,
                    offset:0,
                    limit:5,
                    orderby:'emb.id desc',
                },
                tableData:[],
                total:0,
                shipping_track_no:false,
                dialogScanVisible:false,
                unzip:false,
                disopc:false,
                query:{
                    emb:{
                        name:{like:''},
                        status:{'>':2},
                    },
                }
            };
        },
        mounted(){
            let conf=vk.getCache(uri.getConf).data.shipments;
            let shipments=[];
            for(let key in conf){
                if(key.indexOf('EMB')>-1){
                    shipments.push({
                        value:key,
                        label:conf[key],

                    });
                }
            }
            this.shipments=shipments;
            this.getData();
        },
        methods: {
            handleCurrentChange(page){
                this.pager.page=page;
                this.getData();
            },
            getData(){
                this.pager.offset=(this.pager.page-1)*this.pager.limit;
                let query={
                    this:this.pager,
                }
                Object.assign(query,this.query);
                vk.http(uri.getEmbs,query,this.then);
            },
            then(json,code){
                switch(code){
                    case uri.getEmbs.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.updateEmb.code:
                        this.closeDialog();
                        this.getData();
                        break;
                }
            },
            updateDialog(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        vk.http(uri.updateEmb,this.form,this.then);
                    } else {
                        return false;
                    }
                });
            },
            openDialog(row,shipping_track_no){
                if(row){
                    this.form={
                        id:row.id,
                        name:row.name,
                        shipping_method:row.shipping_method,
                        shipping_track_no:row.shipping_track_no,
                    };
                }
                this.shipping_track_no=!!shipping_track_no;
                this.dialogTableVisible=true;
            },
            closeDialog(){
                this.dialogTableVisible=false;
            },
            closeScanAfter(){

            },
            openScanDialog(row,unzip=false,disopc=false){
                this.form={
                    id:row.id,
                    name:row.name,
                    shipping_method:row.shipping_method,
                    shipping_track_no:row.shipping_track_no,
                };
                this.dialogScanVisible=true;
                this.unzip=unzip;
                this.disopc=disopc;
                let that=this;
                setTimeout(function(){
                    that.$refs.scan.pageInit();
                },0);
            },
            percentage(row){
                if(row.total_in<1) return 0;
                return (row.total_out/row.total_in)*100;
            },
        }
    }
    export default {i18n,...App}
</script>