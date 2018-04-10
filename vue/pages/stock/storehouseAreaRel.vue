<template>
    <v-layout>
        <div slot="main">
            <div >

                <el-row :gutter="24" style="margin-top: 20px">
                    <el-col :span="4" :offset="20">
                        <div class="grid-content bg-purple">
                            <el-button type="primary" icon="el-icon-arrow-left" @click="add" v-if="$router.power('/stock/storehouseAreaRel/add')">{{$t('新增')}}</el-button>
                        </div>
                    </el-col>
                </el-row>

                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">

                    <el-form-item :label="$t('仓库')" prop="storehouse_id">
                        <el-select v-model="searchArgs.storehouse_id" clearable @change="onSearch" :placeholder="$t('仓库')">
                            <el-option
                                    v-for="item in storehouses"
                                    :key="item.id"
                                    :label="$t(item.name)"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('覆盖地区')" prop="area_shortname">
                        <el-select v-model="searchArgs.area_shortname" clearable @change="onSearch" :placeholder="$t('覆盖地区')" filterable>
                            <el-option
                                    v-for="item in area"
                                    :key="item.shortname"
                                    :label="$t(item.shortname)"
                                    :value="item.shortname">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('物流类型')" prop="shipping_method_type">
                        <el-select v-model="searchArgs.shipping_method_type" clearable @change="onSearch" :placeholder="$t('物流类型')">
                            <el-option
                                    v-for="(item, index) in shipmentMethodType"
                                    :key="index"
                                    :label="$t(item)"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('物流方式')" prop="shipping_method">
                        <el-select v-model="searchArgs.shipping_method" clearable @change="onSearch" :placeholder="$t('物流方式')">
                            <el-option
                                    v-for="(item, index) in allShipmentMethod"
                                    :key="index"
                                    :label="$t(item)"
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
                        :total="page.total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:page.total})}}</span>
                    </template>
                </el-pagination>

                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="storehouse.name" :label="$t('仓库')"></el-table-column>
                    <el-table-column prop="area_shortname" :label="$t('覆盖地区')"></el-table-column>
                    <el-table-column prop="shipping_method_type" :label="$t('物流类型')">
                        <template slot-scope="scope">{{$t(shipmentMethodType[scope.row.shipping_method_type])}}</template>
                    </el-table-column>
                    <el-table-column prop="shipping_method" :label="$t('物流方式')"></el-table-column>
                    <el-table-column prop="duration" :label="$t('时效')"></el-table-column>
                    <el-table-column prop="pr" :label="$t('概率')"></el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="update(scope.row)" v-if="$router.power('/stock/storehouseAreaRel/update')">{{$t('更新')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteData(scope.row)" v-if="$router.power('/stock/storehouseAreaRel/deleteData')">{{$t('删除')}}</el-dropdown-item>
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
    import dataForm from './storehouseAreaRelForm.vue';

    import i18n from '../../local'
    var App= {
        components:{
            dataForm,
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
                storehouses:{},
                area:{},
                shipmentMethodType:{},
                allShipmentMethod:{},
                dialogFormVisible: false,
                dialogFormAttributes:{
                    id : null,
                    type : '',
                    title : '',
                }
            }
        },
        mounted(){
            this.searchArgs = this.$route.query;
            this.getData();
            vk.http(uri.getAllStorehouse,{},this.then);
            vk.http(uri.getShipmentMethodType,{},this.then);
            vk.http(uri.getAllShipmentMethod,{},this.then);
            vk.http(uri.getAllArea,{},this.then);
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.storehouseAreaRel.code:
                        this.tableData = json.list;
                        if(json.total){
                            this.page.total = json.total;
                        }
                        break;

                    case uri.getAllStorehouse.code:
                        this.storehouses = json.data;
                        break;

                    case uri.getShipmentMethodType.code:
                        this.shipmentMethodType = json.data;
                        break

                    case uri.getAllShipmentMethod.code:
                        this.allShipmentMethod = json.data;
                        break;

                    case uri.getAllArea.code:
                        this.area = json.data;
                        break;
                }
            },
            getData(){
                vk.http(uri.storehouseAreaRel,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
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
                    id : '',
                    type : 'add',
                    title: i18n.t('新增'),
                };
            },
            update(row){
                this.dialogFormVisible = true;
                this.dialogFormAttributes = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新') + '：' + row.storehouse.name,
                };
            },
            deleteData(row){
                var _this = this;
                vk.confirm(i18n.t('此操作将永久删除该条目, 是否继续?'),function(){
                    vk.http(uri.storehouseAreaRelDelete,{id:row.id},_this.getData);
                });
            },
            receiveSave(){
                this.dialogFormVisible = false;
                this.getData();
            }
        }
    }
    export default {i18n,...App}
</script>