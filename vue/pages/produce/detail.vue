<template>

    <table cellspacing="0" cellpadding="0" border="0" class="customTable">

        <tbody>
        <template v-for="(item, key) in tableData">
            <tr>
                <td>
                    {{item.key1}}
                </td>
                <td :colspan="item.key2 ? 1 :3">
                    <product_user_data v-if="item.key1==$t('参数')"
                                       :user_data="detail.product_attr"
                                       :isPen="false"
                                       :item="{}"
                    ></product_user_data>
                    <v-img v-else-if="typeof item.val1 =='object' && item.val1.type=='image'" :mstyle="img_style" :src="item.val1.src"></v-img>
                    <span v-html="item.val1" v-else></span>
                </td>
                <td v-if="item.key2">
                    {{item.key2}}
                </td>
                <td v-if="item.key2">
                    <v-img v-if="typeof item.val2 =='object' && item.val2.type=='image'" :mstyle="img_style" :src="item.val2.src"></v-img>
                    <span v-html="item.val2" v-else></span>
                </td>

            </tr>
        </template>
        </tbody>
    </table>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import moment from 'moment'
    import image_view from '../common/image_view.vue';
    import productUserData from '../common/product_user_data.vue';
    import product_user_data from '../common/product_user_data.vue';
    let App ={
        props: {
            id: {
                type: String,
                default: () => 0
            },
            options:{
                type: Object,
            }
        },
        components:{
            image_view,
            productUserData,
            product_user_data
        },
        data() {
            return {
                tableData: [],
                detail:{},
                previewImage:{url:'',width:0,show:false},
                img_style:'width:120px'
            }
        },
        watch:{
          'id':function(){
              this.getInfo();
          }
        },
        computed: {
            progressComplete:function(){
                return this.progress.stepStatus >= 3;
            },
        },
        mounted(){
            this.getInfo();
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.factoryProduceInfo.code:
                        this.detail = json.data;
                        this.formatData();
                        break;

                }
            },
            getInfo(){
                vk.http(uri.factoryProduceInfo,{id:this.id},this.then);
            },
            formatData(){
                let items = [],detail= this.detail,defaultOption={1:'是',0:'否'};
                let image = this.getMainImage(detail.product.picMap) ? {type:'image',src:this.getMainImage(detail.product.picMap)} : '';
                let review_img = this.productAttr(detail.product_attr,'review_img');
                let source_img = this.productAttr(detail.product_attr,'source_img');
                review_img = review_img?{type:'image',src:review_img} : '';
                source_img = source_img?{type:'image',src:source_img} : '';
                let param = detail.productAttr.map(function(val){return {name:val.split(':')[0],val:val.split(':')[1]}})

                items.push({key1:i18n.t('生产编号'),val1:this.getSerialNo(detail.serial_id),key2:i18n.t('类型'),val2:this.options.typeOptions[detail.type]});
                items.push({key1:i18n.t('生产状态'),val1:this.options.statusOptions[detail.status],key2:i18n.t('加急'),val2:this.options.expeditedOptions[detail.expedited]});
                items.push({key1:i18n.t('确认变更'),val1:this.options.changeConfirmOptions[detail.change_confirm],key2:i18n.t('是否刻字'),val2:defaultOption[detail.has_engravings]});
                items.push({key1:i18n.t('生产工厂'),val1:detail.factory.name,key2:i18n.t('开始时间'),val2:this.date('',detail.start_at)});
                items.push({key1:i18n.t('OutKey'),val1:detail.out_key,key2:i18n.t('订单编号'),val2:!this.isEmpty(detail.order)?detail.order.ext_order_id:''});
                items.push({key1:i18n.t('仓库'),val1:!this.isEmpty(detail.storeHouse)?detail.storeHouse.name:'',key2:i18n.t('尺寸类型'),val2:!this.isEmpty(detail.orderItem)?i18n.t('product.detail.'+detail.orderItem.size_type):''});

                items.push({key1:i18n.t('SKU'),val1:detail.sku,key2:i18n.t('版号'),val2:detail.product.template_no});
                items.push({key1:i18n.t('数量'),val1:detail.amount,key2:i18n.t('尺码'),val2:this.skuSize(detail.sku)});
                items.push({key1:i18n.t('参数'),val1:param});
                items.push({key1:i18n.t('图片'),val1:image,key2:i18n.t('效果图'),val2:review_img});
                if(source_img) items.push({key1:i18n.t('原图'),val1:source_img});
                this.tableData = items;
            },
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 6 && columnIndex ===1) {

                    return [1, 3];
                }
                return [1,1];
            },
            getSerialNo(id){
                return 'F'+id;
            },


        }
    }
    export default {i18n,...App};
</script>
