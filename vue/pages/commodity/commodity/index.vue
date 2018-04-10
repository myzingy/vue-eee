<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" icon="el-icon-arrow-left" @click="createCommodity">
                            {{$t('添加商品')}}</el-button>
                        <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                        <el-button @click="syncCommodity('select')">{{$t('同步至Mangeto')}}</el-button>
                </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item style="width:220px" :label="$t('类目')" prop="category_id">
                        <select_tree  ref="category_tree_id" v-bind:site_id="site" v-on:listenCategorySelect="receiveCategorySelect"></select_tree>
                    </el-form-item>
                    <el-form-item label="SPU">
                        <el-input v-model="searchArgs.spu" @keyup.enter.native="onSearch" placeholder="SPU"></el-input>
                    </el-form-item>

                </el-form>
                <!-- 分页 -->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="slot, sizes, prev, pager, next, jumper"
                        :total="page.total"
                        slot="page.total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:page.total})}}</span>
                    </template>
                </el-pagination>
                <!-- 商品列表 -->
                <el-table :data="commodityList" border style="width: 100%"
                          @selection-change="checkCommodityItem"
                          @sort-change="fieldSort"
                          :default-sort = "{prop: 'created_at', order: 'descending'}">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="magento_id" :label="$t('magentoID')">
                        <template slot-scope="scope">
                            <div v-if="scope.row.magento_id !=0">
                                {{scope.row.magento_id}}
                            </div>
                            <el-tag v-else size="mini" type="success">{{$t('未同步')}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="categories.0.firstCate.name" :label="$t('类目')"> </el-table-column>
                    <el-table-column prop="meta_title" :label="$t('标题')"> </el-table-column>
                    <el-table-column sortable="custom" prop="product.spu" :label="$t('产品SPU')"></el-table-column>
                    <el-table-column prop="product.pics" :label="$t('common.picture')" >
                        <template slot-scope="scope">
                            <img width="100%" :src="scope.row.product && getMainImage(scope.row.product.picMap) ? getMainImage(scope.row.product.picMap) : ''" @click="showImageView($event)" class="image" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="product.name" :label="$t('产品名称')"> </el-table-column>
                    <el-table-column sortable="custom" prop="selling_price" :label="$t('product.product.selling_price')">
                        <template slot-scope="scope">
                            {{scope.row.selling_price}}
                            <span v-if="scope.row.special_price>0">({{scope.row.special_price}})</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="product.category.name" :label="$t('product.product.category_name')"> </el-table-column>
                    <el-table-column sortable="custom" prop="sync_at" :label="$t('同步时间')">
                        <template slot-scope="scope">
                            <span v-date="['YYYY-MM-DD HH:II',scope.row.sync_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="created_at" :label="$t('创建时间')">
                        <template slot-scope="scope">
                            <span v-date="['YYYY-MM-DD HH:II',scope.row.created_at]"></span>
                        </template>
                    </el-table-column>


                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown @click="handleItemClick(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('查看')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="editCommodity(scope.row)">{{$t('编辑')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="syncCommodity(scope.row)">{{$t('同步')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteCommodity(scope.row)">{{$t('删除')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updateCommodityArgs.title" :visible.sync="dialogFormVisible">
                <dataForm ref="roleForm" v-bind:updateCommodityArgs="updateCommodityArgs" @listenToSaveCommodity="receiveSaveCommodity" @closeForm = "dialogFormVisible = false"></dataForm>
            </el-dialog>
            <!-- img view-->
            <image_view :url="previewImage.url" :width="previewImage.width" :dialogVisible="previewImage.show" @closeImagePreview="closeImagePreview"></image_view>
        </div>
    </v-layout>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    import dataForm from './form.vue';
    import select_tree from '../../commodity/category/block/select_tree.vue';
    import { mapState,mapActions } from 'vuex'
    import { SET } from '../../../store/data.js'
    import image_view from '../../common/image_view.vue';
    let App ={
        components:{
            dataForm:dataForm,
            select_tree:select_tree,
            image_view
        },
        data() {
            return {
                commodityList: [],
                searchArgs:{},
                sortField:'commodity.created_at desc',
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                multipleSelection:[],
                dialogFormVisible: false,
                updateCommodityArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加商品')
                },
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: mapState({
            site: state => state.data.site||'',
        }),
        mounted(){
            this.getLists();
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.commodityList.code:
                        this.commodityList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.commodityDelete.code:
                    case uri.commoditySync.code:
                        this.getLists();
                        break;
                    case uri.commodityExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;
                }
            },
            onSearch(){
              this.getLists();
            },
            getLists(){
                if(this.site==''){
                    this.$message(i18n.t('请选择站点'));
                    return false;
                }
                this.searchArgs.site_id = this.site;
                vk.http(uri.commodityList,{searchArgs:this.searchArgs,select:'commodity.*,commodity_category_map.category_id,commodity_category_map.position',
                    with:['product.category','product.picMap.image','categories.firstCate'],sort:this.sortField,group:'commodity.id',page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkCommodityItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            createCommodity(){
                if(!this.site) {
                    this.$message(i18n.t('请选择站点'));
                    return false;
                }
                this.dialogFormVisible = true
                this.updateCommodityArgs = {
                    id : null,
                    type : 'create',
                    title: i18n.t('添加商品')
                };
            },
            editCommodity(row){
                this.dialogFormVisible = true
                this.updateCommodityArgs = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新商品')
                };
            },
            syncCommodity(row){
                if(!this.site) {
                    this.$message(i18n.t('请选择站点'));
                    return false;
                }
                this.$confirm(i18n.t('此操作将同步至Magento, 是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(t => {
                    if(row=='select'){
                        if(this.multipleSelection.length>0){
                            vk.http(uri.commoditySync,{ids:this.multipleSelection,site_id:this.site},this.then);
                        }else{
                            this.$message(i18n.t('未选择任何条目'));
                        }
                    }else{
                        vk.http(uri.commoditySync,{ids:[row.id],site_id:this.site},this.then);
                    }

                });
            },
            deleteCommodity(row){
                if(parseInt(row.magento_id)){
                    this.$message({message:i18n.t('此商品已上架至站点，不可删除!'),type: 'warning'});
                    return false;
                }
                this.$confirm(i18n.t('此操作将永久删除该条目, 是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(t => {vk.http(uri.commodityDelete,{id:row.id,force:1},this.then);});
            },
            exportExcel(){

                vk.http(uri.commodityExport,{ids:this.multipleSelection,with:['product.category','product.picMap.image','categories.firstCate']},this.then);
            },
            fieldSort(column){
                let o_map = {ascending:'asc',descending:'desc'};
                switch (column.prop){
                    case 'product.spu':
                        this.sortField = column.prop + ' '+o_map[column.order];
                        break;
                    case 'selling_price':
                    case 'sync_at':
                    case 'created_at':
                        this.sortField = 'commodity.'+column.prop + ' '+o_map[column.order];
                        break;
                }
                this.getLists();
            },
            receiveCategorySelect(data){
                this.searchArgs.category_id = data[0];
                this.onSearch();
            },
            receiveSaveCommodity(){
                this.dialogFormVisible = false;
                this.getLists();
            },
            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getLists();
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getLists();
            },
            handleItemClick(){

            }
        },
        filters: {
            showMagentoId: function (value) {
                if (value==0) return <el-tag size="mini" type="success">{i18n.t('未同步')}</el-tag>;
                return value;
            }
        }
    }
    export default {i18n,...App};
</script>
