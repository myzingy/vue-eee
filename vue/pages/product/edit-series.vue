<template>

    <el-form :model="form" ref="form" :rules="formRules" label-width="130px">
        <el-form-item :label="$t('product.product.spu')" prop="spu">
            {{form.spu}}
        </el-form-item>
        <el-form-item v-for="(list,i) in productAttributes.series" :label="i" prop="series.style">
            <el-select filterable v-model="form.series[i]" multiple :placeholder="$t('common.please_select')">
                <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
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
        props: ['id'],
        components:{

        },
        data() {
            return {
                configs:{
                    templateGroupNumMax : 10,
                },
                form: {
                    spu:"",
                    series:{},
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

        },
        watch:{
            'id':function(newVal){
                this.fillSeries();
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
                        this.form.series = this.getDefaultSeries();
                        this.fillSeries();
                        break;
                    case uri.productEditSeries.code:
                        this.closeForm()
                        break;
                    case uri.productInfo.code:
                        let data = json.data;
                        let series = this.getDefaultSeries();
                        for(let i=0;i<data.series.length;i++){
                            if(!series[data.series[i].category]) series[data.series[i].category] = []
                            series[data.series[i].category].push(data.series[i].id) ;
                        }
                        data.series = series;

                        this.form = data;
                        break;

                }

            },

            fillSeries(){
                this.clearForm();
                vk.http(uri.productInfo,{id:this.id},this.then);
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        vk.http(uri.productEditSeries,that.form,that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getDefaultSeries(){
                let series = JSON.parse(JSON.stringify(this.productAttributes.series));
                for(let attr in series){
                    series[attr] = [];
                }
                return series;
            },
            closeForm(){
                this.clearForm();
                this.$emit('closeForm',{});
            },
            clearForm(){
               // this.$refs['form'].resetFields();
            },

        },
        mounted(){
            vk.http(uri.productAttributes,{},this.then);
        }
    }
    export default {i18n,...App};
</script>
