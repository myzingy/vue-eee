<template>
    <el-form ref="form" :model="form" :rules="formRules" label-width="110px">
        <el-form-item :label="$t('选品编号')" prop="sku">
            <el-input readonly v-model="form.sku"></el-input>
        </el-form-item>

        <el-form-item :label="$t('版号')" prop="template_no">
            <el-input readonly v-model="form.template_no"></el-input>

        </el-form-item>
        <el-form-item :label="$t('参考图')" prop="fids">
            <upload_block v-bind:param="picsConfig.param" v-bind:pics="form.fids" v-on:listenToPics="receivePics" v-model="form.fids"></upload_block>
        </el-form-item>
        <el-form-item :label="$t('是否渲染/拍图')" prop="need_studio" >
            <el-switch
                    @change="switchChange('need_studio')"
                    v-model="form.need_studio"
                    active-value="1"
                    inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item v-show="form.need_studio==1" :label="$t('渲染团队')" prop="studio_user">
            <el-select v-model="form.studio_user" :placeholder="$t('请选择')">
                <el-option
                        v-for="(item, index) in templateConfigs.studioTeams"
                        :key="index"
                        :label="item"
                        :value="index">
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
    import upload_block from '../common/upload.vue';
    let App ={
        props: ['copyRow'],
        components:{
            upload_block:upload_block,
        },
        data() {
            return {
                form: {
                    template_no:'',
                    need_studio:0,
                    studio_user:'',
                    fids:[],
                    price:0,
                },
                templateConfigs:{},
                picsConfig:{
                    param:{
                        cate:'product_template',
                    }
                },
                formRules: {
                    sku: [
                        { required: true, message: i18n.t('请输入选品编号'), trigger: 'blur' },
                    ],

                    template_no: [
                        { required: true, message: i18n.t('请填写版号'), trigger: 'blur' },
                    ],

                    fids: [
                        { validator: (rule, value, callback) => {
                            if (!value || value.length <= 0 ) {
                                callback(new Error(i18n.t('请上传图片!')));
                            } else {
                                callback();
                            }
                        }, trigger: 'change' }
                    ],
                    studio_user: [
                        { required: false, message: i18n.t('请选择渲染团队'), trigger: 'change' },
                    ],
                }
            }
        },
        computed: {

        },
        watch:{
            'copyRow': function(newVal, oldVal) {

                this.fillTemplate(newVal);
            },
        },
        methods: {

            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.productTemplateCopy.code:
                        this.$emit('listenToSaveTemplate',{});
                        break;
                    case uri.productTemplateConfigs.code:
                        this.templateConfigs = json.data;
                        break;
                    case uri.productTemplateList.code:
                        let index = !!json.total ? json.total+1 : 1;
                        this.form.id = this.copyRow.id;
                        this.form.sku = this.copyRow.sku+'-'+index;
                        this.form.template_no = this.copyRow.template_no+'-'+index;
                        this.form.fids = [];
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {

                        vk.http(uri.productTemplateCopy,that.form,that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm');
            },
            fillTemplate(row){
                let param = {searchArgs:{template_no:row.template_no+'-',factory_id:row.factory_id}};
                vk.http(uri.productTemplateList,param,this.then)
            },
            receivePics(data){
                this.form.fids = data;
            },
            switchChange(type){
                switch (type){
                    case 'need_studio':
                        this.formRules.studio_user[0].required = this.form.need_studio==1;
                        break;
                }
            },

        },
        mounted(){
            vk.http(uri.productTemplateConfigs,{},this.then);
            this.fillTemplate(this.copyRow);
        }
    }
    export default {i18n,...App};
</script>
