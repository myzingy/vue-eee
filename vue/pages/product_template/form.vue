<template>
    <el-form ref="form" :model="form" :rules="formRules" label-width="110px">
        <el-form-item :label="$t('选品编号')" prop="sku">
            <el-input v-model="form.sku"></el-input>
        </el-form-item>
        <el-form-item :label="$t('版型类别')" prop="template_type">
            <el-select v-model="form.template_type" @change="templateTypeSelect" :placeholder="$t('请选择')">
                <el-option
                        v-for="(item, index) in templateConfigs.template_type"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="this.form.template_type=='factory'" :label="$t('成本价')" prop="price">
            <el-input :readonly="!canEditPrice" v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item v-show="form.template_type=='factory'" :label="$t('开版工厂')" prop="factory_id">
            <el-select v-model="form.factory_id" :placeholder="$t('请选择')">
                <el-option
                        v-for="item in templateConfigs.factories"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('版号')" prop="template_no">
            <el-input v-model="form.template_no"></el-input>
            <!--<el-autocomplete-->
            <!--v-model="template_no_select_val"-->
            <!--:fetch-suggestions="queryTemplateNo"-->
            <!--valueKey="template_no"-->
            <!--placeholder="新开版则不填版号"-->
            <!--@select="templateNoSelect">-->
            <!--</el-autocomplete>-->
        </el-form-item>
        <el-form-item v-show="form.template_type=='purchase'" :label="$t('采购地址')" prop="purchase_url">
            <el-input v-model="form.purchase_url"></el-input>
        </el-form-item>
        <el-form-item :label="$t('分类')" prop="category">
            <el-select v-model="form.category" :placeholder="$t('请选择')">
                <el-option
                        v-for="(item, index) in templateConfigs.category"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('参考图')" prop="fids">
            <upload_block v-bind:param="picsConfig.param" v-bind:pics="form.fids" v-on:listenToPics="receivePics" v-model="form.fids"></upload_block>
        </el-form-item>
        <el-form-item :label="$t('是否开版')" prop="need_factory">
            <el-switch
                    @change="switchChange('need_factory')"
                    v-model="form.need_factory"
                    active-value="1"
                    inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item :label="$t('暂停开版')" prop="pause_factory">
            <el-switch
                    @change="switchChange('pause_factory')"
                    v-model="form.pause_factory"
                    active-value="1"
                    inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item v-show="form.need_factory==1" :label="$t('开版价格')" prop="factory_price">
            <el-input-number v-model="form.factory_price"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('是否渲染/拍图')" prop="need_studio" >
            <el-switch
                    @change="switchChange('need_studio')"
                    v-model="form.need_studio"
                    active-value="1"
                    inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item :label="$t('暂停渲染')" prop="pause_studio">
            <el-switch
                    @change="switchChange('pause_studio')"
                    v-model="form.pause_studio"
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
        <el-form-item v-show="form.need_studio==1" :label="$t('渲染价格')" prop="render_price">
            <el-input-number v-model="form.render_price"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('是否原创')" prop="is_original">
            <el-switch
                    v-model="form.is_original"
                    active-value="1"
                    inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item :label="$t('电镀颜色')" prop="electroplating_color">
            <el-select v-model="form.electroplating_color" :placeholder="$t('请选择')">
                <el-option
                        v-for="(item, index) in templateConfigs.plating_color"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('选品人')" prop="chosen_uid">
            <el-select v-model="form.chosen_uid" :placeholder="$t('请选择')">
                <el-option
                        v-for="item in templateConfigs.chosenUsers"
                        :key="item.id"
                        :label="item.nickname"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('选品理由')" prop="reason_note">
            <editor :value="form.reason_note" :option="{}" ref="textarea"></editor>
        </el-form-item>
        <el-form-item :label="$t('开版说明')" prop="factory_description">
            <editor :value="form.factory_description" :option="{}" ref="textarea1"></editor>
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
    import editor from '../common/editor.vue';
    let App ={
        props: ['updateTemplateArgs'],
        components:{
            upload_block:upload_block,
            editor
        },
        data() {
            return {
                flag_price:0,
                form: {
                    template_no:'',
                    purchase_url:'',
                    fids:[],
                    reason_note : '',
                    factory_description : '',
                    files : [],
                },
                templateConfigs:{},
                editorOption: {},
                template_no_select_val:'',
                picsConfig:{
                    param:{
                        cate:'product_template',
                    }
                },
                formRules: {
                    sku: [
                        { required: true, message: i18n.t('请输入选品编号'), trigger: 'blur' },
                    ],
                    template_type: [
                        { required: true, message: i18n.t('请选择版型'), trigger: 'change' },
                    ],
                    price: [
                        { required: true, message: i18n.t('请填写成本价'), trigger: 'change' },
                    ],
                    template_no: [
                        { required: true, message: i18n.t('请填写版号'), trigger: 'blur' },
                    ],
                    purchase_url: [
                        { required: false, message: i18n.t('请填写采购地址'), trigger: 'blur' },
                    ],
                    category: [
                        { required: true, message: i18n.t('请选择分类'), trigger: 'change' },
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
                    factory_id: [
                        { required: false, message: i18n.t('请选择工厂'), trigger: 'change' },
                    ],
                    studio_user: [
                        { required: false, message: i18n.t('请选择渲染团队'), trigger: 'change' },
                    ],
                }
            }
        },
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            },
            editFactoryPricePermission: function(){
                return (this.$router.power('/product/template.price.edit_once')
                || this.$router.power('/product/template.price.edit_multi'));
            },
            editFactoryPricePermissionMulti:function(){
                return this.editFactoryPricePermission && this.$router.power('/product/template.price.edit_multi');
            },
            canEditPrice:function(){
                if(this.editFactoryPricePermissionMulti) return true;
                if(this.editFactoryPricePermission && this.flag_price==0) return true;
                return false;
            }
        },
        watch:{
            'updateTemplateArgs': function(newVal, oldVal) {
                if(newVal.type=='create'){
                    this.$refs['form'].resetFields();
                    Object.assign(this.formRules, this.$options.data().formRules)
                    this.form.reason_note = '';
                    this.form.factory_description = '';
                    this.form.files = [];
                }
                this.fillTemplate();
            },
        },
        methods: {
            onEditorReady(editor) {

            },
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.productTemplateCreate.code:
                    case uri.productTemplateUpdate.code:
                        this.$emit('listenToSaveTemplate',{});
                        break;
                    case uri.productTemplateInfo.code:
                        if(json.data.files) json.data.fids = json.data.files.map(t=>t.id)
                        this.form = json.data;
                        this.flag_price = this.form.price;
                        break;
                    case uri.productTemplateConfigs.code:
                        this.templateConfigs = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.updateTemplateArgs.type =='update'?uri.productTemplateUpdate : uri.productTemplateCreate;
                        vk.http(url,that.form,that.then);
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
            fillTemplate(){
                if(this.updateTemplateArgs.type!='update') return;
                vk.http(uri.productTemplateInfo,{id:this.updateTemplateArgs.id,__force:true},this.then);
            },
            receivePics(data){
                this.form.fids = data;
            },
            templateTypeSelect(){
                let t = this.form.template_type
                this.formRules.purchase_url[0].required = t=='purchase';
                this.formRules.template_no[0].required = this.form.need_factory!=1;
                this.formRules.factory_id[0].required = t=='factory';
                !this.canEditPrice || t=='purchase' ? this.formRules.price[0].required = false:'';
            },
            switchChange(type){
                switch (type){
                    case 'need_factory':
                        this.formRules.price[0].required = this.form.need_factory!=1 && this.canEditPrice;
                        this.formRules.template_no[0].required = this.form.need_factory!=1;
                        break;
                    case 'need_studio':
                        this.formRules.studio_user[0].required = this.form.need_studio==1;
                        break;
                }
            },
//            queryTemplateNo(queryString, cb) {
//                if (!queryString || queryString.length < 3) return false;
//
//                vk.http(uri.productTemplateAttributes, {searchArgs:{template_no: queryString},page:1,pageSize:20}, function (json, code) {
//                    if (json.code != 200) {
//                        this.$message(json.message);
//                        return;
//                    }
//                    cb(json.list.map(function (v) {
//                        return {template_no: v.template_no}
//                    }));
//                })
//
//            },
//            templateNoSelect(item) {
//                this.form.template_no = this.template_no_select_val = item.template_no;
//            },
        },
        mounted(){
            vk.http(uri.productTemplateConfigs,{},this.then);
            this.fillTemplate();
        }
    }
    export default {i18n,...App};
</script>
