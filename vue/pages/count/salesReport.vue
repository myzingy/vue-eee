<template>
    <v-layout>
        <div slot="main">
            <div >
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">

                    <el-form-item :label="$t('SPU')">
                        <el-input v-model="searchArgs.spu" @keyup.enter.native="onSearch" :placeholder="$t('SPU')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('总销量')" prop="qty_ordered">
                        <el-select v-model="searchArgs.qty_ordered" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in qty_ordered_select"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('库存')" prop="stock_total">
                        <el-select v-model="searchArgs.stock_total" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stock_total_select"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="created_at" sortable="custom" :formatter="moment" :label="$t('下单时间')">
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
                    <el-table-column prop="product_id" :label="$t('产品编号')"></el-table-column>
                    <el-table-column prop="spu" :label="$t('spu')"></el-table-column>
                    <el-table-column prop="qty_ordered" :label="$t('总销量')"></el-table-column>
                    <el-table-column prop="actual_total" :label="$t('可用库存')"></el-table-column>
                    <el-table-column prop="virtual_total" :label="$t('在补库存')"></el-table-column>
                    <el-table-column prop="created_at" :label="$t('产品添加时间')">
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
                qty_ordered_select:[
                    {'key':'1-10','value':'1-10'},
                    {'key':'10-50','value':'10-50'},
                    {'key':'50-100','value':'50-100'},
                    {'key':'100-500','value':'100-500'},
                    {'key':'500-1000','value':'500-1000'},
                    {'key':'1000-10000','value':'1000-10000'},
                ],
                stock_total_select:[
                    {'key':'-2','value':'没有库存'},
                    {'key':'-1','value':'有库存'},
                    {'key':'1-10','value':'1-10'},
                    {'key':'10-50','value':'10-50'},
                    {'key':'50-100','value':'50-100'},
                    {'key':'100-1000','value':'100-1000'},
                    {'key':'1000-10000','value':'10000-1000'},
                ],
            }
        },
        mounted(){
            this.searchArgs = this.$route.query;
            this.getData();
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.salesReport.code:
                        this.tableData = json.list;
                            if(json.total){
                                this.page.total = json.total;
                            }
                        break;
                }
            },
            getData(){
                vk.http(uri.salesReport,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
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
            moment: function (row, column) {
                return vk.date('YYYY-MM-DD HH:II',row[column.property]);
            }
        }
    }
    export default {i18n,...App}
</script>