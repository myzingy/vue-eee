<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" to="/fittings/create" icon="el-icon-arrow-left" @click="createFactory">
                            {{$t('添加工厂')}}</el-button>
                        <el-button>{{$t('导出')}}</el-button>
                </div>
                </el-col>
            </el-row>

            <div >
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('名称')">
                        <el-input v-model="searchArgs.name" @keyup.enter.native="onSearch" :placeholder="$t('名称')"></el-input>
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
                <!-- 工厂列表 -->
                <el-table :data="factoryList" border style="width: 100%" @selection-change="checkFactoryItem">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="id" :label="$t('编号')"></el-table-column>

                    <el-table-column prop="name" :label="$t('名称')"> </el-table-column>
                    <el-table-column prop="weight" :label="$t('权重')"> </el-table-column>

                    <el-table-column :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-button type="primary" @click.native="editFactory(scope.row)">{{$t('编辑')}}</el-button>
                            <el-button type="primary" @click.native="deleteFactory(scope.row)">{{$t('删除')}}</el-button>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updateFactoryArgs.title" :visible.sync="dialogFormVisible">
                <dataForm ref="roleForm" v-bind:updateFactoryArgs="updateFactoryArgs" @listenToSaveFactory="receiveSaveFactory" @closeForm = "dialogFormVisible = false"></dataForm>
            </el-dialog>
        </div>
    </v-layout>

</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import dataForm from './form.vue';
    let App ={
        components:{
            dataForm:dataForm,
        },
        data() {
            return {
                factoryList: [],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                multipleSelection:[],
                dialogFormVisible: false,
                updateFactoryArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加工厂')
                }
            }
        },
        computed: {

        },
        mounted(){
            this.getLists();
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.factoryList.code:
                        this.factoryList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.factoryDelete.code:
                    case uri.factoryCreate.code:
                    case uri.factoryUpdate.code:
                        this.getLists();
                        break;

                }
            },
            onSearch(){
              this.getLists();
            },
            getLists(){
                uri.factoryList.timeout = 0;
                vk.http(uri.factoryList,{searchArg:this.searchArgs,page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkFactoryItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            createFactory(){
                this.dialogFormVisible = true
                this.updateFactoryArgs = {
                    id : null,
                    type : 'create',
                    title: i18n.t('添加工厂')
                };
            },
            editFactory(row){
                this.dialogFormVisible = true
                this.updateFactoryArgs = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新工厂')
                };
            },
            deleteFactory(row){
                let that = this;
                this.confirm(i18n.t('确认删除该条目吗'),function(){
                    vk.http(uri.factoryDelete,{id:row.id},that.then);
                })
            },
            receiveSaveFactory(){
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
