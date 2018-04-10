<style>
    .el-form-item__content{
        line-height: normal;
    }
</style>
<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item>
            <span>耗材名称：{{form.name}}，</span>
            <span>当前库存：{{form.total}}</span>
        </el-form-item>
        <el-form-item :label="$t('耗材数量')" prop="num">
            <el-input v-model="form.num" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('耗材总价')" prop="price">
            <el-input v-model="form.price" ></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    var App= {
        props:['form'],
        components:{
        },
        data () {
            return {
                rules:{
                    num:[ {type:'string',
                        pattern: /^[1-9][\d]*$/,
                        required: true,
                        trigger: 'blur',
                        message:"invalid num" }],
                    price:[ { type:'string',
                        pattern: /^[1-9][\d.]*$/,
                        required: true,
                        trigger: 'blur',
                        message:"invalid price" }],
                },
            };
        },
        mounted(){
            
        },
        methods: {
            then(json,code){
                switch(code){
                    case uri.pushSupplies.code:
                        this.$emit('updateDialogAfter');
                        break;
                }
            },
            updateDialog(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        vk.http(uri.pushSupplies,this.form,this.then);
                    } else {
                        return false;
                    }
                });
            },
        }
    }
    export default {i18n,...App}
</script>