<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
            <el-form-item :label="$t('地址')" prop="address">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item :label="$t('consumerKey')" prop="consumerKey">
                <el-input v-model="form.consumerKey"></el-input>
            </el-form-item>
            <el-form-item :label="$t('consumerSecret')" prop="consumerSecret">
                <el-input v-model="form.consumerSecret"></el-input>
            </el-form-item>
            <el-form-item :label="$t('accessToken')" prop="accessToken">
                <el-input v-model="form.accessToken"></el-input>
            </el-form-item>
            <el-form-item :label="$t('accessTokenSecret')" prop="accessTokenSecret">
                <el-input v-model="form.accessTokenSecret"></el-input>
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
                    address:'',
                    consumerKey:'',
                    consumerSecret:'',
                    accessToken:'',
                    accessTokenSecret:'',
                },
                formRules: {
                    address: [
                        { required: true, message: i18n.t('请输入地址'), trigger: 'blur' },
                    ],
                    consumerKey: [
                        { required: true, message: i18n.t('请输入consumerKey'), trigger: 'blur' },
                    ],
                    consumerSecret: [
                        { required: true, message: i18n.t('请输入consumerSecret'), trigger: 'blur' },
                    ],
                    accessToken: [
                        { required: true, message: i18n.t('请输入accessToken'), trigger: 'blur' },
                    ],
                    accessTokenSecret: [
                        { required: true, message: '请输入accessTokenSecret', trigger: 'blur' },
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
