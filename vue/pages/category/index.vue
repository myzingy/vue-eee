<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <!--<el-button type="primary" to="/product/create" icon="el-icon-arrow-left" @click="saveCategory">-->
                            <!--{{$t('保存')}}</el-button>-->
                </div>
                </el-col>
            </el-row>

            <div>
                <!-- 产品列表 -->
                <el-tree
                        :data="categoryData"
                        :props="defaultProps"
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false"
                        :render-content="renderContent" v-if="loading">
                </el-tree>
            </div>

            <!-- form -->
            <el-dialog :title="$t('add')" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item :label="$t('product.category.name')" >
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('product.category.key')">
                        <el-input v-model="form.key" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('product.category.status')">
                            <el-switch
                                    v-model="form.status"
                                    active-value="1"
                                    inactive-value="0">
                            </el-switch>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
                    <el-button type="primary" @click="saveCategory">{{$t('common.ok')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </v-layout>

</template>

<script>
    let id = 1000;
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    let App ={
        data() {
            return {
                categoryData: [{
                    id: 0,
                    name: i18n.t('顶级分类'),
                    key: 'top',
                    pid: 0,
                    status:1,
                    children :[]
                }],
                form :{},
                isNew:true,
                parentNode : null,
                dialogFormVisible :false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                loading:false,
            }
        },
        mounted(){
            this.loading=true;
            this.getListTree();
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.categoryCreate.code:
                    case uri.categoryUpdate.code:
                    case uri.categoryDelete.code:
                        this.getListTree();
                        break;
                    case uri.categoryTree.code:
                        this.$set(this.categoryData[0], 'children', json.data)
                        this.dialogFormVisible = false;
                        break;
                }

            },
            addCategory(data) {
                this.dialogFormVisible = true;
                this.isNew = true;
                this.form = {};
                this.form.pid = data.id;
                this.form.top_id = data.top_id;
            },
            editCategory(data) {
                this.dialogFormVisible = true;
                this.isNew = false;
                this.form = data;
            },
            saveCategory(){
                let url = this.isNew ? uri.categoryCreate : uri.categoryUpdate;
                vk.http(url,this.form,this.then);
            },
            removeCategory(node, data) {
                vk.http(uri.categoryDelete,{id:data.id},this.then);
            },
            getListTree(){
                let url = uri.categoryTree;
                url.timeout = false;//不缓存
                vk.http(url,{},this.then);
            },
            renderContent(h, { node, data, store }) {

                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
                            <span style="margin-left:10px"><el-tag type="success" size="mini">{data.key}</el-tag></span>
                            {
                                data.status==0 ? <span  style="margin-left:10px"><el-tag type="danger" size="mini">disable</el-tag></span> : <span></span>
                            }

                        </span>
                        <span style="margin-left:30px">
                            <el-button style="font-size: 12px;" type="text" on-click={ () => this.addCategory(data) }>
                                {i18n.t('common.add')}
                            </el-button>
                            {
                                data.id!=0 ? <el-button style="font-size: 12px;" type="text" on-click={ () => this.editCategory(data) }>
                {i18n.t('common.edit')}
                                        </el-button> :<span></span>
                            }
                            {
                                /*  data.id!=0 ? <el-button style="font-size: 12px;" type="text" on-click={ () => this.removeCategory(node, data) }>
                                        {i18n.t('common.delete')}
                                        </el-button> :<span></span>*/
                            }

                        </span>
                    </span>
                );
            }
        }
    }
    export default {i18n,...App};
</script>
