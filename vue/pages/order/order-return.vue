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
        .el-form-item{
            margin-bottom: 10px;
        }
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <div class="orderGrid">
                <el-table
                        :data="[{}]"
                        border
                        style="width: 100%;"
                >
                    <el-table-column
                            prop="order.ext_order_id"
                            :label="$t('订单编号')"
                            width="120" >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.ext_order_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="order.increment_id"
                            :label="$t('订单号')"
                            width="120"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.increment_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipping_method"
                            :label="$t('退回物流')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.orderreturn.shipping_method.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipping_track_no"
                            :label="$t('退回物流单号')"
                            
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.orderreturn.shipping_track_no.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SPU & Return quantity"
                            width="90" >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.items.sku.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('图片')"
                            width="90" >
                        <template slot-scope="props">

                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('退回类型')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.reasons.type" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="0"
                                        :label="$t('order.return.type.0')"
                                        value="0">
                                </el-option>
                                <el-option
                                        key="1"
                                        :label="$t('order.return.type.1')"
                                        value="1">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('匹配结果')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.orderreturn.ismatch" clearable
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
                            :label="$t('退回状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.orderreturn.status" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        :key="s"
                                        :label="$t('order.return.status.'+s)"
                                        :value="s"
                                        v-for="(s,k) in [0,1,2]">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('创建人')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.userCre.nickname"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('跟进人')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.userFol.nickname"></el-input>
                        </template>
                    </el-table-column>
                    <!--
                    <el-table-column
                            :label="$t('确认收货')"
                            width="90"
                    >
                        <template slot-scope="scope">

                        </template>
                    </el-table-column>
                    -->
                    <el-table-column
                            :label="$t('确认完成')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.userFin.nickname"></el-input>
                        </template>
                    </el-table-column>
                </el-table>

                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: -1px;"
                        :height="height(210)"
                        :default-expand-all="false"
                        :row-class-name="tableRowClassName"
                        @filter-change="filterChange"
                        ref="tableData"
                        :show-header="false"
                >
                    <el-table-column
                            prop="order.ext_order_id"
                            :label="$t('订单编号')"
                            width="120" >
                    </el-table-column>
                    <el-table-column
                            prop="order.increment_id"
                            :label="$t('订单号')"
                            width="120"
                    >
                        <template slot-scope="props">
                            <div>
                                {{getOrderReturnString(props.row.order)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipping_method"
                            :label="$t('退回物流')"
                            width="100"
                    ></el-table-column>
                    <el-table-column
                            prop="shipping_track_no"
                            :label="$t('退回物流单号')"
                            
                    ></el-table-column>
                    <el-table-column
                            label="SPU & Return quantity"
                            width="90" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                <div>
                                    {{sxu(item.sku).spu}}
                                </div>
                                <div>
                                    <span style="color: #393;">{{item.qty_ordered}}</span>
                                     -> 
                                    <span style="color: #f33;">{{props.row.reasons[i].num}}</span>
                                </div>
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
                            :label="$t('退回类型')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.reasons" class="box">
                                {{$t('order.return.type.'+item.type)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('匹配结果')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <div>{{scope.row.ismatch==1?'YES':'NO'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('退回状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            {{$t('order.return.status.'+scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('创建人')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            {{getUserName(scope.row.created_uid)}}
                            <div v-date="[,scope.row.followup_at]"></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('跟进人')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            {{getUserName(scope.row.followup_uid)}}
                            <div v-date="[,scope.row.followup_at]"></div>
                        </template>
                    </el-table-column>
                    <!--
                    <el-table-column
                            :label="$t('确认收货')"
                            width="90"
                    >
                        <template slot-scope="scope" v-if="scope.row.delivery_at>0">
                            {{getUserName(scope.row.followup_uid)}}
                            <div v-date="[,scope.row.delivery_at]"></div>
                        </template>
                    </el-table-column>
                    -->
                    <el-table-column
                            :label="$t('确认完成')"
                            width="90"
                    >
                        <template slot-scope="scope" v-if="scope.row.finished_at>0">
                            {{getUserName(scope.row.followup_uid)}}
                            <div v-date="[,scope.row.finished_at]"></div>
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
    import DialogOrderInfo from './common/order.info.dialog.vue';
    import DialogOrderComment from './common/order.comment.dialog.vue';
    import orderCommentPack from '../common/comment.but-list.vue'
    import order_data from '../common/order_data';
    var App= {
        props:['query'],
        components:{
            DialogOrderInfo,
            DialogOrderComment,
            orderCommentPack,
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
                    orderby:'orderreturn.created_at desc',
                },
                querytable:{
                    order:{
                        ext_order_id:{},
                        increment_id:{},
                        status:{},
                        expedited:{},
                        created_at:{},
                        shipped_at:{},
                        payment_status:{},
                    },
                    orderreturn:{
                        shipping_method:{},
                        shipping_track_no:{},
                        track_no:{},
                        refunded_at:{},
                        status:{},
                    },
                    items:{
                        sku:{},
                    },
                    reasons:{
                        
                    },
                    userCre:{},
                    userFol:{},
                    userFin:{},
                },
                orderStatusObj:order_data.orderStatusObj,
                orderLastStatusObj:order_data.orderLastStatusObj,
                orderShippingMethodObj:order_data.orderShippingMethodObj,
            };
        },
        mounted(){
            let node = this.$el.querySelector('.el-table__body-wrapper');
                node.style.overflow = "hidden";
                let node2 = this.$el.querySelectorAll('.el-table__body-wrapper')[1];
                node2.addEventListener('scroll',(e)=>{
                    node.scrollLeft = e.target.scrollLeft;
            });
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
                    case uri.getReturnOrders.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.setReturnStatus.code:
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
                this.pager.offset=(this.pager.page-1)*this.pager.limit;
                this.querytable['this']=this.pager;

                let query=this.querytable;

                query['with']={
                    order:true,
                    items:true,
                    reasons:true,
                }
                vk.http(uri.getReturnOrders,query,this.then);
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
            getThumb(item){
                let url=vk.cgi('file/product?id='+item.product_id);
                if(item.attr){
                    try{
                        let attr=JSON.parse(item.attr);
                        return attr[0].remote_url || url;
                    }catch(e){}
                }
                return url;
            },
        }
    }
    export default {i18n,...App}
</script>