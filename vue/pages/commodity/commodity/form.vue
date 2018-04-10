<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
            <el-form-item :label="$t('选择产品')" prop="product_id">
                <el-autocomplete
                        v-model="selectProduct"
                        :fetch-suggestions="querySearchAsync"
                        valueKey="spu"
                        :placeholder="$t('请输入SPU')"
                        @select="productSelect">
                    <template slot-scope="props">
                        <div class="name">{{ props.item.name }}</div>
                        <span style="font-size: 12px;color: #b4b4b4;">{{ props.item.spu }}</span>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item :label="$t('选择产品栏目')" style="width:220px"  prop="category_id">
                <select_tree ref="category_tree_id" @listenCategorySelect="receiveCategorySelect" v-bind:selectedCategory="form.category_id" v-bind:site_id="site" ></select_tree>
            </el-form-item>
            <el-form-item :label="$t('product.product.market_price')" prop="market_price">
                <el-input-number v-model="form.market_price" :min="0" :controls=false></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('product.product.selling_price')" prop="selling_price">
                <el-input-number v-model="form.selling_price" :min="0" :controls=false></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('product.product.special_price')" prop="special_price">
                <el-input-number v-model="form.special_price" :min="0" :controls=false></el-input-number>
                <span class="demonstration">{{$t('product.product.special_price_date')}}</span>
                <el-date-picker
                        v-model="special_price_range"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="specialPriceRange"
                        :range-separator="$t('至')"
                        :start-placeholder="$t('开始日期')"
                        :end-placeholder="$t('结束日期')"
                        value-format="yyyy-MM-dd">
                </el-date-picker>

            </el-form-item>
            <el-form-item :label="$t('名称')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Url Key')" prop="url_key">
                <url_key :name="form.name" :has_url_key="form.created_at ? form.url_key : ''" :type="updateCommodityArgs.type" :spu="form.product.spu" :category_id="form.category_magento_id" v-on:listenToUrlKey="receiveUrlKey" v-model="form.url_key"></url_key>
            </el-form-item>
            <el-form-item :label="$t('product.product.facebook_pid')" prop="facebook_pid">
                <el-input v-model="form.facebook_pid"></el-input>
            </el-form-item>
            <el-form-item :label="$t('product.product.gtin')" prop="gtin">
                <el-input v-model="form.gtin"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Meta Title')" prop="meta_title">
                <el-input v-model="form.meta_title"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Meta Keyword')" prop="meta_keywords">
                <el-input v-model="form.meta_keywords"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Meta Description')" prop="meta_description">
                <el-input v-model="form.meta_description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('product.product.relation')" prop="relation">
                <spu_set :set="form.relation" v-on:listenToSpuSet="receiveRelationSpu"></spu_set>
            </el-form-item>
            <el-form-item :label="$t('是否启用')" prop="status">
                <el-switch
                        v-model="form.status"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">{{$t('保存')}}</el-button>
                <el-button @click="closeForm">{{$t('取消')}}</el-button>
            </el-form-item>
        </el-form>
</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    import select_tree from '../../commodity/category/block/select_tree.vue';
    import { mapState,mapActions } from 'vuex'
    import { SET } from '../../../store/data.js'
    import url_key from './block/url_key.vue';
    import spu_set from './block/spu_set.vue';
    let App ={
        props: ['updateCommodityArgs'],
        components:{
            select_tree:select_tree,
            url_key,
            spu_set
        },
        data() {
            return {
                selectProduct:'',
                special_price_range:'',
                form: {
                    product_id:'',
                    name:'',
                    magento_id:0,
                    category_id:[],
                    category_magento_id:[],
                    market_price:0,
                    selling_price:0,
                    product:{
                        name:'',
                        spu:'',
                    }
                },
                formRules: {
                    product_id: [
                        { required: true, message: i18n.t('请输入产品SPU'), trigger: 'change' },
                    ],
                    selling_price: [
                        {type: "number", required: true, message: i18n.t('product.validate.input',{name:i18n.t('product.product.selling_price')}), trigger: 'blur' }
                    ],

                }
            }
        },
        computed:mapState({
            site: state => state.data.site||'',
            siteInfo: state => state.data.siteInfo||'',
        }),
        watch:{
            'updateCommodityArgs': function(newVal, oldVal) {
                if(newVal.type=='create'){
                    this.$refs['form'].resetFields();
                    this.form = this.$options.data().form;
                    this.$refs.category_tree_id.selected = [];
                    this.selectProduct = '';
                }
                this.fillCommodity();
            },
            'form.product.name':function(){
                if(this.updateCommodityArgs.type=='create'){
                    this.form.name = this.form.product.name;
                    this.form.meta_title = this.form.name+' - '+this.siteInfo.name + ' Jewelry';
                    this.form.meta_description = 'Buy ' + this.form.name + ' online. '+this.siteInfo.name + ' offers premium quality jewelry at affordable price, shop now!';
                }

            },
            'form.name':function(){
                if(this.updateCommodityArgs.type=='create'){
                    this.form.meta_title = this.form.name+' - '+this.siteInfo.name + ' Jewelry';
                    this.form.meta_description = 'Buy ' + this.form.name + ' online. '+this.siteInfo.name + ' offers premium quality jewelry at affordable price, shop now!';
                }

            },
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.commodityCreate.code:
                    case uri.commodityUpdate.code:
                        this.$emit('listenToSaveCommodity',{});
                        break;
                    case uri.commodityInfo.code:
                        this.selectProduct = json.data.product.spu;
                        json.data.category_id = json.data.categories.map(t=>{return t.id});
                        json.data.category_magento_id = json.data.categories.map(t=>{return t.magento_id});
                        this.form = json.data;
                        if(this.form.special_price_from){
                            this.special_price_range = [this.form.special_price_from,this.form.special_price_to];
                        }

                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        if(!that.site || !parseInt(that.site)){
                            that.$message(i18n.t('请选择站点'))
                            return;
                        }
                        that.form.site_id = that.site;
                        let url = that.updateCommodityArgs.type =='update'?uri.commodityUpdate : uri.commodityCreate;
                        vk.http(url,that.form,that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            closeForm(){
                this.$refs['form'].resetFields();
                this.form = this.$options.data().form;
                this.$emit('closeForm',{aa:123});
                this.special_price_range = '';
            },
            fillCommodity(){
                if(this.updateCommodityArgs.type!='update') return;
                vk.http(uri.commodityInfo,{id:this.updateCommodityArgs.id,__force:true},this.then);
            },
            querySearchAsync(queryString, cb) {
                //if (!queryString || queryString.length < 3) return false;

                vk.http(uri.productList, {searchArgs: {spu: queryString}}, function (json, code) {
                    if (json.code != 200) {
                        this.$message(json.message);
                        return;
                    }
                    cb(json.list.map(function (v) {
                        return {spu: v.spu, name: v.name,id:v.id}
                    }));
                })

            },
            productSelect(item) {
                this.form.product_id = item.id;
                this.form.product.name = item.name;
                this.form.product.spu = item.spu;
            },
            receiveCategorySelect(data){
                this.form.category_id = data[0];
                this.form.category_magento_id = data[1];
            },
            receiveUrlKey(data){
                this.form.url_key = data;
            },
            specialPriceRange(res){
                if(res && res.length==2){
                    this.form.special_price_from = res[0];
                    this.form.special_price_to = res[1];
                }else{
                    this.form.special_price_from = '';
                    this.form.special_price_to = '';
                }
            },
            receiveRelationSpu(data){
                console.log(data);
                this.form.relation = data;
            },
            checkPrice(rule, value, callback){
                if (value <= 0 ) {
                    callback(new Error(i18n.t('价格必须大于0')));
                } else {
                    callback();
                }

            },
        },
        mounted(){
            this.fillCommodity();
        }
    }
    export default {i18n,...App};
</script>
