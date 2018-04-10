<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
            <el-form-item :label="$t('主机')" prop="host">
                <el-input v-model="form.host"></el-input>
            </el-form-item>

            <el-form-item :label="$t('端口')" prop="port">
                <el-input v-model="form.port"></el-input>
            </el-form-item>

            <el-form-item :label="$t('加密')" prop="encryption">
                <el-input v-model="form.encryption"></el-input>
            </el-form-item>

            <el-form-item :label="$t('账号')" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>

            <el-form-item :label="$t('密码')" prop="password">
                <el-input v-model="form.password"></el-input>
            </el-form-item>

            <el-form-item :label="$t('发件人名称')" prop="sendername">
                <el-input v-model="form.sendername"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">{{$t('保存')}}</el-button>
                <el-button @click="closeForm">{{$t('取消')}}</el-button>
            </el-form-item>
        </el-form>
</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    let App ={
        props: ['updateSiteArgs'],
        data() {
            return {
                form: {
                    site_id:'',
                    host:'',
                    port:'',
                    encryption:'',
                    username:'',
                    password:'',
                    sendername:'',
                },
                formRules: {
                    host: [
                        { required: true, message: i18n.t('请输入主机'), trigger: 'blur' },
                    ],
                    port: [
                        { required: true, message: i18n.t('请输入端口'), trigger: 'blur' },
                    ],
                    encryption: [
                        { required: true, message: i18n.t('请输入加密方式'), trigger: 'blur' },
                    ],
                    username: [
                        { required: true, message: i18n.t('请输入账号'), trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: i18n.t('请输入密码'), trigger: 'blur' },
                    ],
                    sendername: [
                        { required: true, message: i18n.t('请输入发件人名称'), trigger: 'blur' },
                    ],
                }
            }
        },
        computed: {
        },
        watch:{
            'updateSiteArgs': function(newVal, oldVal) {
                this.$refs['form'].resetFields();
                this.fillSite();
            },
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.commoditySiteMailConfigEdit.code:
                        this.$emit('listenToSaveSite');
                        break;
                    case uri.commoditySiteMailConfigInfo.code:
                        this.form = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        vk.http(uri.commoditySiteMailConfigEdit,that.form,that.then);
                    } else {
                        return false;
                    }
                });
            },
            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm');
            },
            fillSite(){
                vk.http(uri.commoditySiteMailConfigInfo,{id:this.updateSiteArgs.id},this.then);
            },
        },
        mounted(){
            this.fillSite();
        }
    }
    export default {i18n,...App};
</script>
