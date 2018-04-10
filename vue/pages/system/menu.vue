<style>

</style>
<template>
    <v-layout>
        <div slot="main">
            <div >
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                    <el-table-column
                            fixed
                            prop="date"
                            :label="$t('日期')"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            :label="$t('姓名')"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="province"
                            :label="$t('省份')"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="city"
                            :label="$t('市区')"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            :label="$t('地址')"
                            width="300">
                    </el-table-column>
                    <el-table-column
                            prop="zip"
                            :label="$t('邮编')"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            :label="$t('操作')"
                            width="100">
                        <template slot-scope="scope" >
                            <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('查看')}}</el-button>
                            <el-button type="text" size="small">{{$t('编辑')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'

    var App= {

        data () {
            return {
                tableData:[]
            };
        },
        mounted(){
            //vk.http(uri.getNavList,{},this.then);
        },
        methods: {
            then(json,code){
                this.nav=json.data;
            },
        }
    }
    export default {i18n,...App}
</script>