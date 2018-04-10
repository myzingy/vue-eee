<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" to="/fittings/create" icon="el-icon-arrow-left" @click="createFittings">
                            {{$t('添加配件')}}</el-button>
                        <el-button>{{$t('导出')}}</el-button>
                </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('编号')">
                        <el-input v-model="searchArgs.serial_id" @keyup.enter.native="onSearch" :placeholder="$t('编号')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('形状')" prop="shape">
                        <el-select v-model="searchArgs.shape" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.shape"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('颜色')" prop="color">
                        <el-select v-model="searchArgs.color" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.color"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('色系')" prop="mg_color">
                        <el-select v-model="searchArgs.mg_color" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.mg_color"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('材质')" prop="material">
                        <el-select v-model="searchArgs.material" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.material"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('品牌')" prop="brand">
                        <el-select v-model="searchArgs.brand" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.brand"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
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
                <!-- 配件列表 -->
                <el-table :data="fittingsList" border style="width: 100%" @selection-change="checkFittingsItem">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="serial_id" :label="$t('编号')"></el-table-column>
                    <el-table-column prop="pic" :label="$t('图片')">
                        <template slot-scope="scope">
                            <img width="100%" :src="scope.row.file && scope.row.file.path ? scope.row.file.path : ''" @click="showImageView($event)" class="image" />
                        </template>

                    </el-table-column>
                    <el-table-column prop="specifications" :label="$t('规格(mm)')"> </el-table-column>
                    <el-table-column prop="shape" :label="$t('形状')">
                        <template slot-scope="scope">{{stoneAttributes.shape[scope.row.shape]}}</template>
                    </el-table-column>
                    <el-table-column prop="mg_shape" :label="$t('形状系')">
                    </el-table-column>
                    <el-table-column prop="cutting" :label="$t('切割')">
                        <template slot-scope="scope">{{stoneAttributes.cutting[scope.row.cutting]}}</template>
                    </el-table-column>
                    <el-table-column prop="color" :label="$t('颜色')">
                        <template slot-scope="scope">{{stoneAttributes.color[scope.row.color]}}</template>
                    </el-table-column>
                    <el-table-column prop="color" :label="$t('色系')">
                        <template slot-scope="scope">{{stoneAttributes.mg_color[scope.row.mg_color]}}</template>
                    </el-table-column>
                    <el-table-column prop="material" :label="$t('材质')">
                        <template slot-scope="scope">{{stoneAttributes.material[scope.row.material]}}</template>
                    </el-table-column>
                    <el-table-column prop="weight" :label="$t('重量(g)')"> </el-table-column>
                    <el-table-column prop="carat_weight" :label="$t('克拉(ct)')"> </el-table-column>
                    <el-table-column prop="brand" :label="$t('品牌')">
                        <template slot-scope="scope">{{stoneAttributes.brand[scope.row.brand]}}</template>
                    </el-table-column>
                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown @click="handleItemClick(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('查看')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="editFittings(scope.row)">{{$t('编辑')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteFittings(scope.row)">{{$t('删除')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updateFittingsArgs.title" :visible.sync="dialogFormVisible">
                <dataForm ref="roleForm" v-bind:updateFittingsArgs="updateFittingsArgs" @listenToSaveFittings="receiveSaveFittings" @closeForm = "dialogFormVisible = false"></dataForm>
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
                fittingsList: [],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                fittingsAttributes:{},
                multipleSelection:[],
                dialogFormVisible: false,
                updateFittingsArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加配件')
                },
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {
            stoneAttributes:function(){
                return this.fittingsAttributes.stone ? this.fittingsAttributes.stone : {};
            }
        },
        mounted(){
            uri.fittingsAttributes.timeout = 0;
            vk.http(uri.fittingsAttributes,{},this.then);
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.fittingsList.code:
                        this.fittingsList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.fittingsDelete.code:
                        this.getLists();
                        break;
                    case uri.fittingsAttributes.code:
                        this.fittingsAttributes = json.data;
                        this.getLists();
                        break;
                }
            },
            onSearch(){
              this.getLists();
            },
            getLists(){
                uri.fittingsList.timeout = 0;
                vk.http(uri.fittingsList,{searchArgs:this.searchArgs,with:'file',page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkFittingsItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            createFittings(){
                this.dialogFormVisible = true
                this.updateFittingsArgs = {
                    id : null,
                    type : 'create',
                    title: i18n.t('添加配件')
                };
            },
            editFittings(row){
                this.dialogFormVisible = true
                this.updateFittingsArgs = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新配件')
                };
            },
            deleteFittings(row){
                let that = this;
                this.$confirm(i18n.t('此操作将永久删除该条目, 是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(() => {
                    vk.http(uri.fittingsDelete,{id:row.id},that.then);
                });
            },
            receiveSaveFittings(){
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
