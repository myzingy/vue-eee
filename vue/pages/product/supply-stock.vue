<template>

    <el-form :model="form" ref="form" :rules="formRules" label-width="130px">
        <el-form-item :label="$t('product.product.spu')" prop="spu">
            <el-input v-model="form.spu" readonly ></el-input>
        </el-form-item>
        <el-form-item :label="$t('product.stock.storehouse')" prop="storehouse_id">
            <el-select v-model="form.storehouse_id" :placeholder="$t('common.please_select')">
                <el-option
                        v-for="(item, key) in storehouses"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="factories && factories.length>0" :label="$t('product.stock.factory')" prop="factory_id">
            <el-select  v-model="form.factory_id" :placeholder="$t('common.please_select')">
                <el-option
                        v-for="(item, key) in factories"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('common.amount')" prop="amount">
            <el-input v-if="hasProductSizes()" v-for="(item,key) in productSizes" v-model="form.amount[item.id]" size="medium">
                <template slot="prepend">{{item.name}}</template>
            </el-input>
            <el-input v-if="!hasProductSizes()" v-model="form.amount[999]" size="medium">
            </el-input>
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
        props: ['product','spu'],
        components:{

        },
        data() {
            return {
                configs:{
                    templateGroupNumMax : 10,
                },
                form: {
                    spu:"",
                    size:"",
                    factory_id:'',
                    storehouse_id:'',
                    amount:{}
                },
                productAttributes:{},
                formRules: {
                    storehouse_id: [
                        { required: true, message: i18n.t('product.validate.choose',{name:i18n.t('product.stock.storehouse')}), trigger: 'change' }
                    ],
                    factory_id: [
                        { required: false, message: i18n.t('product.validate.choose',{name:i18n.t('product.stock.factory')}), trigger: 'change' }
                    ],
                    size: [
                        { required: false, message: i18n.t('product.validate.choose',{name:i18n.t('product.stock.size')}), trigger: 'change' }
                    ],
                    spu: [
                        { required: true, message: i18n.t('product.validate.input',{name:i18n.t('product.product.spu')}), trigger: 'blur' }
                    ],
                    amount: [
                        { validator: this.checkAmount, trigger: 'blur' }
                    ],

                }
            }
        },
        computed: {
            storehouses:function(){
                if(this.productAttributes && this.productAttributes.storehouses){
                    return this.productAttributes.storehouses
                }
                return [];
            },
            factories:function(){
                if(this.product.factories && this.product.factories.length>0){
                    return this.product.factories;
                }
                return [];
            },
            productSizes:function(){
                if(this.product.template_id){
                    if(this.product.template_id=='template_9') return this.productNecklaceSizes;//名称项链
                }else if(this.product.detail){
                    if(parseInt(this.product.detail.has_ring_size)){
                        return this.productRingSizes;
                    }else if(parseInt(this.product.detail.has_necklace_size)){
                        return this.productNecklaceSizes;
                    }else if(parseInt(this.product.detail.has_bracelet_size)){
                        return this.productBraceletsSizes;
                    }
                }
                return [];
            },
            productRingSizes: function(){
                if(this.productAttributes && this.productAttributes.size && this.productAttributes.size.ring){
                    let size_list = this.product.options.filter(t => t.key == 'size_list');
                    let list = {};
                    if(!!size_list && size_list.length>0){
                        list = this.filterObject(this.productAttributes.size.ring,JSON.parse(size_list[0].value));
                    }else{
                        list = this.productAttributes.size.ring;
                    }

//
                    return this.sortFormatSize(list);
                }
                return [];
            },
            productNecklaceSizes: function(){
                if(this.productAttributes && this.productAttributes.size && this.productAttributes.size.necklace){
                    return this.sortFormatSize(this.productAttributes.size.necklace);
                }
                return [];
            },
            productBraceletsSizes: function(){
                if(this.productAttributes && this.productAttributes.size && this.productAttributes.size.bracelets){
                    return this.sortFormatSize(this.productAttributes.size.bracelets);
                }
                return [];
            },

        },
        watch:{
            'spu':function(newVal){
                this.fillProduct();
            },

        },
        methods: {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.productAttributes.code:
                        this.productAttributes = json.data;
                        this.fillProduct();
                        break;
                    case uri.productSupplyStock.code:
                        this.$message(json.message);
                        this.clearForm();
                        this.form.spu = this.spu;
                        //this.$emit('closeForm',{})
                        break;

                }

            },

            fillProduct(){
                this.clearForm();
                this.form.spu = this.spu;
                if(this.hasProductSizes()){
                    this.formRules.size[0].required = true;
                }else{
                    this.formRules.size[0].required = false;
                }
                if(this.factories && this.factories.length>0){
                    this.formRules.factory_id[0].required = true;
                }else{
                    this.formRules.factory_id[0].required = false;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        vk.http(uri.productSupplyStock,that.form,that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            checkAmount(rule, value, callback){
                let flag = true,total=0;
                if(this.isEmpty(this.form.amount)) flag = false;
                for(let i in this.form.amount){
                    if(isNaN(this.form.amount[i])){
                        flag = false;break;
                    }else{
                        total += this.form.amount;
                    }
                }
                if (!flag && total<1) {
                    callback(new Error(i18n.t('product.validate.input',{name:i18n.t('common.amount')})));
                    return;
                }
                callback();
            },
            closeForm(){
                this.clearForm();
                this.$emit('closeForm',{});
            },
            clearForm(){
                this.$refs['form'].resetFields();
                Object.assign(this.form, this.$options.data().form)

            },
            hasProductSizes(){
                return this.productSizes && Object.keys(this.productSizes).length !== 0;
            },
            sortFormatSize(list){
                return Object.keys(list).sort((a,b) => {return a-b}).reduce(function (result, key) {
                    result.push({id:key,name:list[key]});
                    return result;
                }, []);
            }

        },
        mounted(){
            vk.http(uri.productAttributes,{},this.then);
        }
    }
    export default {i18n,...App};
</script>
