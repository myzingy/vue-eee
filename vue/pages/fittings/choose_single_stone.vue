<template>
    <div>
        <el-dialog :title="$t('选择宝石')" append-to-body @close="closeDialog" :visible.sync="dialogVisible">
            <el-col :span="24" style="height:100%;">
                <div style="padding: 10px;">
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
                        <el-form-item :label="$t('色系')" prop="color">
                            <el-select v-model="searchArgs.color" clearable @change="onSearch" :placeholder="$t('请选择')">
                                <el-option
                                        v-for="(item, index) in stoneAttributes.color"
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
                    <el-table :data="fittingsList" border style="width: 100%" >
                        <el-table-column prop="serial_id" :label="$t('编号')"></el-table-column>
                        <el-table-column prop="pic" :label="$t('图片')">
                            <template slot-scope="scope">
                                <img width="60px" :src="scope.row.file && scope.row.file.path ? scope.row.file.path : ''" @click="showImageView($event)" class="image" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="specifications" :label="$t('规格')"> </el-table-column>
                        <el-table-column prop="shape" :label="$t('形状')">
                            <template slot-scope="scope">{{stoneAttributes.shape[scope.row.shape]}}</template>
                        </el-table-column>
                        <el-table-column prop="cutting" :label="$t('切割')"> </el-table-column>
                        <el-table-column prop="color" :label="$t('色系')">
                            <template slot-scope="scope">{{stoneAttributes.color[scope.row.color]}}</template>
                        </el-table-column>
                        <el-table-column prop="material" :label="$t('材质')">
                            <template slot-scope="scope">{{stoneAttributes.material[scope.row.material]}}</template>
                        </el-table-column>
                        <el-table-column prop="weight" :label="$t('克拉')"> </el-table-column>
                        <el-table-column prop="brand" :label="$t('品牌')">
                            <template slot-scope="scope">{{stoneAttributes.brand[scope.row.brand]}}</template>
                        </el-table-column>
                        <el-table-column width="150px" prop="num" :label="$t('数量')">
                            <template slot-scope="scope">
                                <el-input-number size="mini" v-model="scope.row.num"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="brand" :label="$t('操作')">
                            <template slot-scope="scope">
                                <el-button @click="selectStone(scope.row)" round>{{$t('选择')}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <div style="clear: both;"></div>
        </el-dialog>
        <!-- img view-->
        <image_view :url="previewImage.url" :appendToBody="true" :width="previewImage.width" :dialogVisible="previewImage.show" @closeImagePreview="closeImagePreview"></image_view>
    </div>

</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import image_view from '../common/image_view.vue';
    let App ={
        props: ['dialogStoneVisible'],
        components:{
            image_view
        },
        data() {
            return {
                fittingsList: [],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                fittingsAttributes:{},
                dialogVisible:false,
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {
            stoneAttributes:function(){
                return this.fittingsAttributes.stone ? this.fittingsAttributes.stone : {};
            }
        },
        mounted(){
            vk.http(uri.fittingsAttributes,{},this.then);
            this.getLists();
        },
        watch:{
            'dialogStoneVisible':function(newVal,oldVal){
                this.dialogVisible = newVal;
            }
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.fittingsList.code:
                        this.fittingsList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.fittingsAttributes.code:
                        this.fittingsAttributes = json.data;
                        break;
                }
            },
            selectStone(row){
                if(row.num <= 0){
                    this.$message(i18n.t('请填写数量'));
                    return;
                }
                this.$emit('listenFittingsSelect',row);
            },
            onSearch(){
                this.getLists();
            },
            getLists(){
                vk.http(uri.fittingsList,{searchArgs:this.searchArgs,with:'file',page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },

            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getLists();
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getLists();
            },
            closeDialog(){
                this.$emit('listenFittingsClose');
            }
        }
    }
    export default {i18n,...App};
</script>
