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

                    <el-form-item :label="$t('SPU')">
                        <el-input v-model="searchArgs.spu" @keyup.enter.native="onSearch" :placeholder="$t('SPU')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('Size')">
                        <el-input v-model="searchArgs.size" @keyup.enter.native="onSearch" :placeholder="$t('Size')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('SKU')">
                        <el-input v-model="searchArgs.sku" @keyup.enter.native="onSearch" :placeholder="$t('SKU')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('现有库存数量')">
                        <el-col :span="5">
                            <el-input v-model="searchArgs.stock_quantity_start" @keyup.enter.native="onSearch" :placeholder="$t('起')"></el-input>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="5">
                            <el-input v-model="searchArgs.stock_quantity_end" @keyup.enter.native="onSearch" :placeholder="$t('止')"></el-input>
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
                    <el-table-column prop="stock.spu" :label="$t('SPU')"></el-table-column>
                    <el-table-column prop="stock.size" :label="$t('尺码')"></el-table-column>
                    <el-table-column prop="stock.sku" :label="$t('SKU')"></el-table-column>
                    <el-table-column prop="stock_quantity" :label="$t('现有库存数量')"> </el-table-column>
                    <el-table-column prop="stock_cost" :label="$t('现有库存成本')"> </el-table-column>
                    <el-table-column prop="add_quantity_total" :label="$t('累计入库数量')"> </el-table-column>
                    <el-table-column prop="add_cost_total" :label="$t('累计入库成本')"> </el-table-column>
                    <el-table-column prop="shipped_quantity_total" :label="$t('累计销售数量')"> </el-table-column>
                    <el-table-column prop="shipped_cost_total" :label="$t('累计销售成本')"> </el-table-column>
                    <el-table-column prop="drop_quantity_total" :label="$t('累计弃件数量')"> </el-table-column>
                    <el-table-column prop="drop_cancel_quantity_total" :label="$t('累计弃件取消数量')"> </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="$router.power('/stock/stockJxcLogList')">
                                        <router-link :to="{ path: '/stock/stockJxcLogList', query: { storehouse_id: scope.row.storehouse ? scope.row.storehouse.id : '', sku: scope.row.stock ? scope.row.stock.sku : ''}}">{{$t('日志')}}</router-link>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>

                </el-table>
            </div>

        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    var App= {
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
            }
        },
        mounted(){
            this.getData();
            vk.http(uri.getAllStorehouse,{},this.then);
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.stockJxc.code:
                        this.tableData = json.list;
                        if(json.total){
                            this.page.total = json.total;
                        }
                        break;

                    case uri.getAllStorehouse.code:
                        this.storehouses = json.data;
                        break;
                }
            },
            getData(){
                vk.http(uri.stockJxc,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
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
            }
        }
    }
    export default {i18n,...App}
</script>