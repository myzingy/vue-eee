<template>
    <div>
        <el-input readonly v-model="url_key" :controls=false></el-input>
        <el-checkbox v-show="checkOpen" v-model="autoFill">{{$t('product.product.auto_rule')}}</el-checkbox>
    </div>

</template>

<script>
    import i18n from '../../../../local'
    import vk from '../../../../vk.js'
    import uri from '../../../../uri.js'
    let App ={
        props: ['name','spu','category_id','type','has_url_key'],
        data() {
            return {
                autoFill:true,
                copyUrlKey:'',
            }
        },
        computed: {
            url_key:function(){
                if(this.has_url_key) return this.has_url_key;
                if(this.autoFill){
                    let lastCate = this.category_id && this.category_id.length>0 ? this.category_id[this.category_id.length-1] : 0;
                    this.copyUrlKey = 'Product-'+this.name.split(' ').join('_') + '-cid' + lastCate + '-' + this.spu;
                    return this.copyUrlKey;
                }
                return this.copyUrlKey;
            },
            checkOpen:function(){
                return false;
//                return this.type == 'update';
            }
        },
        mounted(){

        },
        watch:{

            'type':function(newVal){
                if(newVal=='create'){
                    this.autoFill = true;
                }else{
                    this.autoFill = false;
                }
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
