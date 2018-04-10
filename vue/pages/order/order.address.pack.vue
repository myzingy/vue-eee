<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div class="form-read">
        <h4>
            {{$t('收货地址')}}
            <el-tag type="danger" v-if="order.hasIssue" style="margin-left: 100px;">{{$t('该订单需要联系客户')}}</el-tag>
        </h4>
        <el-form label-position="left" inline class="demo-table-expand"
                 style=" margin-left:50px" v-if="order.address">
            <el-form-item :label="$t('姓名')">
                <i class="info">
                    {{order.address.firstname}}
                    {{order.address.middlename||''}}
                    {{order.address.lastname||''}}</i>
            </el-form-item>
            <el-form-item :label="$t('电话')">
                <i class="info">{{ order.address.telephone }}</i>
            </el-form-item>
            <el-form-item :label="$t('邮箱')">
                <i class="info">{{order.address.email}}</i>
            </el-form-item>
            <el-form-item :label="$t('国家')">
                <i class="info">{{order.address.country_id}}</i>
            </el-form-item>
            <el-form-item :label="$t('省市')">
                <i class="info">{{order.address.region}} {{order.address.city}}</i>
            </el-form-item>
            <el-form-item :label="$t('街道')">
                <i class="info">{{order.address.street}}</i>
            </el-form-item>
            <el-form-item :label="$t('邮编')">
                <i class="info">{{order.address.postcode}}</i>
            </el-form-item>
            <div v-if="$router.power('updateOrder') || $router.power('updateOrder.address')">
                <addressFormPack :order="order" @openCommentDialog="openCommentDialog"></addressFormPack>
                <addressEmailPack :order="order" @updateAddressUrl="updateAddressUrl"></addressEmailPack>
                <el-button type="success" @click="manualSendMail()">{{$t('发送订单修改确认邮件')}}</el-button>
            </div>
            <el-alert
                    v-if="update_address_url"
                    :title="update_address_url"
                    type="success"
                    :closable="false">
            </el-alert>
        </el-form>

    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import addressFormPack from './order.address.form.pack.vue'
    import addressEmailPack from './order.address.email.pack.vue'
    var App= {
        props:['order'],
        components:{
            addressFormPack,addressEmailPack
        },
        data () {
            return {
                update_address_url:""
            };
        },
        mounted(){

        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.manualSendMail.code:
                        vk.toast('Successful','success');
                        break;
                }

            },
            updateAddressUrl(url){
                this.update_address_url=url;
            },
            manualSendMail(){
                let data={
                    id:this.order.id,
                    site_id:this.order.site_id,
                };
                let that=this;
                vk.confirm(i18n.t('发送订单修改确认邮件'),function(){
                    vk.http(uri.manualSendMail,data,that.then);
                })
            },
            openCommentDialog(act,params){
                this.$emit('openCommentDialog',act,params);
            },
        }
    }
    export default {i18n,...App}
</script>