<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div>
        <el-table
                :data="order.refund"
                border
                style="width: 90%;">
            <el-table-column
                    :label="$t('原因')"
                    width="150"
            >
                <template slot-scope="props">
                    <span>{{$t('order.issue.'+props.row.refund_tags)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('描述')"
                    width="300"
            >
                <template slot-scope="props">
                    <div v-html="props.row.refund_info"></div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="total"
                    :label="$t('金额')"
                    width="150"
            >
            </el-table-column>
            <el-table-column
                    :label="$t('申请人')"
                    width="80"
            >
                <template slot-scope="scope">
                    {{getNicks(scope.row.report_uid)}}
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('状态')"
                    width="100"
            >
                <template slot-scope="scope">
                    {{$t('order.refund_status.'+scope.row.refund_status)}}
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('处理人')"
                    width="80"
            >
                <template slot-scope="scope">
                    {{getNicks(scope.row.solved_uid)}}
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('操作')"
                    width="120"
            >
                <template slot-scope="scope">
                    <template v-if="opcStatus">
                        <el-dropdown @command="operationCommand" trigger="click"
                                     v-if="scope.row.refund_status==2">
                                    <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(ss,si) in opcStatus">
                                    <el-dropdown-item :command="{status:ss,index:scope.$index}">
                                        {{$t('order.refund_status.'+ss)}}
                                    </el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template v-else="">
                        <el-dropdown @command="operationCommand" trigger="click"
                                     v-if="scope.row.refund_status!=2
                                     && scope.row.refund_status!=3
                                     && scope.row.refund_status!=7">
                                <span class="el-dropdown-link">
                                {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(ss,si) in [0,1,2,4,5,7]">
                                    <el-dropdown-item :command="{status:ss,index:scope.$index}">
                                        {{$t('order.refund_status.'+ss)}}
                                    </el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import order_data from '../common/order_data'
    var App= {
        props:['order','opcStatus'],
        components:{
            
        },
        data () {
            return {
                nicks:{},
            };
        },
        mounted(){
            let conf=vk.getCache(uri.getConf)['data'];
            this.nicks =conf.nicks;
        },
        methods: {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.setRefundStatus.code:
                        this.$emit('setRefundStatusAfter');
                        break;
                }
            },
            operationCommand(command){
                console.log(command);
                vk.http(uri.setRefundStatus,{
                    refund_id:this.order.refund[command.index].id,
                    status:command.status,
                },this.then);
            },
            getNicks(uid){
                return this.nicks[uid]||uid;
            },
        }
    }
    export default {i18n,...App}
</script>