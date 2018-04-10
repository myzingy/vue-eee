<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('名称')" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    import Vue from 'vue'
    import vk from '../../vk.js';
    import uri from '../../uri.js';
    import i18n from '../../local'
    var App= {
        props:['form','updateAct'],
        data:function(){
            return {
                rules:{
                    name:[
                        { required: true, message: i18n.t('请添写名称'), trigger: 'blur' }
                    ],
                },
            }
        },
        mounted(){

        },
        methods:{
            then(json,code){
                let updateAct=this.updateAct||'updateRole';
                switch(code) {
                    case uri[updateAct].code:
                        this.$emit('submitRelation');
                        break;
                }
            },
            submitRelation(){
                let updateAct=this.updateAct||'updateRole';
                console.log(updateAct,uri[updateAct]);
                vk.http(uri[updateAct],this.form,this.then);
            }

        },
    }
    export default {i18n,...App}
</script>