<template>
    <v-layout>
        <div slot="main">
            <div >

                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">

                    <el-form-item :label="$t('站点')" prop="site_id">
                        <el-select v-model="searchArgs.site_id" clearable @change="onSearch" :placeholder="$t('站点')">
                            <el-option
                                    v-for="item in site"
                                    :key="item.id"
                                    :label="$t(item.title)"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('模板类型')" prop="template_type">
                        <el-select v-model="searchArgs.template_type" clearable @change="onSearch" :placeholder="$t('模板类型')">
                            <el-option
                                    v-for="(item,index) in templateType"
                                    :key="index"
                                    :label="$t(item)"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('模板名称')">
                        <el-input v-model="searchArgs.template_name" @keyup.enter.native="onSearch" :placeholder="$t('模板名称')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('状态')" prop="template_type">
                        <el-select v-model="searchArgs.status" clearable @change="onSearch" :placeholder="$t('状态')">
                            <el-option
                                    v-for="(item,index) in status"
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
                    <el-table-column prop="site.title" :label="$t('站点')"></el-table-column>

                    <el-table-column prop="template_type" :label="$t('模板类型')">
                        <template slot-scope="scope">{{$t(templateType[scope.row.template_type])}}</template>
                    </el-table-column>

                    <el-table-column prop="template_name" :label="$t('模板名称')"></el-table-column>
                    <el-table-column prop="email_title" :label="$t('邮件标题')"></el-table-column>
                    <el-table-column prop="description" :label="$t('模板说明')"></el-table-column>
                    <el-table-column prop="status" :label="$t('状态')">
                        <template slot-scope="scope">{{$t(status[scope.row.status])}}</template>
                    </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="view(scope.row)" v-if="$router.power('view')">{{$t('预览')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteData(scope.row)" v-if="$router.power('deleteData') && scope.row.status=='Y'">{{$t('禁用')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteData(scope.row)" v-if="$router.power('deleteData') && scope.row.status=='N'">{{$t('启用')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="dialogFormAttributes.title" :visible.sync="dialogFormVisible">
                <div v-html="dialogFormAttributes.content"></div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogFormVisible = false">{{$t('关闭')}}</el-button>
                </div>
            </el-dialog>

        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'

    import i18n from '../../../local'
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
                site:{},
                templateType:{},
                status:{},
                dialogFormVisible: false,
                dialogFormAttributes:{
                    title : '',
                    content : '',
                }
            }
        },
        mounted(){
            this.getData();
            vk.http(uri.getAllSite,{},this.then);
            vk.http(uri.getAllTemplateType,{},this.then);
            vk.http(uri.getTemplateStatus,{},this.then);
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.templateEmailList.code:
                        this.tableData = json.list;
                        if(json.total){
                            this.page.total = json.total;
                        }
                        break;

                    case uri.getAllSite.code:
                        this.site = json.data;
                        break;

                    case uri.getAllTemplateType.code:
                        this.templateType = json.data;
                        break;

                    case uri.getTemplateStatus.code:
                        this.status = json.data;
                        break;

                    case uri.templateEmailView.code:
                        this.dialogFormAttributes = json.data;
                        break;
                }
            },
            getData(){
                vk.http(uri.templateEmailList,{searchArgs:this.searchArgs,page:this.page.currentPage,page_size:this.page.pageSize},this.then);
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
            view(row){
                this.dialogFormVisible = true;
                vk.http(uri.templateEmailView,{id:row.id},this.then);
            },
            deleteData(row){
                var _this = this;
                vk.confirm(i18n.t('确定要执行此操作吗？'),function(){
                    vk.http(uri.templateEmailDelete,{id:row.id},_this.getData);
                });
            },
        }
    }
    export default {i18n,...App}
</script>