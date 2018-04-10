<style lang="stylus" rel="stylesheet/scss">
    .deduct{
        color: #F56C6C;
    }
    .actual{
        color: #67C23A;
    }
    .orderGrid{
        .el-table td{
            vertical-align: top;
            div.box{
                width: 80px;
                height: 80px;
                padding: 0;
                margin: 0;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                }

            }
        }
    }
    .highlight-color{
        font-size: 14px;
        color:#F56C6C;
        *{
            font-size: 14px;
            color:#F56C6C;
        }
    }
</style>
<template>
    <div class="orderGrid">
        <el-table
                :data="itemData"
                border
                style="width: 99%;">
            <el-table-column
                    :label="$t('图片')"
                    width="90"
            >
                <template slot-scope="props">
                    <div class="box">
                        <v-img :src="itemThumb(props.row)"></v-img>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="product_id"
                    :label="$t('产品编号')"
                    width="90"
            >
            </el-table-column>
            <el-table-column
                    prop="spu"
                    label="SPU"
                    width="100"
            >
                <template slot-scope="props">
                    <div v-if="checkItemPen('spu',props.row) && !create">
                        <v-pen :value="sxu(props.row.sku).spu" :params="{key:'spu',row:props.row}"
                               @change="updatePen" ></v-pen>
                        <el-button type="danger" @click="deleteItem(props.row)" v-if="!create">
                            {{$t('取消商品')}}
                        </el-button>
                    </div>
                    <div v-else="">{{sxu(props.row.sku).spu}}</div>
                </template>
            </el-table-column>
            <!--
            <el-table-column
                    prop="sku"
                    label="SKU"
                    width="120"
            >
            </el-table-column>
            -->
            <el-table-column
                    prop="item_status"
                    :label="$t('状态')"
                    width="80"
                    v-if="!create"
            >
                <template slot-scope="scope">
                    {{$t('order.status.'+scope.row.item_status)}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="item_type"
                    :label="$t('类型')"
                    width="80"
                    v-if="!create"
            >
                <template slot-scope="scope">
                    {{$t('order.type.'+scope.row.item_type)}}
                    <div v-if="scope.row.size_type!='none'">({{scope.row.size_type}})</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="size_original"
                    :label="$t('尺码')"
                    width="200"
            >
                <template slot-scope="props" >
                    <div v-if="create" class="highlight-color">{{props.row.size_original}}</div>
                    <v-pen v-else="" :value="getSizeOriginal(props.row)"
                           :params="{key:'size_original',row:props.row}"
                           @change="updatePen"
                           class="highlight-color"
                           :isPen="checkItemPen('size_original',props.row)"
                           :selectObj="size_original_all[props.row.prod_cate_id]" ></v-pen>
                </template>
            </el-table-column>
            <el-table-column
                    prop="qty_ordered"
                    :label="$t('数量')"
                    width="50"
            >
                <template slot-scope="props">
                    <v-pen :value="props.row.qty_ordered" :params="{key:'qty_ordered',row:props.row}"
                           class="highlight-color"
                           @change="updatePen" v-if="checkItemPen('qty_ordered',props.row) && !create"></v-pen>
                    <div v-else="create" class="highlight-color">
                        {{props.row.qty_ordered}}
                    </div>
                    <div v-else="" class="highlight-color">
                        {{props.row.item_type!='stock'?
                        (props.row.qty_delivery+'/'+props.row.qty_ordered)
                        :props.row.qty_ordered}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="base_price"
                    :label="$t('价格')"
                    width="80"
                    v-if="!noPen "
            >
                <template slot-scope="props">
                    <div  v-if="create">
                        {{moneyFormat(props.row.price,order.currency_code)}}
                    </div>
                    <div v-else="">
                        <div v-if="props.row.suit_id==0">
                            <b class="actual">{{deductPrice(props.row.price)}}</b>
                            <br>{{moneyFormat(props.row.price,order.currency_code)}}
                        </div>
                        <div v-else="">
                            {{$t('套装单品')}}<br>
                            <b class="actual">{{deductPrice(props.row.price)}}</b>
                            <br>{{moneyFormat(props.row.price,order.currency_code)}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="engravings"
                    :label="$t('刻字')"
                    
            >
                <template slot-scope="props">
                    <div  v-if="create" class="highlight-color">
                        {{props.row.engravings}}
                    </div>
                    <product_user_data v-else=""
                        :user_data="productAttr(props.row.product_options,'this')"
                        :isPen="checkItemPen('qty_ordered',props.row)"
                        :item="props.row"
                        @openCommentDialog="openCommentDialog"
                                       class="highlight-color"
                    ></product_user_data>
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('已导出')"
                    width="60"
                    v-if="showExportField"

            >
                <template slot-scope="props">
                    {{props.row.is_exported==0?'No':'Yes'}}
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('库存')"
                    width="60"
                    v-if="showStockField"

            >
                <template slot-scope="props" v-if="props.row.stock">
                    {{props.row.stock.stock_quantity}} ({{props.row.stock.restock_quantity}})
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('操作')"
                    width="120" fixed="right"
                v-if="distributionOpc"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.item_status!='waiting_shipped'
                               && scope.row.item_status!='shipped'
                               && scope.row.item_status!='cancelled'
                                && scope.row.item_status!='return_completed'">
                        <el-button type="primary"
                                   @click="completeDistribution(scope.row)">
                            {{$t('完成配货')}}
                        </el-button>
                        <orderItemDefectiveButton :item="scope.row"></orderItemDefectiveButton>
                    </div>

                    <el-tag type="success" v-else="">{{$t('贴码+完成配货')}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('操作')"
                    fixed="right"
                    v-if="create"
            >
                <template slot-scope="scope">
                    <el-button type="primary"
                               @click="removeLocalItem(scope.$index)"
                    >
                        {{$t('删除')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button size="mini" type="primary" @click="openPackDialog"
                   v-if="checkEditor()">
            {{$t('添加商品')}}
        </el-button>
        <el-dialog :title="$t('编辑信息')" :visible.sync="packDialogVisible"
                   :close-on-click-modal="true"
                   :close-on-press-escape="true"
                   :modal-append-to-body="false"
                   :append-to-body="true"
                   :modal="true"
        >
            <div class="form-read">
                <el-form label-width="80px" inline
                         :model="itemForm" ref="itemForm" :rules="itemFormRules">
                    <el-form-item :label="$t('SPU')" prop="spu">
                        <el-autocomplete
                                class="inline-input"
                                v-model="itemForm.spu"
                                :fetch-suggestions="querySearch"
                                placeholder="input SPU"
                                :trigger-on-focus="false"
                                @select="handleSelect"
                                @keyup.native="handleSelectBlur"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item :label="$t('尺寸')" prop="size_original" v-if="size_original_all[top_id]">
                        <el-select v-model="itemForm.size_original" placeholder="Select" >
                            <el-option
                                    v-for="(label, key) in size_original_all[top_id]"
                                    :key="key"
                                    :label="$t(label)"
                                    :value="key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('数量')">
                        <el-input-number v-model="itemForm.qty_ordered" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item :label="$t('单价')">
                        <el-input-number v-model="itemForm.base_price" :min="0" :max="9999"></el-input-number>
                    </el-form-item>
                    <el-form-item :label="$t('刻字')">
                        <el-input v-model="itemForm.engravings"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="packDialogSave"
                           type="primary">
                    {{$t('保 存')}}
                </el-button>
                <el-button @click="packDialogVisible = false">{{$t('关 闭')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import order_data from '../common/order_data'
    import product_user_data from '../common/product_user_data.vue';
    import orderItemDefectiveButton from './common/order.item.defective.button.vue';
    let itemForm={
        order_id:"",
        spu:"",
        size_original:"",
        qty_ordered:1,
        base_price:0,
        engravings:''
    };
    var App= {
        props:['order','noPen','distributionOpc','create','filterHidden','showExportField','showStockField'],
        components:{
            product_user_data,
            orderItemDefectiveButton,
        },
        data () {
            return {
                size_original_all:order_data.size_original_all,
                packDialogVisible:false,
                itemForm:JSON.parse(JSON.stringify(itemForm)),
                itemFormRules:{
                    spu:[
                        { required: true, trigger: 'blur' },
                        { validator: order_data.validateSPU, message: 'SPU Non-existent ', trigger: 'blur' },
                    ]
                },
                restaurants:[],
                items:[],
                top_id:0,
                itemFormSpu:"",
            };
        },
        computed: {
            itemData:function(){
                let data=[];
                if(this.order.items){
                    this.order.items.forEach((item)=>{
                        if(!this.isHiddenItem(item)){
                            data.push(item);
                        }
                    });
                }
                return data;
            }
        },
        mounted(){
            this.loadAll();
        },
        methods: {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.acceptancePassed.code:
                        this.$emit('acceptancePassedAfter');
                        break;
                }
            },
            updatePen(val,params){
                console.log(val,params);
                var that=this;
//                if('qty_ordered'==params.key && val>params.row.qty_ordered){
//                    vk.alert(i18n.t("不允许大于下单数量"));
//                    return;
//                }
                vk.confirm(i18n.t('修改订单信息可能会发生仓库变更，确认修改吗'),function(){
                    params.row.newVal=val;
                    if('spu'==params.key){
                        that.$emit('openCommentDialog',200,params);
                    };
                    if('size_original'==params.key){
                        that.$emit('openCommentDialog',201,params);
                    };
                    if('qty_ordered'==params.key){
                        that.$emit('openCommentDialog',202,params);
                    };
                    if('engravings'==params.key || 'more'==params.key){
                        that.$emit('openCommentDialog',204,params);
                    };
                });

            },
            openPackDialog(){
                this.packDialogVisible=true;
                this.itemForm=JSON.parse(JSON.stringify(itemForm));
            },
            packDialogSave() {
                this.$refs.itemForm.validate((valid) => {
                    if (valid) {
                        if(this.create){
                            let item={};
                            if(this.size_original_all[this.top_id] && this.itemForm.size_original==""){
                                vk.alert(i18n.t('请填写尺寸'));
                                return false;
                            }
                            Object.assign(item,this.itemForm);
                            item.sku=vk.sxu(item.spu,item.size_original).sku;
                            this.order.items.push(item);
                            this.packDialogVisible=false;
                            return true;
                        }
                        this.itemForm.order_id=this.order.id;
                        this.itemForm.ext_order_id=this.order.ext_order_id;
                        this.itemForm.increment_id=this.order.increment_id;
                        this.$emit('openCommentDialog',302,{row:this.itemForm});
                        this.packDialogVisible=false;
                    } else {
                        return false;
                    }
                });
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    restaurant.value=restaurant.spu;
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
                };
            },
            handleSelect(item) {
                this.itemForm.size_original="";
                this.itemForm.product_id= item.id;
                this.top_id=item.top_id;
            },
            handleSelectBlur(){
                if(this.itemFormSpu!=this.itemForm.spu){
                    this.itemFormSpu=this.itemForm.spu;
                    this.itemForm.size_original="";
                    this.restaurants.forEach((item)=>{
                        if(item.spu==this.itemForm.spu){
                            this.itemForm.product_id= item.id;
                            this.top_id=item.top_id;
                        }
                    })
                }
            },
            loadAll() {
                let conf=vk.getCache(uri.getConf)['data'];
                this.restaurants =conf.products;
            },
            checkItemPen(key,row){
                if(this.noPen || this.order.status=='shipped'
                    || this.order.status=='cancelled'
                    || this.order.status=='transferring'
                    || this.order.status=='return_completed'
                    || this.order.status=='return_process') return false;
                
                if(this.noPen || row.item_status=='shipped'
                    || row.item_status=='cancelled'
                    || row.item_status=='return_completed'
                    || row.item_status=='return_process') return false;
                return true;
            },
            checkEditor(){
                if((this.noPen && !this.create)  || this.order.status=='shipped'
                    || this.order.status=='cancelled'
                    || this.order.status=='transferring'
                    || this.order.status=='return_completed'
                    || this.order.status=='return_process'
                ) return false;
                return true;
            },
            completeDistribution(row){
                let sxu=vk.sxu(row.sku);
                let that=this;
                vk.confirm(i18n.t("order.distribution.confirm.over",
                    {
                        sku:sxu.sku,
                        size:sxu.size_ext,
                        total:row.qty_ordered
                    }
                    ),function(){
                        vk.http(uri.acceptancePassed,{
                            order_id:row.order_id,
                            item_id:row.id,
                        },that.then);
                    }
                );
            },
            removeLocalItem(index){
                let that=this;
                vk.confirm('确认要删除？',function(){
                    that.order.items.splice(index, 1);
                });
            },
            itemThumb(item){
                let url=vk.cgi('file/product?id='+item.product_id);
                if(item.attr){
                    try{
                        let attr=JSON.parse(item.attr);
                        return attr[0].remote_url || url;
                    }catch(e){}
                }
                return url;
            },
            openCommentDialog(code,params){
                this.$emit('openCommentDialog',code,params);
            },
            deleteItem(row){
                let params={
                    row:row,
                    key:'qty_ordered'
                };
                this.updatePen(0,params);
            },
            getSizeOriginal(row){
                if(row.size_us>0 && row.size_us!=999){
                    let cate=this.size_original_all[row.prod_cate_id] || this.size_original_all[row.prod_cate_id];
                    if(cate){
                        //console.log(cate,row.size_us)
                        let size_us_key=row.size_us;
                        if(size_us_key.indexOf('.')<0){
                            size_us_key+='.0';
                        }
                        return cate[size_us_key]||"";
                    }
                }
            },
            deductPrice(item_price){
                if(item_price==0) return 0;
                let sm=parseFloat(this.order.shipping_amount)
                    +parseFloat(this.order.od_shipping_discount_amount);
                //console.log(sm);
                if(isNaN(sm)){
                    sm=0;
                }
                let lv=(this.order.grand_total-sm)/this.order.subtotal;
                return vk.moneyFormat(parseFloat(item_price)*lv,this.order.currency_code);
            },
            isHiddenItem(item){
                if(this.filterHidden
                    && (item.item_status=='cancelled'
                        || (item.item_status=='shipped' && (item.item_type!='suit') && (item.prod_cate_id!='53'))
                        || item.item_status=='return_completed'
                    )){
                    return true;
                }
                return false;
            }
        }
    }
    export default {i18n,...App}
</script>