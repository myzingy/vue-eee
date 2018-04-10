<style>

</style>
<template>
    <v-layout>
            <div slot="main">
                <el-row :gutter="24">
                    <el-col :span="4" >
                        <el-button type="primary" @click="openDialog">{{$t('新建大包裹')}}</el-button>
                    </el-col>
                    <el-col :span="20">
                        <el-input :placeholder="$t('请输入内容后回车')" v-model="query.emb.name.like"
                                  @keyup.enter.native="getData"
                                  class="input-with-select">
                            <span slot="prepend">{{$t('名称')}}</span>
                            <el-button slot="append" icon="el-icon-search" @click="getData">Query</el-button>
                        </el-input>
                    </el-col>
                </el-row>
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
                                    <el-button type="text" @click="openDialog(row)" v-if="row.status<3">{{$t('修改包裹')
                                        }}</el-button>
                                </div>
                            </el-step>
                            <el-step :title="$t('扫码打包')">
                                <div slot="description">
                                    <el-button type="primary" round size="mini"
                                               @click="openScanDialog(row)"
                                        v-if="row.status<3">
                                        {{$t('扫码录入')}}
                                    </el-button>
                                </div>
                            </el-step>
                            <el-step :title="$t('发送物流')">
                                <div slot="description">
                                    <el-button type="primary" round size="mini" @click="actionExport(row)"
                                               >
                                        {{$t('导出包裹信息')}}</el-button>
                                    <el-button type="success" round size="mini" @click="openDialog(row,true)"
                                               v-if="row.status<4">
                                        {{$t('录入运单号')}}</el-button>
                                </div>
                            </el-step>
                            <el-step :title="$t('扫码解包')">
                                <div slot="description">
                                    {{$t('扫码 打面单 发货')}}
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
                            <el-select v-model="form.shipping_method" :placeholder="$t('请选择线路')" :disabled="disabled_shipping_method">
                                <el-option
                                        v-for="item in shipments"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('包裹名称')" prop="name" >
                            <el-input v-model="form.name" :disabled="disabled_name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('物流公司')" prop="shipping_track_method" v-if="shipping_track_no">
                            <el-input v-model="form.shipping_track_method"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('物流单号')" prop="shipping_track_no" v-if="shipping_track_no">
                            <el-input v-model="form.shipping_track_no"></el-input>
                        </el-form-item>
                    </el-form>

                    <template v-if="failData.length>0">
                        <el-table
                                :data="failData"
                                style="width: 100%"
                                max-height="250">
                            <el-table-column
                                    prop="increment_id"
                                    :label="$t('订单号')"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="ext_order_id"
                                    :label="$t('订单编号')"
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="msg"
                                    label="Message"
                                    >
                            </el-table-column>
                        </el-table>
                    </template>
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
    import newpage from '../common/newpage';
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
                disabled_name:false,
                disabled_shipping_method:false,
                query:{
                    emb:{
                        name:{like:''}
                    },
                },
                failData:[],
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
                        if(json.fail){
                            vk.toast(i18n.t('操作失败'));
                            this.failData=json.fail;
                            return;
                        }else{
                            this.failData=[];
                        }
                        this.closeDialog();
                        this.getData();
                        break;
                    case uri.actionExport.code:
                        if(json.url){
                            return newpage.href(json.url);
                        }
                        vk.toast(json.message);
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
                        shipping_track_method:row.shipping_track_method,
                    };
                    this.disabled_name=row.status>2 || !!shipping_track_no;
                    this.disabled_shipping_method=row.status>0;
                }else{
                    this.disabled_name=false;
                    this.disabled_shipping_method=false;
                }
                this.shipping_track_no=!!shipping_track_no;
                this.failData=[];
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
                    status:row.status,
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
            actionExport(row){
                newpage.open();
                vk.http(uri.actionExport,{id:row.id},this.then);
            }
        }
    }
    export default {i18n,...App}
</script>