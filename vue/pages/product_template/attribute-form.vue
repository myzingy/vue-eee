<template>
    <div>

    <el-form ref="form" :model="form" :rules="formRules" label-width="110px">
        <el-form-item :label="$t('版号')" prop="template_no">
            <el-input v-model="form.template_no"></el-input>
        </el-form-item>
        <el-form-item :label="$t('成本价')" prop="price">
            <el-input :readonly="!canEditPrice" v-model="form.price">

            </el-input>
        </el-form-item>
        <el-form-item :label="$t('材质')" prop="attributeInfo.metal">
            <el-select v-model="form.attributeInfo.metal" :placeholder="$t('请选择')">
                <el-option
                        v-for="(item, index) in templateConfigs.material"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('重量')" prop="attributeInfo.weight">
            <el-input v-model="form.attributeInfo.weight">
                <template slot="append">{{$t('克')}}</template>
            </el-input>
        </el-form-item>
        <el-form-item :label="$t('宽度')" prop="width">
            <el-input v-model="form.attributeInfo.width">
                <template slot="append">{{$t('毫米')}}
                    <el-tooltip v-if="is_ring_type()" placement="left">
                        <div slot="content"><img src="images/width_img.png" /> </div>
                        <el-button>{{$t('示意图')}}</el-button>
                    </el-tooltip>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item :label="$t('高度')" prop="height">
            <el-input v-model="form.attributeInfo.height">
                <template slot="append">{{$t('毫米')}}
                    <el-tooltip v-if="is_ring_type()" placement="left">
                        <div slot="content"><img src="images/height_img.png" /> </div>
                        <el-button>{{$t('示意图')}}</el-button>
                    </el-tooltip>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item :label="$t('厚度')" prop="thickness">
            <el-input v-model="form.attributeInfo.thickness">
                <template slot="append">{{$t('毫米')}}
                    <el-tooltip v-if="is_ring_type()" placement="left">
                        <div slot="content"><img src="images/thickness_img.png" /> </div>
                        <el-button>{{$t('示意图')}}</el-button>
                    </el-tooltip>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item v-if="form.category=='beaded'" :label="$t('内径')" prop="inner_diameter">
            <el-input v-model="form.attributeInfo.inner_diameter">
                <template slot="append">{{$t('毫米')}}</template>
            </el-input>
        </el-form-item>
        <el-form-item v-if="is_chain_type()" :label="$t('链子类型')" prop="attributeInfo.chain_type">
            <el-select v-model="form.attributeInfo.chain_type" :placeholder="$t('请选择')">
                <el-option
                        v-for="(item, index) in templateConfigs.chain_type"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="is_chain_type()" :label="$t('链子长度')" prop="chain_length">
            <el-input v-model="form.attributeInfo.chain_length">
                <template slot="append">{{$t('毫米')}}</template>
            </el-input>
        </el-form-item>
        <el-form-item v-if="is_chain_type()" :label="$t('链子颜色')" prop="attributeInfo.chain_color">
            <el-select v-model="form.attributeInfo.chain_color" :placeholder="$t('请选择')">
                <el-option
                        v-for="(item, index) in templateConfigs.chain_color"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="form.category=='free_size_ring'" :label="$t('手码范围')" prop="size_range">
            <el-input v-model="form.attributeInfo.size_range">
                <template slot="append">{{$t('毫米')}}</template>
            </el-input>
        </el-form-item>
        <el-form-item :label="$t('描述')" prop="description">
            <el-input type="textarea" v-model="form.attributeInfo.description">
            </el-input>
        </el-form-item>
        <el-form-item v-if="form.category!='custom_ring'" :label="$t('宝石')" prop="material">
            <fittings v-bind:material="form.material" v-on:listenFittingsSelect="receiveFittingsSelect" v-model="form.material"></fittings>
            <el-table :data="form.material" border >
                <!--<el-table-column prop="serial_id" :label="$t('宝石编号')"> </el-table-column>-->
                <el-table-column prop="pic" :label="$t('图片')">
                    <template slot-scope="scope">
                        <img width="60px" :src="scope.row.fittings.file && scope.row.fittings.file.path ? scope.row.fittings.file.path : ''" @click="showImageView($event)" class="image" />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称">
                    <template slot-scope="scope">
                        {{getStoneName(scope.row.fittings)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('数量')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.amount"></el-input>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('类型')">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.m_type" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in templateConfigs.stone_type"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('操作')">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-delete" @click.native="stoneDelete(scope.row)">{{$t('删除')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">{{$t('保存')}}</el-button>
            <el-button @click="closeForm">{{$t('取消')}}</el-button>
        </el-form-item>
    </el-form>
        <!-- img view-->
        <image_view :modal="false" :url="previewImage.url" :width="previewImage.width" :dialogVisible="previewImage.show" @closeImagePreview="closeImagePreview"></image_view>
    </div>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import upload_block from '../common/upload.vue';
    import { quillEditor } from 'vue-quill-editor' //调用编辑器
    import fittings from '../fittings/standard_stone.vue';
    import image_view from '../common/image_view.vue';
    let App ={
        props: ['updateTemplateArgs'],
        components:{
            upload_block:upload_block,
            quillEditor,
            fittings:fittings,
            image_view
        },
        data() {
            return {
                flag_price:0,
                form: {
                    fids:[],
                    material:[],
                    attributeInfo:{
                        weight:0,
                        metal:''
                    },
                },
                templateConfigs:{},
                previewImage:{url:'',width:0,show:false},
                formRules: {
                    template_no: [
                        { required: true, message: i18n.t('请输入版号'), trigger: 'blur' },
                    ],
                    price: [
                        { required: true, message: i18n.t('请输入成本价'), trigger: 'blur' },
                        { validator: this.checkPrice, trigger: 'blur' }
                    ],

                    'attributeInfo.metal': [
                        { required: true, message: i18n.t('请选择材质'), trigger: 'change' },
                    ],
                    'attributeInfo.weight': [
                        { required: true, message: i18n.t('请输入重量'), trigger: 'blur' },
                    ],

                }
            }
        },
        computed: {
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
                this.$refs['form'].resetFields();
                Object.assign(this.form, this.$options.data().form)
                this.fillTemplate();
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
                    case uri.productTemplateCreate.code:
                    case uri.productTemplateUpdate.code:
                        this.$emit('listenToSaveTemplate',{});
                        break;
                    case uri.productTemplateInfo.code:
                        this.form = Object.assign(this.form,json.data);
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
                if(!this.canEditPrice) this.formRules.price[0].required = false;
                vk.http(uri.productTemplateInfo,{id:this.updateTemplateArgs.id,__force:true},this.then);
            },
            switchChange(type){
                switch (type){
                    case 'need_factory':
                        this.formRules.factory_id[0].required = this.form.need_factory==1;
                        break;
                    case 'need_studio':
                        this.formRules.studio_user[0].required = this.form.need_studio==1;
                        break;
                }
            },
            receiveFittingsSelect(data){

                let newList = data.map(function(i,v){
                    return {fittings_id:i.id,amount:1,m_type:'small_stone',fittings:i};
                });
                for(let it in newList){
                    let index = this.form.material.findIndex(d => d.fittings_id === newList[it].fittings_id);
                    if(index == -1){
                        this.form.material.push(newList[it]);
                    }
                }

            },
            getStoneName(item){
                return item.id+'|'+item.shape+'|'+item.color+'|'+item.specifications;
            },
            stoneDelete(row){
                console.log(row);
                this.form.material = this.form.material.filter(t => t.fittings_id != row.fittings_id);
            },
            is_ring_type(){
                return this.form.category == 'ring' || this.form.category == 'free_size_ring'
                    || this.form.category == 'custom_ring'
            },
            is_chain_type(){
                return this.form.category=='necklace' || this.form.category=='bracelet'
            },
            checkPrice(rule, value, callback){
                if (this.canEditPrice && parseInt(value) <= 0) {
                    callback(new Error(i18n.t('价格必须大于0')));
                } else {
                    callback();
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
