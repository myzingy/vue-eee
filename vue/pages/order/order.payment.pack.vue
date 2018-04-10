<style lang="stylus" rel="stylesheet/scss">
    .deduct{
        color: #F56C6C;
        &:before{
            content: "/";
        }
    }
    .actual{
        color: #67C23A;
    }
    .bg-warning {
        background-color: #e6a23c;
    }
    .demo-color-box {
        border-radius: 4px;
        padding: 2px 20px;
        box-sizing: border-box;
        color: #fff;
    }
</style>
<template>
    <div class="form-read">
        <h4>
            {{$t('支付信息')}}
            <el-tag type="danger" v-if="order.hasIssue" style="margin-left: 100px;">{{$t('该订单需要联系客户')}}</el-tag>
        </h4>
        <el-form label-position="left" inline class="demo-table-expand"
                 style=" margin-left:50px">
            <el-form-item :label="$t('订单总金额')" v-if="$router.power('seePrice')">
                <i class="info">
                    {{moneyFormat(order.subtotal,order.currency_code)}}
                </i>
            </el-form-item>
            <el-form-item :label="$t('支付状态')">
                <i class="info">
                    {{$t('order.payment.'+order.payment_status)}}
                </i>
            </el-form-item>
            <el-form-item :label="$t('支付方式')">
                <i class="info">
                    {{order.payment_method}}
                </i>
            </el-form-item>
            <el-form-item :label="$t('优惠券')" v-if="$router.power('seePrice')">
                <i class="info">
                    {{order.coupon_code}}
                    <b class="deduct">{{moneyFormat(order.discount_amount,order.currency_code)}} </b>
                </i>
            </el-form-item>
            <el-form-item :label="$t('支付金额')" v-if="$router.power('seePrice')">
                <i class="info">
                    <b class="actual">{{moneyFormat(order.grand_total,order.currency_code)}}</b>
                </i>
            </el-form-item>
            <el-form-item :label="$t('运费')" v-if="$router.power('seePrice')">
                <i class="info">
                    {{moneyFormat(order.shipping_amount,order.currency_code)}}
                    <b class="deduct">{{moneyFormat(order.od_shipping_discount_amount,order.currency_code)}}</b>
                </i>
            </el-form-item>
            <el-form-item :label="$t('积分抵扣')" v-if="$router.power('seePrice')">
                <i class="info">
                    {{order.aw_reward_points}}
                    <b class="deduct">{{moneyFormat(order.aw_reward_points_amount,order.currency_code)}}</b>
                </i>
            </el-form-item>
            <el-form-item :label="$t('礼品卡')" v-if="$router.power('seePrice')">
                <i class="info">
                    {{giftCards(order.gift_cards)}}
                    <b class="deduct">{{moneyFormat(order.gift_card_amount,order.currency_code)}}</b>
                </i>
            </el-form-item>
            <el-form-item :label="$t('已退金额')" v-if="$router.power('seePrice')">
                <i class="info">
                    <b class="demo-color-box bg-warning">{{moneyFormat(order.refund_total,order.currency_code)}}</b>
                </i>
            </el-form-item>
        </el-form>
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
            ...vk,
            giftCards(jsonstr){
                let card='';
                try{
                    let json=JSON.parse(jsonstr);
                    let keys=Object.keys(json);
                    card=keys[0];
                }catch (e){}
                return card;
            }
        }
    }
    export default {i18n,...App}
</script>