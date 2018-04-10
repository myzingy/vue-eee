<template>
    <div>
        <el-form ref="form" :model="options" :rules="formRules" label-width="90px">

            <el-form-item v-show="display.ring_single_show" :label="$t('product.product.simple_ring_type')" prop="simple_ring_type">
                <el-select v-model="options.simple_ring_type" @change="simpleRingChange" :placeholder="$t('common.please_select')">
                    <el-option
                            v-for="(item, index) in selectOptions.simple_ring_option"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-show="display.set_show" label="Set" prop="set">
                <el-autocomplete
                        v-model="options.set"
                        :fetch-suggestions="querySearchAsync"
                        valueKey="url_key"
                        :placeholder="$t('product.validate.input',{name:$t('product.product.spu')})"
                        @select="handleSelect">
                    <template slot-scope="props">
                        <div class="name">{{ props.item.value }}</div>
                        <span style="font-size: 12px;color: #b4b4b4;">{{ props.item.url_key }}</span>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item v-show="display.ring1_show" label="Ring 1" prop="ring1">
                <el-autocomplete
                        v-model="options.ring1"
                        :fetch-suggestions="querySearchAsync"
                        valueKey="url_key"
                        :placeholder="$t('product.validate.input',{name:$t('product.product.spu')})"
                        @select="handleSelect">
                    <template slot-scope="props">
                        <div class="name">{{ props.item.value }}</div>
                        <span style="font-size: 12px;color: #b4b4b4;">{{ props.item.url_key }}</span>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item v-show="display.ring2_show" label="Ring 2" prop="ring2">
                <el-autocomplete
                        v-model="options.ring2"
                        :fetch-suggestions="querySearchAsync"
                        valueKey="url_key"
                        :placeholder="$t('product.validate.input',{name:$t('product.product.spu')})"
                        @select="handleSelect">
                    <template slot-scope="props">
                        <div class="name">{{ props.item.value }}</div>
                        <span style="font-size: 12px;color: #b4b4b4;">{{ props.item.url_key }}</span>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item v-show="display.ring3_show" label="Ring 3" prop="ring3">
                <el-autocomplete
                        v-model="options.ring3"
                        :fetch-suggestions="querySearchAsync"
                        valueKey="url_key"
                        :placeholder="$t('product.validate.input',{name:$t('product.product.spu')})"
                        @select="handleSelect">
                    <template slot-scope="props">
                        <div class="name">{{ props.item.value }}</div>
                        <span style="font-size: 12px;color: #b4b4b4;">{{ props.item.url_key }}</span>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item :label="$t('product.product.material')" prop="material">
                <ringMaterial ref="ring_material_id" v-model="options.material" v-bind:url_hash="options.url_hash" v-bind:material="options.material"
                              v-on:listenMaterialChange="receiveMaterialChange"></ringMaterial>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import upload_block from '../common/upload.vue';
    import ringMaterial from './block/ring_material.vue';
    let App = {
        props: ['product_id', 'categorySelected', 'product_options'],
        components:{
            upload_block:upload_block,
            ringMaterial:ringMaterial,
        },
        data() {
            return {
                options: {//同product_options
                    ring_type: '',
                    simple_ring_type: '',
                    set: '',
                    ring1: '',
                    ring2: '',
                    ring3: '',
                    url_hash: '',
                    material: {},
                },
                selectOptions: {
                    simple_ring_option: {normal: i18n.t('product.normal'), ring1: 'Ring 1', ring2: 'Ring 2', ring3: 'Ring 3'}
                },
                formRules: {},
                display: {
                    ring_single_show: false,
                    set_show: false,
                    ring1_show: false,
                    ring2_show: false,
                    ring3_show: false,
                },
                stoneSelect:{
                    is_show:false,
                    current:{},
                },
            }
        },
        computed: {},
        mounted(){
            this.options.ring_type = this.categorySelected[1];
            this.options = Object.assign({},this.product_options);
            this.displayLogic();
        },
        watch: {
            'categorySelected': function (newVal, oldVal) {
                this.options.ring_type = this.categorySelected[1];
                this.displayLogic();
            },
            'product_options':function(){
                this.options = Object.assign({},this.product_options);
                this.displayLogic();
            }
        },
        methods: {
            getData(){
                this.options.material = this.$refs.ring_material_id.cMaterial;
                this.options.url_hash = this.$refs.ring_material_id.my_url_hash;
                return this.options;
            },
            querySearchAsync(queryString, cb) {
                //if (!queryString || queryString.length < 3) return false;
                let that = this;
                vk.http(uri.productList, {searchArgs: {spu: queryString}}, function (json, code) {
                    if (json.code != 200) {
                        this.$message(json.message);
                        return;
                    }
                    cb(json.list.map(function (v) {
                        return {value: v.spu, url_key: v.url_key}
                    }));
                })

            },
            simpleRingChange(){
                this.displayLogic();
            },
            displayLogic(){
                let ring_set = this.options.ring_type == 'ring_set';
                let simple_ring_type = this.options.simple_ring_type;
                if (ring_set) {
                    this.isShow(false, false, true, true, true);
                } else {
                    this.isShow(true, false, false, false, false);
                    switch (simple_ring_type) {
                        case 'normal':
                            this.isShow(true, false, false, false, false);
                            break;
                        case 'ring1':
                            this.isShow(true, true, false, true, true);
                            break;
                        case 'ring2':
                            this.isShow(true, true, true, false, true);
                            break;
                        case 'ring3':
                            this.isShow(true, true, true, true, false);
                            break;
                    }
                }
            },
            isShow(ring_single, ring_set, ring1, ring2, ring3){
                this.display.ring_single_show = ring_single;
                this.display.set_show = ring_set;
                this.display.ring1_show = ring1;
                this.display.ring2_show = ring2;
                this.display.ring3_show = ring3;
            },
            handleSelect(item) {
                console.log(this.options.set);
                //this.options.set = item.url_key;
            },
            receiveMaterialChange(data){
                this.options.material = data;
            },

        }
    }
    export default {i18n, ...App};
</script>