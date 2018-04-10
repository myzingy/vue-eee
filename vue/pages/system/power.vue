<style>

</style>
<template>
    <v-layout>
        <div slot="main">
            <div>
                <el-button type="primary" @click="openDialog()">{{$t('新增 权限')}}</el-button>
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%;" height="650">
                    <el-table-column
                            prop="name"
                            :label="$t('权限')"
                            width="300">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('描述')"
                            >
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
                            <el-button @click="removePower(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style=" margin: 20px auto; width:300px;"
                               @current-change="handleCurrentChange"
                               :page-size="formSearch.limit"
                               layout="total, prev, pager, next"
                               :total="total">
                </el-pagination>
            </div>
            <el-dialog :title="$t('编辑')" :visible.sync="dialogTableVisible" :close-on-click-modal="false"
                       :close-on-press-escape="false">
                <powerForm ref="powerForm" :form="form" v-on:submitForm="submitForm"></powerForm>
                <span slot="footer" class="dialog-footer">
                            <el-button @click="closeDialog">{{$t('取 消')}}</el-button>
                            <el-button type="primary" @click="updateDialog">{{$t('确 定')}}</el-button>
                          </span>
            </el-dialog>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import powerForm from './powerForm.vue';
    var App= {
        components:{
            powerForm,
        },
        data () {
            return {
                tableData:[],
                total:0,
                formSearch:{
                    limit:30,
                    offset:0,
                    keyword:"",
                    type:"",
                },
                form:{},
                dialogTableVisible:false,
            };
        },
        mounted(){
            this.getData();
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.getPermissions.code:
                        this.tableData = json.data;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.deletePower.code:
                        this.getData();
                        this.flushConf();
                        break;
                }
            },
            getData(){
                vk.http(uri.getPermissions,this.formSearch,this.then);
            },
            handleCurrentChange(page){
                this.formSearch.offset=(page-1)*this.formSearch.limit;
                this.getData();
            },
            openDialog(data){
                if(data){
                    this.form=data;
                }else{
                    this.form={
                        name:"",
                        description:"",
                    };
                }
                this.dialogTableVisible=true;
            },
            removePower(data){
                let that=this;
                vk.confirm(i18n.t('确认删除吗?'),function(){
                    vk.http(uri.deletePower,{id:data.id},that.then);
                });
            },
            closeDialog(){
                this.dialogTableVisible=false;
            },
            updateDialog(){
                this.$refs.powerForm.submitForm();
            },
            submitForm(){
                this.getData();
                this.closeDialog();
                this.flushConf();
            },
            flushConf(){
                vk.http(uri.getConf,{__force:true},this.then);
            }

        }
    }
    export default {i18n,...App}
</script>