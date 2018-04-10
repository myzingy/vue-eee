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
                img{
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    margin: 0;
                }
                overflow: hidden;
            }
        }
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <div class="orderGrid">
                <!--
                <el-input :placeholder="$t('请输入内容')" v-model="searchArgs.value" class="input-with-select">
                    <el-select v-model="searchArgs.key" slot="prepend" :placeholder="$t('订单编号/订单号/SKU')">
                        <el-option :label="$t('订单编号')" value="ext_order_id"></el-option>
                        <el-option :label="$t('订单号')" value="increment_id"></el-option>
                        <el-option label="SKU" value="sku"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
                -->
                <el-input :placeholder="$t('请输入内容后回车')" v-model="searchArgs.value"
                          @keyup.enter.native="search"
                          class="input-with-select">
                    <span slot="prepend">{{$t('订单编号')}}</span>
                    <el-button slot="append" icon="el-icon-search" @click="openQuery">Query</el-button>
                </el-input>
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: 10px;"
                        :height="height(160)"
                        @filter-change="filterChange"
                        ref="tableData"
                >
                    <!--
                    <el-table-column type="expand" width="50" fixed>
                        <template slot-scope="props">
                            <div>
                                <orderItemsPack :order="props.row" @openCommentDialog="openCommentDialog"></orderItemsPack>
                                <orderShipmentPack :order="props.row" @openCommentDialog="openCommentDialog"></orderShipmentPack>
                                <orderUserPack :order="props.row"></orderUserPack>
                            </div>
                        </template>
                    </el-table-column>
                    -->
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            width="120" >
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="120"
                    >
                        <template slot-scope="props">
                            <div>
                                {{getOrderReturnString(props.row)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SPU"
                            width="90" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                {{sxu(item.sku).spu}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('图片')"
                            width="90" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                <v-img :src="getThumb(item)"></v-img>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('待定')"
                            width="120"
                    >
                        <template slot-scope="scope">

                            <el-tag type="danger" v-if="scope.row.paused > 0">
                                {{scope.row.paused == 1?$t('地址'):$t('产品')}}
                            </el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <orderCommentPack :target="props.row" type="order"
                                              :noSee="props.row.noseeComment"
                                              :hasComment="!!props.row.hasComment"></orderCommentPack>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('创建人')"
                            width="120"
                    >
                        <template slot-scope="props">
                            {{getUserName(props.row.lastApproved.uid)}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            :label="$t('操作')"
                            fixed="right">
                        <template slot-scope="scope">

                            <el-dropdown @command="operationCommand" trigger="click">
                                    <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{command:'查看',index:scope.$index}">
                                        {{$t('查看')}}
                                    </el-dropdown-item>
                                    <!--
                                    <el-dropdown-item :command="{command:'查备',index:scope.$index}">
                                        {{$t('查看备注')}}
                                    </el-dropdown-item>
                                    -->
                                    <el-dropdown-item :command="{command:'审核',index:scope.$index}" v-if=" $router.power('operation') ">
                                        {{$t('审核通过')}}
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
                <query ref="query" @search="search" type="order"></query>
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
    import orderCommentPack from '../common/comment.but-list.vue'
    import order_data from '../common/order_data';
    import query from './query.pack.vue';
    import DialogOrderInfo from './common/order.info.dialog.vue';
    import DialogOrderComment from './common/order.comment.dialog.vue';
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
                    key:"ext_order_id",
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
                paymentStatusObj:order_data.paymentStatusObj,
                pager:{
                    page:1,
                    offset:0,
                    limit:10,
                    orderby:'order.updated_at desc',
                }
            };
        },
        mounted(){
            //console.log('this.$route',this.$route,this);
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
                    case uri.orderQuery.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.deletePower.code:
                        this.search();
                        this.flushConf();
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
                        var that=this;
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
                    case '查备':
                        this.$refs.orderCommentPack.getData();
                        break;
                    case '审核':
                        vk.confirm(i18n.t('确认要审核通过此订单？'),this.approved);
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
                if(isEnter) {
                    query.order[this.searchArgs.key] = this.searchArgs.value;
                }
                query.order=Object.assign(query.order,this.filterArgs);
                query.order.approved=0;
                query['lastApproved']={
                    uid:{'>':0},
                };
                query['with']={
                    'noseeComment':true,
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
            approved(){
                vk.http(uri.setOrder,{
                    key:'approved',
                    val:'1',
                    id:this.operationData.id
                },this.search);
            },
            openQuery(){
                this.$refs.query.openQuery();
            },
            getThumb(item){
                let url=vk.cgi('file/product?id='+item.product_id);
                if(item.attr){
                    try{
                        let attr=JSON.parse(item.attr);
                        return attr[0].remote_url || url;
                    }catch(e){}
                }
                return url;
            }
        }
    }
    export default {i18n,...App}
</script>