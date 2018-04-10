<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div class="form-read">
        <h4>{{$t('物流信息')}}</h4>
        <el-form label-position="left" inline class="demo-table-expand"
                 style=" margin-left:50px">
            <el-form-item :label="$t('发货时间')">
                <i class="info" v-if="order.shipped_at"
                   v-date="['YYYY-MM-DD HH:II',order.shipped_at]">
                </i>
                <i v-else="">{{$t('未发货')}}</i>
            </el-form-item>
            <el-form-item :label="$t('物流')">
                <i class="info">
                    <v-pen :value="order.shipping_method"
                           :params="{key:'shipping_method',row:order}"
                           @change="updatePen"
                           v-if="checkItemPen('shipping_method',order) && ($router.power('updateOrder') || $router.power('updateOrder.shipment'))"
                           :selectObj="shipping_method">

                    </v-pen>
                    <i v-else="">{{order.shipping_method}}</i>
                </i>
            </el-form-item>
            <el-form-item :label="$t('物流单号')">
                <i class="info">

                    <v-pen :value="order.shipping_track_no"
                           :params="{key:'shipping_track_no',row:order}"
                           @change="updatePen"
                           v-if="checkItemPen('shipping_track_no',order) && ($router.power('updateOrder') || $router.power('updateOrder.shipment'))">

                    </v-pen>
                    <i v-else="">{{order.shipping_track_no}}</i>
                    <!--
                    {{order.shipping_track_no}}
                    -->
                </i>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import Vue from 'vue'
    import i18n from '../../local'
    import vk from '../../vk'
    import uri from '../../uri'
    var App= {
        props:['order','noPen'],
        components:{
            
        },
        data () {
            return {
                shipping_method:{},
            };
        },
        mounted(){
            let shipments=vk.getCache(uri.getConf)['data'].shipments;
            this.shipping_method=shipments;
        },
        methods: {
            checkItemPen(key,row){
                if(this.noPen || row.status=='shipped'
                    || row.status=='cancelled'
                    || row.status=='transferring'
                    || row.status=='return_completed'
                    || row.status=='return_process') return false;
                return true;
            },
            updatePen(val,params){
                console.log(val,params);
                var that=this;
                params.row.newVal=val;
                if('shipping_method'==params.key){
                    that.$emit('openCommentDialog',216,params);
                };
                if('shipping_track_no'==params.key){
                    that.$emit('openCommentDialog',217,params);
                };
            },
        }
    }
    export default {i18n,...App}
</script>