<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary"  icon="el-icon-arrow-left" @click="syncCategory">
                        {{$t('获取类目')}}</el-button>
                        <el-button type="primary"  @click="syncSorts">
                            {{$t('同步商品排序')}}</el-button>
                </div>
                </el-col>
            </el-row>

            <div style="padding: 10px;">
                <!-- 产品列表 -->
                <el-tree v-if="loading"
                        :data="categoryData"
                        :props="defaultProps"
                        node-key="id"
                        default-expand-all
                        :render-content="renderContent">
                </el-tree>
            </div>
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
            <el-table :data="[searchArgs]" border style="width: 100%" @selection-change="checkAll">
                <el-table-column type="selection" prop="id" width="55"></el-table-column>
                <el-table-column prop="meta_title" :label="$t('标题')"> </el-table-column>
                <el-table-column prop="product.spu" :label="$t('产品SPU')">
                    <template slot-scope="scope">
                        <el-input v-model="searchArgs.spu" @keyup.enter.native="onSearch" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="product.name" :label="$t('产品名称')"> </el-table-column>
                <el-table-column prop="sync_at" :label="$t('排序')"></el-table-column>
                <el-table-column :label="$t('操作')"></el-table-column>
            </el-table>
            <!-- 商品列表 -->
            <el-table :show-header="false" ref="multipleTable" :data="commodityList" border style="width: 100%" @selection-change="checkProductItem">
                <el-table-column type="selection" prop="id" width="55"></el-table-column>
                <el-table-column prop="meta_title" :label="$t('标题')"> </el-table-column>
                <el-table-column prop="product.spu" :label="$t('产品SPU')"></el-table-column>
                <el-table-column prop="product.name" :label="$t('产品名称')"> </el-table-column>
                <el-table-column prop="sync_at" :label="$t('排序')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.position"></el-input>
                    </template>
                </el-table-column>


                <el-table-column :label="$t('操作')">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click.native="saveSort(scope.row)">{{$t('保存')}}</el-button>
                    </template>

                </el-table-column>
            </el-table>
            <div>&nbsp;</div>
        </div>
    </v-layout>

</template>

<script>
    let id = 1000;
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    import { mapState,mapActions } from 'vuex'
    import { SET } from '../../../store/data.js'
    let App ={
        data() {
            return {
                categoryData: [{
                    id: 0,
                    name: i18n.t('顶级分类'),
                    key: 'top',
                    pid: 0,
                    status:1,
                    children :[]
                }],
                commodityList:[],
                multipleSelection:[],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                isNew:true,
                curreent_category:0,
                parentNode : null,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                } ,
                loading:false,
            }
        },
        mounted(){
            if(this.site==''){
                this.$message(i18n.t('请选择站点'));
                return false;
            }
            this.loading=true;
            this.getListTree();
        },
        computed: mapState({
            site: state => state.data.site||'',
        }),
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.commodityCategoryTree.code:
                        this.$set(this.categoryData[0], 'children', json.data)
                        this.dialogFormVisible = false;
                        break;
                    case uri.commodityCategorySync.code:
                        this.getListTree();
                        break;
                    case uri.commodityList.code:
                        this.commodityList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.commodityCategoryMapEdit.code:
                        this.getCommodityLists(this.curreent_category);
                        break;
                    case uri.commodityCategorySortSync.code:

                        break;
                }

            },
            getListTree(){
                uri.commodityCategoryTree.timeout = 0;
                vk.http(uri.commodityCategoryTree,{site_id:this.site,is_active:-1},this.then);
            },
            getCommodityLists(category_id){
                this.curreent_category = category_id;
                this.searchArgs = Object.assign(this.searchArgs,{category_id:[category_id],has_sync:1});
                vk.http(uri.commodityList,{searchArgs:this.searchArgs,select:'commodity.*,commodity_category_map.category_id,commodity_category_map.position',
                    with:['product.category','categories'],sort:'commodity_category_map.position',page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            onSearch(){
                this.getCommodityLists(this.curreent_category);
            },
            syncCategory(){
                vk.http(uri.commodityCategorySync,{site_id:this.site},this.then);
            },
            saveSort(row){
                let data = {category_id:row.category_id,commodity_id:row.id,position:row.position};
                vk.http(uri.commodityCategoryMapEdit,data,this.then);
            },
            checkProductItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            checkAll(a,b,c){
                if(a.length>0){
                    this.$refs.multipleTable.clearSelection();
                    this.commodityList.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }else{
                    this.$refs.multipleTable.clearSelection();
                }
            },
            syncSorts(){
                if(this.multipleSelection.length<1){
                    this.$message(i18n.t('请选择相应的条目'));
                    return false;
                }
                vk.http(uri.commodityCategorySortSync,{ids:this.multipleSelection,category_id:this.curreent_category},this.then);
            },
            renderContent(h, { node, data, store }) {

                return (
                        <span>
                        <span>
                            <span>{node.label}</span>
                        </span>
                        <span style="margin-left:6px">
                            {
                                data.is_active!=0 ? <el-tag size="mini" type="success">启用</el-tag> :<el-tag size="mini" type="info">禁用</el-tag>
                            }
                        </span>
                        <span style="margin-left:6px">
                            <el-button on-click={ () => this.getCommodityLists(data.id) } type="text" icon="el-icon-arrow-right">产品列表</el-button>
                        </span>
                    </span>
                );
            },
            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getCommodityLists(this.curreent_category);
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getCommodityLists(this.curreent_category);
            },

        }
    }
    export default {i18n,...App};
</script>
