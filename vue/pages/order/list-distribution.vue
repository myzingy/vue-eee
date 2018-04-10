<style lang="stylus" rel="stylesheet/scss">
    .input-with-select .el-select .el-input {
        width: 130px;
    }
    
    .el-form-item__error{
        line-height: 1;
    }
    .orderGrid{
        .el-table td{
            vertical-align: top;
            div.box{
                width: 80px;
                height: 80px;
                padding: 0;
                margin: 0;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                }

            }
        }
        .row-tr{
            border: 1px solid #00acd6;
            border-top-width: 0;
            margin-bottom: 8px;
        }
        .tr{
            .td{
                float: left;
                border: 1px solid #00acd6;
                font-size: 14px;
                padding: 3px 0;
                line-height: 20px;
                min-height:30px;
                border-right-width: 0;
                &:first-child{
                    border-left-width: 0;
                }
                button{
                    padding: 0 2px;
                }
                word-break:break-all;
            }

        }
        .el-table td .cell .export{
            button{
                padding: 10px 10px;
            }
        }
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <div class="orderGrid">
                <el-row :gutter="24">
                    <el-col :span="4" >
                        <!--
                        <div v-if="distributionCount > 0">
                            <el-badge :value="distributionCount" class="item">

                                <el-button  type="primary" @click="exportExcel">{{$t('导出库存配货单')}}</el-button>
                                <el-dropdown split-button type="primary" @command="exportExcel">
                                    {{$t('导出库存配货单')}}
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{command:'ups_kezi'}">UPS
                                            +刻字</el-dropdown-item>
                                        <el-dropdown-item :command="{command:'def'}">非(UPS
                                            +刻字)</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>

                            </el-badge>
                        </div>
                        <div v-else="">
                            <el-button  type="primary" disabled>{{$t('导出库存配货单')}}</el-button>
                        </div>
                        -->
                        <el-input :placeholder="$t('OLD SKU 搜索')" v-model="oldsku"
                                  @keyup.enter.native="searchSku"
                                  class="input-with-select">
                            <el-button slot="append" icon="el-icon-search" @click="searchSku"></el-button>
                        </el-input>
                        <el-input :placeholder="$t('SKU 搜索')" v-model="querytable.items.sku.like"
                                  @keyup.enter.native="search"
                                  class="input-with-select">
                            <el-button slot="append" icon="el-icon-search" @click="searchSku"></el-button>
                        </el-input>
                        <el-input :placeholder="$t('产品编号')" v-model="querytable.items.product_id"
                                  @keyup.enter.native="search"
                                  class="input-with-select">
                            <el-button slot="append" icon="el-icon-search" @click="searchSku"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="16">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span></span>
                                <el-switch
                                        v-model="printing"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        :active-text="$t('发货将自动打印面单或条码')"
                                        :inactive-text="$t('手动打印')">
                                </el-switch>
                            </div>
                            <el-input :placeholder="$t('请扫码或输入生产编号')" v-model="searchArgs.value"
                                      @keyup.enter.native="search"
                                      class="input-with-select">
                                <span slot="prepend">{{$t('生产编号')}}</span>
                                <el-button slot="append" icon="el-icon-search" @click="search">Query</el-button>
                            </el-input>
                        </el-card>

                    </el-col>
                    <el-col :span="4">
                        <el-button v-if="CLODOP_LOADING" type="danger" icon="el-icon-refresh" @click="setPrintDevices">
                            {{$t('请手动点击加载打印机')}}
                        </el-button>
                        <el-form label-position="top" label-width="80px" class="printForm" v-else="">
                            <div v-for="(method_index,method_key) in printOption" v-if="lodopinit">
                                <select v-model="printOption[method_key]" style="width: 98%; margin:5px"
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
                <el-pagination style=" margin: 20px auto 0; width:300px;"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :page-size="pager.limit"
                               :page-sizes="pager.pageSizes"
                               layout="slot,sizes, prev, pager, next"
                               :total="total"
                               :current-page="pager.page"
                               slot="total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:total})}}</span>
                    </template>
                </el-pagination>
                <!--//表头-->
                <el-table
                        :data="[{}]"
                        border
                        style="width: 100%; margin-top: 10px;"
                        ref="tableDataHeader"
                        :default-sort = "{prop: 'order.id', order: 'descending'}"
                        @sort-change="sortChange"
                >
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            fixed
                            width="120" >
                        <template slot-scope="props">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.ext_order_id.like"></el-input>
                            </el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="expedited"
                            :label="$t('加急')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.expedited.gte" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="0"
                                        label="No"
                                        value="0">
                                </el-option>
                                <el-option
                                        key="1"
                                        label="Yes"
                                        value="1">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="items.sku"
                            label="SPU"
                            width="80"
                            sortable
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.items.sku.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="issue"
                            :label="$t('联系客户')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.issue.contact_clients" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="2"
                                        label="No"
                                        value="2">
                                </el-option>
                                <el-option
                                        key="1"
                                        label="Yes"
                                        value="1">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="120"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.increment_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('UPS成人签收')"
                            width="50"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.__ups_sign_up" @change="search"
                                       placeholder="select" clearable>
                                <el-option
                                        v-for="(val,key) in ['Yes','No']"
                                        :key="val"
                                        :label="val"
                                        :value="val">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="order_type"
                            :label="$t('订单类型')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.order.order_type" placeholder="Select" clearable
                                       @change="search">
                                <el-option
                                        v-for="(item,key) in ['custom','taobao','stock','mixture']"
                                        :key="item"
                                        :label="$t('order.type.'+item)"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="order_type"
                            :label="$t('产品类型')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.items.item_type" placeholder="Select" clearable
                                       @change="search">
                                <el-option
                                        v-for="(item,key) in ['custom','taobao','stock']"
                                        :key="item"
                                        :label="$t('order.type.'+item)"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="stockPresell.storehouse_name"
                            :label="$t('仓库')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.stockPresell.storehouse_id" placeholder="Select"
                                       @change="search" clearable>
                                <el-option
                                        key="1"
                                        v-if="$router.power('stock.GuangZhou')"
                                        label="GuangZhou"
                                        value="1">
                                </el-option>
                                <el-option
                                        key="2"
                                        v-if="$router.power('stock.LosAngeles')"
                                        label="LosAngeles"
                                        value="2">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('创建时间')"
                            width="150"
                    >
                        <template slot-scope="props">
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('订单状态')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.status.in"
                                       multiple
                                       placeholder="Select" @change="search"
                                       clearable>
                                <el-option
                                        v-for="(item,key) in orderStatusObj"
                                        :key="key"
                                        :label="$t('order.status.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('产品状态')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.items.item_status.in"
                                       multiple
                                       placeholder="Select" @change="search"
                                       clearable>
                                <el-option
                                        v-for="(item,key) in orderStatusObj"
                                        :key="key"
                                        :label="$t('order.status.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="last_track_status"
                            :label="$t('跟踪状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.order.last_track_status" placeholder="Select"
                                       @change="search" clearable>
                                <el-option
                                        v-for="(item,key) in orderLastStatusObj"
                                        :key="key"
                                        :label="$t('order.status.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('待定')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.order.paused" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="1"
                                        :label="$t('地址')"
                                        value="1">
                                </el-option>
                                <el-option
                                        key="2"
                                        :label="$t('产品')"
                                        value="2">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shipping_track_no"
                            :label="$t('物流单号')"
                    >
                        <template slot-scope="props">
                            <el-input placeholder="" v-model="querytable.order.shipping_track_no"
                                      lass="input-with-select" @keyup.enter.native="search">
                                <el-select v-model="querytable.order.shipping_method" slot="prepend"
                                           @change="search" clearable
                                           placeholder="Select" style="width: 80px;">
                                    <el-option
                                            v-for="(item,key) in orderShippingMethodObj"
                                            :key="key"
                                            :label="item"
                                            :value="key">
                                    </el-option>
                                </el-select>
                            </el-input>
                        </template>
                    </el-table-column>
                    <!--
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <orderCommentPack :target="props.row" type="order"></orderCommentPack>
                        </template>
                    </el-table-column>
                    -->
                    <el-table-column
                            :label="$t('导出状态')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.items.is_exported" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="0"
                                        :label="$t('还未导出')"
                                        value="0">
                                </el-option>
                                <el-option
                                        key="1"
                                        :label="$t('已经导出')"
                                        value="1">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('是否刻字')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.items.has_engravings" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="1"
                                        :label="$t('有刻字')"
                                        value="1">
                                </el-option>
                                <el-option
                                        key="0"
                                        :label="$t('无刻字')"
                                        value="0">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            fixed="right" width="100">
                        <template slot-scope="props">
                            <div class="export">
                            <el-button type="danger" @command="exportExcel" @click="exportExcel" >
                                {{$t('导出')}}
                            </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!--//数据-->
                <div v-for="(row,index) in tableData" class="row-tr">
                    <el-checkbox-group v-model="checkedOrders" @change="handleCheckedOrdersChange">
                        <!--//行-->
                        <div class="tr">
                            <div style="width: 120px;" class="td">
                                <el-checkbox :label="row.id" :key="row.id">&nbsp;</el-checkbox> {{row.ext_order_id}}
                            </div>
                            <div style="width: 80px;" class="td">
                                <el-tag type="success" v-if="row.expedited==2">{{$t('加急')}}</el-tag>
                                <el-tag type="danger" v-if="row.expedited==1">{{$t('加急')}}</el-tag>
                            </div>
                            <div style="width: 80px;" class="td">
                                
                            </div>
                            <div style="width: 80px;" class="td">
                                <el-tag type="danger" v-if="row.has_issue>0">{{$t('是')}}</el-tag>
                                <el-tag type="success" v-if="row.has_issue<1">{{$t('否')}}</el-tag>
                            </div>
                            <div style="width: 120px;" class="td">
                                {{getOrderReturnString(row)}}
                            </div>
                            <div style="width: 50px;" class="td">
                                    {{signUpAdults(row)}}
                            </div>
                            <div style="width: 80px;" class="td">
                                {{$t('order.type.'+row.order_type)}}
                            </div>
                            <div style="width: 80px;" class="td">
                                &nbsp;
                            </div>
                            <div style="width: 80px;" class="td">
                                {{row.stockPresell.storehouse_name}}
                            </div>
                            <div style="width: 150px;" class="td">
                                <span v-date="['YYYY-MM-DD HH:II',row.created_at]"></span>
                            </div>
                            <div style="width: 100px;" class="td">
                                <span>{{$t('order.status.'+row.status)}}</span>
                            </div>
                            <div style="width: 100px;" class="td">
                                &nbsp;
                            </div>
                            <div style="width: 100px;" class="td">
                                <el-tag type="danger" v-if="row.last_track_status!='normal'">
                                    {{$t(row.last_track_status)}}
                                </el-tag>
                            </div>
                            <div style="width: 80px;" class="td">
                                <el-tag type="danger" v-if="row.paused > 0">
                                    {{row.paused == 1?$t('地址'):$t('产品')}}
                                </el-tag>
                            </div>
                            <div style="width: 80px;" class="td">
                                <orderCommentPack :target="row" type="order"
                                                  :noSee="row.noseeComment"
                                                  :hasComment="!!row.hasComment"
                                ></orderCommentPack>
                            </div>
                            <div style="width: auto;" class="td">
                                <span v-if="row.shipping_method">
                                    ({{row.shipping_method}}) {{row.shipping_track_no}}
                                </span>
                            </div>
                            <div style="width: 100px; float: right;" class="td">
                                <el-dropdown @command="operationCommand" trigger="click">
                                    <span class="el-dropdown-link">
                                        {{$t('操作')}}
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{command:'查看',index:index}">
                                            {{$t('查看')}}
                                        </el-dropdown-item>

                                        <el-dropdown-item :command="{command:'备注',index:index}">
                                            {{$t('备注添加')}}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="{command:'联系',index:index}">
                                            {{$t('联系客户')}}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="{command:'autoPrint',index:index}"
                                                          v-if="row.shipping_method!='EUB'">
                                            {{$t('打印')}}<el-badge is-dot class="item"></el-badge>
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="{command:'发货',index}" v-if="row.shipping_method=='EMB'">
                                            {{$t('完成配货')}}<el-badge is-dot class="item"></el-badge>
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="{command:'nextStep',index}" v-else="">
                                            {{$t('发货')}}<el-badge is-dot class="item"></el-badge>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-badge is-dot class="item" v-if="row.shipping_track_no"></el-badge>
                            </div>
                        </div>
                    </el-checkbox-group>
                    <!--//扩展-->
                    <div style="margin-left: 50px;">
                        <orderItemsPack :order="row"
                                        :noPen="true"
                                        :distributionOpc="true"
                                        :filterHidden="true"
                                        :showExportField="true"
                                        :showStockField="true"
                                        @acceptancePassedAfter="search"></orderItemsPack>
                    </div>
                </div>
                <el-pagination style=" margin: 20px auto 0; width:300px;"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :page-size="pager.limit"
                               :page-sizes="pager.pageSizes"
                               layout="slot,sizes, prev, pager, next"
                               :total="total"
                               :current-page="pager.page"
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
                <query ref="query" @search="search" type="distribution"></query>
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
    import lodop from '../common/lodop/print.barcode';
    import query from './query.pack.vue';
    import newPage from '../common/newpage';
    import order_data from '../common/order_data';
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
                tableLoading:false,
                tableData:[],
                total:0,
                searchArgs:{
                    key:"produce.sn",
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
                distributionCount:0,
                pager:{
                    page:1,
                    offset:0,
                    limit:20,
                    pageSizes:[20, 50, 100, 200,500,1000],
                    orderby:'order.id desc',
                },
                printOption:{},
                printDevices:[],
                oldsku:"",
                printOption:{
                    //waybill:'',
                    //invoice:'',
                    'EMB Barcode':-1,
                    'DHL':-1,
                    'UPS':-1,
                    //'EUB':-1,
                    'FEDEX':-1,
                    'ARAMEX':-1
                },
                printDevices:[],
                printing:true,
                expandRowKeys:[],
                CLODOP_LOADING:true,
                querytable:{
                    order:{
                        ext_order_id:{},
                        increment_id:{},
                        status:{},
                        expedited:{},
                    },
                    items:{
                        sku:{neq:"?"},
                        serial_id:{},
                        item_status:{},
                    },
                    produce:{
                        sn:{},
                    },
                    stockPresell:{},
                    issue:{contact_clients:null},
                },
                orderStatusObj:order_data.orderStatusObj,
                orderLastStatusObj:order_data.orderLastStatusObj,
                orderShippingMethodObj:order_data.orderShippingMethodObj,
                checkAll: false,
                isIndeterminate: true,
                checkedOrders:[],
                orderOptions:[],
                
            };
        },
        computed: {
            lodopinit:function(){lodop.init();return true},
        },
        mounted(){
            lodop.init();
            this.search();
        },
//        watch:{
//            'query':function(newVal){
//                this.setBaseQuery();
//                this.search();
//            }
//        },
        methods: {
            ...vk,
            setPrintDevices(){
                if(!this.CLODOP_LOADING) return;
                let that=this;
                setTimeout(function(){
                    if(typeof CLODOP=='undefined'){
                        that.CLODOP_LOADING=true;
                        return;
                    }
                    console.log('CLODOP',CLODOP);
                    that.CLODOP_LOADING=false;
                    let lc=CLODOP.GET_PRINTER_COUNT();
                    console.log('lc',lc);
                    for(let i=0;i<lc;i++){
                        let ln=CLODOP.GET_PRINTER_NAME(i);
                        console.log('ln',ln);
                        that.printDevices.push(ln);
                    }
                },300);
            },
            then(json,code){
                switch (code) {
                    case uri.orderQuery.code:
                        this.tableData = json.list;
                        this.setPrintDevices();
                        if (json.total > 0) {
                            this.total = json.total;
                        }
                        //vk.http(uri.distributionCount,{},this.then);
                        let printOption=vk.ls('this.printOption');
                        if(printOption){
                            this.printOption=printOption;
                        }
                        let orderOptions=[];
                        if(json.list){
                            json.list.map((row)=>{
                                orderOptions.push(row.id);
                            });
                        }
                        this.orderOptions=orderOptions;
                        this.checkedOrders=[];
                        this.checkAll=false;
                        break;
                    case uri.setOrder.code:
                        //lodop.printBarcode(this.operationData.increment_id);
                        this.search();
                        break;
                    case uri.distributionExport.code:
                        if(json.message){
                            vk.toast(json.message);
                        }
                        newPage.href(json.url);
                        break;
                    case uri.distributionCount.code:
                        this.distributionCount=parseInt(json.total);
                        break;
                    case uri.orderPickedDelivery.code:
                        if(this.printing && json.data.shipping_method!='EUB'){
                            if(json.data.shipping_method=='EMB'){
                                lodop.printBarcode(json.data.increment_id);
                            }else{
                                let img=vk.cgi('file/waybill?id='
                                    +json.data.id
                                    +'&method='+json.data.shipping_method
                                );
                                lodop.printWaybill(img,json.data.shipping_method,json.data.increment_id);
                            }
                        }
                        this.search();
                        break;
                }
            },
            handleCurrentChange(page){
                this.pager.page=page;
                this.search();
            },
            handleSizeChange(size){
                this.pager.limit = size;
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
                let that=this;
                switch (param.command){
                    case '查看':
                        this.outerDialogType='orderInfoPack';
                        this.outerDialogFull=true;
                        this.outerDialogVisible=true;
                        this.outerDialogSaveButton=false;
                        setTimeout(function(){
                            that.$refs.DialogOrderInfo.initPage();
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
                    case '发票':

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
                    case '贴码':
                        lodop.printBarcode(this.operationData.increment_id);
                        break;
                    case '发货':
                        vk.confirm(i18n.t('完成配货？'),function(){
                            vk.http(uri.setOrder,{id:that.operationData.id,key:'status',val:'waiting_shipped'},that.then);
                        })
                        break;
                    case 'autoPrint'://打印
                        if(!this.checkPrint())return;
                        if(!this.operationData.shipping_track_no && this.operationData.shipping_method != 'EMB'){
                            vk.alert(i18n.t('还没有物流单号，请提交联系客户'));
                            return;
                        }
                        if(this.operationData.shipping_method=='EMB'){//打条码
                            lodop.printBarcode(this.operationData.increment_id);
                        }else{//打面单
                            let img=vk.cgi('file/waybill?id='
                                +this.operationData.id
                                +'&method='+this.operationData.shipping_method
                            );
                            lodop.printWaybill(img,this.operationData.shipping_method,this.operationData.increment_id);
                        }
                        break;
                    case 'nextStep'://直接发货
                        if(!this.checkPrint() && this.printing)return;
                        if(!this.operationData.shipping_track_no){
                            vk.alert(i18n.t('还没有物流单号，请提交联系客户'));
                            return;
                        }
                        vk.confirm(i18n.t('即将发货？'),function(){
                            vk.http(uri.orderPickedDelivery,{id:that.operationData.id},that.then);
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
            search(){
                this.pager.offset=(this.pager.page-1)*this.pager.limit;
                this.querytable['this']=this.pager;

                let query=this.querytable;
                query.searchAct='distribution';
                query.produce.sn=this.searchArgs.value;
                query.order=Object.assign(query.order,this.filterArgs);
                //query.order.status={in:['processing','pick_waiting','waiting_accept']};
//                if(query.order.status.in){
//                    query.order.status.in=[query.order.status.in];
//                }
                query.order.status.nin=['pending','cancelled','shipped','return_completed','return_process','transferring'];
                query.order.payment_status={in:['complete','processing']};
                query.order.approved=1;
                query['with']={
                    stockPresell:true,
                    items:true,
                    noseeComment:true,
                }
                query.select = ["SUM(case when issue.issue_status != 'solved' then 1 else 0 end) AS has_issue"];
                //query.order.status='processing';
                if(query.this.offset==0){
                    this.total=0;
                }
                vk.http(uri.orderQuery,query,this.then);
            },
            searchSku(){
                this.pager.offset=0;
                let query={
                    'this':this.pager,
                    searchAct:'distribution',
                    order:{
//                        status:{
//                            in:['processing','pick_waiting','waiting_accept']
//                        },
                        status:{nin:['pending','cancelled','shipped','return_completed','return_process']},
                        payment_status:{
                            in:['complete','processing']
                        },
                        approved:1,
                        __oldsku:this.oldsku,
                    },
                    with:{stockPresell:true}
                };
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
            exportExcel(param){
                let post={
                    __command:'allNoExport',
                };
                if(this.checkedOrders.length<1){
                    return vk.alert(i18n.t('请选择需要导出的订单'));
                }
                newPage.open();
                this.pager.offset=(this.pager.page-1)*this.pager.limit;
                this.querytable['this']=this.pager;
                let query=this.querytable;
                //query.searchAct='distribution';
                //query.produce.sn=this.searchArgs.value;
                //query.order=Object.assign(query.order,this.filterArgs);

                query.order.status.nin=['pending','cancelled','shipped','return_completed','return_process'];
                query.order.payment_status={in:['complete','processing']};
                query.order.approved=1;
                query['with']={
                    //stockPresell:true,
                    items:true,
                    //noseeComment:true,
                }

                post=Object.assign(post,query);
                post.order={id:{in:this.checkedOrders}};
                vk.http(uri.distributionExport,post,this.then);

            },
            openQuery(){
                this.$refs.query.openQuery();
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
            printDevicesChangeWaybill(event,method_key){
                console.log(event.target.value,method_key);
                this.printDevicesChange(method_key,event.target.value);
            },
            printDevicesChange(type,val){
                this.printOption[type]=val;
                vk.ls('this.printOption',this.printOption);
            },
            handleCheckAllChange(val) {
                this.checkedOrders = val ? this.orderOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedOrdersChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.orderOptions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.orderOptions.length;
            },
            sortChange(obj){
                this.pager.orderby=obj.prop+' '+('descending'==obj.order?'desc':'asc');
                this.search();
            },
            signUpAdults(row){
                let flag=row.currency_code=='USD' && row.base_grand_total>=300;
                return flag?'Yes':'No';
            },
        }
    }
    export default {i18n,...App}
</script>