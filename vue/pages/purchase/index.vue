<template>

    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">
                        <el-button-group>
                            <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                            <!--<el-button @click="printTags()">{{$t('批量打印')}}</el-button>-->
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>

            <div >
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('生产编号')">
                        <el-input v-model="searchArgs.serial_id" @keyup.enter.native="onSearch" :placeholder="$t('serial_id')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('订单编号')">
                        <el-input v-model="searchArgs.ext_order_id" @keyup.enter.native="onSearch" :placeholder="$t('ext_order_id')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('订单号')">
                        <el-input v-model="searchArgs.increment_id" @keyup.enter.native="onSearch" :placeholder="$t('increment_id')"></el-input>
                    </el-form-item>
                    <el-form-item label="sku">
                        <el-input v-model="searchArgs.sku" @keyup.enter.native="onSearch" placeholder="SKU"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('类型')" prop="type">
                        <el-select v-model="searchArgs.type" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in purchaseConfigs.typeOptions"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('状态')" prop="status">
                        <el-select v-model="searchArgs.status" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in purchaseConfigs.statusOptions"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('是否导出')" prop="is_output">
                        <el-select v-model="searchArgs.is_output" clearable @change="onSearch" :placeholder="$t('请选择')">
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
                <!-- 生产列表 -->
                <el-table :data="purchaseList" border style="width: 100%" @selection-change="checkPurchaseItem">
                    <el-table-column type="selection" prop="id" width="40"></el-table-column>
                    <el-table-column prop="serial_id" :label="$t('采购编号')" width="120px">
                        <template slot-scope="scope">
                            {{getSerialNo(scope.row.serial_id)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="order.ext_order_id" :label="$t('订单编号')"  width="100px"></el-table-column>
                    <el-table-column prop="order.increment_id" :label="$t('订单号')"  width="100px"></el-table-column>
                    <el-table-column prop="spu" :label="$t('SPU')"  width="100px">
                        <template slot-scope="scope">
                            {{sxu(scope.row.sku).spu}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sku" label="SKU">
                        <template slot-scope="scope">
                            <a :href="scope.row.product.oneTemplate ? scope.row.product.oneTemplate.purchase_url : ''" >{{scope.row.sku}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" :label="$t('采购数量')">
                        <template slot-scope="scope">
                            <span :style="{color:scope.row.amount>1 ? 'red':''}">{{ scope.row.amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" :label="$t('成本价')"></el-table-column>
                    <el-table-column prop="accept_num" :label="$t('验收数量')"></el-table-column>
                    <el-table-column prop="pics" :label="$t('图片')">
                        <template slot-scope="scope">
                            <img width="100%" :src="getMainImage(scope.row.product.picMap)" @click="showImageView($event)" class="image" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" :label="$t('类型')">
                        <template slot-scope="scope">{{purchaseConfigs.typeOptions[scope.row.type]}}</template>
                    </el-table-column>
                    <el-table-column prop="status" :label="$t('状态')">
                        <template slot-scope="scope">
                            {{purchaseConfigs.statusOptions[scope.row.status]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="extra_data" :label="$t('属性')">
                        <template slot-scope="scope">
                            <span v-show="skuSize(scope.row.sku)">{{ $t('尺码')+':'+skuSize(scope.row.sku)}}</span>
                            <span v-if="scope.row.has_engravings==1">刻字：{{scope.row.has_engravings==1 ? scope.row.extra_data.info.engravings :''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="has_engravings" :label="$t('是否刻字')">
                        <template slot-scope="scope">
                            <span :style="{color:scope.row.has_engravings==1 ? 'red':''}">{{scope.row.has_engravings ==1 ? $t('是'):$t('否')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="size_type" :label="$t('尺码类型')">
                        <template slot-scope="scope">
                            <span>{{$t('product.detail.'+scope.row.orderItem.size_type)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brand" :label="$t('product.product.brand')">
                        <template slot-scope="scope">
                            {{scope.row.product.brand}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80">
                        <template slot-scope="props">
                            <orderCommentPack v-if="props.row.type=='stock'" :target="{id:props.row.id}" type="stock_produce"></orderCommentPack>
                            <orderCommentPack v-if="props.row.type=='order' && props.row.order" :target="props.row.order" type="order"></orderCommentPack>
                        </template>
                    </el-table-column>
                    <el-table-column prop="change_confirm" :label="$t('变更确认')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.change_confirm==1" type="danger"><i class="el-icon-time"></i>{{$t('待确认')}}</el-tag>
                            <span v-else-if="scope.row.change_confirm==2">{{$t('已确认')}}</span>
                            <span v-else>{{$t('否')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" :formatter="date" :label="$t('创建时间')"> </el-table-column>
                    <el-table-column prop="updated_at" :formatter="date" :label="$t('更新时间')"> </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown @click="handleItemClick(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="currentRow.id=scope.row.id;dialogDetailVisible=true">{{$t('详情')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="openProgress(scope.row)">{{$t('开始采购')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="openCommentDialog(scope.row,'222')">{{$t('备注')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="printTag(scope.row)">{{$t('打印标签')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.change_confirm==1" @click.native="needConfirm(scope.row,'change_confirm')">{{$t('确认变更')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="updatePurchaseArgs.title" :visible.sync="dialogFormVisible">
                <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
                    <el-form-item :label="$t('应采数量')" prop="amount">
                        {{form.amount}}
                    </el-form-item>
                    <el-form-item label="成本价（总价）" prop="price">
                        <el-input-number v-model="form.price"></el-input-number>
                    </el-form-item>
                    <el-form-item v-show="!showOnlyPriceBox" :label="$t('实际采购数量')" prop="accept_num">
                        <el-input-number v-model="form.accept_num"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="acceptProduce">{{$t('保存')}}</el-button>
                        <el-button @click="dialogFormVisible=false">{{$t('取消')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('步骤')" :visible.sync="progressVisible">
                <el-steps :active="progress.stepStatus" finish-status="success">
                    <el-step v-for="(item, index) in progress.map" :title="item" :key="index"></el-step>
                </el-steps>
                <el-button style="margin-top: 12px;" v-if="!progressComplete" @click="setProgress">{{progress.map[progress.stepStatus]}}</el-button>
            </el-dialog>
            <!--详情-->
            <el-dialog :title="$t('详情')" :visible.sync="dialogDetailVisible">
                <detail :id="currentRow.id" :options="purchaseConfigs" ></detail>
            </el-dialog>
            <!-- 备注 -->
            <el-dialog :visible.sync="outerCommonDialogVisible"
                       :fullscreen="false"
                       :modal="true"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
            >
                <comment ref="comment" :form="{}" :params="{}" @commentSaveAfter="commentSaveAfter"></comment>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="outerDialogSave"
                               type="primary">
                        {{$t('保 存')}}
                    </el-button>
                    <el-button @click="outerCommonDialogVisible = false">{{$t('关 闭')}}</el-button>
                </div>
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
    import comment from '../common/comment.vue'
    import orderCommentPack from '../common/comment.but-list.vue'
    import image_view from '../common/image_view.vue';
    import lodop from '../common/lodop/print.label';
    import detail from './detail.vue';
    let App ={
        components:{
            comment,
            orderCommentPack,
            image_view,
            detail,
        },
        data() {
            return {
                purchaseList: [],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                form:{
                    id:0,
                    price:0,
                },
                currentRow:{id:0},
                purchaseConfigs:{},
                multipleSelection:[],
                dialogFormVisible: false,
                progressVisible:false,
                dialogDetailVisible: false,
                updatePurchaseArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('编辑')
                },
                progress:{
                    selectRow:{},
                    stepStatus:0,
                    map:['等待采购','开始采购','采购完成'],
                    action:['wait','in_purchase','complete']
                },
                formRules: {
                    price: [
                        { validator: this.checkPrice, trigger: 'blur' }
                    ],
                    accept_num: [
                        { validator: this.checkAcceptSum, trigger: 'blur' }
                    ],

                },
                showOnlyPriceBox:false,
                outerCommonDialogVisible:false,
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {
            progressComplete:function(){
                return this.progress.stepStatus >= 3;
            },
        },
        mounted(){
            lodop.init();
            vk.http(uri.purchaseConfigs,{},this.then);
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
                    case uri.purchaseList.code:
                        this.purchaseList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.purchaseConfigs.code:
                        this.purchaseConfigs = json.data;
                        break;
                    case uri.purchaseSetConfirm.code:
                        this.dialogFormVisible = false;
                        this.getLists();
                        break;
                    case uri.purchaseSet.code:
                        this.progress.stepStatus ++;
                        this.dialogFormVisible = false;
                        this.getLists();
                        break;
                    case uri.purchaseExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;

                }
            },
            onSearch(){
                this.getLists();
            },
            getLists(){

                vk.http(uri.purchaseList,{searchArgs:this.searchArgs,with:['product.picMap.image','product.oneTemplate','order','orderItem','storeHouse','operateLogs'],sort:'created_at desc',page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkPurchaseItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            exportExcel(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.purchaseExport,{ids:this.multipleSelection,with:['product.picMap.image','product.oneTemplate','order','storeHouse','operateLogs']},this.then);
            },
            openProgress(row){
                this.progressVisible = true;
                this.progress.selectRow = row;
                switch (row.status){
                    case 'wait':
                        this.progress.stepStatus = 1;
                        break;
                    case 'in_purchase':
                        this.progress.stepStatus = 2;
                        break;
                    case 'complete':
                        this.progress.stepStatus = 3;
                        break;
                    default:
                        this.progress.stepStatus = 4;
                }
            },
            setProgress(){
                let row = this.progress.selectRow;
                let step = this.progress.stepStatus;
                if(this.progress.action[step]=='complete'){
                    this.showOnlyPriceBox = false;
                    this.openAccept(row);
                    return ;
                }else if(this.progress.action[step]=='in_purchase'){
                    this.showOnlyPriceBox = true;
                    this.openAccept(row);
                    return ;
                }
                vk.http(uri.purchaseSet,{status:this.progress.action[step],price:this.form.price,id:row.id},this.then);

            },
            openAccept(row){
                this.form = row;
                this.dialogFormVisible = true;
            },
            checkPrice(rule, value, callback){
                if (!this.showOnlyPriceBox && value <= 0 ) {
                    callback(new Error(i18n.t('价格必须大于0')));
                } else {
                    callback();
                }

            },
            checkAcceptSum(rule, value, callback){
                if (!this.showOnlyPriceBox && value < this.form.amount ) {
                    callback(new Error(i18n.t('验收数目必须大于等于')+this.form.amount));
                } else {
                    callback();
                }

            },
            acceptProduce(){
                let that = this;
                let status = this.progress.action[this.progress.stepStatus];
                this.$refs['form'].validate(function(valid){
                    if (valid) {
                        vk.http(uri.purchaseSet,{status:status,price:that.form.price,accept_num:that.form.accept_num,id:that.form.id},that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            needConfirm(row,type){
                let msg ;
                if(type=='change_confirm'){
                    msg = '确认变更吗？<br/>';
                    for(let i in row.productAttrDiff){
                        if(typeof row.productAttrDiff[i].new =='string'){
                            msg += i18n.t('product.user_set.'+i)+':'+' [新]'+row.productAttrDiff[i].new+'  [旧]'+row.productAttrDiff[i].old+'<br/>'
                        }else{
                            for(let j in row.productAttrDiff[i]){
                                if(isNaN(i)){
                                    msg += i18n.t('product.user_set.'+i)+'['+j+']:'+' [新]'+row.productAttrDiff[i][j].new+'  [旧]'+row.productAttrDiff[i][j].old+'<br/>'
                                }else{
                                    msg += i18n.t('product.user_set.'+j)+':'+' [新]'+row.productAttrDiff[i][j].new+'  [旧]'+row.productAttrDiff[i][j].old+'<br/>'
                                }

                            }
                        }
                    }
                }else{
                    msg = i18n.t('确认要加急吗？');
                }
                this.confirm(msg,()=>{
                    vk.http(uri.purchaseSetConfirm,{id:row.id,type:type},this.then);
                });
            },
            openCommentDialog(row, cateStr){

                if(row){
                    this.operationData=row;
                }
                this.outerCommonDialogVisible=true;
                this.cateStr=cateStr;
                var that=this;
                setTimeout(function(){
                    that.$refs.comment.initPage(cateStr,cateStr>1000);
                },0);
            },
            outerDialogSave(){

                let type = this.operationData.type=='stock' ? 'stock_produce':'order';
                let target_id = this.operationData.type=='stock' ? this.operationData.id : this.operationData.order_id;
                this.$refs.comment.commentSave({
                    type:type,
                    target_id:target_id,
                    item:this.operationData,
                    code:this.cateStr,
                });
            },
            commentSaveAfter(obj){

                if(this.outerDialogVisible){
                    this.$refs.orderInfoPack.initPage();
                }
                this.outerCommonDialogVisible=false;
            },
            receiveSavePurchase(){
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
            getSerialNo(id){
                return 'P'+id;
            },
            printTags(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                let selectRows = this.purchaseList.filter(t => this.multipleSelection.includes(t.id))

                for (var i in selectRows){
                    this.printTag(selectRows[i]);
                }

            },
            printTag(row){
                if(!row.sku || !row.id){
                    this.$message('不存在sku/生产编号');
                    return;
                }
                let number = this.getSerialNo(row.serial_id);
                let pp = this.sxu(row.sku);
                if(number && pp && pp.spu){
                    let size = this.skuSize(row.sku);
                    lodop.printLabel(pp.spu,size?this.skuSize(row.sku,true):'',number);
                }


            }
        }
    }
    export default {i18n,...App};
</script>
