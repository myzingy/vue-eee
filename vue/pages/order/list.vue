<style lang="stylus" rel="stylesheet/scss">
    /*
    $success_row_bg=#E6EBF5;
    .el-table tr.el-table__row.success-row {
        background: $success_row_bg;
        *,&:hover{
            background: $success_row_bg;
        }
    }*/
    .input-with-select .el-select .el-input {
        width: 130px;
    }
    .el-form-item__error{
        line-height: 1;
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
        .el-form-item{
            margin-bottom: 10px;
        }
    }
</style>
<template>
    <v-layout>
        <div slot="main">
            <div class="orderGrid">
                <!--
                <el-input :placeholder="$t('请输入内容后回车')" v-model="searchArgs.value"
                          @keyup.enter.native="search"
                          class="input-with-select">
                    <span slot="prepend">{{$t('订单编号')}}</span>
                    <el-button slot="append" icon="el-icon-search" @click="openQuery">Query</el-button>
                </el-input>
                -->
                <el-row :gutter="24" style="">
                    <el-col :span="10">
                        <div class="grid-content bg-purple">
                            <el-form :inline="true" :model="querytable" class="demo-form-inline">
                                <el-form-item label="" style="width: 150px;">
                                    <el-input v-model="querytable.address.__name"
                                              placeholder="Consumer Name" @keyup.enter.native="search"></el-input>
                                </el-form-item>
                                <el-form-item label="" style="width: 100px;">
                                    <el-input v-model="querytable.address.email.like"
                                              placeholder="Email" @keyup.enter.native="search"></el-input>
                                </el-form-item>
                                <el-form-item label="" style="width: 100px;">
                                    <el-input v-model="querytable.address.telephone.like"
                                              placeholder="Telephone" @keyup.enter.native="search"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="grid-content bg-purple" style="float: right; padding-bottom: 10px;">
                            <el-button v-if="$router.power('exportUpsEds')" @click="exportUpsEds()">{{$t('导出UPS电子报关单')}}</el-button>
                            <el-button v-if="$router.power('exportUpsTpl')" @click="exportUpsTpl()">{{$t('导出UPS模板')}}</el-button>
                            <el-button v-if="$router.power('exportDhlTpl')" @click="exportDhlTpl()">{{$t('导出DHL模板')}}</el-button>
                            <el-button v-if="$router.power('exportFedexTpl')" @click="exportFedexTpl()">{{$t('导出FEDEX模板')}}</el-button>
                            <el-button v-if="$router.power('exportAramexTpl')" @click="exportAramexTpl()">{{$t('导出ARAMEX模板')}}</el-button>
                            <el-button v-if="$router.power('exportEubTpl')" @click="exportEubTpl()">{{$t('导出EUB模板')}}</el-button>
                        </div>
                    </el-col>
                </el-row>
                <!--//search header-->
                <el-table
                        :data="[{}]"
                        border
                        style="width: 100%;"
                        :default-expand-all="false"
                        :row-class-name="tableRowClassName"
                        @selection-change="checkAll"
                >
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    <el-table-column
                            prop="expedited"
                            :label="$t('Priority')"
                            width="70"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.expedited.gte" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="0"
                                        label="No"
                                        value="0">
                                </el-option>
                                <el-option
                                        key="1"
                                        label="Yes"
                                        value="1">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            v-if="$router.power('fields.ext_order_id')"
                            width="150" >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.ext_order_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.increment_id.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SPU"
                            width="90" >
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.items.sku.like"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('图片')"
                            width="90" >
                        <template slot-scope="props">

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="order_type"
                            :label="$t('Classification')"
                            width="70"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.order.order_type" placeholder="Select" clearable
                                       @change="search">
                                <el-option
                                        v-for="(item,key) in ['custom','taobao','stock','mixture']"
                                        :key="item"
                                        :label="$t('order.type.'+item)"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('支付金额')"
                            width="80" v-if="$router.power('seePrice')"
                    >
                        <template slot-scope="props">

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipping_method"
                            :label="$t('物流方式')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.shipping_method" slot="prepend"
                                       @change="search" clearable
                                       placeholder="Select" style="width: 80px;">
                                <el-option
                                        v-for="(item,key) in orderShippingMethodObj"
                                        :key="key"
                                        :label="item"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipping_track_no"
                            :label="$t('物流单号')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-row :gutter="24" style="">
                                <el-input placeholder="" v-model="querytable.order.shipping_track_no"
                                          lass="input-with-select" @keyup.enter.native="search">
                                    <el-select v-model="querytable.order.__has_shipping_track_no" slot="prepend"
                                               @change="search" clearable
                                               placeholder="Select" style="width: 80px;">
                                        <el-option  key="1" :label="$t('已有单号')" :value="1"></el-option>
                                        <el-option  key="0" :label="$t('没有单号')" :value="0"></el-option>
                                    </el-select>
                                </el-input>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('UPS成人签收')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.__ups_sign_up" @change="search"
                                       placeholder="select" clearable>
                                <el-option
                                        v-for="(val,key) in ['Yes','No']"
                                        :key="val"
                                        :label="val"
                                        :value="val">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('Order date')"
                            width="90"
                    >
                        <template slot-scope="props">
                            <el-date-picker
                                    v-model="querytable.order.created_at.between"
                                    type="datetimerange"
                                    range-separator="-"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="Start"
                                    end-placeholder="End" @change="search">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('发货时间')"
                            width="90"
                    >
                        <template slot-scope="props">
                            <el-date-picker
                                    v-model="querytable.order.shipped_at.between"
                                    type="datetimerange"
                                    range-separator="-"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="Start"
                                    end-placeholder="End" @change="search">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="payment_status"
                            :label="$t('支付状态')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <el-select v-model="querytable.order.payment_status.in" multiple
                                       placeholder="Select"
                                       @change="search"
                                       clearable>
                                <el-option
                                        v-for="(item,key) in paymentStatusObj"
                                        :key="key"
                                        :label="$t('order.payment.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('订单状态')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.order.status.in"
                                       multiple
                                       placeholder="Select" @change="search"
                                       clearable>
                                <el-option
                                        v-for="(item,key) in orderStatusObj"
                                        :key="key"
                                        :label="$t('order.status.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="last_track_status"
                            :label="$t('Order change state')"
                            width="90"
                    >
                        <template slot-scope="scope">

                            <el-select v-model="querytable.order.last_track_status" placeholder="Select"
                                       @change="search" clearable>
                                <el-option
                                        v-for="(item,key) in orderLastStatusObj"
                                        :key="key"
                                        :label="$t('order.status.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>

                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('产品状态')"
                            width="80" >
                        <template slot-scope="props">
                            <el-select v-model="querytable.items.item_status.in"
                                       multiple
                                       placeholder="Select" @change="search"
                                       clearable>
                                <el-option
                                        v-for="(item,key) in orderStatusObj"
                                        :key="key"
                                        :label="$t('order.status.'+key)"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('待定')"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.order.paused" clearable
                                       @change="search" placeholder="Select">
                                <el-option
                                        key="1"
                                        :label="$t('地址')"
                                        value="1">
                                </el-option>
                                <el-option
                                        key="2"
                                        :label="$t('产品')"
                                        value="2">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                        <template slot-scope="props">
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="coupon_code"
                            :label="$t('优惠券')"
                    >
                    </el-table-column>
                    <el-table-column
                            :label="$t('是否清仓')"
                            width="50" >
                        <template slot-scope="props">
                            <el-select v-model="querytable.items.is_clearance" placeholder="Select"
                                       @change="search" clearable>
                                <el-option
                                        key="1"
                                        label="Yes"
                                        value="1">
                                </el-option>
                                <el-option
                                        key="0"
                                        label="No"
                                        value="0">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="stockPresell.storehouse_name"
                            :label="$t('仓库')"
                            width="60"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="querytable.stockPresell.storehouse_id" placeholder="Select"
                                       @change="search" clearable>
                                <el-option
                                        key="1"
                                        v-if="$router.power('stock.GuangZhou')"
                                        label="GuangZhou"
                                        value="1">
                                </el-option>
                                <el-option
                                        key="2"
                                        v-if="$router.power('stock.LosAngeles')"
                                        label="LosAngeles"
                                        value="2">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" :label="$t('common.id')" width="50">
                        <template slot-scope="props">
                            <el-input @keyup.enter.native="search"
                                      v-model="querytable.order.id"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            width="100" fixed="right">
                        <template slot-scope="scope">
                            
                        </template>
                    </el-table-column>
                </el-table>
                <!--//search header-->

                <el-table
                        :data="tableData"
                        border
                        style="width: 100%; margin-top: -1px;"
                        :height="height(280)"
                        :default-expand-all="false"
                        :row-class-name="tableRowClassName"
                        @filter-change="filterChange"
                        ref="tableData"
                        @selection-change="checkProductItem"
                        :show-header="false"
                    >
                    <el-table-column type="selection" prop="id" width="55"></el-table-column>
                    
                    <el-table-column
                            prop="expedited"
                            :label="$t('Priority')"
                            width="70"
                            :filters="[{ text: 'Yes', value: '2' }, { text: 'No', value: '0' }]"
                            filter-placement="bottom-end"
                            :filter-multiple="false"
                            column-key="expedited"
                            >
                        <template slot-scope="props">
                            <el-tag type="success" v-if="props.row.expedited==2">{{$t('加急')}}</el-tag>
                            <el-tag type="danger" v-if="props.row.expedited==1">{{$t('加急')}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="ext_order_id"
                            :label="$t('订单编号')"
                            v-if="$router.power('fields.ext_order_id')"
                            width="150" >
                    </el-table-column>
                    <el-table-column
                            prop="increment_id"
                            :label="$t('订单号')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <div>
                                {{getOrderReturnString(props.row)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SPU"
                            width="90" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                {{sxu(item.sku).spu}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('图片')"
                            width="90" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                <v-img :src="getThumb(item)"></v-img>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="order_type"
                            :label="$t('Classification')"
                            width="70"
                            :filters="[
                            { text: $t('order.type.taobao'), value: 'taobao' },
                            { text: $t('order.type.custom'), value: 'custom' },
                            { text: $t('order.type.stock'), value: 'stock' },
                            { text: $t('order.type.mixture'), value: 'mixture' },
                            { text: $t('order.type.fictitious'), value: 'fictitious' }]"
                            filter-placement="bottom-end"
                            :filter-multiple="false"
                            column-key="order_type"
                    >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                {{$t('order.type.'+item.item_type)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('支付金额')"
                            width="80" v-if="$router.power('seePrice')"
                    >
                        <template slot-scope="props">
                            {{moneyFormat(props.row.grand_total,props.row.currency_code)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="shipping_method"
                            :label="$t('物流方式')"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shipping_track_no"
                            :label="$t('物流单号')"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('UPS成人签收')"
                            width="80"
                    >
                        <template slot-scope="props">
                            {{signUpAdults(props.row)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('Order date')"
                            width="90"
                    >
                        <template slot-scope="props">
                            <span v-date="['YYYY-MM-DD HH:II',props.row.created_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('发货时间')"
                            width="90"
                    >
                        <template slot-scope="props">
                            <span v-date="['YYYY-MM-DD HH:II',props.row.shipped_at]"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="payment_status"
                            :label="$t('支付状态')"
                            width="100"
                    >
                        <template slot-scope="props">
                            <v-pen :value="props.row.payment_status"
                                   :params="{key:'payment_status',row:props.row}"
                                   @change="updatePen"
                                   :selectObj="paymentStatusObj"
                                v-if="$router.power('change.pay.status') && checkOrderPen(props.row)"
                            ></v-pen>
                            <span v-else="">{{$t('order.payment.'+props.row.payment_status)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            :label="$t('订单状态')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            <div v-if="scope.row.approved!=1">
                                <el-tag type="danger" >
                                    {{$t('待审核')}}
                                </el-tag>
                            </div>
                            {{$t('order.status.'+scope.row.status)}}
                            <div v-if="scope.row.status=='transferring' && scope.row.embPack">
                                {{$t('包裹名称')}}:{{scope.row.embPack.name}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="last_track_status"
                            :label="$t('Order change state')"
                            width="90"
                    >
                        <template slot-scope="scope">
                            <div v-if="scope.row.approved!=1">
                                <el-tag type="danger" >
                                    {{$t('待审核')}}
                                </el-tag>
                            </div>
                            <el-tag type="danger" v-if="scope.row.last_track_status!='normal'">
                                {{$t('order.status.'+scope.row.last_track_status)}}
                            </el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('产品状态')"
                            width="80" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                {{$t('order.status.'+item.item_status)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('待定')"
                            width="80"
                    >
                        <template slot-scope="scope">

                            <el-tag type="danger" v-if="scope.row.paused > 0">
                                {{scope.row.paused == 1?$t('地址'):$t('产品')}}
                            </el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80"
                    >
                        <template slot-scope="props">
                            <orderCommentPack :target="props.row" type="order"
                                              :noSee="props.row.noseeComment"
                            :hasComment="!!props.row.hasComment"
                            ></orderCommentPack>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="coupon_code"
                            :label="$t('优惠券')"
                    >
                    </el-table-column>
                    <el-table-column
                            :label="$t('是否清仓')"
                            width="50" >
                        <template slot-scope="props">
                            <div v-for="(item,i) in props.row.items" class="box">
                                {{item.is_clearance==1?'Yes':'No'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="stockPresell.storehouse_name"
                            :label="$t('仓库')"
                            width="60"
                    >
                        <template slot-scope="props">
                            {{props.row.stockPresell?$t(props.row.stockPresell.storehouse_name):''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" :label="$t('common.id')" width="50"> </el-table-column>
                    <el-table-column
                            :label="$t('操作')"
                            width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-dropdown @command="operationCommand" trigger="click">
                                <span class="el-dropdown-link">
                                {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{command:'查看',index:scope.$index}">
                                        {{$t('查看')}}
                                    </el-dropdown-item>

                                    <el-dropdown-item :command="{command:'备注',index:scope.$index}">
                                        {{$t('备注添加')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'异常',index:scope.$index}"
                                                      v-if="checkShowOpc('def',scope.row)">
                                        {{$t('异常件问题')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'联系',index:scope.$index}">
                                        {{$t('联系客户')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'待定',index:scope.$index}"
                                                      v-if="checkShowOpc('待定',scope.row)">
                                        {{$t('待定')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'取待',index:scope.$index}"
                                                      v-if="checkShowOpc('取待',scope.row)">
                                        {{$t('取消待定')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'加急',index:scope.$index}"
                                                      v-if="checkShowOpc('def',scope.row)"
                                    >
                                        {{$t('加急')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'取消',index:scope.$index}"
                                                      v-if="checkShowOpc('def',scope.row)"
                                    >
                                        {{$t('取消订单')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'退款',index:scope.$index}"
                                                      v-if="checkShowOpc('退款',scope.row)">
                                        {{$t('申请退款')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'退回',index:scope.$index}"
                                                      v-if="checkShowOpc('退回',scope.row)">
                                        {{$t('退回')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'重发',index:scope.$index}"
                                                      v-if="checkShowOpc('重发',scope.row)">
                                        {{$t('重发')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'退完',index:scope.$index}"
                                                      v-if="checkShowOpc('退完',scope.row)">
                                        {{$t('退回完成')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{command:'发票',index:scope.$index}">
                                        {{$t('发票')}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination style=" margin: 20px auto 0; width:300px;"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :page-size="pager.limit"
                               :page-sizes="pager.pageSizes"
                               layout="slot, sizes, prev, pager, next"
                               :total="total"
                               slot="total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:total})}}</span>
                    </template>
                </el-pagination>
                <DialogOrderInfo @openCommentDialog="openCommentDialog"
                                 :order="operationData"
                    ref="DialogOrderInfo"></DialogOrderInfo>
                <DialogOrderComment
                        :order="operationData"
                        ref="DialogOrderComment"
                        @commentSaveAfter="commentSaveAfter"></DialogOrderComment>
                <query ref="query" @search="search" type="order"></query>
            </div>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import orderItemsPack from './order.items.pack.vue'
    import orderShipmentPack from './order.shipment.pack.vue'
    import orderUserPack from './order.user.pack.vue'
    import orderCommentPack from '../common/comment.but-list.vue'
    import order_data from '../common/order_data';
    import query from './query.pack.vue';
    import DialogOrderInfo from './common/order.info.dialog.vue';
    import DialogOrderComment from './common/order.comment.dialog.vue';
    import newPage from '../common/newpage';
    var App= {
        props:['query'],
        components:{
            orderItemsPack,
            orderShipmentPack,
            orderUserPack,
            orderCommentPack,
            query,
            DialogOrderInfo,
            DialogOrderComment,
        },
        data () {
            return {
                tableData:[],
                total:0,
                searchArgs:{
                    key:"ext_order_id",
                    value:"",
                },
                filterArgs:{},
                operationData:{},
                cateStr:"",
                outerCommonDialogVisible:false,
                paymentStatusObj:order_data.paymentStatusObj,
                pager:{
                    page:1,
                    offset:0,
                    limit:20,
                    pageSizes:[20, 50, 100, 200,500],
                    orderby:'order.id desc',
                },
                newPageHref:"#",
                multipleSelection:[],

                querytable:{
                    order:{
                        ext_order_id:{},
                        increment_id:{},
                        status:{},
                        expedited:{},
                        created_at:{},
                        shipped_at:{},
                        payment_status:{},
                    },
                    items:{
                        sku:{neq:'?'},
                        serial_id:{},
                        item_status:{},
                    },
                    stockPresell:{},
                    address:{
                        email:{},
                        telephone:{},
                        lastname:{},
                        firstname:{},
                        street:{},
                    },
                },
                orderStatusObj:order_data.orderStatusObj,
                orderLastStatusObj:order_data.orderLastStatusObj,
                orderShippingMethodObj:order_data.orderShippingMethodObj,
            };
        },
        mounted(){
            this.search();
            let node = this.$el.querySelector('.el-table__body-wrapper');
            node.style.overflow = "hidden";
            let node2 = this.$el.querySelectorAll('.el-table__body-wrapper')[1];
            node2.addEventListener('scroll',(e)=>{
                node.scrollLeft = e.target.scrollLeft;
            })

        },
//        watch:{
//            'query':function(newVal){
//                this.search();
//            }
//        },
        methods: {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.orderQuery.code:
                        this.tableData = json.list;
                        if(json.total)
                            this.total=json.total;
                        break;
                    case uri.deletePower.code:
                        this.search();
                        this.flushConf();
                        break;
                    case uri.orderInvoiceExport.code:
                        newPage.href(json.data);
                        break;
                    case uri.exportUpsEds.code:
                    case uri.exportUpsTpl.code:
                    case uri.exportDhlTpl.code:
                    case uri.exportFedexTpl.code:
                    case uri.exportAramexTpl.code:
                    case uri.eubExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;
                }
            },
            handleCurrentChange(page){
                this.pager.page=page;
                this.search();
            },
            handleSizeChange(size){
                this.pager.limit = size;
                this.search();
            },
            removePower(data){
                let that=this;
                vk.confirm(i18n.t('确认删除吗?'),function(){
                    vk.http(uri.deletePower,{id:data.id},that.then);
                });
            },
            tableRowClassName({row, rowIndex}) {
                return 'success-row';
            },
            operationCommand(param){
                this.operationData=this.tableData[param.index];
                switch (param.command){
                    case '查看':
                        var that=this;
                        setTimeout(function(){
                            that.$refs.DialogOrderInfo.initPage();
                        },0);
                        break;
                    case '异常':
                        this.openCommentDialog('1001');
                        break;
                    case '备注':
                        this.openCommentDialog('222');
                        break;
                    case '联系':
                        this.openCommentDialog('1006');
                        break;
                        break;
                    case '发票':
                        newPage.open();
                        vk.http(uri.orderInvoiceExport,{id:this.operationData.id},this.then);
                        break;
                    case '待定':
                        this.openCommentDialog('1009');
                        break;
                    case '取待':
                        this.openCommentDialog('210');
                        break;
                    case '加急':
                        this.openCommentDialog('211');
                        break;
                    case '取消':
                        let that=this;
                        vk.confirm(i18n.t('确认要取消订单吗'),function(){
                            that.openCommentDialog('212');
                        });
                        break;
                    case '退款':
                        this.openCommentDialog('1005');
                        break;
                    case '退回':
                        if(!this.checkItemsOpcReturn(this.operationData.items)){
                            vk.alert(i18n.t('已没有可以操作的商品'));
                            return;
                        }
                        this.openCommentDialog('307');
                        break;
                    case '重发':
                        if(!this.checkItemsOpcReturn(this.operationData.items)){
                            vk.alert(i18n.t('已没有可以操作的商品'));
                            return;
                        }
                        this.openCommentDialog('1011');
                        break;
                    case '退完':
                        this.openCommentDialog('308');
                        break;
                }
            },
            openCommentDialog(cateStr,params={}){
                var that=this;
                setTimeout(function(){
                    that.$refs.DialogOrderComment.openCommentDialog(cateStr,params);
                },0);
            },
            search(isEnter=false){
                this.pager.offset=(this.pager.page-1)*this.pager.limit;
                this.querytable['this']=this.pager;

                let query=this.querytable;
                //let query=this.$refs.query.getQuery(this.pager);
//                if(isEnter){
//                    query.order[this.searchArgs.key]=this.searchArgs.value;
//                }
                query.order=Object.assign(query.order,this.filterArgs);
                query['with']={
                    noseeComment:true,
                    stockPresell:true,
                    items:true,
                    embPack:true,
                }
                vk.http(uri.orderQuery,query,this.then);
            },
            updatePen(val,params){
                console.log(val,params);
                this.operationData=params.row;
                this.operationData.newVal=val;
                if('expedited'==params.key){
                    this.openCommentDialog('211');
                }
                if('payment_status'==params.key){
                    this.openCommentDialog('214');
                };
                if('spu'==params.key){
                    this.openCommentDialog('200');
                };
                if('size_original'==params.key){
                    this.openCommentDialog('201');
                };
                if('qty_ordered'==params.key){
                    this.openCommentDialog('202');
                };
            },
            filterChange(filters){
                let filterArgs={};
                for(var key in filters){
                    filterArgs[key]=filters[key][0] || "";
                }
                console.log(filters,filterArgs);
                this.filterArgs=filterArgs;
                this.search();
            },
            commentSaveAfter(obj){
                if(obj.code==1005){//退款
                    this.$router.replace({ path: '/order/refund/apply' })
                    return;
                }
                this.search();
            },
            openQuery(){
                this.$refs.query.openQuery();
            },
            getThumb(item){
                let url=vk.cgi('file/product?id='+item.product_id);
                if(item.attr){
                    try{
                        let attr=JSON.parse(item.attr);
                        return attr[0].remote_url || url;
                    }catch(e){}
                }
                return url;
            },
            checkShowOpc(opc,row){
                // 已取消、已发货
                let flag=row.status=='cancelled'
                    || row.status=='shipped'
                    || row.status=='return_completed'
                    || row.status=='return_process';

                if(!this.$router.power('updateOrder')){
                    return false;
                }
                switch (opc){
                    case '待定':
                        return row.paused==0 && !flag;
                        break;
                    case '取待':
                        return row.paused!=0 && !flag;
                        break;
                    case '退款':
                        return row.payment_status == 'processing' || row.payment_status == 'complete';
                        break;
                    case '退回':
                    case '重发':
                        return row.status == 'shipped' || row.status == 'return_completed';
                        break;
                    case '退完':
                        return row.status == 'return_process';
                        break;
                    case 'def':
                        return !flag;
                        break;
                }
                return !flag;
            },
            checkItemsOpcReturn(items){
                let flag=false;
                items.forEach((item)=>{
                    if(item.item_status=='shipped' && item.item_type!='fictitious' && item.item_type!='suit'){
                        flag=true;
                        return true;
                    }
                });
                return flag;
            },
            checkOrderPen(row){
                if(row.status=='shipped'
                    || row.status=='cancelled'
                    || row.status=='return_completed'
                    || row.status=='return_process') return false;
                return true;
            },
            signUpAdults(row){
                let flag=row.currency_code=='USD' && row.base_grand_total>=300;
                return flag?'Yes':'No';
            },
            checkAll(a,b,c){
                this.tableData.forEach(row => {
                    this.$refs.tableData.toggleRowSelection(row);
                });
            },
            exportUpsEds(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.exportUpsEds,{ids:this.multipleSelection},this.then);
            },
            exportUpsTpl(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.exportUpsTpl,{ids:this.multipleSelection},this.then);
            },
            exportDhlTpl(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.exportDhlTpl,{ids:this.multipleSelection},this.then);
            },
            exportFedexTpl(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.exportFedexTpl,{ids:this.multipleSelection},this.then);
            },
            exportAramexTpl(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.exportAramexTpl,{ids:this.multipleSelection},this.then);
            },
            exportEubTpl(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.eubExport,{ids:this.multipleSelection},this.then);
            },
            checkProductItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
        }
    }
    export default {i18n,...App}
</script>