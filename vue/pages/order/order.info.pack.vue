<style lang="stylus" rel="stylesheet/scss">
    .form-read .info{
        .el-tag{
            height:auto;
            line-height: normal;
        }
    }
</style>
<template>
    <div>
        <orderBasePack :order="orderInfo"></orderBasePack>
        <orderPaymentPack :order="orderInfo"></orderPaymentPack>
        <orderUserPack :order="orderInfo"></orderUserPack>
        <orderItemsPack style="margin-left: 50px;" :order="orderInfo"
                        @openCommentDialog="openCommentDialog" :noPen="!$router.power('updateOrder')"></orderItemsPack>
        <orderAddressPack :order="orderInfo" ref="orderAddressPack" @openCommentDialog="openCommentDialog"></orderAddressPack>
        <orderShipmentPack :order="orderInfo" @openCommentDialog="openCommentDialog"></orderShipmentPack>
        <orderHistoryPack :order="orderInfo"></orderHistoryPack>
        <orderShipmentAllPack :order="orderInfo"></orderShipmentAllPack>
        <div class="form-read">
            <h4>{{$t('包装')}}</h4>
            <div style="margin-left: 50px;">
                <el-tag v-for="(pack,i) in orderInfo.package" style="margin-right: 5px;">{{pack}}</el-tag>
            </div>
        </div>
        <orderRemarkPack :order="orderInfo" @openCommentDialog="openCommentDialog"></orderRemarkPack>
        <DialogOrderComment
                :order="orderInfo"
                ref="DialogOrderComment"
                @commentSaveAfter="commentSaveAfter"></DialogOrderComment>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import orderBasePack from './order.base.pack.vue'
    import orderPaymentPack from './order.payment.pack.vue'
    import orderItemsPack from './order.items.pack.vue'
    import orderHistoryPack from './order.history.pack.vue'
    import orderRemarkPack from './order.remark.pack.vue'
    import orderShipmentAllPack from  './order.shipment.all.pack.vue'
    import orderShipmentPack from  './order.shipment.pack.vue'
    import orderUserPack from './order.user.pack.vue'
    import orderAddressPack from './order.address.pack.vue'
    import DialogOrderComment from './common/order.comment.dialog.vue';
    var App= {
        props:['order'],
        components:{
            orderBasePack,
            orderPaymentPack,
            orderItemsPack,
            orderHistoryPack,
            orderShipmentAllPack,
            orderRemarkPack,
            orderUserPack,
            orderAddressPack,
            orderShipmentPack,
            DialogOrderComment,
        },
        data () {
            return {
                orderInfo:{},
            };
        },
        mounted(){

        },
        methods: {
            getData(){
                Object.assign(this.orderInfo,this.order);
                vk.http(uri.getOrderInfo,{id:this.order.order_id || this.order.id},this.then)
            },
            initPage(){
                this.getData();
                this.$refs.orderAddressPack.updateAddressUrl('');
            },
            then(json,code){
                this.orderInfo=json.data;
            },
            openCommentDialog(cateStr,params={}){
                var that=this;
                setTimeout(function(){
                    that.$refs.DialogOrderComment.openCommentDialog(cateStr,params);
                },0);
            },
            commentSaveAfter(obj){
                this.getData();
            },
        }
    }
    export default {i18n,...App}
</script>