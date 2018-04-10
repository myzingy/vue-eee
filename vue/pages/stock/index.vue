<style lang="stylus" rel="stylesheet/scss">
    .box{
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
</style>
<template>
    <v-layout>
        <div slot="main">
            <div >

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

                    <el-form-item :label="$t('类型')" prop="template_type">
                        <el-select v-model="searchArgs.template_type" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in templateConfigs.templateTypeOptions"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('产品类型')" prop="category">
                        <el-select v-model="searchArgs.category" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in templateConfigs.category"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('产品编号')">
                        <el-input v-model="searchArgs.product_id" @keyup.enter.native="onSearch" :placeholder="$t('产品编号')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('SPU')">
                        <el-input v-model="searchArgs.spu" @keyup.enter.native="onSearch" :placeholder="$t('SPU')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('Size')">
                        <el-input v-model="searchArgs.size" @keyup.enter.native="onSearch" :placeholder="$t('Size')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('SKU')">
                        <el-input v-model="searchArgs.sku" @keyup.enter.native="onSearch" :placeholder="$t('SKU')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('可用库存数量')">
                        <el-col :span="5">
                            <el-input v-model="searchArgs.stock_quantity_start" @keyup.enter.native="onSearch" :placeholder="$t('起')"></el-input>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="5">
                            <el-input v-model="searchArgs.stock_quantity_end" @keyup.enter.native="onSearch" :placeholder="$t('止')"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item :label="$t('在补库存数量')">
                        <el-col :span="5">
                            <el-input v-model="searchArgs.restock_quantity_start" @keyup.enter.native="onSearch" :placeholder="$t('起')"></el-input>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="5">
                            <el-input v-model="searchArgs.restock_quantity_end" @keyup.enter.native="onSearch" :placeholder="$t('止')"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item :label="$t('预占库存数量')">
                        <el-col :span="5">
                            <el-input v-model="searchArgs.presell_quantity_start" @keyup.enter.native="onSearch" :placeholder="$t('起')"></el-input>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="5">
                            <el-input v-model="searchArgs.presell_quantity_end" @keyup.enter.native="onSearch" :placeholder="$t('止')"></el-input>
                        </el-col>
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
                    <el-table-column prop="template_type" :label="$t('类型')">
                        <template slot-scope="scope">
                            {{templateConfigs.template_type[scope.row.template_type]}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="category" :label="$t('产品类型')">
                        <template slot-scope="scope">
                            {{templateConfigs.category[scope.row.category]}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="product.id" :label="$t('产品编号')"></el-table-column>
                    <el-table-column prop="product.img" :label="$t('图片')">
                        <template slot-scope="scope">
                            <div class="box">
                                <v-img :src="scope.row.product.img ? scope.row.product.img : ''" @click="showImageView($event)" class="image" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="spu" :label="$t('SPU')"></el-table-column>
                    <el-table-column prop="size" :label="$t('尺码')"></el-table-column>
                    <el-table-column prop="sku" :label="$t('SKU')"></el-table-column>
                    <el-table-column prop="stock_quantity" :label="$t('可用库存数量')"> </el-table-column>
                    <el-table-column prop="restock_quantity" :label="$t('在补库存数量')"> </el-table-column>
                    <el-table-column prop="presell_quantity" :label="$t('预占库存数量')"> </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="restock(scope.row)" v-if="$router.power('/stock/index/restock')">{{$t('补库存')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="drop(scope.row)" v-if="$router.power('/stock/index/drop')">{{$t('弃件')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="drop_cancel(scope.row)" v-if="$router.power('/stock/index/drop_cancel')">{{$t('弃件取消')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="adjustment(scope.row)" v-if="$router.power('/stock/index/adjustment')">{{$t('修正库存')}}</el-dropdown-item>

                                    <el-dropdown-item v-if="$router.power('/stock/presellList')">
                                        <router-link :to="{ path: '/stock/presellList', query: { storehouse_id: scope.row.storehouse_id, sku: scope.row.sku, status: 'presell'}}">{{$t('库存预占详细')}}</router-link>
                                    </el-dropdown-item>

                                    <el-dropdown-item v-if="$router.power('/stock/logList')">
                                        <router-link :to="{ path: '/stock/logList', query: { storehouse_id: scope.row.storehouse_id, sku: scope.row.sku}}">{{$t('日志')}}</router-link>
                                    </el-dropdown-item>

                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="dialogFormAttributes.title" :visible.sync="dialogFormVisible">
                <dropForm v-bind:dialogFormAttributes="dialogFormAttributes" @listenToSave="receiveSave" @closeForm="dialogFormVisible=false" v-if="dialogFormType == 'dropForm'"></dropForm>
                <restockForm v-bind:dialogFormAttributes="dialogFormAttributes" @listenToSave="receiveSave" @closeForm="dialogFormVisible=false" v-if="dialogFormType == 'restockForm'"></restockForm>
                <adjustmentForm v-bind:dialogFormAttributes="dialogFormAttributes" @listenToSave="receiveSave" @closeForm="dialogFormVisible=false" v-if="dialogFormType == 'adjustmentForm'"></adjustmentForm>
            </el-dialog>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import dropForm from './stockDrop.vue';
    import restockForm from './restockForm.vue';
    import adjustmentForm from './adjustmentForm.vue';

    import i18n from '../../local'
    var App= {
        components:{
            dropForm,
            restockForm,
            adjustmentForm,
        },
        data() {
            return {
                tableData:[],
                searchArgs:{},
                templateConfigs:{},
                page:{
                    currentPage:1,
                    pageSize:10,
                    pageSizes:[10, 50, 100, 200,500],
                    total:0
                },
                storehouses:{},
                dialogFormType: '',
                dialogFormVisible: false,
                dialogFormAttributes:{
                    id : null,
                    type : '',
                    title : '',
                    sku : '',
                }
            }
        },
        mounted(){
            this.getData();
            vk.http(uri.getAllStorehouse,{},this.then);
            vk.http(uri.productTemplateConfigs,{},this.then);
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.stock.code:
                        this.tableData = json.list;
                        if(json.total){
                            this.page.total = json.total;
                        }
                        break;

                    case uri.getAllStorehouse.code:
                        this.storehouses = json.data;
                        break;

                    case uri.productTemplateConfigs.code:
                        this.templateConfigs = json.data;
                        break;
                }
            },
            getData(){
                vk.http(uri.stock,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
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
            drop(row){
                this.dialogFormType = 'dropForm';
                this.dialogFormVisible = true;
                this.dialogFormAttributes = {
                    id : row.id,
                    type : 'drop',
                    title: i18n.t('弃件') + '：' + row.sku,
                };
            },
            drop_cancel(row){
                this.dialogFormType = 'dropForm';
                this.dialogFormVisible = true;
                this.dialogFormAttributes = {
                    id : row.id,
                    type : 'drop_cancel',
                    title: i18n.t('弃件取消') + '：' + row.sku
                };
            },
            adjustment(row){
                this.dialogFormType = 'adjustmentForm';
                this.dialogFormVisible = true;
                this.dialogFormAttributes = {
                    id : row.id,
                    type : 'adjustment',
                    title: i18n.t('修正库存') + '：' + row.sku,
                    sku:row.sku
                };
            },
            restock(row){
                this.dialogFormType = 'restockForm';
                this.dialogFormVisible = true;
                this.dialogFormAttributes = {
                    id : row.id,
                    type : 'restock',
                    title: i18n.t('补库存') + '：' + row.sku,
                    sku : row.sku,
                };
            },
            receiveSave(){
                this.dialogFormVisible = false;
                this.getData();
            }
        }
    }
    export default {i18n,...App}
</script>