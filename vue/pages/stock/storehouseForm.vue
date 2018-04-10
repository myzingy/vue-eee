<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
            <el-form-item :label="$t('仓库名称')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item :label="$t('联系人')" prop="contact">
                <el-input v-model="form.contact"></el-input>
            </el-form-item>

            <el-form-item :label="$t('仓库所在国家')" prop="country">
                <el-input v-model="form.country"></el-input>
            </el-form-item>

            <el-form-item :label="$t('仓库地址')" prop="address">
                <el-input v-model="form.address"></el-input>
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
                form: {
                    name:'',
                    contact:'',
                    country:'',
                    address:'',
                },
                formRules: {
                    name: [
                        { required: true, message: i18n.t('请输入仓库名称'), trigger: 'blur' },
                    ],
                    contact: [
                        { required: true, message: i18n.t('请输入联系人'), trigger: 'blur' },
                    ],
                    country: [
                        { required: true, message: i18n.t('请输入仓库所在国家'), trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: i18n.t('请输入仓库地址'), trigger: 'blur' },
                    ],
                }
            }
        },
        watch:{
            'dialogFormAttributes': function(newVal, oldVal) {
                if(newVal.type=='add'){
                    this.$refs['form'].resetFields();
                }
                this.getStorehouse();
            },
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.storehouseAdd.code:
                    case uri.storehouseUpdate.code:
                        this.$emit('listenToSave',{});
                        break;
                    case uri.getStorehouse.code:
                        this.form = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.dialogFormAttributes.type =='add'?uri.storehouseAdd : uri.storehouseUpdate;
                        vk.http(url,that.form,that.then);
                    } else {
                        return false;
                    }
                });
            },
            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm');
            },
            getStorehouse(){
                if(this.dialogFormAttributes.type!='update') return;
                vk.http(uri.getStorehouse,{id:this.dialogFormAttributes.id},this.then);
            }
        },
        mounted(){
            this.getStorehouse();
        }
    }
    export default {i18n,...App};
</script>
