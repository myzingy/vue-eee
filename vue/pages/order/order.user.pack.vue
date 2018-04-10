<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div class="form-read">
        <h4>
            {{$t('客户信息')}}
            <el-tag type="danger" v-if="order.hasIssue" style="margin-left: 100px;">{{$t('该订单需要联系客户')}}</el-tag>
        </h4>
        <el-form label-position="left" inline class="demo-table-expand"
                 style=" margin-left:50px" v-if="order.address">
            <el-form-item :label="$t('客户姓名')">
                <i class="info">{{ order.address.firstname || '' }}
                    {{ order.address.lastname?order.address.lastname:'' }}</i>
            </el-form-item>
            <el-form-item :label="$t('客户邮箱')">
                <i class="info">{{ order.address.email }}</i>
            </el-form-item>
            <el-form-item :label="$t('是否注册')">
                <i class="info">{{ order.customer_id>0?'Yes':'No' }}</i>
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
            
        }
    }
    export default {i18n,...App}
</script>