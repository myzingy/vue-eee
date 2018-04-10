<style lang="stylus" rel="stylesheet/scss">
    .input-with-select .el-select .el-input {
        width: 130px;
    }
    
    .el-form-item__error{
        line-height: 1;
    }
    .printForm {
        .el-form-item__label{
            line-height: 10px;
        }
        .el-form--label-top .el-form-item__label{
            padding-bottom: 0;
        }
        .el-form-item{
            margin-bottom: 10px;
        }
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <div >
                <el-row :gutter="24">
                    <el-col :span="4" style="text-align: center">
                        <span style="font-size: 100px; color: #0d6aad;">{{total}}</span>
                    </el-col>
                    <el-col :span="16">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span></span>
                                <el-switch
                                        v-model="printing"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        :active-text="$t('扫码后自动打印面单并发货')"
                                        :inactive-text="$t('手动处理')">
                                </el-switch>
                            </div>
                            <el-input :placeholder="$t('请扫码或输入订单号')" v-model="searchArgs.value"
                                      :autofocus="true"
                                      @keyup.enter.native="search"
                                      class="input-with-select">
                                <span slot="prepend">SCAN</span>
                                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                            </el-input>
                        </el-card>
                    </el-col>
                    <el-col :span="4" style="text-align: center">
                        <el-form label-position="top" label-width="80px" class="printForm">
                            <div v-for="(method_index,method_key) in printOption">
                                <select v-model="printOption[method_key]" style="width: 98%; margin-top:10px"
                                        @change="printDevicesChangeWaybill($event,method_key)">
                                    <option :value="-1">{{method_key}} Printer ?</option>
                                    <template v-for="(item,index) in printDevices">
                                        <option :value="index">{{item}}</option>
                                    </template>
                                </select>
                            </div>
                        </el-form>
                    </el-col>
                </el-row>

                <!--<h1>{{$t('order.delivery.total',{total:total})}}</h1>-->


                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: 10px;"
                        :height="height(260)" type="expand"
                        :default-expand-all="true"
                        :row-class-name="tableRowClassName"
                        @filter-change="filterChange"
                        ref="tableData"
                    >
                    <el-table-column type="expand" width="50" fixed>
                        <template slot-scope="props">
                            <div>
                                <orderShipmentPack :order="props.row" :noPen="true"></orderShipmentPack>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            width="120" >
                    </el-table-column>
                    <el-table-column
                            prop="expedited"
                            :label="$t('加急')"
                            width="80"
                            >
                        <template slot-scope="props">
                            <el-tag type="success" v-if="props.row.expedited==2">{{$t('加急')}}</el-tag>
                            <el-tag type="danger" v-if="props.row.expedited==1">{{$t('加急')}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="order_type"
                            :label="$t('类型')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            {{$t('order.type.'+scope.row.order_type)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="stockPresell.storehouse_name"
                            :label="$t('仓库')"
                            width="80"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('创建时间')"
                            width="200"
                    >
                        <template slot-scope="props">
                            <span v-date="['YYYY-MM-DD HH:II',props.row.created_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('订单状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            {{$t('order.status.'+scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="last_track_status"
                            :label="$t('跟踪状态')"
                            width="100"
                    >
                        <template slot-scope="scope">

                            <el-tag type="danger" v-if="scope.row.last_track_status!='normal'">
                                {{$t('order.status.'+scope.row.last_track_status)}}
                            </el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <orderCommentPack :target="props.row" type="order"></orderCommentPack>
                        </template>
                    </el-table-column>

                    <el-table-column
                            :label="$t('操作')"
                            fixed="right">
                        <template slot-scope="scope">

                            <el-dropdown @command="operationCommand" trigger="click">
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{command:'备注',index:scope.$index}">
                                        {{$t('备注添加')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'异常',index:scope.$index}">
                                        {{$t('异常件问题')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'联系',index:scope.$index}">
                                        {{$t('联系客户')}}
                                    </el-dropdown-item>
                                    <!--<el-dropdown-item :command="{command:'发票',index:scope.$index}"-->
                                        <!--v-if=" scope.row.shipping_method=='ARAMEX' "-->
                                    <!--&gt;-->
                                        <!--{{$t('打印发票')}}-->
                                    <!--</el-dropdown-item>-->
                                    <el-dropdown-item :command="{command:'面单',index:scope.$index}"
                                                      v-if="scope.row.shipping_method!='EUB'">
                                        {{$t('打印面单')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'发货',index:scope.$index}">
                                        {{$t('已发货')}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
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
                <DialogOrderInfo @openCommentDialog="openCommentDialog"
                                 :order="operationData"
                                 ref="DialogOrderInfo"></DialogOrderInfo>
                <DialogOrderComment
                        :order="operationData"
                        ref="DialogOrderComment"
                        @commentSaveAfter="commentSaveAfter"></DialogOrderComment>
                <query ref="query" @search="search" type="delivery"></query>
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
    import orderItemsPack from './order.items.pack.vue'
    import orderShipmentPack from './order.shipment.pack.vue'
    import orderUserPack from './order.user.pack.vue'
    import DialogOrderInfo from './common/order.info.dialog.vue';
    import DialogOrderComment from './common/order.comment.dialog.vue';
    import orderCommentPack from '../common/comment.but-list.vue'
    import lodop from '../common/lodop/print.waybill';
    import query from './query.pack.vue';
    var App= {
        props:['query'],
        components:{
            orderItemsPack,
            DialogOrderInfo,
            DialogOrderComment,
            orderShipmentPack,
            orderUserPack,
            orderCommentPack,
            query
        },
        data () {
            return {
                tableData:[],
                total:0,
                searchArgs:{
                    key:"increment_id",
                    value:"",
                },
                searchBaseArgs:{},
                filterArgs:{},
                operationData:{},
                outerDialogVisible:false,
                outerDialogSaveButton:false,
                outerDialogFull:false,
                outerDialogType:"",
                cateStr:"",
                outerCommonDialogVisible:false,
                printing:true,
                pager:{
                    page:1,
                    offset:0,
                    limit:10,
                    orderby:'order.updated_at desc',
                },
                printOption:{
                    //waybill:'',
                    //invoice:'',
                    'DHL':-1,
                    'UPS':-1,
                    //'EUB':-1,
                    'FEDEX':-1,
                    'ARAMEX':-1
                },
                printDevices:[],
                autoScanDelivery:false,//扫码后发货
                //shipping_method:[],
            };
        },
        mounted(){
            //let shipments=vk.getCache(uri.getConf)['data'].shipments;
            //this.shipping_method=shipments;
            
            let printOption=vk.ls('this.printOption');
            if(printOption){
                this.printOption=printOption;
            }
            this.search();
            lodop.init();
            let that=this;
            setTimeout(function(){
                console.log('CLODOP',CLODOP);
                let lc=CLODOP.GET_PRINTER_COUNT();
                console.log('lc',lc);
                for(let i=0;i<lc;i++){
                    let ln=CLODOP.GET_PRINTER_NAME(i);
                    console.log('ln',ln);
                    that.printDevices.push(ln);
                }
            },1500);
        },
//        watch:{
//            'query':function(newVal){
//                this.setBaseQuery();
//                this.search();
//            }
//        },
        methods: {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.orderQuery.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        if(this.searchArgs.value && json.total==1){
                            this.autoScanDelivery=true;
                            vk.http(uri.orderDelivery,{id:json.list[0].id},this.then);
                        }
                        break;
                    case uri.orderDelivery.code:
                        if(this.printing && json.data.shipping_method!='EUB'){
                            let img=vk.cgi('file/waybill?id='
                                +json.data.id
                                +'&method='+json.data.shipping_method
                            );
                            lodop.printWaybill(img,json.data.shipping_method,json.data.increment_id);
                        }
                        if(!this.autoScanDelivery){ //手动发货
                            this.searchArgs.value="";
                            this.search();
                        }
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
                    case '异常':
                        this.openCommentDialog('1001');
                        break;
                    case '备注':
                        this.openCommentDialog('222');
                        break;
                    case '联系':
                        this.openCommentDialog('1006');
                        break;
                    case '退款':
                        this.openCommentDialog('1005');
                        break;
                    case '待定':
                        this.openCommentDialog('1009');
                        break;
                    case '取待':
                        this.openCommentDialog('210');
                        break;
                    case '加急':
                        this.openCommentDialog('211');
                        break;
                    case '取消':
                        this.openCommentDialog('212');
                        break;
                    case '发票':
                        //if(!this.checkPrint()) return;
                        let invoiceImg=vk.cgi('file/waybill?id='
                            +this.operationData.id
                            +'&method='+this.operationData.shipping_method
                            +'&type=invoice'
                        );
                        lodop.printWaybill(invoiceImg,this.operationData.shipping_method,this.operationData.increment_id);
                        break;
                    case '面单':
                        if(!this.checkPrint()) return;
                        let img=vk.cgi('file/waybill?id='
                            +this.operationData.id
                            +'&method='+this.operationData.shipping_method
                        );
                        lodop.printWaybill(img,this.operationData.shipping_method,this.operationData.increment_id);
                        break;
                    case '发货':
                        if(!this.checkPrint()) return;
                        let that=this;
                        this.autoScanDelivery=false;
                        let title='已发货？';
                        if(that.operationData.shipping_method=='EUB'){
                            title='确认已经找到 EUB 面单，执行发货？';
                        }
                        vk.confirm(i18n.t(title),function(){
                            vk.http(uri.orderDelivery,{id:that.operationData.id},that.then);
                        })
                        break;
                }
            },
            openCommentDialog(cateStr,params={}){
                var that=this;
                setTimeout(function(){
                    that.$refs.DialogOrderComment.openCommentDialog(cateStr,params);
                },0);
            },
            search(isEnter=false){
                let query=this.$refs.query.getQuery(this.pager);
                query.searchAct='delivery';
                if(isEnter) {
                    query.order[this.searchArgs.key] = this.searchArgs.value;
                }
                query.order=Object.assign(query.order,this.filterArgs);
                query.order.status='waiting_shipped';
                query.order.shipping_method={'<>':'EMB'};
                query.order.payment_status={in:['complete','processing']};
                query.order.approved=1;
                query['with']={
                    stockPresell:true,
                }
                vk.http(uri.orderQuery,query,this.then);
            },
            updatePen(val,params){
                console.log(val,params);
                this.operationData=params.row;
                this.operationData.newVal=val;
                if('expedited'==params.key){
                    this.openCommentDialog('211');
                }
                if('payment_status'==params.key){
                    this.openCommentDialog('214');
                };
                if('spu'==params.key){
                    this.openCommentDialog('200');
                };
                if('size_original'==params.key){
                    this.openCommentDialog('201');
                };
                if('qty_ordered'==params.key){
                    this.openCommentDialog('202');
                };
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
            checkPrint(){
                for(var i in this.printOption){
                    if(this.printOption[i]<0){
                        vk.alert(i18n.t('请设置打印机'));
                        return false;
                    }
                }
                return true;

            },
            printDevicesChange(type,val){
                this.printOption[type]=val;
                vk.ls('this.printOption',this.printOption);
            },
            printDevicesChangeWaybill(event,method_key){
                console.log(event.target.value,method_key);
                this.printDevicesChange(method_key,event.target.value);
            },
            printDevicesChangeInvoice(val){
                this.printDevicesChange('invoice',val);
            },
        }
    }
    export default {i18n,...App}
</script>