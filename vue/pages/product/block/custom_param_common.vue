<template>
    <div>
        <el-card class="box-card">
            <el-form :inline="true">
                <el-form-item  prop="has_engraving">
                    <el-checkbox true-label="1" false-label="0" v-model="param.has_engraving" @change="selectChange" :label="$t('刻字')"></el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('product.detail.engrave_label')" prop="engrave_label">
                    <el-select size="mini" clearable v-model="param.engrave_label" @change="selectChange" :placeholder="$t('common.please_select')">
                        <el-option
                                v-for="n in configs.engrave_label"
                                :key="n"
                                :label="n"
                                :value="n">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('product.detail.engrave_font')" prop="engrave_font">
                    <el-select size="mini" clearable v-model="param.engrave_font" @change="selectChange" :placeholder="$t('common.please_select')">
                        <el-option
                                v-for="(val,key) in configs.engrave_font"
                                :key="key"
                                :label="val"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('product.product.engrave_max_len')" prop="engrave_max_len">
                    <el-input-number size="mini" v-model="param.engrave_max_len" :min=1 @blur="selectChange" ></el-input-number>
                </el-form-item>
                <el-checkbox true-label="1" false-label="0" v-model="param.engrave_free" @change="selectChange" :label="$t('刻字免费')" ></el-checkbox>
                <el-checkbox true-label="1" false-label="0" v-model="param.engrave_preview" @change="selectChange" :label="$t('刻字预览')" ></el-checkbox>
                <el-checkbox true-label="1" false-label="0" v-model="param.engrave_add_to_group" @change="selectChange" :label="$t('加入分组')" ></el-checkbox>
            </el-form>
            <el-form :inline="true">
                <el-form-item prop="has_stone">
                    <el-checkbox true-label="1" false-label="0" v-model="param.has_stone" @change="selectChange" :label="$t('石头')" ></el-checkbox>
                </el-form-item>
                <el-form-item prop="stone_add_to_group">
                    <el-checkbox true-label="1" false-label="0" v-model="param.stone_add_to_group" @change="selectChange" :label="$t('加入分组')" ></el-checkbox>
                </el-form-item>
            </el-form>
            <el-form :inline="true">
                <el-form-item prop="has_symbol">
                    <el-checkbox true-label="1" false-label="0" v-model="param.has_symbol" @change="selectChange" :label="$t('字母/字符')" ></el-checkbox>
                </el-form-item>
                <el-form-item prop="symbol_add_to_group">
                    <el-checkbox true-label="1" false-label="0" v-model="param.symbol_add_to_group" @change="selectChange" :label="$t('加入分组')" ></el-checkbox>
                </el-form-item>
            </el-form>

            <el-form :inline="true" >
                <el-form-item :label="$t('product.product.template_group_num')" prop="template_group_num">
                    <el-select size="mini" clearable v-model="param.group_num" @change="selectChange" :placeholder="$t('common.please_select')">
                        <el-option
                                v-for="n in configs.group_num"
                                :key="n"
                                :label="n"
                                :value="n">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('product.product.group_fee')" prop="template_group_num">
                    <el-input-number size="mini" :min=0 v-model="param.group_fee" @blur="selectChange" ></el-input-number>
                </el-form-item>

            </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top:10px">

            <el-checkbox true-label="1" false-label="0" v-model="param.has_ring_size" @change="selectChange" :label="$t('戒指尺寸')" >
                戒指尺寸 (<el-checkbox true-label="1" false-label="0" v-model="param.size_free" @change="selectChange" :label="$t('尺寸免费')" >

                </el-checkbox>)
            </el-checkbox>
            <el-checkbox true-label="1" false-label="0" v-model="param.has_bracelet_size" @change="selectChange" :label="$t('手链链长')" ></el-checkbox>
            <el-checkbox true-label="1" false-label="0" v-model="param.has_necklace_size" @change="selectChange" :label="$t('项链链长')" ></el-checkbox>
            <el-checkbox true-label="1" false-label="0" v-model="param.has_plating_color" @change="selectChange" :label="$t('颜色')" ></el-checkbox>
            <el-checkbox true-label="1" false-label="0" v-model="param.has_coordinate" @change="selectChange" :label="$t('坐标')" ></el-checkbox>
            <el-checkbox true-label="1" false-label="0" v-model="param.has_constellation" @change="selectChange" :label="$t('星座')" ></el-checkbox>
        </el-card>
        <el-card class="box-card" style="margin-top:10px">
            <el-form :inline="true" >
                <el-form-item :label="$t('product.detail.phrase')" prop="phrase">
                    <el-input type="textarea" v-model="param.phrase" @change="selectChange"></el-input>
                </el-form-item>
            </el-form>
            <el-form :inline="true" >
                <el-form-item :label="$t('product.detail.target_area')" prop="target_area">
                    <el-select size="mini" clearable v-model="param.target_area" @change="selectChange" :placeholder="$t('common.please_select')">
                        <el-option
                                v-for="n in configs.target_area"
                                :key="n"
                                :label="n"
                                :value="n">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form :inline="true" >
                <el-form-item>
                    <el-button size="mini" type="primary" @click="addEngraving">添加刻字</el-button>
                </el-form-item>
            </el-form>
            <el-form v-for="(item,key) in param.engravings" :inline="true" >
                <el-form-item :label="$t('product.product.engraving')+(key+1)" prop="engrave_item_label">
                    <el-input :controls="false" size="mini" v-model="item.label" @blur="selectChange">
                        <template slot="prepend">{{$t('product.detail.engrave_label')}}</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('product.product.engrave_max_len')" prop="engrave_item_length">
                    <el-input-number size="mini" v-model="item.length" :min=1 @blur="selectChange" ></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="removeEngraving(key)">删除刻字</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    let App ={
        props: ['detail','productAttributes'],
        data() {
            return {
                configs:{
                    group_num :12,
                    engrave_max_len :20,
                    target_area:9,
                    engrave_label:['Engraving','Name','Inscription','Preview Of Your Name'],
                    engrave_font:{}
                },
                param:{
                    has_engraving:0,
                    symbol_add_to_group:0,
                    stone_add_to_group:0,
                    has_symbol :0,
                    group_num :1,
                    group_fee :0,
                    engrave_free:0,
                    engrave_label:'',
                    engrave_max_len :12,
                    engrave_preview :0,
                    engrave_font :'',
                    engrave_add_to_group:0,
                    has_ring_size :0,
                    size_free :0,
                    has_bracelet_size :0,
                    has_necklace_size :0,
                    has_plating_color :0,
                    has_constellation :0,
                    has_coordinate :0,
                    target_area:0,
                    engravings:[]
                },
            }
        },
        computed: {

        },
        mounted(){

            this.assignList(this.detail);
            this.configs.engrave_font = this.productAttributes.font_family;
        },
        watch:{
            'detail':function(newVal){
                this.assignList(newVal);
            },
            'productAttributes':function(newVal){
                this.configs.engrave_font = newVal.font_family;
            }
        },
        methods : {
            selectChange:function(){
                let data = JSON.parse(JSON.stringify(this.param));
                data.engravings = JSON.stringify(data.engravings);
                this.$emit('listenSelect',data);
            },
            assignList:function(list){
                if(!(Object.keys(list).length === 0 && list.constructor === Object)){
                    this.param = Object.assign(this.param,list);
                    if(this.param.engravings){
                        this.param.engravings = JSON.parse(this.param.engravings);
                    }else{
                        this.param.engravings = [];
                    }
                }else{
                    this.param = this.$options.data().param;
                }
            },
            addEngraving(){
                let item = {label:'',length:12};
                this.param.engravings.push(item);
                this.selectChange();
            },
            removeEngraving(key){
                this.param.engravings.splice(key,1);
                this.selectChange();
            }
        }
    }
    export default {i18n,...App};
</script>
