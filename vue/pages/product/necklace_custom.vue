<template>
    <div>
        <el-form ref="form" :model="options" :rules="formRules" label-width="90px">

            <el-form-item :label="$t('product.product.materials')" prop="material">
                <el-tabs v-model="materialTabSelect" type="card">
                    <el-tab-pane :label="$t('product.product.material')" name="material">
                        <table cellspacing="0" cellpadding="0" border="0" class="customTable text_center">

                            <tbody>
                            <template v-for="(item, key) in options.material.materials">
                                <tr>
                                    <td>
                                        {{key}}
                                        <el-button-group>
                                            <el-button size="mini" @click="resetMaterialPrice(key)" >{{$t('product.product.reset_price')}}</el-button>
                                        </el-button-group>

                                    </td>
                                    <td style="padding: 0">
                                        <table cellspacing="0" cellpadding="0" border="0" class="customTable text_center">
                                            <thead>
                                            <tr>
                                                <td width="70">{{$t('product.product.material')}}</td>
                                                <template v-for="(item1, key1) in params.materials">
                                                    <td>
                                                        <img :title="item1.label" :src="item1.icon" />
                                                    </td>
                                                </template>

                                            </tr>
                                            </thead>
                                            <tbody>

                                            <tr>
                                                <td> {{$t('product.product.price')}}</td>
                                                <template v-for="(mt, mtType) in item">
                                                    <td>
                                                        <el-input :min="-1" :controls="false" size="mini" v-model="mt.price">
                                                            <template slot="prepend">$</template>
                                                        </el-input>
                                                    </td>
                                                </template>
                                            </tr>

                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('product.product.engraving')" name="engraving">
                        <table cellspacing="0" cellpadding="0" border="0" class="customTable text_center">

                            <tbody>
                            <template v-for="(item, key) in options.material.engraving">
                                <tr>
                                    <td>
                                        E{{item.index}}<br/>
                                        <el-button-group>
                                            <el-button size="mini" @click="addEngraving" >{{$t('product.product.add_engraving')}}</el-button>
                                            <el-button size="mini" @click="deleteEngraving(key)" >{{$t('product.product.delete_engraving')}}</el-button>
                                        </el-button-group>

                                    </td>
                                    <td style="padding: 0">
                                        <el-select size="mini" v-model="item.limit" :placeholder="$t('common.please_select')">
                                            <el-option
                                                    v-for="n in configs.engravingMaxLen"
                                                    :key="n"
                                                    :label="n"
                                                    :value="n">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import upload_block from '../common/upload.vue';
    let App ={
        props: ['product_id', 'categorySelected', 'product_options'],
        components:{
            upload_block:upload_block,
        },
        data() {
            return {
                configs:{
                    materialMax : 5,
                    engravingMax:5,
                    engravingMaxLen:20,
                },
                materialTabSelect:'material',
                params:{materials:{}},

                options: {
                    material: {
                        materials:{},
                        engraving:[]
                    },
                },
                formRules:{}
            }
        },
        computed: {},
        mounted(){
            this.options = Object.assign(this.options,this.product_options);
            this.getMaterials();
        },
        methods:{
            then(json, code){
                if (json.code != 200) {
                    this.$message(json.message);
                    return;
                }
                switch (code) {
                    case uri.productCustomMaterial.code:
                        this.params = json.data;
                        this.setDefaultMaterials();
                        break;
                }

            },
            getData(){
                return this.options;
            },
            getMaterials(){
                vk.http(uri.productCustomMaterial, {type: 'necklace'}, this.then)
            },
            checkMaterialEmpty(){
                return JSON.stringify(this.options.material.materials) == "{}";
            },
            setDefaultMaterials(){

                if(!this.checkMaterialEmpty()) return;
                this.setDefaultMaterial();
                this.setDefaultRing();
            },
            setDefaultMaterial(){
                let materials = this.params.materials;
                let de_materials = {};
                for(let i in materials){
                    de_materials[i] = {price:-1};
                }
                let res = Object.assign({},{M1:de_materials},{M2:de_materials},{M3:de_materials});
                res = JSON.parse(JSON.stringify(res));
                this.$set(this.options.material, 'materials', res);
            },
            setDefaultRing(){
                this.$set(this.options.material, 'engraving', [{
                    index: "1",
                    limit: "1"
                }])
            },
            resetMaterialPrice(key){
                for(let i in this.options.material.materials[key]){
                    this.options.material.materials[key][i].price = -1;
                }
            },
            addEngraving(ringIndex){
                let count = Object.keys(this.options.material.engraving).length;
                if(count >= this.configs.engravingMax) {this.$message('最多添加'+count+'个'); return;}
                this.options.material.engraving.push({index:count+1,limit:1})
            },
            deleteEngraving(ringIndex){
                let count = Object.keys(this.options.material.engraving).length;
                this.$delete(this.options.material.engraving, count-1);//删除最后一个
            },
        }
    }
    export default {i18n,...App};
</script>