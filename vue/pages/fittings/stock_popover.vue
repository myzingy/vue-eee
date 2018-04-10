<style lang="stylus" rel="stylesheet/scss">

    .el-select .el-input {
        width: 110px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

</style>
<template>
    <div>
        <el-popover
                ref="popover_pen"
                placement="left"
                width="300"
                @show="showPopover"
                v-model="popover_pen_value">

            <el-input placeholder="Value" v-model="cur_amount">
                <el-select v-show="showFactoryInfo" slot="prepend" v-model="cur_factory_id" placeholder="Select" >
                    <el-option
                            v-for="(item, key) in factoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
               <el-button slot="append" type="primary" icon="el-icon-success" @click="saveStock()"></el-button>

            </el-input>
        </el-popover>
        <el-button type="text" v-popover:popover_pen>
            {{amount}}
            <i class="el-icon-edit"></i>
        </el-button>

    </div>
</template>
<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    var App= {
        props: ['factory_id','fittings_id','amount','factoryList'],
        data () {
            return {
                cur_factory_id:0,
                cur_amount:1,
                popover_pen_value:false,
            }
        },
        computed: {
            showFactoryInfo:function(){
                return this.factoryList && this.factoryList.length > 1;
            }
        },
        mounted(){
            if(this.factory_id){
                this.cur_factory_id = this.factory_id;
            }else{
                if(!this.cur_factory_id) this.cur_factory_id = this.factoryList[0].id;
            }
            if(this.amount) this.cur_amount = this.amount;
        },
        methods: {

            saveStock(){
                this.popover_pen_value=false;
                if(this.cur_amount!=this.amount){
                    this.$emit('change',this.cur_factory_id,this.fittings_id,this.cur_amount);
                }
            },
            openPopover(){
                this.popover_pen_value=true;
            },
            showPopover(){

            }
        }
    }
    export default {i18n,...App}
</script>