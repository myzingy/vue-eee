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
                            prop="description"
                            :label="$t('退款金额')"
                            width="100"
                    >
                        <template slot-scope="props">

                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('申请人')"
                            width="140"
                    >
                        <template slot-scope="scope">
                            <el-date-picker
                                    v-model="querytable.orderrefund.created_at.between"
                                    type="datetimerange"
                                    range-separator="-"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="Start"
                                    end-placeholder="End" @change="search">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('退款状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.orderrefund.refund_status.eq"
                                       placeholder="Select"
                                       @change="search"
                                       clearable>
                                <el-option
                                        v-for="(key) in [2,3,6]"
                                        :key="key"
                                        :label="$t('order.refund_status.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('处理人')"
                            width="140"
                    >
                        <template slot-scope="scope">

                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('支付状态')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.payment_status.in" multiple
                                       placeholder="Select"
                                       @change="search"
                                       clearable>
                                <el-option
                                        v-for="(item,key) in paymentStatusObj"
                                        :key="key"
                                        :label="$t('order.payment.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('订单状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
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
                            prop="last_track_status"
                            :label="$t('跟踪状态')"
                            width="100"
                    >
                        <template slot-scope="scope">

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                        <template slot-scope="props">
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('支付金额')"
                            width="100"
                    >
                        <template slot-scope="props">
                            
                        </template>
                    </el-table-column>

                    <el-table-column
                            :label="$t('操作')"
                            fixed="right">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                </el-table>

                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: -1px;"
                        :height="height(190)"
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
                        <template slot-scope="props">
                            <div>
                                {{getOrderReturnString(props.row.order)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="order.increment_id"
                            :label="$t('订单号')"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('退款金额')"
                            width="100"
                    >
                        <template slot-scope="props">
                            {{moneyFormat(props.row.total,props.row.order.currency_code)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('申请人')"
                            width="140"
                    >
                        <template slot-scope="scope">
                            <div>{{getUserName(scope.row.report_uid)}}</div>
                            <span v-date="['YYYY-MM-DD HH:II',scope.row.created_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('退款状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            {{$t('order.refund_status.'+scope.row.refund_status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('处理人')"
                            width="140"
                    >
                        <template slot-scope="scope">
                            <div>{{getUserName(scope.row.solved_uid)}}</div>
                            <span v-date="['YYYY-MM-DD HH:II',scope.row.solved_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="payment_status"
                            :label="$t('支付状态')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <span>{{$t('order.payment.'+props.row.order.payment_status)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('订单状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            {{$t('order.status.'+scope.row.order.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="last_track_status"
                            :label="$t('跟踪状态')"
                            width="100"
                    >
                        <template slot-scope="scope">

                            <el-tag type="danger" v-if="scope.row.order.last_track_status!='normal'">
                                {{$t('order.status.'+scope.row.order.last_track_status)}}
                            </el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <orderCommentPack :target="props.row.order" type="order"></orderCommentPack>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('支付金额')"
                            width="100"
                    >
                        <template slot-scope="props">
                            {{moneyFormat(props.row.order.grand_total,props.row.order.currency_code)}}
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
                                    <el-dropdown-item :command="{command:'备注',index:scope.$index}">
                                        {{$t('备注添加')}}
                                    </el-dropdown-item>
                                    <template v-for="(ss,si) in [3,6]" v-if="scope.row.refund_status==2">
                                        <el-dropdown-item :command="{command:'STATUS',status:ss,index:scope.$index}">
                                            <i class="el-icon-info"></i> {{$t('order.refund_status.'+ss)}}
                                        </el-dropdown-item>
                                    </template>
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
                    orderby:'orderrefund.created_at desc',
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
                    orderrefund:{
                        refund_status:{},
                        created_at:{},
                    },
                },
                orderStatusObj:order_data.orderStatusObj,
                orderLastStatusObj:order_data.orderLastStatusObj,
                orderShippingMethodObj:order_data.orderShippingMethodObj,
            };
        },
        mounted(){
            this.search();
            let node = this.$el.querySelector('.el-table__body-wrapper');
            node.style.overflow = "hidden";
            let node2 = this.$el.querySelectorAll('.el-table__body-wrapper')[1];
            node2.addEventListener('scroll',(e)=>{
                node.scrollLeft = e.target.scrollLeft;
            });
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
                    case uri.getRefundOrders.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.setRefundStatus.code:
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
                            that.$refs.DialogOrderInfo.initPage();
                        },0);
                        break;
                    case '备注':
                        this.openCommentDialog('222');
                        break;
                    case 'STATUS':
                        let params={
                            row:this.operationData,
                        };
                        params.row.newVal=param.status;
                        this.openCommentDialog(param.status==3?233:234,params);
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
                //let query=this.$refs.query.getQuery(this.pager);
//                if(this.searchArgs.value){
//                    query.order[this.searchArgs.key]=this.searchArgs.value;
//                }
                //query.order=Object.assign(query.order,this.filterArgs);
                query.orderrefund.refund_status.in=[2,3,6];
                query['with']={
                    order:true,
                }
                vk.http(uri.getRefundOrders,query,this.then);
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
        }
    }
    export default {i18n,...App}
</script>