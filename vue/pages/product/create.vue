<template>

    <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('product.product.base')" name="base_content">
            <el-col :span="24" style="height:100%;">
                <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
                    <el-form-item :label="$t('product.product.category_name')" prop="category_id">
                        <category_select ref="category_select_id" v-bind:category_id="form.category_id" v-on:listenCategorySelect="receiveCategorySelect" v-model="form.category_id"></category_select>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.is_customize')" prop="is_customize">
                        <el-switch
                                v-model="form.is_customize"
                                :active-text="$t('common.yes')"
                                :inactive-text="$t('common.no')"
                                active-value="1"
                                inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.is_set')" prop="is_set">
                        <el-switch
                                v-model="form.is_set"
                                :active-text="$t('common.yes')"
                                :inactive-text="$t('common.no')"
                                @change="isSetChange"
                                active-value="1"
                                inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item v-if="form.is_set==1" :label="$t('product.product.spu_set')" prop="spu_set">
                        <spu_set :startNum="2" v-bind:set="form.options.spu_set" v-on:listenToSpuSet="receiveSpuSet"></spu_set>
                        {{set_product_tips}}
                    </el-form-item>
                    <el-form-item :label="$t('product.product.is_clearance')" prop="is_clearance">
                        <el-switch
                                v-model="form.is_clearance"
                                :active-text="$t('common.yes')"
                                :inactive-text="$t('common.no')"
                                active-value="1"
                                inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.name')" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.spu')" prop="spu">
                        <el-input v-model="form.spu" :readonly="spu_readonly"></el-input>
                    </el-form-item>
                    <el-form-item v-if="this.form.is_set==0" :label="$t('product.product.template_no')" prop="template_no">

                        <el-autocomplete
                                class="inline-input"
                                v-model="autocomplete_template_no"
                                :fetch-suggestions="templateSearch"
                                placeholder="请输入内容"
                                @select="templateSelect"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.osku')" prop="osku">
                        <el-input v-model="form.osku"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.pics')" prop="pics">
                        <upload_block v-bind:param="picsConfig.param" v-bind:pics="form.pics" v-on:listenToPics="receivePics" v-model="form.pics"></upload_block>
                    </el-form-item>

                    <el-form-item :label="$t('product.product.real_image')" prop="real_image">
                        <upload_block v-bind:param="realImageConfig.param" v-bind:pics="form.options.real_image" v-on:listenToPics="receiveRealImage" v-model="form.options.real_image"></upload_block>
                    </el-form-item>
                    <el-form-item v-show="false" :label="$t('product.product.picture_num')" prop="picture">
                        <el-input-number v-model="form.options.picture" :min="0" :controls=false></el-input-number>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.zip')" prop="zip">
                        <upload_block v-bind:param="zipConfig.param" v-bind:pics="form.options.zip" v-on:listenToPics="receiveZip" v-model="form.options.zip"></upload_block>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.show3d')" prop="show3d">
                        <el-switch
                                v-model="form.options.show3d"
                                :active-text="$t('common.yes')"
                                :inactive-text="$t('common.no')"
                                active-value="1"
                                inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.short_description')" prop="short_description">

                        <editor :editorId="'short_desc'" :editorContent="form.short_description" :tipMsg="$t('不填则获取版图属性表格')" @listenToContent="receiveShortDesc" v-model="form.short_description"></editor>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.description')" prop="description">
                        <editor :editorId="'desc'" :editorContent="form.description"  @listenToContent="receiveDesc" v-model="form.description"></editor>
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

                    <el-form-item :label="$t('product.product.style')" prop="style">
                        <el-select v-model="form.style" :placeholder="$t('common.please_select')">
                            <el-option
                                    v-for="(item, index) in productAttributes.style"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.template_id')" prop="template_id">
                        <el-select v-model="form.template_id" @change="templateIdSelect" :placeholder="$t('common.please_select')">
                            <el-option
                                    v-for="(item, index) in productAttributes.template_id"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="is_dui_ring" :label="$t('product.product.man_size')" prop="man_size">
                        <muti_select :list="form.options.man_size" :optionList="productManRingSizes" @listenSelect="receiveManSizeListSelect" :placeholder="$t('不选代表所有尺寸可用')"></muti_select>
                    </el-form-item>
                    <el-form-item v-if="is_dui_ring" :label="$t('product.product.women_size')" prop="women_size">
                        <muti_select :list="form.options.women_size" :optionList="productWomenRingSizes" @listenSelect="receiveWomenSizeListSelect" :placeholder="$t('不选代表所有尺寸可用')"></muti_select>
                    </el-form-item>
                    <el-form-item v-if="form.template_id==''" :label="$t('product.product.template_attr')" prop="template_group_num">
                        <custom_param :detail="form.detail" @listenSelect="receiveCustomParam"></custom_param>
                    </el-form-item>
                    <el-form-item v-if="form.template_id=='common'" :label="$t('product.product.template_attr')" prop="template_group_num">
                        <custom_param_common :detail="form.detail" :productAttributes="productAttributes" @listenSelect="receiveCustomParamCommon"></custom_param_common>
                    </el-form-item>

                    <el-form-item v-if="form.template_id=='' || form.template_id=='common'"  :label="$t('product.product.size_list')" prop="size_list">

                        <muti_select :list="form.options.size_list" :optionList="productRingSizes" @listenSelect="receiveSizeListSelect" :placeholder="$t('不选代表所有尺寸可用')"></muti_select>
                    </el-form-item>
                    <el-form-item v-show="form.is_set!=1"  :label="$t('product.product.support_stock')" prop="support_stock">
                        <el-select clearable v-model="form.support_stock" :placeholder="$t('common.please_select')">
                            <el-option
                                    v-for="(item, index) in {'1':'是', '0':'否'}"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.brand')" prop="brand">
                        <el-select v-model="form.brand" :placeholder="$t('common.please_select')">
                            <el-option
                                    v-for="(item, index) in productAttributes.brand"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.designer')" prop="designer">
                        <el-input v-model="form.designer"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('product.product.copyright')" prop="copyright">
                        <el-select v-model="form.copyright" multiple :placeholder="$t('common.please_select')">
                            <el-option
                                    v-for="(item, index) in productAttributes.copyright"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">{{$t('common.save')}}</el-button>
                        <el-button @click="closeForm">{{$t('common.cancel')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-tab-pane>
        <el-tab-pane v-if="ringCustomShow" :label="$t('product.product.ringCustomShow')" name="ring_custom">

            <ring_custom ref="ring_custom_id"  v-bind:product_id="form.id" v-bind:categorySelected="categorySelected"
                         v-bind:product_options="form.options"></ring_custom>
        </el-tab-pane>
        <el-tab-pane v-if="necklaceCustomShow" :label="$t('product.product.necklaceCustomShow')" name="necklace_custom">
            <necklace_custom ref="necklace_custom_id" v-bind:product_id="form.id" v-bind:categorySelected="categorySelected"
                             v-bind:product_options="form.options"></necklace_custom>
        </el-tab-pane>
    </el-tabs>

</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import ring_custom_view from './ring_custom.vue';
    import necklace_custom_view from './necklace_custom.vue';
    import upload_block from '../common/upload.vue';
    import spu_set from './block/spu_set.vue';
    import category_select from '../category/block/select_category.vue';
    import Editor from '../common/wangeditor.vue';
    import muti_select from './block/muti_select.vue';
    import custom_param from './block/custom_param.vue';
    import custom_param_common from './block/custom_param_common.vue';
    let App ={
        props: ['updateProductArgs'],
        components:{
            ring_custom:ring_custom_view,
            necklace_custom:necklace_custom_view,
            upload_block:upload_block,
            spu_set:spu_set,
            category_select:category_select,
            Editor,
            muti_select,
            custom_param,
            custom_param_common,
        },
        data() {
            return {
                configs:{
                    templateGroupNumMax : 10,
                },
                activeTabName: 'base_content',
                categorySelected:[],
                autocomplete_template_no:'',
                form: {
                    brand:"",
                    category_id:0,
                    copyright:[],
                    cost_price:0,
                    description:"",
                    designer:"",
                    detail:{},
                    options:{
                        zip:[],
                        show3d:0,
                    },
                    series:{},
                    is_clearance:0,
                    is_set:0,
                    is_customize:0,
                    market_price:0,
                    name:"",
                    osku:"",
                    pics:[],
                    selling_price:0,
                    template_id:'',
                    template_no:'',
                    spu:"",
                    style:"",
                    support_stock:"",
                },
                picsConfig:{
                    param:{
                        cate:'product',
                        accept:'.jpg,.png',
                        size:'500kb',
                        multi:true
                    }
                },
                zipConfig:{
                    param:{
                        cate:'product',
                        accept:'.zip',
                        size:'50Mb',
                        multi:false
                    }
                },
                realImageConfig:{
                    param:{
                        cate:'product',
                        accept:'.jpg,.png',
                        size:'500kb',
                        multi:true
                    }
                },
                productAttributes:{},
                formRules: {
                    category_id: [
                        { required: true, message: i18n.t('product.validate.choose',{name:i18n.t('product.product.category_name')}), trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: i18n.t('product.validate.input',{name:i18n.t('product.product.name')}), trigger: 'blur' },
                    ],
                    spu: [
                        { required: true, message: i18n.t('product.validate.input',{name:i18n.t('product.product.spu')}), trigger: 'blur' }
                    ],
                    spu_set: [
                        { validator: this.checkSpuSet, trigger: 'blur' }
                    ],
                    template_no: [
                        { required: true, message: i18n.t('product.validate.input',{name:i18n.t('product.product.template_no')}), trigger: 'change' },
                    ],
//                    selling_price: [
//                        {type: "number", required: true, message: i18n.t('product.validate.input',{name:i18n.t('product.product.selling_price')}), trigger: 'blur' }
//                    ],
                    style: [
                        { required: true, message: i18n.t('product.validate.choose',{name:i18n.t('product.product.style')}), trigger: 'change' }
                    ],
                    brand: [
                        { required: true, message: i18n.t('product.validate.choose',{name:i18n.t('product.product.brand')}), trigger: 'change' }
                    ],
                    support_stock: [
                        { required: true,validator: this.checkSupportStock,  trigger: 'change' }
                    ],

                }
            }
        },
        computed: {
            ringCustomShow: function () {
                return this.form.is_customize==1 && this.categorySelected[0]=='ring';
            },
            necklaceCustomShow: function () {
                return this.form.is_customize==1 && this.categorySelected[0]=='necklace' &&
                    this.categorySelected[1]=='svg_necklace';
            },
            isNeedTemplateNo:function(){
                if(['package','virtual'].includes(this.categorySelected[0])){
                    return false;
                }else{
                    return true;
                }
            },
            productRingSizes: function(){
                if(this.productAttributes && this.productAttributes.size && this.productAttributes.size.ring){
                    return this.form.style =='male' ? this.productManRingSizes : (this.form.style =='female' ?
                       this.productWomenRingSizes : this.productAttributes.size.ring);
                }
                return [];
            },
            productManRingSizes: function(){
                if(this.productAttributes && this.productAttributes.size && this.productAttributes.size.ring_man){
                    return this.productAttributes.size.ring_man;
                }
                return [];
            },
            productWomenRingSizes: function(){
                if(this.productAttributes && this.productAttributes.size && this.productAttributes.size.ring_women){
                    return this.productAttributes.size.ring_women;
                }
                return [];
            },
            set_product_tips:function(){
                if(this.categorySelected[0]=='ring'){
                    return '提示：第一个SPU为男戒，第二个SPU为女戒';
                }else{
                    return '提示：第一个SPU为主产品(照片/刻字类型)，第二个SPU为副产品（普通类型）';
                }

            },
            is_dui_ring:function(){
                return this.form.template_id == 'template_6' || this.form.template_id == 'template_8'
            },
            spu_readonly:function(){
                return this.updateProductArgs.type =='update' ? (this.form.commodities && this.form.commodities.length>0) : false
            }
        },
        watch:{
            'form.is_set':function(newVal){
                this.formRules.template_no[0].required = !parseInt(newVal);
                this.form.support_stock = parseInt(newVal) ? '0' : ''

            }
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.productAttributes.code:
                        this.productAttributes = json.data;
                        this.form.series = this.getDefaultSeries();//first
                        this.productAttributes.factories = this.productAttributes.factories.concat([{id:0,name:'采购',weight:1}])
                        this.fillProduct();
                        break;
                    case uri.productUpdate.code:
                    case uri.productCreate.code:
                        this.$emit('listenToSaveProduct',{})
                        break;
                    case uri.productInfo.code:
                        let data = json.data;
                        if(!data.detail) json.data.detail = {};
                        if(!data.series) json.data.series = [];
                        if(json.data.pics) json.data.pics = json.data.pics.map(t=>t.id)
                        let series = this.getDefaultSeries();
                        for(let i=0;i<data.series.length;i++){
                            if(!series[data.series[i].category]) series[data.series[i].category] = []
                            series[data.series[i].category].push(data.series[i].id) ;
                        }
                        data.series = series;

                        this.form = Object.assign({}, this.form, json.data)
                        this.autocomplete_template_no = this.form.template_no;
                        setTimeout(t=>{this.$refs.category_select_id.init();},0)
                        break;
                }

            },
            init(){
                this.fillProduct();
            },
            onSubmit(formName) {
                let that = this;
                this.fillProductOptions();
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.updateProductArgs.type =='update'?uri.productUpdate : uri.productCreate;
                        vk.http(url,that.form,that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            fillProductOptions(){
                if(this.ringCustomShow){
                    let allowed = ['material','ring1','ring2','ring3','ring_type','set','simple_ring_type','url_hash'];
                    let data = this.filterObject(this.$refs.ring_custom_id.getData(),allowed);
                    this.form.options = Object.assign(this.form.options, data);
                }else if(this.necklaceCustomShow){
                    let allowed = ['material'];
                    let data = this.filterObject(this.$refs.necklace_custom_id.getData(),allowed);
                    this.form.options = Object.assign(this.form.options, data);
                }

            },
            filterObject(raw, allowed){
                return Object.keys(raw).filter(key => allowed.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = raw[key];
                        return obj;
                    }, {});
            },
            receivePics(data){
                this.form.pics = data;
                console.log(data);
            },
            receiveSizeListSelect(data){
                this.form.options.size_list = data;
            },
            receiveManSizeListSelect(data){
                this.form.options.man_size = data;
            },
            receiveWomenSizeListSelect(data){
                this.form.options.women_size = data;
            },
            receiveSpuSet(data){
                this.form.options.spu_set = data;
            },
            receiveCategorySelect(data){
                this.form.category_id = data.category_id;
                this.categorySelected = data.categorySelected;
                if(this.isNeedTemplateNo){
                    this.formRules.template_no[0].required = true;
                }else{
                    this.formRules.template_no[0].required = false;
                }
            },
            receiveZip(data){
                if(data && data[0]){
                    this.form.options.zip = data[0];
                }else{
                    delete this.form.options.zip;
                }

            },
            receiveRealImage(data){
                this.form.options.picture = data.length;
                this.form.options.real_image = data.join(',');
            },
            receiveShortDesc(data){
                this.form.short_description = data;
            },
            receiveDesc(data){
                this.form.description = data;
            },
            receiveCustomParam(data){
                let allowed = ['has_engraving','has_stone','has_symbol','group_num','group_fee','engrave_max_len','has_ring_size','size_free','has_bracelet_size','has_necklace_size','has_plating_color','has_coordinate'];
                this.form.detail = Object.assign(this.form.detail, this.filterObject(data,allowed));
            },
            receiveCustomParamCommon(data){
                let allowed = ['has_engraving','has_stone','has_symbol','group_num','group_fee','engrave_max_len','has_ring_size','target_area',
                    'size_free','has_bracelet_size','has_necklace_size','has_plating_color','has_coordinate','engrave_label','engrave_free','engrave_preview',
                    'engrave_font','engrave_add_to_group','stone_add_to_group','stone_add_to_group','symbol_add_to_group','has_constellation','phrase','engravings'];
                this.form.detail = Object.assign(this.form.detail, this.filterObject(data,allowed));
            },
            handleTabClick(tab, event){
                console.log(tab, event);
            },
            closeForm(){
                this.clearForm();
                this.$emit('closeForm',{});
            },
            clearForm(){
                this.$refs['form'].resetFields();
                this.$refs.category_select_id.clearSelect();
                this.autocomplete_template_no = '';
                Object.assign(this.form, this.$options.data().form)
                this.form.series = this.getDefaultSeries();
            },
            fillProduct(){
                if(this.updateProductArgs.type!='update') {
                    this.clearForm();
                    return;
                }
                vk.http(uri.productInfo,{id:this.updateProductArgs.id},this.then);
            },
            isSetChange(item){
                if(item==0) delete this.form.options.spu_set
            },
            checkSpuSet(rule, value, callback){
                if (this.form.is_set) {
                    let flag = false;
                    if(!this.form.options.spu_set){
                        callback(new Error(i18n.t('product.validate.input',{name:i18n.t('product.product.spu_set')})));
                        return;
                    }
                    this.form.options.spu_set.map(function(v,i){
                        if(!v) flag = true;
                    })
                    if(flag){
                        callback(new Error(i18n.t('product.validate.input',{name:i18n.t('product.product.spu_set')})));
                        return;
                    }

                }
                callback();
            },
            checkSupportStock(rule, value, callback){
                if(this.form.support_stock === ''){
                    callback(new Error(i18n.t('product.validate.choose',{name:i18n.t('product.product.support_stock')})));
                    return;
                }
                callback();
            },
            templateSearch(queryString, cb) {
                //if (!queryString || queryString.length < 3) return false;

                vk.http(uri.productTemplateList, {searchArgs: {template_no: queryString,list_type:'available'}}, function (json, code) {
                    if (json.code != 200) {
                        this.$message(json.message);
                        return;
                    }
                    cb(json.list.map(function (v) {
                        return {value: v.template_no}
                    }));
                })

            },
            getDefaultSeries(){
                let series = JSON.parse(JSON.stringify(this.productAttributes.series));
                for(let attr in series){
                    series[attr] = [];
                }
                return series;
            },
            templateSelect(item,index) {
                this.form.template_no = item.value;
            },
            templateIdSelect(val){
                if(val){

                }
            }

        },
        mounted(){
            vk.http(uri.productAttributes,{},this.then);

        }
    }
    export default {i18n,...App};
</script>
