<style>

</style>
<template>
    <v-layout>
        <div slot="main">
            <div>
                <el-tree
                        :data="tableData"
                        :props="defaultProps"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="['1']"
                        :expand-on-click-node="false"
                        :render-content="renderContent">
                </el-tree>
            </div>
            <el-dialog :title="$t('编辑')" :visible.sync=" dialogTableVisible " :close-on-click-modal="false"
                       :close-on-press-escape="false">
                <roleForm ref="roleForm" v-if="dialogTableVisibleInfo.type == 'roleForm'"
                          :form="form" updateAct="updateCategories"
                          v-on:submitRelation="submitRelation"></roleForm>
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

    let id = 1000;
    var App= {
        components:{
            roleForm
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
                    label:'id',
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
                    case uri.getCategories.code:
                        this.tableData = json.data;
                        this.setRootID();
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.deleteCategories.code:
                        this.getData(true);
                        break;
                }
            },
            getData(__force){
                if(__force){
                    this.formSearch.__force=true;
                }
                vk.http(uri.getCategories,this.formSearch,this.then);
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
                this.$refs.roleForm.submitRelation();

            },
            submitRelation(){
                this.closeDialog();
                this.getData(true);
            },
//            append(store,data){
//                store.append({ id: id++, label: 'testtest', children: [] }, data);
//            },
            remove(store,data){
                var that=this;
                if(vk.confirm(i18n.t('确认要删除吗？'),function(){
                    vk.http(uri.deleteCategories,{id:data.id},that.then);
                }));
            },
            setRootID(){
                if(this.tableData.length>0){
                    this.role_root_id=this.tableData[0].id;
                }
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span style="width:100%">
                        <span>
                            <span>{i18n.t('order.issue.'+node.label)}</span>
                        </span>
                        <span style="margin-left: 20px">
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('roleUpdate',store, data) }>
                                {i18n.t('修改')}
                            </el-button>
                            <el-button size="mini" type="text" on-click={ () => this.openDialog('roleUpdateNew',store, data) }>
                                {i18n.t('添加子分类')}
                                </el-button>
                            <el-button size="mini" type="text" on-click={ () => this.remove(store, data) }>
                                {i18n.t('删除分类')}
                            </el-button>
                        </span>

                    </span>
                );
            },
        }
    }
    export default {i18n,...App}
</script>