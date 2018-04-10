<style>
    .el-form-item__content{
        line-height: normal;
    }
</style>
<template>
    <el-form label-position="left" label-width="120px">
        <el-form-item >
            <i class="info">耗材名称: {{form.name}}</i> ,
            <i class="info">当前库存: {{form.total}}</i>
        </el-form-item>
        <el-form-item>
            <i class="info">耗材包: {{form.spus}}</i>
        </el-form-item>
        <el-form-item :label="$t('可包装产品')">
            <el-tag v-for="(row,index) in form.refl">
                {{row.name}}
            </el-tag>
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
                package_id:53,
                virtual_id:40,
                products:[],
                rules:{
                    name:[ { required: true, trigger: 'blur' }],
                },
                category:[],
                prod_cates:[],
            };
        },
        mounted(){
            let conf=vk.getCache(uri.getConf).data.products;
            let products=[];
            for(let key in conf){
                if(conf[key].category_id==this.package_id){
                    products.push(conf[key]);
                }
            }
            this.products=products;
            vk.http(uri.categoryTree,{},this.then);
        },
        methods: {
            then(json,code){
                switch(code){
                    case uri.categoryTree.code:
                        let category=[];
                        json.data.map((item)=>{
                            if(item.id==this.package_id || item.id==this.virtual_id)
                                return;
                            category.push(item);
                        });
                        this.category=category;
                        break;
                    case uri.updateSupplies.code:
                        this.$emit('updateDialogAfter');
                        break;
                }
            },
            updateDialog(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        vk.http(uri.updateSupplies,this.form,this.then);
                    } else {
                        return false;
                    }
                });
            },
        }
    }
    export default {i18n,...App}
</script>