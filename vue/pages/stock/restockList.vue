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

                    <el-form-item :label="$t('操作人')">
                        <el-input v-model="searchArgs.nickname" @keyup.enter.native="onSearch" :placeholder="$t('操作人')"></el-input>
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

                    <el-form-item :label="$t('验收通过数量')">
                        <el-col :span="5">
                            <el-input v-model="searchArgs.restock_quantity_passed_start" @keyup.enter.native="onSearch" :placeholder="$t('起')"></el-input>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="5">
                            <el-input v-model="searchArgs.restock_quantity_passed_end" @keyup.enter.native="onSearch" :placeholder="$t('止')"></el-input>
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
                    <el-table-column prop="restock_quantity" :label="$t('在补库存数量')"> </el-table-column>
                    <el-table-column prop="restock_quantity_passed" :label="$t('验收通过数量')"> </el-table-column>
                    <el-table-column prop="user.nickname" :label="$t('操作人')"> </el-table-column>
                    <el-table-column prop="created_at" :label="$t('操作时间')">
                        <template slot-scope="scope"><span v-date="['YYYY-MM-DD HH:II',scope.row.created_at]"></span></template>
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
                    case uri.restockList.code:
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
                vk.http(uri.restockList,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
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