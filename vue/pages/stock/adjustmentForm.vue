<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="200px">

            <el-form-item :label="$t('修正数量，可录入负数')" prop="quantity">
                <el-input v-model="form.quantity"></el-input>
            </el-form-item>

            <el-form-item :label="$t('修正成本，可录入负数')" prop="cost">
                <el-input v-model="form.cost"></el-input>
            </el-form-item>

            <template>
                <el-table
                        :data="product_cost"
                        style="width: 50%;margin:10px auto;">
                    <el-table-column
                            prop="factory"
                            label="工厂"
                            >
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            label="成本价"
                            >
                    </el-table-column>
                </el-table>
            </template>

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
                form: {
                    id:'',
                    quantity:'',
                    cost:'',
                    sku:'',
                },
                product_cost:'',
                formRules: {
                    quantity: [
                        { required: true, message: i18n.t('请输入修正数量'), trigger: 'blur' },
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
                    case uri.stockAdjustment.code:
                        this.$emit('listenToSave');
                        break;
                    case uri.getProductPrice.code:
                        this.product_cost = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        that.form.id = that.dialogFormAttributes.id;
                        vk.http(uri.stockAdjustment,that.form,that.then);
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
                vk.http(uri.getProductPrice,{sku:this.dialogFormAttributes.sku},this.then);
            }
        },
        mounted(){
            this.getBaseData();
        }
    }
    export default {i18n,...App};
</script>
