<template>
    <v-layout>
        <div slot="main">
            <div>

                <el-row :gutter="24" style="margin-top: 20px">
                    <el-col :span="4" :offset="20">
                        <div class="grid-content bg-purple">
                            <el-button type="primary" icon="el-icon-arrow-left" @click="add" v-if="$router.power('add')">{{$t('添加仓库')}}</el-button>
                        </div>
                    </el-col>
                </el-row>

                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">

                    <el-form-item :label="$t('仓库名称')">
                        <el-input v-model="searchArgs.name" @keyup.enter.native="onSearch" :placeholder="$t('仓库名称')"></el-input>
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
                        :total="page.total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:page.total})}}</span>
                    </template>
                </el-pagination>

                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="name" :label="$t('仓库名称')"></el-table-column>
                    <el-table-column prop="shortname" :label="$t('仓库简称')"></el-table-column>
                    <el-table-column prop="contact" :label="$t('联系人')"></el-table-column>
                    <el-table-column prop="country" :label="$t('仓库所在国家')"></el-table-column>
                    <el-table-column prop="address" :label="$t('仓库地址')"></el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="edit(scope.row)" v-if="$router.power('/stock/storehouseList/edit')">{{$t('更新')}}</el-dropdown-item>

                                    <el-dropdown-item v-if="$router.power('/stock/storehouseAreaRel')">
                                        <router-link :to="{ path: '/stock/storehouseAreaRel', query: { storehouse_id: scope.row.id}}">{{$t('仓库物流配置')}}</router-link>
                                    </el-dropdown-item>

                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="dialogFormAttributes.title" :visible.sync="dialogFormVisible">
                <dataForm v-bind:dialogFormAttributes="dialogFormAttributes" @listenToSave="receiveSave" @closeForm="dialogFormVisible=false"></dataForm>
            </el-dialog>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import dataForm from './storehouseForm.vue';

    import i18n from '../../local'
    var App= {
        components:{
            dataForm:dataForm,
        },
        data() {
            return {
                tableData:[],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:10,
                    pageSizes:[10, 50, 100, 200,500],
                    total:0
                },
                dialogFormVisible: false,
                dialogFormAttributes:{
                    type : '',
                    id : null,
                    title:''
                }
            }
        },
        mounted(){
            this.getData();
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.storehouseList.code:
                        this.tableData = json.list;
                        if(json.total){
                            this.page.total = json.total;
                        }
                        break;
                }
            },
            getData(){
                vk.http(uri.storehouseList,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
            },
            onSearch(){
                this.page.currentPage = 1;
                this.getData();
            },
            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getData();
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getData();
            },
            add(){
                this.dialogFormVisible = true;
                this.dialogFormAttributes = {
                    id : null,
                    type : 'add',
                    title: i18n.t('添加仓库')
                };
            },
            edit(row){
                this.dialogFormVisible = true
                this.dialogFormAttributes = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新仓库') + '：' + row.name
                };
            },
            receiveSave(){
                this.dialogFormVisible = false;
                this.getData();
            },
        }
    }
    export default {i18n,...App}
</script>