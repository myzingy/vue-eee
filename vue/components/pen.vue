<style lang="stylus" rel="stylesheet/scss">
</style>
<template>
    <div>
        <div v-if="isPen">
            <el-popover
                    ref="popover_pen"
                    :placement="placement"
                    :title="title"
                    width="400"
                    @show="showPopover"
                    v-model="popover_pen_value">
                <div v-if="select">
                    <el-select v-model="newValue" placeholder="Select" >
                        <el-option
                                v-for="item in select"
                                :key="item"
                                :label="$t(item)"
                                :value="item">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-success" @click="saveButton"></el-button>
                </div>
                <div v-else-if="selectObj">
                    <el-select v-model="newValue" placeholder="Select" >
                        <el-option
                                v-for="(label, key) in selectObj"
                                :key="key"
                                :label="$t(label)"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-success" @click="saveButton"></el-button>
                </div>
                <div v-else-if="isn2br()">
                    <el-input placeholder="Value" v-model="newValue" type="textarea" :rows="3"
                              resize="none"
                              style="width: 83%;">
                    </el-input>
                    <el-button type="primary" icon="el-icon-success" @click="saveButton"></el-button>
                </div>
                <el-input placeholder="Value" v-model="newValue" v-else>
                    <template slot="append">
                        <el-button type="primary" icon="el-icon-success" @click="saveButton"></el-button>
                    </template>
                </el-input>


            </el-popover>
            <el-button type="text" v-popover:popover_pen>
                <div v-if="isn2br()" style="text-align: left">
                    <span v-html="n2br()"></span><i class="el-icon-edit"></i>
                </div>
                <div v-else="">{{value}} <i class="el-icon-edit"></i></div>
            </el-button>
        </div>
        <div v-else="">
            <div v-if="isn2br()" style="text-align: left">
                <span v-html="n2br()"></span>
            </div>
            <div v-else="">{{value}}</div>
        </div>
    </div>
</template>
<script>
    import i18n from '../local'
    var App= {
        props: {
            title: {
                type: String,
                default: '',
            },
            value: {
                type: String,
                default: '',
            },
            placement: {
                type: String,
                default: 'top'
            },
            params:{
                type:Object,
                required: true,
            },
            select:{
                type:Array,
            },
            selectObj:{
                type:Object,
            },
            isPen:{
                type:Boolean,
                default:true,
            }
        },
        data () {
            return {
                newValue:"",
                popover_pen_value:false,
            }
        },
        mounted(){
            this.newValue=typeof this.params.val=='undefined'?this.value
                :this.params.val;
        },
        methods: {
            saveButton(){
                this.popover_pen_value=false;
                if(this.value!=this.newValue){
                    this.$emit('change',this.newValue,this.params);
                }
            },
            openPopover(){
                this.popover_pen_value=true;
            },
            showPopover(){
                console.log(this.select,this.selectObj);
                this.newValue=typeof this.params.val=='undefined'?this.value
                    :this.params.val;
            },
            isn2br(){
                return this.value?this.value.indexOf('\n')>0:false;
            },
            n2br(){
                return this.value.replace(/[\n]/g,'<br/>');
            },
        }
    }
    export default {i18n,...App}
</script>