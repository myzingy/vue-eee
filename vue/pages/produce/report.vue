<template>

    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">

                    </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">

                    <el-form-item :label="$t('下单时间')" prop="date">
                        <el-date-picker
                                v-model="searchArgs.date"
                                type="datetimerange"
                                @change="onSearch"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item v-show="showFactoryInfo" :label="$t('工厂')" prop="factory_id">
                        <el-select v-model="searchArgs.factory_id" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in factoryProduceConfigs.factories"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>

                <!-- 生产列表 -->
                <el-table :show-header="false" height="680" :data="reportList" ref="multipleTable" border style="width: 100%" @selection-change="checkFactoryProduceItem">
                    <!--<el-table-column type="selection" prop="id" width="40"></el-table-column>-->
                    <el-table-column prop="name" :label="$t('ID')" width="100"></el-table-column>
                    <el-table-column prop="total" :label="$t('生产编号')" width="120px"></el-table-column>

                </el-table>
            </div>


        </div>
    </v-layout>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import moment from 'moment'
    let App ={
        components:{

        },
        data() {
            return {
                reportList: [],
                searchArgs:{},
                multipleSelection:[],
                factoryProduceConfigs:{},

            }
        },
        computed: {
            showFactoryInfo:function(){
                return this.factoryProduceConfigs.factories && Object.keys(this.factoryProduceConfigs.factories).length > 1;
            }
        },
        mounted(){
            vk.http(uri.factoryProduceConfigs,{},this.then);
            this.getLists();

        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.factoryProduceReportList.code:
                        this.reportList = [
                            {name:'定制款下单',total:json.data.count.order},
                            {name:'库存款下单',total:json.data.count.stock},
                            {name:'定制款验收',total:json.data.accept.order},
                            {name:'库存款验收',total:json.data.accept.stock},
                            ];
                        break;
                    case uri.factoryProduceConfigs.code:
                        this.factoryProduceConfigs =json.data;
                        break;
                }
            },
            onSearch(){
                this.getLists();
            },
            getLists(){
                vk.http(uri.factoryProduceReportList,{searchArgs:this.searchArgs},this.then);
            },

            checkFactoryProduceItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },

        }
    }
    export default {i18n,...App};
</script>
