<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div class="form-read">

        <h4>{{$t('发货记录')}}</h4>
        <div style="margin-left: 50px;">
            <el-table
                    :data="formatData"
                    border
                    style="width:99%; max-height: 300px; overflow-y: auto;">
                <el-table-column
                        prop="uid"
                        label="User"
                        width="150"
                >
                    <template slot-scope="props">
                        {{props.row.nickname}}({{props.row.uid}})
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sku"
                        label="Date"
                        width="180"
                >
                    <template slot-scope="props">
                        <span v-date="[,props.row.created_at]"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="Todo"
                        width="150"
                >
                    <template slot-scope="props">
                        {{$t('order.history.'+props.row.operation)}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="Info"
                >
                    <template slot-scope="scope">
                        <span>{{operationInfo(scope.row.operation_info)}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
        computed: {
            formatData: function () {
                let data = [];
                console.log('this.order.histories',this.order.histories);
                if(this.order.histories){
                    this.order.histories.forEach((item)=>{
                        if(item.type==218){
                            data.push(item);
                        }
                    });
                }
                return data;
            }
        },
        mounted(){

        },
        methods: {

            formatDate(tpl,timespace){
                return vk.date(tpl,timespace);
            },
            operationInfo(html){
                return html.replace(/<[^>]+>/g,'');
            }
        }
    }
    export default {i18n,...App}
</script>