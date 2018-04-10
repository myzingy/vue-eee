<style>
    .el-form-item__content{
        line-height: normal;
    }
</style>
<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item :label="$t('耗材名称')" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('耗材包')" prop="form_spus">
            <el-checkbox-group v-model="form.spus" size="mini">
                <template v-for="(row,index) in products">
                    <el-checkbox :label="row.spu" border>{{row.name}}</el-checkbox>
                </template>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('可包装产品')" prop="form_prod_cates">
            <el-checkbox-group v-model="form.prod_cates" size="mini">
                <template v-for="(row,index) in category">
                    <el-checkbox :label="row.id" border>{{row.name}}</el-checkbox>
                </template>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('重量')" prop="weight">
            <el-input v-model="form.weight">
                <template slot="append">G</template>
            </el-input>
        </el-form-item>
        <el-form-item :label="$t('体积')" class="tiji">
            <el-col :span="8">
                <el-form-item label="Length" prop="length" label-width="60px">
                    <el-input v-model="form.length" >
                        <template slot="append">CM</template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="Width" prop="width" label-width="60px">
                    <el-input v-model="form.width">
                        <template slot="append">CM</template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="Height" prop="height" label-width="60px">
                    <el-input v-model="form.height">
                        <template slot="append">CM</template>
                    </el-input>
                </el-form-item>
            </el-col>
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
                    length:[ {type:'string',
                        pattern: /^[\d.]*$/,
                        trigger: 'blur',
                        message:"invalid length" }],
                    width:[ {type:'string',
                        pattern: /^[\d.]*$/,
                        trigger: 'blur',
                        message:"invalid width" }],
                    height:[ {type:'string',
                        pattern: /^[\d.]*$/,
                        trigger: 'blur',
                        message:"invalid height" }],
                    weight:[ {type:'string',
                        pattern: /^[\d]*$/,
                        required: true,
                        trigger: 'blur',
                        message:"invalid weight" }],
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