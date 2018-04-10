<template>
    <div>
        <el-card class="box-card">

            <el-checkbox true-label="1" false-label="0" v-model="param.has_engraving" @change="selectChange" :label="$t('刻字')"></el-checkbox>
            <el-checkbox true-label="1" false-label="0" v-model="param.has_stone" @change="selectChange" :label="$t('石头')" ></el-checkbox>
            <el-checkbox true-label="1" false-label="0" v-model="param.has_symbol" @change="selectChange" :label="$t('字母/字符')" ></el-checkbox>
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
                    <el-input-number size="mini" v-model="param.group_fee" @blur="selectChange" ></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('product.product.engrave_max_len')" prop="engrave_max_len">
                    <el-input-number size="mini" v-model="param.engrave_max_len" :min=1 @blur="selectChange" ></el-input-number>
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
        </el-card>

    </div>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    let App ={
        props: ['detail'],
        data() {
            return {
                configs:{
                    group_num :12,
                    engrave_max_len :20,
                },
                param:{
                    has_engraving:0,
                    has_stone:0,
                    has_symbol :0,
                    group_num :1,
                    group_fee :0,
                    engrave_max_len :12,
                    has_ring_size :0,
                    size_free :0,
                    has_bracelet_size :0,
                    has_necklace_size :0,
                    has_plating_color :0,
                    has_coordinate :0,
                },
            }
        },
        computed: {

        },
        mounted(){

            this.assignList(this.detail);
        },
        watch:{
            'detail':function(newVal){
                this.assignList(newVal);
            },

        },
        methods : {
            selectChange:function(){
                this.$emit('listenSelect',this.param);
            },
            assignList:function(list){
                if(!(Object.keys(list).length === 0 && list.constructor === Object)){
                    this.param = Object.assign(this.param,list);
                }else{
                    this.param = this.$options.data().param;
                }
            }
        }
    }
    export default {i18n,...App};
</script>
