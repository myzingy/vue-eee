<template>
    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="4" :offset="20">

                </el-col>
            </el-row>

            <div>
                <!-- 录入物流编号-->
                <el-form :inline="true" :model="createForm" class="demo-form-inline">
                    <el-form-item :label="$t('物流单号')">
                        <el-input v-model="createForm.old_track_no" @keyup.enter.native="onSearch" :placeholder="$t('物流单号')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="createFormBtn()">{{$t('录入')}}</el-button>
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
                <!-- 列表 -->
                <el-table :data="returnList" border style="width: 100%" @selection-change="checkReturnItem">
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column prop="old_track_no" :label="$t('退回单号')"></el-table-column>

                    <el-table-column prop="order.increment_id" :label="$t('订单号')"> </el-table-column>
                    <el-table-column prop="order.shipping_track_no" :label="$t('现单号')"></el-table-column>
                    <el-table-column prop="status" :label="$t('状态')">
                        <template slot-scope="scope">{{returnAttributes.statusOptions[scope.row.status]}}</template>
                    </el-table-column>
                    <el-table-column prop="contact_status" :label="$t('联系客户状态')">
                        <template slot-scope="scope">{{returnAttributes.contactStatusOptions[scope.row.contact_status]}}</template>
                    </el-table-column>
                    <el-table-column prop="user.nickname" :label="$t('录入人')"></el-table-column>
                    <el-table-column prop="created_at" :formatter="moment" :label="$t('录入时间')"></el-table-column>
                    <el-table-column prop="order.address.email" :label="$t('客户邮箱')"></el-table-column>
                    <el-table-column prop="contactedUser.username" :label="$t('联系客户')"></el-table-column>
                    <el-table-column prop="contacted_at" :formatter="moment" :label="$t('联系时间')"></el-table-column>
                    <el-table-column prop="verifyUser.username" :label="$t('核实人')"> </el-table-column>
                    <el-table-column prop="verify_at" :formatter="moment" :label="$t('核实时间')"> </el-table-column>
                    <el-table-column prop="printUser.username" :label="$t('打单人')"> </el-table-column>
                    <el-table-column prop="print_at" :formatter="moment" :label="$t('打单时间')"> </el-table-column>
                    <el-table-column prop="shippedUser.username" :label="$t('发货人')"> </el-table-column>
                    <el-table-column prop="shipped_at" :formatter="moment" :label="$t('发货时间')"> </el-table-column>
                    <el-table-column prop="original_track_no" :label="$t('原始运单号')"> </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown @click="handleItemClick(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('查看')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="scope.row.status=='pending'" @click.native="verifyStatus(scope.row)">{{$t('已核实')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.status=='pending' && scope.row.contact_status=='pending'" @click.native="contactedStatus(scope.row)">{{$t('已联系客户')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.status=='wait_for_transfer'" @click.native="printStatus(scope.row)">{{$t('打印面单')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.status=='in_transit'" @click.native="shipStatus(scope.row)">{{$t('发货')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.status!='shipped'" @click.native="cancelStatus(scope.row)">{{$t('取消')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
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
    import image_view from '../common/image_view.vue';
    let App ={
        components:{
            image_view
        },
        data() {
            return {
                returnList: [],
                searchArgs:{},
                createForm:{old_track_no:''},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                returnAttributes:{},
                multipleSelection:[],
                dialogFormVisible: false,
                updateReturnArgs:{
                    type : 'create',
                    id : null,
                    title:i18n.t('添加配件')
                },
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {

        },
        mounted(){
            uri.embOrderReturnAttributes.timeout = 0;
            vk.http(uri.embOrderReturnAttributes,{},this.then);
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.embOrderReturnIndex.code:
                        this.returnList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.embOrderReturnCreate.code:
                    case uri.embOrderReturnContacted.code:
                    case uri.embOrderReturnPrint.code:
                    case uri.embOrderReturnCancel.code:
                    case uri.embOrderReturnShip.code:
                    case uri.embOrderReturnVerify.code:
                        this.getLists();
                        break;
                    case uri.embOrderReturnAttributes.code:
                        this.returnAttributes = json.data;
                        this.getLists();
                        break;
                }
            },
            onSearch(){
              this.getLists();
            },
            createFormBtn(){
                vk.http(uri.embOrderReturnCreate,this.createForm,this.then);
            },
            getLists(){

                vk.http(uri.embOrderReturnIndex,{searchArgs:this.searchArgs,with:['order.address','user','verifyUser','contactedUser','printUser','shippedUser'],page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            checkReturnItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },

            verifyStatus(row){
                let that = this;
                this.confirmBox(function(){
                    vk.http(uri.embOrderReturnVerify,{id:row.id},that.then);
                });
            },
            contactedStatus(row){
                let that = this;
                this.confirmBox(function(){
                    vk.http(uri.embOrderReturnContacted,{id:row.id},that.then);
                });
            },
            printStatus(row){
                let that = this;
                this.confirmBox(function(){
                    vk.http(uri.embOrderReturnPrint,{id:row.id},that.then);
                });
            },
            shipStatus(row){
                let that = this;
                this.confirmBox(function(){
                    vk.http(uri.embOrderReturnShip,{id:row.id},that.then);
                });
            },
            cancelStatus(row){
                let that = this;
                this.confirmBox(function(){
                    vk.http(uri.embOrderReturnCancel,{id:row.id},that.then);
                });
            },
            confirmBox(callback){
                this.$confirm(i18n.t('确定要此操作吗?'), i18n.t('提示'), {
                    confirmButtonText: i18n.t('确定'),
                    cancelButtonText: i18n.t('取消'),
                    type: 'warning'
                }).then(callback);
            },
            receiveSaveReturn(){
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
            }
        }
    }
    export default {i18n,...App};
</script>
