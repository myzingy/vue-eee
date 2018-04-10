<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" v-if="$router.power('/product/add')" to="/product/create" icon="el-icon-arrow-left" @click="createProduct">
                            {{$t('common.add')}}</el-button>
                        <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                </div>
                </el-col>
            </el-row>

            <div>
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

                <!--搜索条件-->
                <el-table :data="[searchArgs]" border style="width: 100%" @sort-change="fieldSort" @selection-change="checkAll">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" sortable="custom" :label="$t('common.id')">
                        <template slot-scope="scope">
                            <el-input v-model="searchArgs.id" @keyup.enter.native="onSearch" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="category.name" :label="$t('product.product.category_name')">
                        <template slot-scope="scope">
                            <category_select ref="category_select1_id" v-bind:params="{changeOnSelect:true,expandTrigger:'click'}" v-bind:category_id="searchArgs.category_id" v-on:listenCategorySelect="receiveCategorySelect" v-model="searchArgs.category_id"></category_select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_set" :label="$t('product.product.is_set')">
                        <template slot-scope="scope">
                            <el-select v-model="searchArgs.is_set" clearable @change="onSearch" :placeholder="$t('common.please_select')">
                                <el-option
                                        v-for="(item, index) in ['否','是']"
                                        :key="index"
                                        :label="item"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" :label="$t('product.product.name')">
                        <template slot-scope="scope">
                            <el-input v-model="searchArgs.name" @keyup.enter.native="onSearch" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="spu" sortable="custom" :label="$t('product.product.spu')">
                        <template slot-scope="scope">
                            <el-input v-model="searchArgs.spu" @keyup.enter.native="onSearch" placeholder="SPU"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="osku" sortable="custom" :label="$t('product.product.osku')">
                        <template slot-scope="scope">
                            <el-input v-model="searchArgs.osku" @keyup.enter.native="onSearch" placeholder="OSKU"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pics" :label="$t('common.picture')" ></el-table-column>
                    <el-table-column prop="oneTemplate.template_type" :label="$t('product.template.template_type')">
                        <template slot-scope="scope">
                            <el-select v-model="searchArgs['product_template.template_type']" clearable @change="onSearch" :placeholder="$t('common.please_select')">
                                <el-option
                                        v-for="(item, index) in templateConfigs.templateTypeOptions"
                                        :key="index"
                                        :label="item"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="showFactoryInfo" prop="oneTemplate.factory_id" :label="$t('product.template.factory')">
                        <template slot-scope="scope">
                            <el-select v-model="searchArgs['product_template.factory_id']" clearable @change="onSearch" :placeholder="$t('common.please_select')">
                                <el-option
                                        v-for="(item, index) in templateConfigs.factories"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="template_no" :label="$t('product.product.template_no')">
                        <template slot-scope="scope">
                            <el-input v-model="searchArgs.template_no" @keyup.enter.native="onSearch" placeholder=""></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_clearance" :label="$t('product.product.is_clearance')">
                        <template slot-scope="scope">
                            <el-select v-model="searchArgs.is_clearance" clearable @change="onSearch" :placeholder="$t('common.please_select')">
                                <el-option
                                        v-for="(item, index) in ['否','是']"
                                        :key="index"
                                        :label="item"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brand" :label="$t('product.product.brand')">
                        <template slot-scope="scope">
                            <el-select v-model="searchArgs.brand" clearable @change="onSearch" :placeholder="$t('common.please_select')">
                                <el-option
                                        v-for="(item, index) in productAttributes.brand"
                                        :key="index"
                                        :label="item"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" sortable="custom" :formatter="moment" :label="$t('product.product.created_at')">
                        <template slot-scope="scope">
                            <el-date-picker
                                    v-model="searchArgs.created_at"
                                    type="datetimerange"
                                    @change="onSearch"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" :label="$t('common.operate')"></el-table-column>
                </el-table>
                <!-- 产品列表 -->
                <el-table :show-header="false" ref="multipleTable" :data="productList" border @selection-change="checkProductItem" style="width: 100%">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="id" sortable="custom" :label="$t('common.id')"> </el-table-column>
                    <el-table-column prop="category.name" :label="$t('product.product.category_name')"> </el-table-column>
                    <el-table-column prop="is_set" :label="$t('product.product.is_set')">
                        <template slot-scope="scope">{{scope.row.is_set==1 ? '是':'否'}}</template>
                    </el-table-column>
                    <el-table-column prop="name" :label="$t('product.product.name')"> </el-table-column>
                    <el-table-column prop="spu" sortable="custom" :label="$t('product.product.spu')"> </el-table-column>
                    <el-table-column prop="osku" sortable="custom" :label="$t('product.product.osku')"> </el-table-column>
                    <el-table-column prop="pics" :label="$t('common.picture')" >
                        <template slot-scope="scope">
                            <img width="100%" :src="getMainImage(scope.row.picMap)" @click="showImageView($event)" class="image" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="oneTemplate.template_type" :label="$t('product.template.template_type')">
                        <template slot-scope="scope">{{scope.row.oneTemplate && templateConfigs.template_type ? templateConfigs.template_type[scope.row.oneTemplate.template_type] : ''}}</template>
                    </el-table-column>
                    <el-table-column  v-if="showFactoryInfo" prop="oneTemplate.factory_id" :label="$t('product.template.factory_id')">
                        <template slot-scope="scope">{{scope.row.factories && scope.row.factories.length>0 ? scope.row.factories.map(function(value) {return value.name}).join(',') : ''}}</template>
                    </el-table-column>
                    <el-table-column prop="template_no" :label="$t('product.product.template_no')"> </el-table-column>
                    <el-table-column prop="is_clearance" :label="$t('product.product.is_clearance')">
                        <template slot-scope="scope">{{scope.row.is_clearance==1 ? '是':'否'}}</template>
                    </el-table-column>
                    <el-table-column prop="brand" :label="$t('product.product.brand')"></el-table-column>
                    <el-table-column prop="created_at" sortable="custom" :formatter="moment" :label="$t('product.product.created_at')"> </el-table-column>
                    <el-table-column fixed="right" :label="$t('common.operate')">
                        <template slot-scope="scope">
                            <el-dropdown @click="viewProduct(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('common.view')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="$router.power('/product/update')" @click.native="editProduct(scope.row)">{{$t('common.edit')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="$router.power('/product/update')" @click.native="editSeries(scope.row)">{{$t('product.product.edit_series')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="$router.power('/product/supply-stock') && scope.row.support_stock==1" @click.native="supplyStock(scope.row)">{{$t('product.product.supply_stock')}}</el-dropdown-item>
                                    <el-dropdown-item  v-if="$router.power('/product/delete')" @click.native="deleteProduct(scope.row)">{{$t('common.delete')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updateProductArgs.title" :fullscreen="true" :visible.sync="dialogFormVisible">
                <createForm ref="create_form_id" v-bind:updateProductArgs="updateProductArgs" @listenToSaveProduct="receiveSaveProduct" @closeForm = "dialogFormVisible = false"></createForm>
            </el-dialog>
            <el-dialog :title="$t('product.product.supply_stock')" :visible.sync="dialogStockFormVisible">
                <supplyStockForm :product="currentRow" :spu="currentRow && currentRow.spu ? currentRow.spu : ''" @listenToSupplyStock="receiveSupplyStock" @closeForm = "dialogStockFormVisible = false"></supplyStockForm>
            </el-dialog>
            <el-dialog :title="$t('product.product.edit_series')" :visible.sync="dialogSeriesFormVisible">
                <editSeriesForm :id="currentRow && currentRow.id ? currentRow.id : ''"  @closeForm = "dialogSeriesFormVisible = false"></editSeriesForm>
            </el-dialog>
            <!-- img view-->
            <image_view :url="previewImage.url" :width="previewImage.width" :dialogVisible="previewImage.show" @closeImagePreview="closeImagePreview"></image_view>
        </div>
    </v-layout>

</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import createForm from './create.vue';
    import supplyStockForm from './supply-stock.vue';
    import editSeriesForm from './edit-series.vue';
    import category_select from '../category/block/select_category.vue';
    import image_view from '../common/image_view.vue';
    let App ={
        components:{
            createForm:createForm,
            supplyStockForm,
            editSeriesForm,
            category_select:category_select,
            image_view,
        },
        data() {
            return {
                productList: [],
                productAttributes:{},
                templateConfigs:{},
                searchArgs:{},
                popover_image_path:'',
                sortField:'',
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                multipleSelection:[],
                dialogFormVisible: false,
                dialogStockFormVisible:false,
                dialogSeriesFormVisible:false,
                updateProductArgs:{
                    type : 'create',
                    id : null,
                    title:this.$t('common.add')
                },
                currentRow:null,
                previewImage:{url:'',width:0,show:false},
            }
        },
        mounted(){
            vk.http(uri.productAttributes,{},this.then);

            setTimeout(() =>{//加载公共数据
                vk.http(uri.categoryTree,{status:1},this.then);
                vk.http(uri.fittingsAttributes,{},this.then);
                vk.http(uri.productTemplateConfigs,{},this.then);
                vk.http(uri.fittingsList,{},this.then);
                vk.http(uri.productCustomMaterial, {type: 'ring'}, this.then)
                vk.http(uri.productCustomMaterial, {type: 'necklace'}, this.then)
            },1000);
        },
        computed: {
            showFactoryInfo:function(){
                return this.templateConfigs.factories && this.templateConfigs.factories.length > 1;
            }
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.productList.code:
                        this.productList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.productDelete.code:
                        this.getLists();
                        break;
                    case uri.productAttributes.code:
                        this.productAttributes = json.data;
                        this.getLists();
                        break;
                    case uri.productExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;
                    case uri.productTemplateConfigs.code:
                        this.templateConfigs = json.data;
                        break;
                }

            },
            getLists(){

                vk.http(uri.productList,{searchArgs:this.searchArgs,joinWith:'oneTemplate',with:['category','picMap.image','detail','factories','commodities','options'],sort:this.sortField,page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            exportExcel(){
//                if(this.multipleSelection.length < 1){
//                    this.$message(this.$t('common.none_select'))
//                    return;
//                }
                vk.http(uri.productExport,{ids:this.multipleSelection,with:['category','picMap.image']},this.then);
            },
            checkProductItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            checkAll(a,b,c){
                if(a.length>0){
                    this.$refs.multipleTable.clearSelection();
                    this.productList.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }else{
                    this.$refs.multipleTable.clearSelection();
                }

            },
            onSearch(){
                this.getLists();
            },
            createProduct(){
                this.dialogFormVisible = true
                this.updateProductArgs = Object.assign({}, this.updateProductArgs, {
                    id : null,
                    type : 'create',
                    title: this.$t('common.add')
                })
                setTimeout(t=>{this.$refs.create_form_id.init();},0)

            },
            viewProduct(){},
            editProduct(row){console.log(row);
                this.dialogFormVisible = true
                this.updateProductArgs = Object.assign({}, this.updateProductArgs, {
                    id : row.id,
                    type : 'update',
                    title: this.$t('common.edit')
                })
                setTimeout(t=>{this.$refs.create_form_id.init();},0)
            },
            editSeries(row){
                this.dialogSeriesFormVisible = true
                this.currentRow = row;
            },
            deleteProduct(row){
                if(row.commodities.length>0){
                    this.$message({message:this.$t('此产品存在商品,不可删除'),type:'warning'});
                    return;
                }
                this.$confirm(this.$t('common.confirm_delete'), this.$t('common.prompt'), {
                    confirmButtonText: this.$t('common.ok'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    vk.http(uri.productDelete,{id:row.id},this.then);
                });
            },
            supplyStock(row){
                this.dialogStockFormVisible = true;
                this.currentRow = row;
            },
            receiveCategorySelect(data){
                this.searchArgs.category_id = data.category_id;
                this.onSearch();
            },
            receiveSaveProduct(){
                this.dialogFormVisible = false;
                this.getLists();
                console.log('产品更新完毕');
            },
            receiveSupplyStock(){

            },
            fieldSort(column){
                let o_map = {ascending:'asc',descending:'desc'};
                switch (column.prop){
                    case 'spu':
                    case 'id':
                    case 'created_at':
                        this.sortField = 'product.'+column.prop + ' '+o_map[column.order];
                        break;
                }
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
            moment: function (row, column) {
                return vk.date('YYYY-MM-DD HH:II',row[column.property]);
            }
        }
    }
    export default {i18n,...App};
</script>
