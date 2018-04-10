<template>

    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">
                        <el-button-group>
                            <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>

            <div >
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('sku')">
                        <el-input v-model="searchArgs.sku" @keyup.enter.native="onSearch" :placeholder="$t('SKU')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('类型')" prop="type">
                        <el-select v-model="searchArgs.type" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in factoryProduceConfigs.typeOptions"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('生产时间')" prop="produce_time">
                        <el-select v-model="searchArgs.produce_time" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in produceTimeRange"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('交货时间')" prop="accept_at">
                        <el-date-picker
                                v-model="searchArgs.accept_at"
                                type="datetimerange"
                                @change="onSearch"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                </el-form>
                <!-- 分页 -->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="slot, sizes, prev, pager, next, jumper"
                        :total="page.total"
                        slot="page.total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:page.total})}}</span>
                    </template>
                </el-pagination>
                <!-- 生产列表 -->
                <el-table :data="produceRecordList" border style="width: 100%" @selection-change="checkFactoryProduceItem">
                    <el-table-column type="selection" prop="id" width="40"></el-table-column>
                    <el-table-column prop="produce.serial_id" :label="$t('生产编号')">
                        <template slot-scope="scope">
                            {{getSerialNo(scope.row.produce.serial_id)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="produce.sku" :label="$t('SKU')"></el-table-column>
                    <el-table-column prop="produce.amount" :label="$t('生产数量')"></el-table-column>
                    <!--<el-table-column prop="request_num" :label="$t('请求验收数量')"></el-table-column>-->
                    <el-table-column prop="accept_num" :label="$t('已验收数量')"></el-table-column>
                    <el-table-column v-if="showPrice" prop="produce.price" :label="$t('单价')"></el-table-column>

                    <el-table-column v-if="showPrice" prop="produce.price" :label="$t('总价')">
                        <template slot-scope="scope">
                            {{scope.row.produce.price * scope.row.accept_num}}
                        </template>
                    </el-table-column>

                    <!--<el-table-column prop="produce.out_key" :label="$t('out_key')"> </el-table-column>-->
                    <!--<el-table-column prop="produce.order_id" :label="$t('order id')"> </el-table-column>-->
                    <el-table-column prop="produce.pics" :label="$t('图片')">
                        <template slot-scope="scope">
                            <img width="100%" :src="getMainImage(scope.row.produce.product.picMap)" @click="showImageView($event)" class="image" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="produce.type" :label="$t('类型')">

                        <template slot-scope="scope">{{factoryProduceConfigs.typeOptions[scope.row.produce.type]}}</template>
                    </el-table-column>

                    <el-table-column v-if="showFactoryInfo" prop="produce.factory_id" :label="$t('工厂')">
                        <template slot-scope="scope">
                            {{scope.row.produce.factory.name}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="produce.has_engravings" :label="$t('是否刻字')">
                        <template slot-scope="scope">
                            {{scope.row.produce.has_engravings ==1 ? '是':'否'}}
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="paused" label="暂停">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-tag v-if="scope.row.paused==1" type="danger"><i class="el-icon-time"></i>暂停</el-tag>-->
                            <!--<span v-else>否</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->

                    <el-table-column prop="produce.expedited" :label="$t('加急')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.produce.expedited==1" type="danger"><i class="el-icon-time"></i>{{$t('待确认')}}</el-tag>
                            <el-tag v-else-if="scope.row.produce.expedited==2" type="danger"><i class="el-icon-time"></i>{{$t('已加急')}}</el-tag>
                            <span v-else>{{$t('否')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="start_at" :formatter="dateFormat" :label="$t('开始时间')"></el-table-column>
                    <el-table-column prop="accept_at" :formatter="dateFormat" :label="$t('交货时间')"> </el-table-column>
                    <!--<el-table-column prop="accept_at" :formatter="dateFormat" :label="$t('验收时间')"> </el-table-column>-->
                    <el-table-column prop="created_at" :label="$t('生产时间')">
                        <template slot-scope="scope">
                            {{dateDiff(scope.row.start_at,scope.row.accept_at)}}
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <!-- img view-->
            <image_view :url="previewImage.url" :width="previewImage.width" :dialogVisible="previewImage.show" @closeImagePreview="closeImagePreview"></image_view>
        </div>
    </v-layout>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import moment from 'moment'
    import comment from '../common/comment.vue'
    import orderCommentPack from '../common/comment.but-list.vue'
    import image_view from '../common/image_view.vue';
    import countdown from '../common/countdown.vue';
    let App ={
        components:{
            comment,
            orderCommentPack,
            image_view,
            countdown,
        },
        data() {
            return {
                produceRecordList: [],
                searchArgs:{},
                produceTimeRange:{
                    86400 : '大于一天',
                },
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                factoryProduceConfigs:{},
                multipleSelection:[],
                outerCommonDialogVisible:false,
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {
            progressComplete:function(){
                return this.progress.stepStatus >= 3;
            },
            showFactoryInfo:function(){
                return this.factoryProduceConfigs.factories && Object.keys(this.factoryProduceConfigs.factories).length > 1;
            },
            showPrice:function(){
                return this.$router.power('column.show_price')
            }
        },
        mounted(){
            vk.http(uri.factoryProduceConfigs,{},this.then);
            this.getLists();
            this.initProduceTimeRange();
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.factoryProduceRecordList.code:
                        this.produceRecordList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.factoryProduceConfigs.code:
                        this.factoryProduceConfigs = json.data;
                        break;
                    case uri.factoryProduceRecordExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;

                }
            },
            onSearch(){
                this.getLists();
            },
            getLists(){
                vk.http(uri.factoryProduceRecordList,{searchArgs:this.searchArgs,with:['produce.product.picMap.image','produce.factory','produce.order','produce.operateLogs'],sort:'t.created_at desc',page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            exportExcel(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.factoryProduceRecordExport,{ids:this.multipleSelection,with:['produce.product.picMap.image','produce.factory','produce.order','produce.operateLogs']},this.then);
            },
            checkFactoryProduceItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getLists();
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getLists();
            },
            dateFormat: function (row, column) {
                if(!parseInt(row[column.property])) return '';
                return vk.date('YYYY-MM-DD HH:II',row[column.property]);
            },
            dateDiff:function(date1,date2){
                moment.locale('zh-cn');
                if(!parseInt(date1) || !parseInt(date2)) return '';
                return moment(date1*1000).to(moment(date2*1000))
            },
            yesNo: function (row, column) {
                return row[column.property]==1 ? '是':'否';
            },
            getSerialNo(id){
                return 'F'+id;
            },
            initProduceTimeRange:function(){

                for(let i=1;i<31;i++){
                    this.produceTimeRange[i*86400] = '大于'+i+'天';
                }
            }
        }
    }
    export default {i18n,...App};
</script>
