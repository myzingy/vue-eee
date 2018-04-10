<style>

</style>
<template>
    <div>
        <div>
            <span>{{$t('订单总数')}}:{{total.order_count}}</span> , <span>{{$t('产品总数')}}:{{total.items_count}}</span>
            |
            <span v-for="(val,key) in total.items_type_count">
                {{$t(key)}}:{{val}},
            </span>
        </div>
        <el-switch
                v-model="printing"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('扫码后自动打印面单并发货')"
                :inactive-text="$t('手动处理')"
                v-if="unzip && !disopc">
        </el-switch>
        <el-input :placeholder="$t('请扫码或输入订单号')" v-model="increment_id"
                  :autofocus="true"
                  @keyup.enter.native="orderScan"
                  class="input-with-select">
            <template slot="prepend">
                SCAN
            </template>
        </el-input>
        <el-table
                :data="tableData"
                border
                style="width: 100%; margin-top: 10px;" height="450"
                ref="tableData"
        >
            <el-table-column
                    prop="increment_id"
                    :label="$t('订单号')"
                    width="120" >
            </el-table-column>
            <el-table-column
                    prop="ext_order_id"
                    :label="$t('状态')"
                    v-if="unzip"
            >
                <template slot-scope="props">
                    {{props.row.status==0?'in':'outed'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="ext_order_id"
                    :label="$t('订单编号')"
                    >
                <template slot-scope="props">
                    {{props.row.ext_order_id}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="ext_order_id"
                    :label="$t('产品数量')"
            >
                <template slot-scope="props">
                    {{props.row.items_num}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="ext_order_id"
                    :label="$t('物流单号')"
            >
                <template slot-scope="props">
                    {{props.row.shipping_track_no?props.row.shipping_track_no:$t('等待创建')}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="ext_order_id"
                    :label="$t('重量(G)')"
                    width="80"
            >
                <template slot-scope="props">
                    <el-input @keyup.enter.native="updatePen({key:'weight',row:props.row})"
                              v-model="props.row.weight"
                        v-if="checkItemPen('weight',props.row)"
                    ></el-input>
                    <span v-else="">{{props.row.weight}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('操作')"
                    width="120"  v-if="!disopc">
                <template slot-scope="props">
                    <el-dropdown @command="operationCommand" trigger="click" v-if="unzip">
                                <span class="el-dropdown-link">
                                {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{command:'面单',index:props.$index}">
                                {{$t('打印面单')}}
                            </el-dropdown-item>
                            <el-dropdown-item :command="{command:'发货',index:props.$index}">
                                {{$t('已发货')}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div v-else="">
                        <el-button type="primary"
                                   @click="delEmbItem(props.row)"
                                   >{{$t('移除')}}</el-button>
                        <el-button type="primary"
                                   @click="forceShipment(props.row)"
                                   >{{$t('强制打单')}}</el-button>
                    </div>

                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'

    import i18n from '../../../local'
    import lodop from '../../common/lodop/print.waybill';
    var App= {
        props:['emb','unzip','disopc'],
        components:{
        },
        data () {
            return {
                increment_id:"",
                tableData:[],
                printing:!this.disopc,
                operationData:{},
                total:{
                    order_count:0,
                    items_count:0,
                    items_type_count:{}
                },
            };
        },
        mounted(){
            lodop.init();
        },
        methods: {
            then(json,code){
                switch(code){
                    case uri.getEmbItems.code:
                        this.tableData = json.data;
                        this.total =json.total;
                        break;
                    case uri.pushEmbItem.code:
                        vk.toast(i18n.t('已加入包裹'),'success');
                        this.increment_id='';
                        this.getData();
                        break;
                    case uri.delEmbItem.code:
                        this.getData();
                        break;
                    case uri.popEmbItem.code:
                        let img=vk.cgi('file/waybill?id='
                            +json.data.id
                            +'&method='+json.data.shipping_method
                        );
                        lodop.printWaybill(img,'EMB',json.data.increment_id);
                        
                        this.increment_id='';
                        this.getData();
                        break;
                    case uri.updateEmbItem.code:
                        this.getData();
                        break;
                    case uri.flushShipment.code:
                        this.getData();
                        break;
                }
            },
            pageInit(){
                this.printing=!this.disopc;
                this.getData()
            },
            getData(param){
                vk.http(uri.getEmbItems,param || this.emb,this.then);
            },
            pushEmbItem(increment_id){
                let obj={
                    emb_id:this.emb.id,
                    increment_id:increment_id,
                }
                vk.http(uri.pushEmbItem,obj,this.then);
            },
            orderScan(){
                if(this.unzip){
                    if(this.printing){
                        let obj={
                            emb_id:this.emb.id,
                            increment_id:this.increment_id,
                        }
                        vk.http(uri.popEmbItem,obj,this.then);

                    }else{
                        this.getData({id:this.emb.id,increment_id:this.increment_id});
                    }
                }else{
                    this.pushEmbItem(this.increment_id);
                }
            },
            delEmbItem(row){
                let that=this;
                vk.confirm(i18n.t('确认要移除吗'),function(){
                    let obj={
                        id:row.id,
                        emb_id:row.emb_id,
                    }
                    vk.http(uri.delEmbItem,obj,that.then);
                });

            },
            forceShipment(row){
                let that=this;
                vk.confirm(i18n.t('确认要强制打单吗'),function(){
                    let obj={
                        order_id:row.order_id,
                        enforce:'enforce'
                    }
                    vk.http(uri.flushShipment,obj,that.then);
                });

            },
            operationCommand(param){
                this.operationData=this.tableData[param.index];
                switch (param.command){
                    case '面单':
                        let img=vk.cgi('file/waybill?id='
                            +this.operationData.order_id
                            +'&method=EMB'
                        );
                        lodop.printWaybill(img,'EMB',this.operationData.increment_id);
                        break;
                    case '发货':
                        let that=this;
                        vk.confirm(i18n.t('已发货？'),function(){
                            vk.http(uri.orderDelivery,{id:that.operationData.id},that.then);
                        })
                        break;
                }
            },
            checkItemPen(act,row){

                console.log('emb',this.emb);

                return this.emb.status<3;
            },
            updatePen(params){
                vk.http(uri.updateEmbItem,{id:params.row.id,key:params.key,val:params.row[params.key]},this.then);
            },
        }
    }
    export default {i18n,...App}
</script>