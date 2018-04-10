<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
            <el-form-item :label="$t('仓库')" prop="storehouse_id">
                <el-select v-model="form.storehouse_id" :placeholder="$t('仓库')">
                    <el-option
                            v-for="item in storehouses"
                            :key="item.id"
                            :label="$t(item.name)"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('补库存数量')" prop="quantity">
                <el-input v-model="form.quantity"></el-input>
            </el-form-item>

            <el-form-item :label="$t('生产工厂')" prop="factory_id" v-if="factoriesVisible">
                <el-select v-model="form.factory_id" :placeholder="$t('生产工厂')">
                    <el-option
                            v-for="item in productInfo.factories"
                            :key="item.id"
                            :label="$t(item.name)"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">{{$t('保存')}}</el-button>
                <el-button @click="closeForm">{{$t('取消')}}</el-button>
            </el-form-item>
        </el-form>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    let App ={
        props: ['dialogFormAttributes'],
        data() {
            return {
                stock:{},
                storehouses:{},
                productInfo:{},
                factoriesVisible: false,
                form: {
                    storehouse_id:'',
                    sku:'',
                    quantity:'',
                    factory_id:'',
                },
                formRules: {
                    quantity: [
                        { required: true, message: i18n.t('请输入补库存数量'), trigger: 'blur' },
                    ],
                    factory_id: [
                        { required: true, message: i18n.t('请选择工厂'), trigger: 'blur' },
                    ],
                }
            }
        },
        watch:{
            'dialogFormAttributes': function(newVal, oldVal) {
                this.getBaseData();
            },
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.restock.code:
                        this.$emit('listenToSave');
                        break;
                    case uri.getAllStorehouse.code:
                        this.storehouses = json.data;
                        break;
                    case uri.getStock.code:
                        this.stock = json.data;
                        this.form.storehouse_id = this.stock.storehouse_id;
                        this.form.sku = this.stock.sku;
                        break;
                    case uri.getProductInfo.code:
                        this.productInfo = json.data;
                        if(this.productInfo.factories != ''){
                            this.factoriesVisible = true;
                        }
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        vk.http(uri.restock,that.form,that.then);
                    } else {
                        return false;
                    }
                });
            },
            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm');
            },
            getBaseData(){
                this.factoriesVisible = false;
                vk.http(uri.getStock,{id:this.dialogFormAttributes.id},this.then);
                vk.http(uri.getProductInfo,{sku:this.dialogFormAttributes.sku},this.then);
            }
        },
        mounted(){
            vk.http(uri.getAllStorehouse,{},this.then);
            this.getBaseData();
        }
    }
    export default {i18n,...App};
</script>
