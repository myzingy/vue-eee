<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div style="display: inline-block; margin-left: 10px;" v-if="order.status!='shipped'
                   && order.status!='cancelled'
                   && order.status!='transferring'
                   && order.status!='return_completed'
                    && order.status!='return_process'">
        <el-button type="info" @click="getUpdateAddressUrl('show')">{{$t('查看修改地址链接')}}</el-button>
        <el-button type="primary" @click="getUpdateAddressUrl('mail')">{{$t('发送修改地址邮件')}}</el-button>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    var App= {
        props:['order'],
        components:{
            
        },
        data () {
            return {
            };
        },
        mounted(){

        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.getUpdateAddressUrl.code:
                        this.$emit('updateAddressUrl',json.update_address_url);
                        break;
                }
            },
            getUpdateAddressUrl(act='show'){
                let data={
                    id:this.order.id,
                    site_id:this.order.site_id,
                    act:act
                };
                if(act=='mail'){
                    let that=this;
                    vk.confirm(i18n.t('发送修改地址邮件？'),function(){
                        vk.http(uri.getUpdateAddressUrl,data,that.then);
                    })
                    return;
                }
                vk.http(uri.getUpdateAddressUrl,data,this.then);
            },

        }
    }
    export default {i18n,...App}
</script>