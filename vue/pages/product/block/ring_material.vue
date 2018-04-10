<template>
    <div>
        <el-tabs v-model="materialTabSelect" type="card">
            <el-tab-pane :label="$t('product.product.stone')" name="stone">
                <table cellspacing="0" cellpadding="0" border="0" class="customTable text_center">

                    <tbody>
                    <template v-for="(item, key) in cMaterial.gemstones">
                        <tr>
                            <td>
                                {{key}}
                                <el-button-group>
                                    <el-button size="mini" @click="copyStone" >{{$t('product.product.add_stone')}}</el-button>
                                    <el-button size="mini" @click="deleteStone(key)" >{{$t('product.product.delete_stone')}}</el-button>
                                </el-button-group>

                            </td>
                            <td style="padding: 0">
                                <table cellspacing="0" cellpadding="0" border="0" class="customTable text_center">
                                    <thead>
                                    <tr>
                                        <td width="70">{{$t('product.product.color')}}</td>
                                        <template v-for="(item1, key1) in params.stones.stones">
                                            <td>
                                                <img :title="item1.label" :src="item1.icon" />
                                            </td>
                                        </template>

                                    </tr>
                                    </thead>
                                    <tbody>

                                    <tr v-for="(stone, stoneType) in item">

                                        <td>{{params.stones.materials[stoneType].label}}</td>
                                        <template v-for="(value, colorType) in stone">
                                            <td>
                                                <el-button-group>
                                                    <el-button class="button-mini" size="mini" @click="openStoneSelect(key,stoneType,colorType)">{{value.fittings_id==0 ? "选择宝石":value.fittings_id+'-'+value.fittings_num}}</el-button>
                                                    <el-button :title="$t('点击选择默认宝石')" class="button-mini" size="mini" @click="setFirstMaterial('stone',key,stoneType,colorType)" icon="el-icon-star-on"></el-button>
                                                </el-button-group>

                                                <el-input :min="-1" :controls="false" size="mini" v-model="value.price">
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
            <el-tab-pane :label="$t('product.product.material')" name="material">
                <table cellspacing="0" cellpadding="0" border="0" class="customTable text_center">

                    <tbody>
                    <template v-for="(item, key) in cMaterial.materials">
                        <tr>
                            <td>
                                {{key}}
                                <el-button-group>
                                    <el-button size="mini" @click="copyMaterial" >{{$t('product.product.add_material')}}</el-button>
                                    <el-button size="mini" @click="deleteMaterial(key)" >{{$t('product.product.delete_material')}}</el-button>
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
                                                <el-button slot="append" class="button-mini" :title="$t('点击选择默认材质')" size="mini" @click="setFirstMaterial('material',key,mtType)" icon="el-icon-star-on"></el-button>
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
                    <template v-for="(item, key) in cMaterial.rings">
                        <tr>
                            <td>
                                {{key}}<br/>
                                <el-button-group>
                                    <el-button size="mini" @click="copyRing" >{{$t('product.product.add_ring')}}</el-button>
                                    <el-button size="mini" @click="deleteRing(key)" >{{$t('product.product.delete_ring')}}</el-button>
                                </el-button-group>

                            </td>
                            <td style="padding: 0">
                                <table cellspacing="0" cellpadding="0" border="0" class="customTable text_center">
                                    <tbody>
                                    <tr>
                                        <td> {{$t('product.product.inner_engraving')}}</td>
                                        <td style="text-align: left">
                                            <el-select size="mini" v-model="item.engraving[0].limit" :placeholder="$t('common.please_select')">
                                                <el-option
                                                        v-for="n in configs.engravingMax"
                                                        :key="n"
                                                        :label="n"
                                                        :value="n">
                                                </el-option>
                                            </el-select>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td> {{$t('product.product.outer_engraving')}}</td>
                                        <td>
                                            <template v-for="(info,index) in item.engraving.filter(t => t.type == 'outer')">
                                                    Outer {{index+1}}
                                                    <el-select size="mini" v-model="item.engraving[index+1].limit" :placeholder="$t('common.please_select')">
                                                        <el-option
                                                                v-for="n in configs.engravingMax"
                                                                :key="n"
                                                                :label="n"
                                                                :value="n">
                                                        </el-option>
                                                        <el-button slot="append" icon="el-icon-search"></el-button>
                                                    </el-select>

                                                    <el-button size="mini" @click="deleteEngraving(key)" >{{$t('common.delete')}}</el-button>
                                            </template>
                                            <el-button size="mini" @click="addEngraving(key)" >{{$t('common.add')}}</el-button>
                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </el-tab-pane>
        </el-tabs>
        <stoneSelectDialog v-bind:dialogStoneVisible="stoneSelect.is_show" v-on:listenFittingsClose="receiveStoneClose" v-on:listenFittingsSelect="receiveStoneSelect"></stoneSelectDialog>
    </div>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    import stoneSelectDialog from '../../fittings/choose_single_stone.vue';
    let App ={
        props:['material','url_hash'],
        components:{
            stoneSelectDialog:stoneSelectDialog,
        },
        data() {
            return {
                configs:{
                    stoneMax : 3,
                    materialMax : 5,
                    engravingMax:20,
                    ringMax:20,
                    outerEngravingMax:3
                },
                materialTabSelect:'stone',
                stoneSelect:{
                    is_show:false,
                    current:{},
                },
                firstMaterial:{},
                params:{stones:{},materials:{}},
                cMaterial : {//宝石、材质、刻字
                    gemstones:{},
                    materials:{},
                    rings:{}
                },
                my_url_hash:'',
            }
        },
        computed: {
//            url_key:function(){
//                let  url_hash = '';
//                if(Object.keys(this.firstMaterial).length<1){//默认
//                    for(let item in this.cMaterial.gemstones){
//                        let mtype = Object.keys(this.cMaterial.gemstones[item])[0],ctype=Object.keys(this.cMaterial.gemstones[item][mtype])[0];
//                        let mcode = this.params.stones.materials[mtype].code;
//                        let ccode = this.params.stones.stones[ctype].code;
//                        url_hash += item + '_'+mcode+'_'+ccode+'&';
//                    }
//                    for(let it in this.cMaterial.materials){
//                        let type = Object.keys(this.cMaterial.materials[it])[0];
//                        let code = this.params.materials[type].code;
//                        url_hash += it + '_'+code+'&';
//                    }
//                }else{//用户选择
//                    let stones = this.firstMaterial.stone,materials=this.firstMaterial.material;
//                    for(let bbb in stones){
//                        url_hash += bbb + '_'+this.params.stones.materials[stones[bbb].attr1].code;
//                        url_hash += '_'+this.params.stones.stones[stones[bbb].attr2].code;
//                    }
//                    for(let aaa in materials){
//                        url_hash += index + '_'+this.params.materials[materials[aaa].attr1].code+'&';
//                    }
//                }
//                return url_hash.substr(0,url_hash.length-1);
//            }
        },
        mounted(){
            if(this.material) this.cMaterial = this.material;
            this.my_url_hash = this.url_hash;
            this.getMaterials();
        },
        watch:{
            'material':function(){
                if(this.material) this.cMaterial = this.material;
            }
        },
        methods : {
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
            getMaterials(){
                vk.http(uri.productCustomMaterial, {type: 'ring'}, this.then)
            },
            receiveStoneSelect(data){
                let cur = this.stoneSelect.current;
                this.stoneSelect.is_show = false;
                this.cMaterial.gemstones[cur[0]][cur[1]][cur[2]].fittings_id = data.id;
                this.cMaterial.gemstones[cur[0]][cur[1]][cur[2]].fittings_num = data.num;
            },
            receiveStoneClose(){
                this.stoneSelect.is_show = false;
            },
            openStoneSelect(stoneIndex,stoneType,stoneColor){
                if(this.cMaterial.gemstones[stoneIndex][stoneType][stoneColor].fittings_id!=0){
                    this.cMaterial.gemstones[stoneIndex][stoneType][stoneColor].fittings_id = 0;
                    return;
                }
                this.stoneSelect.current = [stoneIndex,stoneType,stoneColor]
                this.stoneSelect.is_show = true;
            },
            setDefaultMaterials(){
                if(!this.checkMaterialEmpty()) return;
                this.setDefaultStones();
                this.setDefaultMaterial();
                this.setDefaultRing();
                setTimeout(t => {this.setDefaultUrlHash(this.my_url_hash=='')},200);
            },
            checkMaterialEmpty(){
                return JSON.stringify(this.cMaterial) == "{}";
            },
            setDefaultStones(){
                let stones = this.params.stones.stones;
                let materials = this.params.stones.materials;
                let de_stones = {};
                for(let i in materials){
                    de_stones[i] = {};
                    for(let j in stones){
                        de_stones[i][j]={price:-1,fittings_id:0,fittings_num:0};
                    }
                }
                this.$set(this.cMaterial, 'gemstones', {G1:de_stones})
                console.log(de_stones);
            },
            setDefaultMaterial(){
                let materials = this.params.materials;
                let de_materials = {};
                for(let i in materials){
                    de_materials[i]={price:-1};
                }
                this.$set(this.cMaterial, 'materials', {M1:de_materials});
                console.log(de_materials);
            },
            setDefaultRing(){
                this.$set(this.cMaterial, 'rings', {R1:{
                    engraving: [
                        {
                            type: "inner",
                            limit: "1"
                        }
                    ]
                }})

            },
            setDefaultUrlHash(cover){
                let  url_hash = '';
                cover = cover || true
                if(cover){//默认
                    this.firstMaterial = {};
                    for(let item in this.cMaterial.gemstones){
                        let mtype = Object.keys(this.cMaterial.gemstones[item])[0],ctype=Object.keys(this.cMaterial.gemstones[item][mtype])[0];
                        let obj = {};

                        obj[item] = {attr1:mtype,attr2:ctype};
                        if('stone' in this.firstMaterial){
                            this.$set(this.firstMaterial['stone'], item, obj[item]);
                        }else{
                            this.$set(this.firstMaterial, 'stone',obj);
                        }
                    }
                    for(let it in this.cMaterial.materials){
                        let type = Object.keys(this.cMaterial.materials[it])[0];
                        let code = this.params.materials[type].code;
                        let obj = {};

                        obj[it] = {attr1:type};
                        if('material' in this.firstMaterial){
                            this.$set(this.firstMaterial['material'], it, obj[it]);
                        }else{
                            this.$set(this.firstMaterial, 'material',obj);
                        }
                    }
                }
                this.setFirstMaterial(false);
            },
            copyStone(){
                let count = Object.keys(this.cMaterial.gemstones).length;
                if(count >= this.configs.stoneMax) {this.$message(i18n.t('product.validate.max_input',{num:count})); return;}
                let newItem = JSON.parse(JSON.stringify(this.cMaterial.gemstones['G'+count]));
                this.$set(this.cMaterial.gemstones, 'G'+(count+1), newItem);
                this.setDefaultUrlHash();
            },
            deleteStone(key){
                let count = Object.keys(this.cMaterial.gemstones).length;
                if(count>1){
                    this.$delete(this.cMaterial.gemstones, 'G'+count);//删除最后一个
                }
                this.setDefaultUrlHash();
            },
            copyMaterial(){
                let count = Object.keys(this.cMaterial.materials).length;
                if(count >= this.configs.materialMax) {this.$message(i18n.t('product.validate.max_input',{num:count})); return;}
                let newItem = JSON.parse(JSON.stringify(this.cMaterial.materials['M'+count]));
                this.$set(this.cMaterial.materials, 'M'+(count+1), newItem);
                this.setDefaultUrlHash();
            },
            deleteMaterial(key){
                let count = Object.keys(this.cMaterial.materials).length;
                if(count>1){
                    this.$delete(this.cMaterial.materials, 'M'+count);//删除最后一个
                }
                this.setDefaultUrlHash();
            },
            copyRing(){
                let count = Object.keys(this.cMaterial.rings).length;
                if(count >= this.configs.ringMax) {this.$message(i18n.t('product.validate.max_input',{num:count})); return;}
                let newItem = JSON.parse(JSON.stringify(this.cMaterial.rings['R'+count]));
                this.$set(this.cMaterial.rings, 'R'+(count+1), newItem)
            },
            deleteRing(key){
                let count = Object.keys(this.cMaterial.rings).length;
                if(count>1){
                    this.$delete(this.cMaterial.rings, 'R'+count);//删除最后一个
                }
            },
            addEngraving(ringIndex){
                let count = Object.keys(this.cMaterial.rings[ringIndex].engraving).length-1;
                if(count >= this.configs.outerEngravingMax) {this.$message(i18n.t('product.validate.max_input',{num:count})); return;}
                this.cMaterial.rings[ringIndex].engraving.push({type:'outer',limit:1})
            },
            deleteEngraving(ringIndex){
                let count = Object.keys(this.cMaterial.rings[ringIndex].engraving).length;
                this.$delete(this.cMaterial.rings[ringIndex].engraving, count-1);//删除最后一个
            },
            setFirstMaterial(type, index, attr1, attr2){

                let item = {},url_hash='';
                if(type){
                    item[index] = {attr1:attr1,attr2:attr2};
                    this.$set(this.firstMaterial[type], index, item[index]);
                }

                let stones = this.firstMaterial.stone,materials=this.firstMaterial.material;
                for(let bbb in stones){
                    url_hash += bbb + '_'+this.params.stones.materials[stones[bbb].attr1].code;
                    url_hash += '_'+this.params.stones.stones[stones[bbb].attr2].code+'&';
                }
                for(let aaa in materials){
                    url_hash += aaa + '_'+this.params.materials[materials[aaa].attr1].code+'&';
                }
                this.my_url_hash = url_hash.substr(0,url_hash.length-1);
            },
            mergeDeep(target, ...sources) {
                if (!sources.length) return target;
                const source = sources.shift();

                if (this.isObject(target) && this.isObject(source)) {
                    for (const key in source) {
                        if (this.isObject(source[key])) {
                            if (!target[key]) Object.assign(target, { [key]: {} });
                            this.mergeDeep(target[key], source[key]);
                        } else {
                            Object.assign(target, { [key]: source[key] });
                        }
                    }
                }

                return this.mergeDeep(target, ...sources);
            },
            isObject(item) {
                return (item && typeof item === 'object' && !Array.isArray(item));
            }
        }
    }
    export default {i18n,...App};
</script>
