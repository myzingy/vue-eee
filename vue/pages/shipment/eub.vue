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
            <div class="">
                <el-row :gutter="24">
                    <el-col :span="4" v-if="distributionCount > 0">

                        <el-badge :value="distributionCount" class="item">
                            <el-button  type="primary" @click="exportExcel">{{$t('导出EUB订单')}}</el-button>
                        </el-badge>
                    </el-col>
                    <el-col :span="4" v-else="">
                        <el-button  type="primary" @click="exportExcel">{{$t('导出EUB订单')}}</el-button>
                    </el-col>
                    <el-col :span="16">
                        <el-input :placeholder="$t('请输入内容后回车')" v-model="searchArgs.value"
                                  @keyup.enter.native="search"
                                  class="input-with-select">
                            <span slot="prepend">{{$t('订单编号')}}</span>
                            <el-button slot="append" icon="el-icon-search" @click="openQuery">Query</el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4" style="text-align: center">
                        <el-dropdown>
                            <el-button type="success">
                                {{$t('导入物流文件')}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-upload
                                            class="upload-demo"
                                            :action="uri"
                                            :show-file-list="false"
                                            name="file"
                                            :on-success="uploadSuccess"
                                    >
                                        <el-button  type="success" v-if="$router.power('/shipment/doImportShipmentNo')">
                                            {{$t('导入物流文件')}}
                                        </el-button>

                                    </el-upload>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="downloadImportFileExample()">{{$t('下载物流模板')}}</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>


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
                        @selection-change="checkItem"
                    >
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            width="100" >
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="150"
                    >
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
                            prop="stockPresell.storehouse_name"
                            :label="$t('仓库')"
                            width="60"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('创建时间')"
                            width="130"
                    >
                        <template slot-scope="props">
                            <span v-date="['YYYY-MM-DD HH:II',props.row.created_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipping_method"
                            :label="$t('物流方式')"
                            width="80"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shipping_track_no"
                            :label="$t('物流单号')"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('订单状态')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            {{$t('order.status.'+scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="last_track_status"
                            :label="$t('跟踪状态')"
                            width="90"
                    >
                        <template slot-scope="scope">

                            <el-tag type="danger" v-if="scope.row.last_track_status!='normal'">
                                {{$t('order.status.'+scope.row.last_track_status)}}
                            </el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('产品状态')"
                            width="80" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                {{$t('order.status.'+item.item_status)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('待定')"
                            width="80"
                    >
                        <template slot-scope="scope">

                            <el-tag type="danger" v-if="scope.row.paused > 0">
                                {{scope.row.paused == 1?$t('地址'):$t('产品')}}
                            </el-tag>

                        </template>
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
                                    <el-dropdown-item :command="{command:'备注',index:scope.$index}">
                                        {{$t('备注')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'联系',index:scope.$index}">
                                        {{$t('联系客户')}}
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
                <DialogOrderComment
                        :order="operationData"
                        ref="DialogOrderComment"
                        @commentSaveAfter="commentSaveAfter"></DialogOrderComment>
                <query ref="query" @search="search" type="eub"></query>
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
    import order_data from '../common/order_data';
    import query from '../order/query.pack.vue';
    import DialogOrderComment from '../order/common/order.comment.dialog.vue';
    var App= {
        props:['query'],
        components:{
            query,
            DialogOrderComment,
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
                cateStr:"",
                outerCommonDialogVisible:false,
                paymentStatusObj:order_data.paymentStatusObj,
                pager:{
                    page:1,
                    offset:0,
                    limit:10,
                    orderby:'order.updated_at desc',
                },
                distributionCount:0,
                uri:'/api/'+uri.importShipmentNo.act,
                multipleSelection:[],
            };
        },
        mounted(){
            vk.http(uri.eubCount,{},this.then);
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
                    case uri.eubExport.code:
                        if(json.url){
                            window.open(json.url);
                        }
                        break;
                    case uri.eubCount.code:
                        this.distributionCount=parseInt(json.total);
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
            tableRowClassName({row, rowIndex}) {
                return 'success-row';
            },
            operationCommand(param){
                this.operationData=this.tableData[param.index];
                switch (param.command){
                    case '异常':
                        this.openCommentDialog('1001');
                        break;
                    case '备注':
                        this.openCommentDialog('222');
                        break;
                    case '联系':
                        this.openCommentDialog('1006');
                        break;
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
                if(isEnter){
                    query.order[this.searchArgs.key]=this.searchArgs.value;
                }
                query.order=Object.assign(query.order,this.filterArgs);
                query.order.approved=1;
                query.order.shipping_method='EUB';
                query['with']={
                    noseeComment:true,
                    stockPresell:true,
                }
                vk.http(uri.orderQuery,query,this.then);
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
                if(obj.code==1005){//退款
                    this.$router.replace({ path: '/order/refund/apply' })
                    return;
                }
                this.search();
            },
            openQuery(){
                this.$refs.query.openQuery();
            },
            checkItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            exportExcel(){
                vk.http(uri.eubExport,{ids:this.multipleSelection},this.then);
            },
            downloadImportFileExample(){
                window.open('/download/importShipment/importShipmentNoExample.csv');
            },
            uploadSuccess(){
                this.search();
                vk.http(uri.eubCount,{},this.then);
            }
        }
    }
    export default {i18n,...App}
</script>