<style>

</style>
<template>
    <v-layout>
        <div slot="main">
            <div>
                <el-button type="primary" @click="openDialog('userForm')" v-if=" $router.power('add') ">
                    {{$t('新建员工')}}
                </el-button>

                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="id"
                            label="ID"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="User Name"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="nickname"
                            label="Nick Name"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            :label="$t('部门')"
                    >
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            width="130" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="openDialog('rolePower', scope.row)" type="text" size="small">
                                {{$t('权限')}}
                            </el-button>
                            <el-button type="text" size="small" @click="openDialog('userForm',scope.row)">
                                {{$t('编辑')}}
                            </el-button>
                            <el-button type="text" size="small" @click="remove(scope.row)">
                                {{$t('删除')}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog :title="$t('编辑')" :visible.sync=" dialogTableVisible " :close-on-click-modal="false"
                       :close-on-press-escape="false" width="80%">
                <rolePower ref="rolePower" v-if="dialogTableVisibleInfo.type == 'rolePower'"
                           :user_id="user_id"
                           v-on:submitRelation="submitRelation"></rolePower>
                <userForm ref="userForm" v-if="dialogTableVisibleInfo.type == 'userForm'"
                           :form="form"
                           v-on:submitRelation="submitRelation"></userForm>
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
    import rolePower from './rolePower.vue';
    import userForm from './userForm.vue';
    var App= {
        components:{
            rolePower,userForm
        },
        data () {
            return {
                tableData:[],
                dialogTableVisible:false,
                dialogTableVisibleInfo:{},
                dialogType:'',
                user_id:'',
            };
        },
        mounted(){
            this.getData();
        },
        methods: {
            getData(){
                let conf=vk.getCache(uri.getConf)['data'];
                this.tableData=conf.users;
            },
            then(json,code){
                switch(code){
                    case uri.deleteUser.code:
                        vk.http(uri.getConf,{__force:true},this.then);
                        break;
                    case uri.getConf.code:
                        //vk.ls(uri.getConf.act,json.data);
                        this.getData();
                        break;
                }
            },
            openDialog(type,data){
                this.dialogType=type;
                this.dialogTableVisibleInfo={type:type};
                this.dialogTableVisible=true;
                let that=this;
                if('rolePower'==type){
                    this.user_id=data.id;

                    setTimeout(function(){
                        that.$refs.rolePower.initPage();
                    },0);
                }
                if('userForm'==type){
                    if(data){
                        let form={password:""};
                        this.form={form, ...data};
                    }else{
                        this.form={
                            username:"",
                            nickname:"",
                            password:""
                        };
                    }
                    setTimeout(function(){
                        that.$refs.userForm.initPage();
                    },0);

                }
            },
            closeDialog(){
                this.form={};
                this.dialogTableVisible=false;
            },
            updateDialog(){
                if('rolePower'==this.dialogType){
                    this.$refs.rolePower.submitRelation();
                }
                if('userForm'==this.dialogType){
                    this.$refs.userForm.submitRelation();
                }

            },
            submitRelation(){
                vk.http(uri.getConf,{__force:true},this.then);
                this.closeDialog();
            },
            remove(data){
                var that=this;
                if(vk.confirm(i18n.t('确认要删除吗？'),function(){
                    vk.http(uri.deleteUser,{id:data.id},that.then);
                }));
            },
            power(){
                console.log('$route',$route);
                return false;
            },
        }
    }
    export default {i18n,...App}
</script>