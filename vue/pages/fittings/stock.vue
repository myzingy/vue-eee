<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">
                    <div class="grid-content bg-purple">
                        <!--<el-button>{{$t('导出')}}</el-button>-->
                </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('编号')">
                        <el-input v-model="searchArgs.serial_id" @keyup.enter.native="onSearch" :placeholder="$t('编号')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('形状')" prop="shape">
                        <el-select v-model="searchArgs.shape" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.shape"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('颜色')" prop="color">
                        <el-select v-model="searchArgs.color" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.color"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('色系')" prop="mg_color">
                        <el-select v-model="searchArgs.mg_color" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.mg_color"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('材质')" prop="material">
                        <el-select v-model="searchArgs.material" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.material"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('品牌')" prop="brand">
                        <el-select v-model="searchArgs.brand" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in stoneAttributes.brand"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
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
                <!-- 配件列表 -->
                <el-table :data="fittingsStockList" border style="width: 100%" @selection-change="checkFittingsItem">
                    <el-table-column type="selection" prop="sid" width="55"></el-table-column>
                    <el-table-column prop="serial_id" :label="$t('编号')"></el-table-column>
                    <el-table-column prop="pic" :label="$t('图片')">
                        <template slot-scope="scope">
                            <img width="100%" :src="scope.row.path && scope.row.path ? scope.row.path : ''" @click="showImageView($event)" class="image" />
                        </template>

                    </el-table-column>
                    <el-table-column prop="specifications" :label="$t('规格(mm)')"> </el-table-column>
                    <el-table-column prop="shape" :label="$t('形状')">
                        <template slot-scope="scope">{{stoneAttributes.shape[scope.row.shape]}}</template>
                    </el-table-column>
                    <el-table-column prop="cutting" :label="$t('切割')">
                        <template slot-scope="scope">{{stoneAttributes.cutting[scope.row.cutting]}}</template>
                    </el-table-column>
                    <el-table-column prop="color" :label="$t('颜色')">
                        <template slot-scope="scope">{{stoneAttributes.color[scope.row.color]}}</template>
                    </el-table-column>
                    <el-table-column prop="color" :label="$t('色系')">
                        <template slot-scope="scope">{{stoneAttributes.mg_color[scope.row.mg_color]}}</template>
                    </el-table-column>
                    <el-table-column prop="material" :label="$t('材质')">
                        <template slot-scope="scope">{{stoneAttributes.material[scope.row.material]}}</template>
                    </el-table-column>
                    <el-table-column prop="weight" :label="$t('重量(g)')"> </el-table-column>
                    <el-table-column prop="carat_weight" :label="$t('克拉(ct)')"> </el-table-column>
                    <el-table-column prop="brand" :label="$t('品牌')">
                        <template slot-scope="scope">{{stoneAttributes.brand[scope.row.brand]}}</template>
                    </el-table-column>
                    <el-table-column v-if="showFactoryInfo" prop="factory" :label="$t('工厂')">
                        <template slot-scope="scope">
                            {{scope.row.factory ? scope.row.factory.name : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" :label="$t('库存')">
                        <template slot-scope="scope">
                            <stock_popover :factoryList="factoryList" :factory_id="scope.row.factory_id" :fittings_id="scope.row.fittings_id"
                                           :amount="scope.row.amount" @change="updateStock"></stock_popover>

                        </template>
                    </el-table-column>
                    <!--<el-table-column fixed="right" :label="$t('操作')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-dropdown @click="handleItemClick(scope.row,'info')">-->
                                <!--<span class="el-dropdown-link">-->
                                    <!--{{$t('查看')}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                                  <!--</span>-->
                                <!--<el-dropdown-menu slot="dropdown">-->
                                    <!--&lt;!&ndash;<el-dropdown-item @click.native="editFittingsStock(scope.row)">{{$t('编辑库存')}}</el-dropdown-item>&ndash;&gt;-->
                                <!--</el-dropdown-menu>-->
                            <!--</el-dropdown>-->
                        <!--</template>-->

                    <!--</el-table-column>-->
                </el-table>
            </div>

            <!-- form -->
            <!-- img view-->
            <image_view :url="previewImage.url" :width="previewImage.width" :dialogVisible="previewImage.show" @closeImagePreview="closeImagePreview"></image_view>
        </div>
    </v-layout>

</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import dataForm from './form.vue';
    import image_view from '../common/image_view.vue';
    import stock_popover from './stock_popover.vue';
    let App ={
        components:{
            dataForm:dataForm,
            image_view,
            stock_popover,
        },
        data() {
            return {
                fittingsStockList: [],
                factoryList:[],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                fittingsAttributes:{},
                multipleSelection:[],
                dialogFormVisible: false,
                updateFittingsArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加配件')
                },
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {
            stoneAttributes:function(){
                return this.fittingsAttributes.stone ? this.fittingsAttributes.stone : {};
            },
            showFactoryInfo:function(){
                return this.factoryList && this.factoryList.length > 1;
            }
        },
        mounted(){
            uri.fittingsAttributes.timeout = 0;
            uri.factoryList.timeout = 0;
            vk.http(uri.fittingsAttributes,{},this.then);
            vk.http(uri.factoryList,{},this.then);

        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.fittingsStockList.code:
                        this.fittingsStockList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.fittingsAttributes.code:
                        this.fittingsAttributes = json.data;
                        this.getLists();
                        break;
                    case uri.factoryList.code:
                        this.factoryList = json.list;
                        break;
                    case uri.fittingsStockUpdate.code:
                        this.getLists();
                        break;
                }
            },
            onSearch(){
              this.getLists();
            },
            getLists(){
                uri.fittingsStockList.timeout = 0;
                vk.http(uri.fittingsStockList,{select:'fittings.id as fittings_id,fittings.serial_id,fittings.specifications,fittings.shape,' +
                'fittings.cutting,fittings.color,fittings.mg_color,fittings.material,fittings.weight,fittings.carat_weight,fittings.brand,t.factory_id,t.id,t.amount,file_manager.path',searchArgs:this.searchArgs,with:['fittings','factory'],page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkFittingsItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },

            editFittingsStock(row){

            },
            receiveSaveFittings(){
                this.dialogFormVisible = false;
                this.getLists();
            },
            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getLists();
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getLists();
            },
            updateStock(factory_id,fittings_id,amount){

                vk.confirm(i18n.t('正在修改库存数量，确认修改吗'),t => {

                    let form = {factory_id:factory_id,fittings_id:fittings_id,amount:amount }
                    vk.http(uri.fittingsStockUpdate,form,this.then);
                });

            },
        }
    }
    export default {i18n,...App};
</script>
