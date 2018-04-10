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

                    <el-form-item :label="$t('SPU')">
                        <el-input v-model="searchArgs.spu" @keyup.enter.native="onSearch" :placeholder="$t('SPU')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('处理状态')" prop="category">
                        <el-select v-model="searchArgs.status" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in [{'status':'0','label':'未处理'},{'status':'1','label':'已处理'}]"
                                    :key="item.status"
                                    :label="item.label"
                                    :value="item.status">
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
                    <el-table-column prop="storehouse.name" :label="$t('仓库')"></el-table-column>
                    <el-table-column prop="stock.spu" :label="$t('SPU')"></el-table-column>
                    <el-table-column prop="stock.size" :label="$t('尺码')"></el-table-column>

                    <el-table-column prop="status" :label="$t('状态')">
                        <template slot-scope="scope">{{scope.row.status == 0 ? '未处理':'已处理'}}</template>
                    </el-table-column>

                    <el-table-column prop=created_at :label="$t('时间')">
                        <template slot-scope="scope"><span v-date="['YYYY-MM-DD HH:II',scope.row.created_at]"></span></template>
                    </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="changeStatus(scope.row)">{{$t('已处理')}}</el-dropdown-item>
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
        components:{
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
            }
        },
        mounted(){
            this.getData();
            vk.http(uri.getAllStorehouse,{},this.then);
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.stockZero.code:
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
                vk.http(uri.stockZero,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
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
            changeStatus(row){
                var _this = this;
                vk.http(uri.stockZeroChangeStatus,{id:row.id},_this.getData);
            },
        }
    }
    export default {i18n,...App}
</script>