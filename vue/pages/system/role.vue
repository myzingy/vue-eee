<style>

</style>
<template>
    <v-layout>
        <div slot="main">
            <div style="padding: 10px;">
                <el-tree
                        :data="tableData"
                        :props="defaultProps"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false"
                        :render-content="renderContent">
                </el-tree>
            </div>
            <el-dialog :title="$t('编辑')" :visible.sync=" dialogTableVisible " :close-on-click-modal="false"
                       :close-on-press-escape="false" width="80%">
                <roleForm ref="roleForm" v-if="dialogTableVisibleInfo.type == 'roleForm'"
                          :form="form"
                          v-on:submitRelation="submitRelation"></roleForm>
                <roleUsers ref="roleUsers" v-if="dialogTableVisibleInfo.type == 'roleUsers'"
                           :users="users"
                           :role_id="role_id"
                           v-on:submitRelation="submitRelation"></roleUsers>
                <rolePower ref="rolePower" v-if="dialogTableVisibleInfo.type == 'rolePower'"
                           :power="power"
                           :role_id="role_id"
                           v-on:submitRelation="submitRelation"></rolePower>
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
    import roleForm from './roleForm.vue';
    import rolePower from './rolePower.vue';
    import roleUsers from './roleUsers.vue';

    let id = 1000;
    var App= {
        components:{
            roleForm,rolePower,roleUsers
        },
        data () {
            return {
                tableData:[],
                total:0,
                formSearch:{
                    limit:10,
                    offset:0,
                    keyword:"",
                    type:"",
                },
                form:{},
                dialogTableVisible:false,
                dialogTableVisibleInfo:{},
                defaultProps:{
                    children:'children',
                    label:'label',
                },
                power:[],
                users:[],
                dialogType:'',
                role_id:'',
                value:'',
                role_root_id:0,
            };
        },
        mounted(){
            this.getData();
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.getRoles.code:
                        this.tableData = json.data;
                        this.setRootID();
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.deleteRole.code:
                        this.getData();
                        break;
                }
            },
            getData(){
                vk.http(uri.getRoles,this.formSearch,this.then);
            },
            handleCurrentChange(page){
                this.formSearch.offset=(page-1)*this.formSearch.limit;
                this.getData();
            },
            openDialog(type,index,data){
                this.dialogType=type;
                this.role_id=data.id;
                this.dialogTableVisibleInfo={type:type};
                this.dialogTableVisible=true;

                if('rolePower'==type){
                    var _d=[];
                    data.power.map((r)=>{
                        _d.push(r.target_id);
                    });
                    this.power=_d;
                    var that=this;
                    setTimeout(function(){
                        that.$refs.rolePower.initPage();
                    },0);
                }
                if('roleUsers'==type){
                    var _d=[];
                    data.users.map((r)=>{
                        _d.push(r.target_id);
                    });
                    this.users=_d;
                    var that=this;
                    setTimeout(function(){
                        that.$refs.roleUsers.initPage();
                    },0);
                }
                if('roleUpdate'==type || 'roleUpdateNew'==type){
                    this.dialogType='roleForm';
                    this.dialogTableVisibleInfo={type:'roleForm'};
                    if('roleUpdate'==type){
                        this.form={
                            id:data.id,
                            name:data.label,
                        };
                    }else{
                        this.form={
                            fid:data.id,
                            name:data.label+"--",
                        };
                    }
                }
            },
            closeDialog(){
                this.dialogTableVisible=false;
            },
            updateDialog(){
                if('rolePower'==this.dialogType){
                    this.$refs.rolePower.submitRelation();
                }
                if('roleUsers'==this.dialogType){
                    this.$refs.roleUsers.submitRelation();
                }
                if('roleForm'==this.dialogType){
                    this.$refs.roleForm.submitRelation();
                }

            },
            submitRelation(){
                this.closeDialog();
                this.getData();
            },
//            append(store,data){
//                store.append({ id: id++, label: 'testtest', children: [] }, data);
//            },
            remove(store,data){
                var that=this;
                if(vk.confirm(i18n.t('确认要删除吗？'),function(){
                    vk.http(uri.deleteRole,{id:data.id},that.then);
                }));
            },
            setRootID(){
                if(this.tableData.length>0){
                    this.role_root_id=this.tableData[0].id;
                }
            },
            renderContent(h, { node, data, store }) {
                let select_option="";
                let conf=vk.getCache(uri.getConf)['data'];
                if(!data.userAdmin){
                    data.userAdmin={};
                }
                if(conf.users.length>0){
                    select_option=conf.users.map((r)=>{
                        return data.users.map((rx)=>{
                            if(rx.target_id==r.id){
                                console.log(rx.target_id,data.userAdmin.id);
                                return (rx.target_id==data.userAdmin.id)?
                                    (<option value={r.id} selected="selected">{r.username}</option>):
                                    (<option value={r.id}>{r.username}</option>)
                            }

                        });
                    });
                }
                return this.role_root_id == data.id?(
                    <span style="width:100%">
                        <span>
                            <span>{node.label}</span>
                        </span>
                        <span style="margin-left: 20px">
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('roleUpdate',store, data) }>
                                {i18n.t('修改')}
                            </el-button>
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('roleUpdateNew',store, data) }>
                                {i18n.t('添加子部门')}
                                </el-button>
                        </span>
                        <span style="margin-right: 20px;float:right">
                            {data.userAdmin.username?(i18n.t('负责人')+':'+data.userAdmin.username):""}
                        </span>

                    </span>
                    ):(
                    <span style="width:100%">
                        <span>
                            <span>{node.label}</span>
                        </span>
                        <span style="margin-left: 20px">
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('rolePower',store,
                                data) }>
                                {i18n.t('权限')}
                            </el-button>
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('roleUsers',store,
                                data) }>
                                {i18n.t('人员')}
                            </el-button>
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('roleUpdate',store, data) }>
                                {i18n.t('修改')}
                            </el-button>
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('roleUpdateNew',store, data) }>
                                {i18n.t('添加子部门')}
                                </el-button>
                            <el-button size="mini" type="text" on-click={ () => this.remove(store, data) }>
                                {i18n.t('删除部门')}
                            </el-button>
                        </span>
                        <span style="margin-right: 20px;float:right; display:inline-block;">
                            <select on-change={ ()=>this.setRoleAdmin(event, data) }>
                                <option value="">{i18n.t('负责人')}</option>
                                {select_option}
                            </select>
                        </span>

                    </span>
                );
            },
            setRoleAdmin(event, data){
                console.log(data,event.target.value);
                if(!event.target.value){
                    vk.toast(i18n.t('必须选择一个用户作为负责人'));
                    return;
                }
                vk.http(uri.setRoleAdmin,{
                    role:data.id,
                    uid:event.target.value,
                },this.then);
            }
        }
    }
    export default {i18n,...App}
</script>