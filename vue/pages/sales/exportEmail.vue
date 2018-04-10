<template>
    <v-layout>
        <div slot="main">
            <div v-if="aloading">
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">

                    <el-form-item :label="$t('下单时间')" prop="accept_at">
                        <el-date-picker
                                v-model="searchArgs.created_at"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                </el-form>
            </div>

            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">
                        <el-button-group>
                            <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>
        </div>
    </v-layout>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    let App ={
        components:{
        },
        data() {
            return {
                aloading:false,
                searchArgs:{},
            }
        },
        computed: {

        },
        mounted(){
            this.aloading = true;
        },
        methods : {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.exportEmail.code:
                        if(json.url)
                            window.open(json.url);
                        break;
                }
            },
            exportExcel(){
                vk.http(uri.exportEmail,{searchArgs:this.searchArgs},this.then);
            },
        }
    }
    export default {i18n,...App};
</script>
