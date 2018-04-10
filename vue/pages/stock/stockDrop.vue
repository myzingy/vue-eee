<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
            <el-form-item :label="$t('数量')" prop="quantity">
                <el-input v-model="form.quantity"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">{{$t('确定')}}</el-button>
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
                },
                formRules: {
                    quantity: [
                        { required: true, message: i18n.t('请输入数量'), trigger: 'blur' },
                    ],
                }
            }
        },
        watch:{
            'dialogFormAttributes': function(newVal, oldVal) {
                this.$refs['form'].resetFields();
            },
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.stockDrop.code:
                    case uri.stockDropCancel.code:
                        this.$emit('listenToSave');
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        that.form.id = that.dialogFormAttributes.id;
                        let url = that.dialogFormAttributes.type =='drop' ? uri.stockDrop : uri.stockDropCancel;
                        vk.http(url,that.form,that.then);
                    } else {
                        return false;
                    }
                });
            },
            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm');
            }
        },
        mounted(){

        }
    }
    export default {i18n,...App};
</script>
