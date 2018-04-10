<template>

    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">
                        <el-button-group>
                            <el-button type="primary" @click="setPaid">
                                {{$t('支付')}}</el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>

            <div >
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('版号')">
                        <el-input v-model="searchArgs.template_no" @keyup.enter.native="onSearch" :placeholder="$t('版号')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('类型')" prop="category">
                        <el-select v-model="searchArgs.category" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in templateConfigs.category"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('支付状态')" prop="factory_payment_status">
                        <el-select v-model="searchArgs.factory_payment_status" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in templateConfigs.payment_type"
                                    :key="index"
                                    :label="item"
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
                        :total="page.total"
                        slot="page.total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:page.total})}}</span>
                    </template>
                </el-pagination>
                <!-- 配件列表 -->
                <el-table :data="templateList" border style="width: 100%" @selection-change="checkTemplateItem">
                    <el-table-column type="selection" prop="id" width="40"></el-table-column>
                    <el-table-column prop="ext_id" :label="$t('开版编号')"></el-table-column>
                    <el-table-column prop="sku" :label="$t('选品编号')"></el-table-column>
                    <el-table-column prop="template_no" :label="$t('版号')"> </el-table-column>
                    <el-table-column prop="fids" :label="$t('图片')">
                        <template slot-scope="scope">
                            <img width="100%" :src="scope.row.files.length>0 ? scope.row.files[0].path : ''" class="image" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="category" :label="$t('版型分类')">
                        <template slot-scope="scope">
                            {{templateConfigs.category[scope.row.category]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_original" :formatter="yesNo" :label="$t('是否原创')"></el-table-column>

                    <el-table-column prop="chosenUser.username" :label="$t('选品人')"></el-table-column>
                    <el-table-column prop="finished_at" :formatter="date" :label="$t('结束时间')"> </el-table-column>
                    <el-table-column prop="factory_payment_status"  :label="$t('支付状态')">
                        <template slot-scope="scope">
                            {{templateConfigs.payment_type[scope.row.factory_payment_status]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="factory_price" :label="$t('开版价格')"> </el-table-column>

                    <el-table-column :label="$t('操作')">

                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="primary" v-if="scope.row.factory_price<=0" @click.native="editPrice(scope.row)" icon="el-icon-edit">{{$t('录入价格')}}</el-button>
                            </el-button-group>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="$t('录入价格')" :visible.sync="dialogFormVisible">
                <el-form ref="form" :model="form" :rules="formRules" label-width="110px">

                    <el-form-item :label="$t('开版价格')" prop="factory_price">
                        <el-input v-model="form.factory_price"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">{{$t('保存')}}</el-button>
                        <el-button @click="dialogFormVisible = false">{{$t('取消')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </v-layout>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import attrForm from './attribute-form.vue';
    import dataForm from './form.vue';
    let App ={
        components:{
            dataForm:dataForm,
            attrForm:attrForm,
        },
        data() {
            return {
                templateList: [],
                searchArgs:{},
                form:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                templateConfigs:{},
                multipleSelection:[],
                dialogFormVisible: false,
                formRules: {
                    factory_price: [
                        { required: true, message: i18n.t('请输入价格'), trigger: 'blur' },
                        { validator: (rule, value, callback) => {
                            if (value <= 0 ) {
                                callback(new Error(i18n.t('价格必须大于0!')));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur' }
                    ],

                }
            }
        },
        computed: {

        },
        mounted(){
            vk.http(uri.productTemplateConfigs,{},this.then);
            this.getLists();
        },
        methods : {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.productTemplateList.code:
                        this.templateList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.productTemplateUpdate.code:
                    case uri.productTemplateSetPaid.code:
                        this.dialogFormVisible = false
                        this.getLists();
                        break;
                    case uri.productTemplateConfigs.code:
                        this.templateConfigs = json.data;
                        break;

                }
            },
            onSearch(){
                this.getLists();
            },
            getLists(){
                this.searchArgs = Object.assign(this.searchArgs,{list_type:'factory_price_list'});
                vk.http(uri.productTemplateList,{searchArgs:this.searchArgs,with:['files','chosenUser'],page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkTemplateItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },

            editPrice(row){
                this.dialogFormVisible = true
                this.form = JSON.parse(JSON.stringify(row));
            },
            setPaid(){
                if(this.multipleSelection.length<1){
                    this.$message(i18n.t('请选择相应的条目'));
                    return false;
                }
                vk.http(uri.productTemplateSetPaid,{type:'factory',ids:this.multipleSelection},this.then);
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        that.confirmDialog(i18n.t('此价格只能填一次，不可修改，确定要提交吗？'),function(){

                            vk.http(uri.productTemplateUpdate,that.form,that.then);
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getLists();
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getLists();
            },
            date: function (row, column) {
                return vk.date('YYYY-MM-DD HH:II',row[column.property]);
            },
            yesNo: function (row, column) {
                return row[column.property]==1 ? '是':'否';
            },
            confirmDialog : function(msg,callback){
                let message = msg || i18n.t('你确定要进行此操作吗？');
                this.$confirm(message, i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(() => {
                    callback();
                });
            }
        }
    }
    export default {i18n,...App};
</script>
