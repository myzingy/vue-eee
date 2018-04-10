<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <el-dialog title="Query" :visible.sync="dialogFormVisible">
        <div style="max-height: 500px; overflow-y: auto;" class="form-read">
            <el-form ref="form" :model="query" inline label-width="150px" >
                <el-form-item :label="$t('退回物流单号')" v-if="dispaly('return')">
                    <el-input v-model="query.orderreturn.track_no.like"></el-input>
                </el-form-item>
                <el-form-item :label="$t('处理状态')" v-if="dispaly('issue')">
                    <el-checkbox-group v-model="query.orderissue.issue_status.in">
                        <el-checkbox label="pending">pending</el-checkbox>
                        <el-checkbox label="processing">processing</el-checkbox>
                        <el-checkbox label="solved">solved</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('生产编号')" v-if="dispaly('distribution')">
                    <el-input v-model="query.produce.sn"></el-input>
                </el-form-item>
                <el-form-item :label="$t('订单编号')" v-if="dispaly('order,issue,eub')">
                    <el-input v-model="query.order.ext_order_id"></el-input>
                </el-form-item>
                <el-form-item :label="$t('订单号')" v-if="dispaly('order,issue,eub')">
                    <el-input v-model="query.order.increment_id"></el-input>
                </el-form-item>
                <el-form-item :label="$t('支付状态')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.order.payment_status" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in paymentStatusObj"
                                :key="key"
                                :label="$t('order.payment.'+key)"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('支付方式')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.order.payment_method" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in paymentMethod"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('订单状态')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.order.status" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in orderStatusObj"
                                :key="key"
                                :label="$t('order.status.'+key)"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('订单追踪状态')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.order.last_track_status" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in orderLastStatusObj"
                                :key="key"
                                :label="$t('order.status.'+key)"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('订单物流方式')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.order.shipping_method" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in orderShippingMethodObj"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('订单物流编号')" v-if="dispaly('order,issue')">
                    <el-input v-model="query.order.shipping_track_no"></el-input>
                </el-form-item>
                <el-form-item :label="$t('是否有物流编号')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.order.__has_shipping_track_no" placeholder="select" clearable>
                        <el-option  key="1" :label="$t('已有单号')" :value="1"></el-option>
                        <el-option  key="0" :label="$t('没有单号')" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <div>
                    <el-form-item :label="$t('订单创建时间')" v-if="dispaly('order,issue')">
                        <el-date-picker
                                v-model="query.order.created_at.between"
                                type="datetimerange"
                                range-separator="-"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="Start"
                                end-placeholder="End">
                        </el-date-picker>
                    </el-form-item>
                    </div>
                    <el-form-item :label="$t('订单发货时间')" v-if="dispaly('order,issue')">
                        <el-date-picker
                                v-model="query.order.shipped_at.between"
                                type="datetimerange"
                                range-separator="-"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="Start"
                                end-placeholder="End">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <!--
                <el-form-item :label="$t('订单类型')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.order.order_type" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in ['custom','taobao','stock','mixture','fictitious']"
                                :key="item"
                                :label="$t('order.type.'+item)"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                -->
                <el-form-item :label="$t('Items SKU')" v-if="dispaly('order,distribution,issue')">
                    <el-input v-model="query.items.sku"></el-input>
                </el-form-item>

                <el-form-item :label="$t('产品编号')" v-if="dispaly('order,distribution,issue')">
                    <el-input v-model="query.items.product_id"></el-input>
                </el-form-item>

                <el-form-item :label="$t('Items Status')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.items.item_status" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in orderStatusObj"
                                :key="key"
                                :label="$t('order.status.'+key)"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('Items Type')" v-if="dispaly('order,issue')">
                    <el-select v-model="query.items.item_type" placeholder="select" clearable>
                        <el-option
                                v-for="(item,key) in ['custom','taobao','stock','mixture','fictitious','suit']"
                                :key="item"
                                :label="$t('order.type.'+item)"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('刻字内容')" v-if="dispaly('order,issue')">
                    <el-input v-model="query.items.engravings.like"></el-input>
                </el-form-item>

                <el-form-item label="First name" v-if="dispaly('order,issue')">
                    <el-input v-model="query.address.firstname"></el-input>
                </el-form-item>
                <el-form-item label="Last name" v-if="dispaly('order,issue')">
                    <el-input v-model="query.address.lastname"></el-input>
                </el-form-item>
                <el-form-item label="Telephone" v-if="dispaly('order,issue')">
                    <el-input v-model="query.address.telephone"></el-input>
                </el-form-item>
                <el-form-item label="Email" v-if="dispaly('order,issue')">
                    <el-input v-model="query.address.email"></el-input>
                </el-form-item>
                <el-form-item :label="$t('街道')" v-if="dispaly('order,issue')">
                    <el-input v-model="query.address.street"></el-input>
                </el-form-item>
                <el-form-item :label="$t('城市')" v-if="dispaly('order,issue')">
                    <el-input v-model="query.address.city"></el-input>
                </el-form-item>
                <el-form-item :label="$t('国家简码')" v-if="dispaly('order,issue')">
                    <el-input v-model="query.address.country_id"></el-input>
                </el-form-item>
                <el-form-item :label="$t('UPS成人签收')" v-if="dispaly('order')">
                    <el-select v-model="query.order.__ups_sign_up" placeholder="select" clearable>
                        <el-option
                                v-for="(val,key) in ['Yes','No']"
                                :key="val"
                                :label="val"
                                :value="val">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="search">Search</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import order_data from '../common/order_data';
    let queryObj={
        order:{
            ext_order_id:'',
            increment_id:'',
            payment_status:'',
            payment_method:'',
            status:'',
            last_track_status:'',
            shipping_method:'',
            shipping_track_no:'',
            order_type:'',
            paused:'',
            approved:'',
            site_id:'',
            created_at:{between:[]},
            shipped_at:{between:[]},
        },
        address:{
            id:'',
            lastname:'',
            firstname:'',
            telephone:'',
            street:'',
            city:'',
            country_id:'',
            email:'',
        },
        items:{
            id:'',
            sku:'',
            item_status:'',
            engravings:{},
        },
        produce:{
            sn:'',
        },
        orderissue:{
            issue_status:{
                in:[],
            },
        },
    };

    var App= {
        props:['type'],
        components:{

        },
        data() {
            return {
                dialogFormVisible: false,
                formLabelWidth:"80",
                query:JSON.parse(JSON.stringify(queryObj)),
                paymentStatusObj:order_data.paymentStatusObj,
                paymentMethod:order_data.paymentMethod,
                orderStatusObj:order_data.orderStatusObj,
                orderLastStatusObj:order_data.orderLastStatusObj,
                orderShippingMethodObj:order_data.orderShippingMethodObj,
            };
        },
        mounted(){
            this.pageInit();
        },
        methods: {
            openQuery(){
                this.dialogFormVisible=true;
            },
            pageInit(obj={}){
                Object.assign(this.query,obj);
            },
            getQuery(pager){
                pager.offset=(pager.page-1)*pager.limit;
                this.query['this']=pager;
                return this.query;
            },
            search(){
                this.dialogFormVisible=false;
                this.$emit('search');
            },
            dispaly(type_display){
                let types=[];
                if(typeof this.type=='string'){
                    types.push(this.type);
                }else{
                    types=this.type;
                }
                type_display=type_display.split(',');
                let a = new Set(types);
                let b = new Set(type_display);
                let intersectionSet = new Set([...a].filter(x => b.has(x)));
                return intersectionSet.size>0;
            },
        },
    }
    export default {i18n,...App}
</script>