<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('用户名')" prop="username">
            <el-input v-model="form.username" :disabled="username"></el-input>
        </el-form-item>
        <el-form-item :label="$t('昵称')" prop="nickname">
            <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item :label="$t('密码')" prop="password">
            <el-input v-model="form.password"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    import Vue from 'vue'
    import vk from '../../vk.js';
    import uri from '../../uri.js';
    import i18n from '../../local'
    var App= {
        props:['form','username'],
        data:function(){
            return {
                rules:{},
            }
        },
        mounted(){

        },
        methods:{
            initPage(){
                let rules={
                    username:[
                        { required: true, message: i18n.t('请添写用户名'), trigger: 'blur' },
                        { min: 2, max: 50, message: i18n.t('validate.rangelength',{min:2,max:50}), trigger: 'blur' }
                    ],
                    password:[
                        { min: 6, message: i18n.t('validate.minlength',{min:6}), trigger: 'blur' }
                    ],
                };
                if(!this.form.id){
                    rules['password']=[
                        { required: true, message: i18n.t('请添写密码'), trigger: 'blur' },
                        { min: 6, message: i18n.t('validate.minlength',{min:6}), trigger: 'blur' }
                    ];
                }
                this.rules=rules;
            },
            then(json,code){
                switch(code) {
                    case uri.updateUser.code:
                        this.$emit('submitRelation');
                        break;
                }
            },
            submitRelation(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        vk.http(uri.updateUser,this.form,this.then);
                    } else {
                        return false;
                    }
                });

            }

        },
    }
    export default {i18n,...App}
</script>