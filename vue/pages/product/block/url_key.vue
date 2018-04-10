<template>
    <div>
        <el-input readonly v-model="url_key" :controls=false></el-input>
        <el-checkbox v-show="checkOpen" v-model="autoFill">{{$t('product.product.auto_rule')}}</el-checkbox>
    </div>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    let App ={
        props: ['name','spu','category_id','type'],
        data() {
            return {
                autoFill:true,
                copyUrlKey:'',
            }
        },
        computed: {
            url_key:function(){
                if(this.autoFill){
                    this.copyUrlKey = 'Product-'+this.name.split(' ').join('_') + '-' + this.category_id + '-' + this.spu;
                    return this.copyUrlKey;
                }
                return this.copyUrlKey;
            },
            checkOpen:function(){
                return this.type == 'update';
            }
        },
        mounted(){

        },
        watch:{
            'type':function(newVal){
                if(newVal=='create') this.autoFill = true;
            },
            'url_key': function(newVal, oldVal) {
                if(this.autoFill){
                    this.$emit('listenToUrlKey',newVal);
                }
            },

        },
        methods : {

        }
    }
    export default {i18n,...App};
</script>
