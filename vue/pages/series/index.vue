<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" icon="el-icon-arrow-left" @click="createSeries">
                            {{$t('添加标签')}}</el-button>
                        <!--<el-button>{{$t('导出')}}</el-button>-->
                </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">

                    <el-form-item :label="$t('key')">
                        <el-input v-model="searchArgs.key" @keyup.enter.native="onSearch" :placeholder="$t('key')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('名称')">
                        <el-input v-model="searchArgs.name" @keyup.enter.native="onSearch" :placeholder="$t('名称')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('类别')">
                        <el-input v-model="searchArgs.category" @keyup.enter.native="onSearch" :placeholder="$t('类别')"></el-input>
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
                <!-- 标签列表 -->
                <el-table :data="productSeriesList" border style="width: 100%" @selection-change="checkSeriesItem">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="key" :label="$t('key')"></el-table-column>
                    <el-table-column prop="name" :label="$t('名称')"> </el-table-column>
                    <el-table-column prop="category" :label="$t('类别')"> </el-table-column>
                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown @click="handleItemClick(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('查看')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="editSeries(scope.row)">{{$t('编辑')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteSeries(scope.row)">{{$t('删除')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updateSeriesArgs.title" :visible.sync="dialogFormVisible">
                <dataForm ref="roleForm" v-bind:updateSeriesArgs="updateSeriesArgs" @listenToSaveSeries="receiveSaveSeries" @closeForm = "dialogFormVisible = false"></dataForm>
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
    import dataForm from './form.vue';
    import image_view from '../common/image_view.vue';
    let App ={
        components:{
            dataForm:dataForm,
            image_view
        },
        data() {
            return {
                productSeriesList: [],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                seriesAttributes:{},
                multipleSelection:[],
                dialogFormVisible: false,
                updateSeriesArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加标签')
                },
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {

        },
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
                    case uri.productSeriesList.code:
                        this.productSeriesList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.productSeriesDelete.code:
                        this.getLists();
                        break;

                }
            },
            onSearch(){
              this.getLists();
            },
            getLists(){
                uri.productSeriesList.timeout = 0;
                vk.http(uri.productSeriesList,{searchArgs:this.searchArgs,page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkSeriesItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            createSeries(){
                this.dialogFormVisible = true
                this.updateSeriesArgs = {
                    id : null,
                    type : 'create',
                    title: i18n.t('添加标签')
                };
            },
            editSeries(row){
                this.dialogFormVisible = true
                this.updateSeriesArgs = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新标签')
                };
            },
            deleteSeries(row){
                let that = this;
                this.$confirm(i18n.t('此操作将永久删除该条目, 是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(() => {
                    vk.http(uri.productSeriesDelete,{id:row.id},that.then);
                });
            },
            receiveSaveSeries(){
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
            }
        }
    }
    export default {i18n,...App};
</script>
