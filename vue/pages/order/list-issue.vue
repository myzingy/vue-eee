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
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <div class="orderGrid">
                <!--
                <el-input :placeholder="$t('请输入内容后回车')" v-model="searchArgs.value"
                          @keyup.enter.native="search"
                          class="input-with-select">
                    <span slot="prepend">{{$t('订单编号')}}</span>
                    <el-button slot="append" icon="el-icon-search" @click="openQuery">Query</el-button>
                </el-input>
                -->
                <!--//search header-->
                <el-table
                        :data="[{}]"
                        border
                        style="width: 100%; "
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
                            width="140"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.increment_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SPU"
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
                            prop="order_type"
                            :label="$t('类型')"
                            width="70"
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
                            prop="issue.issue_tags"
                            :label="$t('问题类型')"
                            width="120"
                    >
                        <template slot-scope="scope">
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('创建者')"
                            width="140"
                    >
                        <template slot-scope="props">

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('处理者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('问题状态')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.orderissue.issue_status"
                                       @change="search" clearable
                                       placeholder="Select" style="width: 80px;">
                                <el-option
                                        v-for="(sta,key) in ['pending','processing','solved']"
                                        :key="sta"
                                        :label="$t('order.issue_status.'+sta)"
                                        :value="sta">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="payment_status"
                            :label="$t('支付状态')"
                            width="100"
                    >

                        <template slot-scope="props">
                            <el-select v-model="querytable.order.payment_status.in" multiple
                                       placeholder="select"
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
                            prop="description"
                            :label="$t('备注')"

                    >
                        <template slot-scope="props">
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('客户姓名')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-input placeholder="" v-model="querytable.address.__name"
                                      lass="input-with-select" @keyup.enter.native="search">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="address.email"
                            :label="$t('客户邮箱')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-input placeholder="" v-model="querytable.address.email.like"
                                      lass="input-with-select" @keyup.enter.native="search">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            width="100" fixed="right">
                        <template slot-scope="scope">
                            
                        </template>
                    </el-table-column>
                </el-table>
                <!--//search header-->


                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: -1px;"
                        :height="height(190)"
                        type="expand"
                        :default-expand-all="false"
                        :row-class-name="tableRowClassName"
                        @filter-change="filterChange"
                        ref="tableData"
                        :show-header="false"
                    >
                    <!--
                    <el-table-column type="expand" width="50" fixed>
                        <template slot-scope="props">
                            <i class="el-icon-upload2" style="color: #ff0084"></i>
                            <span>{{operationInfo(props.row.description)}}</span>
                        </template>
                    </el-table-column>
                    -->
                    <el-table-column
                            prop="order.ext_order_id"
                            :label="$t('订单编号')"
                            width="120" >
                    </el-table-column>
                    <el-table-column
                            prop="order.increment_id"
                            :label="$t('订单号')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <div>
                                {{getOrderReturnString(props.row.order)}}
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
                            prop="order_type"
                            :label="$t('类型')"
                            width="70"
                            :filters="[
                            { text: $t('order.type.taobao'), value: 'taobao' },
                            { text: $t('order.type.custom'), value: 'custom' },
                            { text: $t('order.type.stock'), value: 'stock' },
                            { text: $t('order.type.mixture'), value: 'mixture' },
                            { text: $t('order.type.fictitious'), value: 'fictitious' }]"
                            filter-placement="bottom-end"
                            :filter-multiple="false"
                            column-key="order_type"
                    >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                {{$t('order.type.'+item.item_type)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="issue.issue_tags"
                            :label="$t('问题类型')"
                            width="120"
                    >
                        <template slot-scope="scope">
                            {{$t('order.issue.'+scope.row.issue_tags)}}
                            <div v-if="scope.row.issue_tags==308">
                                {{scope.row.description}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('创建者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <div>
                                <div>{{getUserName(props.row.report_uid)}}</div>
                                <span v-date="['YYYY-MM-DD HH:II',props.row.created_at]"></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('处理者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <div>
                                <div>{{getUserName(props.row.solved_uid,true)}}</div>
                                <span v-date="['YYYY-MM-DD HH:II',props.row.solved_at]"></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="issue_status"
                            :label="$t('问题状态')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            {{$t('order.issue_status.'+scope.row.issue_status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('支付状态')"
                            width="100"
                    >

                        <template slot-scope="scope">
                            {{$t('order.payment.'+scope.row.order.payment_status)}}
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
                            prop="description"
                            :label="$t('备注')"
                            
                    >
                        <template slot-scope="props">
                            <orderCommentPack :target="props.row.order" type="order"></orderCommentPack>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('客户姓名')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            {{scope.row.address.firstname}} {{scope.row.address.lastname}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="address.email"
                            :label="$t('客户邮箱')"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-dropdown @command="operationCommand" trigger="click">
                                <span class="el-dropdown-link">
                                {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{command:'查看',index:scope.$index}">
                                        {{$t('查看订单')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'备注',index:scope.$index}">
                                        {{$t('备注添加')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                            :command="{command:'处理中',index:scope.$index,issue_id:scope.row.id}">
                                        {{$t('order.issue_status.processing')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'已解决',index:scope.$index,issue_id:scope.row.id}">
                                        {{$t('order.issue_status.solved')}}
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
        },
        data () {
            return {
                tableData:[],
                total:0,
                searchArgs:{
                    key:"ext_order_id",
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
                pager:{
                    page:1,
                    offset:0,
                    limit:10,
                    orderby:'orderissue.created_at desc',
                },

                querytable:{
                    orderissue:{
                        issue_status:{},
                        issue_tags:{},

                    },
                    order:{
                        ext_order_id:{},
                        increment_id:{},
                        status:{},
                        payment_status:{},
                    },
                    items:{
                        sku:{},
                    },
                    address:{
                        firstname:{},
                        lastname:{},
                        email:{},
                    }
                },
                orderStatusObj:order_data.orderStatusObj,
                orderLastStatusObj:order_data.orderLastStatusObj,
                orderShippingMethodObj:order_data.orderShippingMethodObj,
                paymentStatusObj:order_data.paymentStatusObj,
            };
        },
        mounted(){
            //console.log('this.$route',this.$route,this);
            //this.getData();
            //this.setBaseQuery();
            this.search();
            let node = this.$el.querySelector('.el-table__body-wrapper');
            node.style.overflow = "hidden";
            let node2 = this.$el.querySelectorAll('.el-table__body-wrapper')[1];
            node2.addEventListener('scroll',(e)=>{
                node.scrollLeft = e.target.scrollLeft;
            })
        },
//        watch:{
//            'query':function(newVal){
//                this.setBaseQuery();
//                this.search();
//            }
//        },
        methods: {
            ...vk,
            setBaseQuery(){
                let searchBaseArgs=[];
                for(let key in this.query){
                    switch (key){
                        case 'issue':
                            break;
                    }
                }
                this.searchBaseArgs=searchBaseArgs;
            },
            then(json,code){
                switch(code) {
                    case uri.getIssueOrders.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
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
                    case '处理中':
                        vk.http(uri.setOrderIssue,{id:param.issue_id,key:'issue_status',val:'processing'},this.search);
                        break;
                    case '已解决':
                        vk.http(uri.setOrderIssue,{id:param.issue_id,key:'issue_status',val:'solved'},this.search);
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
                this.pager.offset=(this.pager.page-1)*this.pager.limit;
                this.querytable['this']=this.pager;

                let query=this.querytable;
                //let query=this.$refs.query.getQuery(this.pager);
//                if(isEnter) {
//                    query.order[this.searchArgs.key] = this.searchArgs.value;
//                }
//                query.order=Object.assign(query.order,this.filterArgs);
                query['with']={
                    items:true,
                    order:true,
                    address:true,
                }
                vk.http(uri.getIssueOrders,query,this.then);
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
                    filterArgs[key]=filters[key][0] || "";
                }
                console.log(filters,filterArgs);
                this.filterArgs=filterArgs;
                this.search();
            },
            commentSaveAfter(obj){
                this.search();
            },
            openQuery(){
                this.$refs.query.openQuery();
            },
            getUserName(uid,solved=false){
                let conf=vk.getCache(uri.getConf).data.nicks;
                return uid=='0'?'ONEDAY':conf[uid];
            },
            operationInfo(html){
                return html.replace(/<[^>]+>/g,'');
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