<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 160px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" icon="el-icon-arrow-left" @click="createSite">
                            {{$t('添加站点')}}</el-button>
                </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
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
                <!-- 站点列表 -->
                <el-table :data="siteList" border style="width: 100%" >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <template v-for="(value, key) in props.row.configs">
                                    <el-form-item :label="key">
                                        <span>{{ value }}</span>
                                    </el-form-item>
                                </template>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" :label="$t('编号')"></el-table-column>
                    <el-table-column prop="title" :label="$t('标题')"></el-table-column>
                    <el-table-column prop="name" :label="$t('名称')"> </el-table-column>
                    <el-table-column prop="version" :label="$t('版本')"> </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="editSite(scope.row)" v-if="$router.power('editSite')">{{$t('编辑')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="mailConfig(scope.row)" v-if="$router.power('mailConfig')">{{$t('邮件配置')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteSite(scope.row)" v-if="$router.power('deleteSite')">{{$t('删除')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>

                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updateSiteArgs.title" :visible.sync="dialogFormVisible">
                <dataForm ref="roleForm" v-bind:updateSiteArgs="updateSiteArgs" @listenToSaveSite="receiveSaveSite" @closeForm = "dialogFormVisible = false" v-if="dialogFormType == 'site'"></dataForm>
                <mailConfig v-bind:updateSiteArgs="updateSiteArgs" @listenToSaveSite="receiveSaveSite" @closeForm = "dialogFormVisible = false" v-if="dialogFormType == 'mailConfig'"></mailConfig>
            </el-dialog>
        </div>
    </v-layout>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    import dataForm from './form.vue';
    import mailConfig from './formMailConfig.vue';
    let App ={
        components:{
            dataForm:dataForm,
            mailConfig:mailConfig,
        },
        data() {
            return {
                siteList: [],
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                dialogFormVisible: false,
                dialogFormType: '',
                updateSiteArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加站点')
                }
            }
        },
        computed: {
        },
        mounted(){
            this.getLists();
        },
        methods : {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.commoditySiteList.code:
                        this.siteList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.commoditySiteDelete.code:
                        this.getLists();
                        break;
                }
            },
            onSearch(){
              this.getLists();
            },
            getLists(){
                uri.commoditySiteList.timeout = 0;
                vk.http(uri.commoditySiteList,{page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            createSite(){
                this.dialogFormType = 'site';
                this.dialogFormVisible = true;
                this.updateSiteArgs = {
                    id : null,
                    type : 'create',
                    title: i18n.t('添加站点')
                };
            },
            editSite(row){
                this.dialogFormType = 'site';
                this.dialogFormVisible = true;
                this.updateSiteArgs = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新站点')
                };
            },
            deleteSite(row){
                let that = this;
                this.$confirm(i18n.t('此操作将永久删除该条目, 是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(() => {
                    vk.http(uri.commoditySiteDelete,{id:row.id},that.then);
                });
            },
            receiveSaveSite(){
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
            },
            mailConfig(row){
                this.dialogFormType = 'mailConfig';
                this.dialogFormVisible = true;
                this.updateSiteArgs = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('邮件配置')
                };
            }
        }
    }
    export default {i18n,...App};
</script>
