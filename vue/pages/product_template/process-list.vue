<template>

    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="12" :offset="12">
                    <div class="grid-content bg-purple">
                        <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                        <el-button-group>
                            <el-button type="primary" @click="pauseTemplate('factoryPause')">
                                {{$t('暂停开版')}}</el-button>
                            <el-button type="primary" @click="pauseTemplate('studioPause')">
                                {{$t('暂停渲染')}}</el-button>
                            <el-button type="primary" @click="pauseTemplate('factoryCancelPause')">
                                {{$t('恢复开版')}}</el-button>
                            <el-button type="primary" @click="pauseTemplate('studioCancelPause')">
                                {{$t('恢复渲染')}}</el-button>
                            <el-button type="primary" @click="createTemplate">
                                {{$t('添加选品')}}</el-button>
                            <el-button type="primary" @click="confirmTemplate">
                                {{$t('确认发起')}}</el-button>
                            <el-button type="primary" @click="endTemplate">
                                {{$t('流程结束')}}</el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('版号')">
                        <el-input v-model="searchArgs.template_no" @keyup.enter.native="onSearch" :placeholder="$t('版号')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('类型')" prop="category">
                        <el-select v-model="searchArgs.category" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in templateConfigs.category"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('状态')" prop="status">
                        <el-select v-model="searchArgs.status" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in templateConfigs.statusOptions"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('暂停开版')" prop="pause_factory">
                        <el-select v-model="searchArgs.pause_factory" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in ['否','是']"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item :label="$t('暂停渲染')" prop="pause_studio">
                        <el-select v-model="searchArgs.pause_studio" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in ['否','是']"
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
                <el-table :data="templateList" border style="width: 100%" @selection-change="checkTemplateItem">
                    <el-table-column type="selection" prop="id" width="40"></el-table-column>
                    <el-table-column prop="ext_id" :label="$t('开版编号')"></el-table-column>
                    <el-table-column prop="sku" :label="$t('选品编号')"></el-table-column>
                    <el-table-column prop="template_no" :label="$t('版号')"> </el-table-column>
                    <el-table-column prop="pause_factory" :label="$t('暂停开版')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.pause_factory==1" type="danger">暂停</el-tag>
                            <el-tag v-else type="success">否</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pause_studio" :label="$t('暂停渲染')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.pause_studio==1" type="danger">暂停</el-tag>
                            <el-tag v-else type="success">否</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fids" :label="$t('图片')">
                        <template slot-scope="scope">
                            <img width="100%" :src="scope.row.files.length>0 ? scope.row.files[0].path : ''" @click="showImageView($event)" class="image" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" :label="$t('状态')">
                        <template slot-scope="scope">
                            {{templateConfigs.statusOptions[scope.row.status]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="template_type" :label="$t('类别')">
                        <template slot-scope="scope">
                            {{templateConfigs.template_type[scope.row.template_type]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="category" :label="$t('分类')">
                        <template slot-scope="scope">
                            {{templateConfigs.category[scope.row.category]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_original" :formatter="yesNo" :label="$t('是否原创')"></el-table-column>
                    <el-table-column prop="electroplating_color" :label="$t('电镀颜色')">
                        <template slot-scope="scope">
                            {{templateConfigs.plating_color[scope.row.electroplating_color]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="expedited" :label="$t('加急')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.expedited==1" type="danger"><i class="el-icon-time"></i>{{$t('加急')}}</el-tag>
                            <span v-else>{{$t('否')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="chosenUser.username" :label="$t('选品人')"></el-table-column>
                    <el-table-column prop="factory_start_at" :formatter="date" :label="$t('开版')"> </el-table-column>
                    <el-table-column prop="factory_end_at" :formatter="date" :label="$t('开版完成')"> </el-table-column>
                    <el-table-column prop="factory_accepted_at" :formatter="date" :label="$t('工厂验收')"> </el-table-column>
                    <el-table-column prop="finished_at" :formatter="date" :label="$t('流程完成')"> </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown @click="handleItemClick(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="editTemplate(scope.row)">{{$t('编辑')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="expeditedTemplate(scope.row)">{{$t('加急')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="cancelTemplate(scope.row)">{{$t('取消')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="deleteTemplate(scope.row)">{{$t('删除')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updateTemplateArgs.title" :visible.sync="dialogFormVisible">
                <dataForm ref="dataForm" v-bind:updateTemplateArgs="updateTemplateArgs" @listenToSaveTemplate="receiveSaveTemplate" @closeForm = "dialogFormVisible = false"></dataForm>
            </el-dialog>
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
    let App ={
        components:{
            dataForm:dataForm,
            image_view
        },
        data() {
            return {
                templateList: [],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                templateConfigs:{},
                multipleSelection:[],
                dialogFormVisible: false,
                updateTemplateArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加选品')
                },
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {
        },
        mounted(){
            vk.http(uri.productTemplateConfigs,{},this.then);
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
                    case uri.productTemplateList.code:
                        this.templateList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.productTemplateDelete.code:
                    case uri.productTemplateCancel.code:
                    case uri.productTemplateExpedited.code:
                        this.getLists();
                        break;
                    case uri.productTemplateConfigs.code:
                        this.templateConfigs = json.data;
                        break;
                    case uri.productTemplateSetProgress.code:
                        this.getLists();
                        break;
                    case uri.productTemplateExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;
                }
            },
            onSearch(){
                this.getLists();
            },
            getLists(){
                this.searchArgs = Object.assign(this.searchArgs,{list_type:'process_list'});
                vk.http(uri.productTemplateList,{searchArgs:this.searchArgs,with:['files','chosenUser'],page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkTemplateItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            createTemplate(){
                this.dialogFormVisible = true
                this.updateTemplateArgs = {
                    id : null,
                    type : 'create',
                    title: i18n.t('添加选品')
                };

            },
            editTemplate(row){
                this.dialogFormVisible = true
                this.updateTemplateArgs = {
                    id : row.id,
                    type : 'update',
                    title: i18n.t('更新选品')
                };
            },
            expeditedTemplate(row){
                let that = this;
                this.$confirm(i18n.t('是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(() => {
                    vk.http(uri.productTemplateExpedited,{id:row.id},that.then);
                });
            },
            deleteTemplate(row){
                let that = this;
                this.$confirm(i18n.t('此操作将永久删除该条目, 是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(() => {
                    vk.http(uri.productTemplateDelete,{id:row.id},that.then);
                });
            },
            cancelTemplate(row){
                let that = this;
                this.$confirm(i18n.t('此操作将取消该条目, 是否继续?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(() => {
                    vk.http(uri.productTemplateCancel,{id:row.id},that.then);
                });
            },
            confirmTemplate(){
                if(this.multipleSelection.length<1){
                    this.$message(i18n.t('请选择相应的条目'));
                    return false;
                }
                vk.http(uri.productTemplateSetProgress,{type:'approval',ids:this.multipleSelection},this.then);
            },
            pauseTemplate(type){
                if(this.multipleSelection.length<1){
                    this.$message(i18n.t('请选择相应的条目'));
                    return false;
                }
                vk.http(uri.productTemplateSetProgress,{type:type,ids:this.multipleSelection},this.then);
            },
            endTemplate(){
                if(this.multipleSelection.length<1){
                    this.$message(i18n.t('请选择相应的条目'));
                    return false;
                }
                vk.http(uri.productTemplateSetProgress,{type:'finished',ids:this.multipleSelection},this.then);
            },
            exportExcel(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.productTemplateExport,{ids:this.multipleSelection,with:['files','factory']},this.then);
            },
            receiveSaveTemplate(){
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
            date: function (row, column) {
                return vk.date('YYYY-MM-DD HH:II',row[column.property]);
            },
            yesNo: function (row, column) {
                return row[column.property]==1 ? i18n.t('是'):i18n.t('否');
            },
        }
    }
    export default {i18n,...App};
</script>
