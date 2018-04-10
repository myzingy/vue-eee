<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('权限路径')" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('权限描述')" prop="description">
            <el-input v-model="form.description"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    import Vue from 'vue'
    import vk from '../../vk.js';
    import uri from '../../uri.js';
    import i18n from '../../local'
    var App= {
        props:['form'],
        data:function(){
            return {
                rules:{
                    name:[
                        { required: true, message: i18n.t('请添写权限路径'), trigger: 'blur' }
                    ],
                    description:[
                        { required: true, message: i18n.t('请添写描述'), trigger: 'blur' }
                    ],
                },
            }
        },
        mounted(){

        },
        methods:{
            then(json,code){
                switch(code) {
                    case uri.updatePower.code:
                        this.$emit('submitForm');
                        break;
                }
            },
            submitForm(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        vk.http(uri.updatePower,this.form,this.then);
                    } else {
                        return false;
                    }
                });
            }

        },
    }
    export default {i18n,...App}
</script>