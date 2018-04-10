<style>

</style>
<template>
    <v-layout>
            <div slot="main">
                <el-button type="primary" @click="operationCommand({command:'create'})">{{$t('新建耗材')
                    }}</el-button>
                <div style="padding: 10px;">
                    <el-table
                            :data="tableData"
                            border
                            style="width: 100%"
                            :height="height(110)">
                        <el-table-column
                                prop="id"
                                label="ID"
                                width="40">
                        </el-table-column>
                        <el-table-column
                                label="名称"
                                width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                                <div v-if="scope.row.length > 0">
                                    {{scope.row.length}}x{{scope.row.width}}x{{scope.row.height}}
                                </div>
                                <div v-if="scope.row.weight > 0">
                                    {{scope.row.weight}}(G)
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="total"
                                label="数量"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="spus"
                                label="耗材包"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="refl"
                                label="可包装产品"
                        >
                            <template slot-scope="scope">
                                <el-tag v-for="(row,index) in scope.row.refl">
                                    {{row.name}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="120">
                            <template slot-scope="scope">
                                <el-dropdown @command="operationCommand" trigger="click">
                                    <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{command:'info',row:scope.row}">
                                            {{$t('查看')}}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="{command:'update',row:scope.row}">
                                            {{$t('修改')}}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="{command:'push',row:scope.row}">
                                            {{$t('采购')}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog :title="$t('编辑')" :visible.sync=" dialogVisible " :close-on-click-modal="false"
                           :close-on-press-escape="false" width="80%">
                    <formPack ref="formPack" :form="form" v-if=" dialogType=='form' "
                        @updateDialogAfter="updateDialogAfter"></formPack>
                    <pushPack ref="pushPack" :form="form" v-if=" dialogType=='push' "
                              @updateDialogAfter="updateDialogAfter"></pushPack>
                    <infoPack ref="infoPack" :form="form" v-if=" dialogType=='info' "
                              @updateDialogAfter="updateDialogAfter"></infoPack>
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
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import formPack from './form.pack.vue';
    import pushPack from './push.pack.vue';
    import infoPack from './info.pack.vue';
    var App= {
        components:{
            formPack,
            pushPack,
            infoPack,
        },
        data () {
            return {
                form:{
                    prod_cates:[],
                    spus:[],
                },
                dialogVisible:false,
                dialogType:'',
                tableData:[],
            };
        },
        mounted(){
            this.getData();
        },
        methods: {
            ...vk,
            getData(){
                vk.http(uri.getSupplies,{},this.then);
            },
            then(json,code){
                switch(code){
                    case uri.getSupplies.code:
                        this.tableData = json.list;
                        break;
                }
            },
            updateDialog(){
                this.$refs[this.dialogType+'Pack'].updateDialog();
            },
            openDialog(type){
                this.dialogVisible=true;
                this.dialogType=type;
            },
            closeDialog(){
                this.dialogVisible=false;
            },
            operationCommand(opc){
                console.log(opc);
                switch (opc.command){
                    case 'create':
                        this.form={prod_cates:[],spus:[]};
                        this.openDialog('form');
                        break;
                    case 'info':
                        this.form=this.formatRow(opc.row);
                        this.openDialog('info');
                        break;
                    case 'update':
                        this.form=this.formatRow(opc.row);
                        this.openDialog('form');
                        break;
                    case 'push':
                        this.form=this.formatRow(opc.row);
                        this.openDialog('push');
                        break;
                }
            },
            formatRow(row){
                let obj={};
                Object.assign(obj,row);
                obj.spus=obj.spus.split(',');
                obj.prod_cates=[];
                if(obj.refl){
                    obj.refl.map((row)=>{
                        obj.prod_cates.push(row.id);
                    });
                }
                return obj;
            },
            updateDialogAfter(){
                this.getData();
                this.closeDialog();
            },
        }
    }
    export default {i18n,...App}
</script>