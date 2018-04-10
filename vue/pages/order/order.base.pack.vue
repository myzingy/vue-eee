<style lang="stylus" rel="stylesheet/scss">
    
</style>
<template>
    <div class="form-read">
        <h4>
            {{$t('订单信息')}}
            <el-tag type="danger" v-if="order.hasIssue" style="margin-left: 100px;">{{$t('该订单需要联系客户')}}</el-tag>
        </h4>
        <el-form label-position="left" inline class="demo-table-expand"
                 style=" margin-left:50px">
            <el-form-item :label="$t('订单编号')">
                <i class="info">{{order.ext_order_id}}</i>
            </el-form-item>
            <el-form-item :label="$t('订单号')">
                <i class="info">{{ order.increment_id }}</i>
            </el-form-item>
            <el-form-item :label="$t('加急')">
                <i class="info">
                    <el-tag type="success" v-if="order.expedited==2">{{$t('加急')}}</el-tag>
                    <el-tag type="danger" v-if="order.expedited==1">{{$t('加急')}}</el-tag>
                </i>
            </el-form-item>
            <el-form-item :label="$t('类型')">
                <i class="info">
                    {{$t('order.type.'+order.order_type)}}
                </i>
            </el-form-item>
            <el-form-item :label="$t('创建时间')">
                <i class="info" v-date="['YYYY-MM-DD HH:II',order.created_at]"></i>
            </el-form-item>
            <el-form-item :label="$t('订单状态')">
                <i class="info">
                    <el-tag type="danger" v-if="order.approved!=1">
                        {{$t('待审核')}}
                    </el-tag>
                    {{$t('order.status.'+order.status)}}
                </i>
            </el-form-item>
            <el-form-item :label="$t('跟踪状态')">
                <i class="info">
                    <el-tag type="danger" v-if="order.approved!=1">
                        {{$t('待审核')}}
                    </el-tag>
                    {{$t('order.status.'+order.last_track_status)}}
                </i>
            </el-form-item>
            <el-form-item :label="$t('待定')">
                <i class="info">
                    <el-tag type="danger" v-if="order.paused > 0">
                        {{order.paused == 1?$t('地址'):$t('产品')}}
                    </el-tag>
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

            formatDate(tpl,timespace){
                return vk.date(tpl,timespace);
            },

        }
    }
    export default {i18n,...App}
</script>