<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
            <el-form-item :label="$t('soap地址')" prop="soap_url">
                <el-input v-model="form.soap_url"></el-input>
            </el-form-item>
            <el-form-item :label="$t('用户名')" prop="auth.login">
                <el-input v-model="form.auth.login"></el-input>
            </el-form-item>
            <el-form-item :label="$t('密码')" prop="auth.password">
                <el-input v-model="form.auth.password"></el-input>
            </el-form-item>

        </el-form>
</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    let App ={
        props: ['configs'],
        components:{
        },
        data() {
            return {
                form: {
                    soap_url:'',
                    auth:{
                        login:'',
                        password:''
                    },
                },
                formRules: {
                    soap_url: [
                        { required: true, message: i18n.t('请输入soap地址'), trigger: 'blur' },
                    ],
                    'auth.login': [
                        { required: true, message: i18n.t('请输入用户名'), trigger: 'blur' },
                    ],
                    'auth.password': [
                        { required: true, message: i18n.t('请输入密码'), trigger: 'blur' },
                    ],

                }
            }
        },
        computed: {
        },
        mounted(){
            this.form = this.configs;
        },
        watch:{
            'configs': function(newVal, oldVal) {
                this.form = newVal;
            },
        },
        methods: {

            getData() {
                let flag=false;
                this.$refs['form'].validate(function(valid){
                    flag = valid;
                });
                return flag ? this.form : false;
            },

        },
    }
    export default {i18n,...App};
</script>
