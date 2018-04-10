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
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                    </div>
                </el-col>
            </el-row>
            <div class="orderGrid22">
                <el-table  @selection-change="checkAll"
                        :data="[{}]"
                        border
                        style="width: 100%;"
                        @filter-change="filterChange"
                        ref="tableData"
                >
                    <el-table-column type="selection" width="55" ></el-table-column>
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            width="120" >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.itemdefective.ext_order_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.itemdefective.increment_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="serial_id"
                            :label="$t('生产/外采编号')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.itemdefective.serial_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SKU"
                            width="140" >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.itemdefective.sku.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('次品数量')"
                            prop="num"
                            width="80" >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                  v-model="querytable.itemdefective.num"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('原因')"
                            prop="categories" >
                    </el-table-column>
                    <el-table-column
                            :label="$t('创建者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.itemdefective.__created_uid"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('处理者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.itemdefective.__processing_uid"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('解决者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.itemdefective.__finish_uid"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('状态')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-select @change="search"
                                    v-model="querytable.itemdefective.status" clearable placeholder="select">
                                <el-option
                                        v-for="item in [0,1,2]"
                                        :key="item"
                                        :label="$t('item_defective_status_'+item)"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            fixed="right">
                        
                    </el-table-column>
                </el-table>
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: -1px;"
                        :height="height(190)"
                        @filter-change="filterChange"
                        @selection-change="checkProductItem"
                        ref="tableData"
                        :show-header="false"
                    >
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            width="120" >
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="140"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="serial_id"
                            :label="$t('生产/外采编号')"
                            width="140"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="sku"
                            label="SKU"
                            width="140" >
                    </el-table-column>
                    <el-table-column
                            :label="$t('次品数量')"
                            prop="num"
                            width="80" >
                    </el-table-column>
                    <el-table-column
                            :label="$t('原因')"
                            prop="categories" >
                        <template slot-scope="props">
                            {{props.row.categories.map(t=> { return t.name}).join(',')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('创建者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <div>
                                <div>{{getUserName(props.row.created_uid)}}</div>
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
                            <div v-if="props.row.processing_at>0">
                                <div>{{getUserName(props.row.processing_uid,true)}}</div>
                                <span v-date="['YYYY-MM-DD HH:II',props.row.processing_at]"></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('解决者')"
                            width="140"
                    >
                        <template slot-scope="props">
                            <div v-if="props.row.finish_at>0">
                                <div>{{getUserName(props.row.finish_uid,true)}}</div>
                                <span v-date="['YYYY-MM-DD HH:II',props.row.finish_at]"></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('状态')"
                            width="100"
                    >
                        <template slot-scope="scope">
                            {{$t('item_defective_status_'+scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            fixed="right">
                        <template slot-scope="scope">
                            <el-dropdown @command="operationCommand" trigger="click" v-if="scope.row.status<2">
                                <span class="el-dropdown-link">
                                {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                            v-if="scope.row.status<1"
                                            :command="{command:'处理中',index:scope.$index,issue_id:scope.row.id}">
                                        {{$t('item_defective_status_1')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'已解决',index:scope.$index,issue_id:scope.row.id}">
                                        {{$t('item_defective_status_2')}}
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
                <query ref="query" @search="search" type="issue"></query>
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
                    key:"ext_order_id",
                    value:"",
                },
                searchBaseArgs:{},
                filterArgs:{},
                operationData:{},
                outerDialogVisible:false,
                outerDialogSaveButton:false,
                multipleSelection:[],
                outerDialogFull:false,
                outerDialogType:"",
                cateStr:"",
                outerCommonDialogVisible:false,
                pager:{
                    page:1,
                    offset:0,
                    limit:10,
                    orderby:'itemdefective.created_at desc',
                },
                querytable:{
                    itemdefective:{
                        ext_order_id:{},
                        increment_id:{},
                        sku:{},
                        serial_id:{},
                        status:"",
                    },
                },
            };
        },
        mounted(){
            //console.log('this.$route',this.$route,this);
            //this.getData();
            //this.setBaseQuery();
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
            then(json,code){
                switch(code) {
                    case uri.itemDefectiveLists.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.itemDefectiveExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;
                }
            },
            handleCurrentChange(page){
                this.pager.page=page;
                this.search();
            },
            closeDialog(){
                this.outerDialogVisible=false;
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
                        vk.http(uri.itemDefectiveSet,{id:this.operationData.id,key:'status',val:1},this.search);
                        break;
                    case '已解决':
                        vk.http(uri.itemDefectiveSet,{id:this.operationData.id,key:'status',val:2},this.search);
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
                this.querytable['with'] = {categories:true};
                vk.http(uri.itemDefectiveLists,this.querytable,this.then);
            },
            checkProductItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
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
            checkAll(a,b,c){
                if(a.length>0){
                    this.$refs.tableData.clearSelection();
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row);
                    });
                }else{
                    this.$refs.tableData.clearSelection();
                }

            },
            exportExcel(){
//                if(this.multipleSelection.length < 1){
//                    this.$message(this.$t('common.none_select'))
//                    return;
//                }
                vk.http(uri.itemDefectiveExport,{ids:this.multipleSelection,with:['categories','product.picMap.image']},this.then);
            },
        }
    }
    export default {i18n,...App}
</script>