<style lang="stylus" rel="stylesheet/scss">
.el-form-item .el-form-item{
    margin-bottom: 22px;
}
</style>
<template>
    <v-layout>
        <div slot="main">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item :label="$t('创建原因')" prop="comment">
                    <editor :value="form.comment" :option="{}" ref="textarea"></editor>
                </el-form-item>
                <el-form-item :label="$t('收货信息')" prop="address">
                    <el-row :gutter="21"></el-row>
                    <el-row :gutter="21">
                        <el-col :span="8">
                            {{$t('地区')}}<br>
                            <el-input v-model="form.address.region" :placeholder="$t('地区')"></el-input>
                        </el-col>
                        <el-col :span="8">
                            {{$t('邮编')}}<br>
                            <el-input v-model="form.address.postcode" :placeholder="$t('邮编')"></el-input>
                        </el-col>
                        <el-col :span="8">
                            {{$t('街道')}}<br>
                            <el-input v-model="form.address.street" :placeholder="$t('街道')"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="21">
                        <el-col :span="8">
                            {{$t('城市')}}<br>
                            <el-input v-model="form.address.city" :placeholder="$t('城市')"></el-input>
                        </el-col>
                        <el-col :span="8">
                            {{$t('国家代码（两个字符：如US）')}}<br>
                            <el-input v-model="form.address.country_id" :placeholder="$t('国家代码（两个字符：如US）')"></el-input>
                        </el-col>
                        <el-col :span="8">
                            {{$t('邮箱')}}<br>
                            <el-input v-model="form.address.email" :placeholder="$t('邮箱')"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="21">
                        <el-col :span="8">
                            First Name<br>
                            <el-input v-model="form.address.firstname" placeholder="First Name"></el-input>
                        </el-col>
                        <el-col :span="8">
                            Last Name<br>
                            <el-input v-model="form.address.lastname" placeholder="Last Name"></el-input>
                        </el-col>
                        <el-col :span="8">
                            {{$t('电话')}}<br>
                            <el-input v-model="form.address.telephone" :placeholder="$t('电话')"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item :label="$t('物流时效')" prop="shipping_description">
                    <el-radio-group v-model="form.shipping_description">
                        <el-radio label="STANDARD" value="STANDARD">{{$t('普通时效')}}</el-radio>
                        <el-radio label="EXPEDITED" value="EXPEDITED">{{$t('标准时效')}}</el-radio>
                        <el-radio label="EXPRESS" value="EXPRESS">{{$t('快速时效')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('产品信息')" prop="items">
                    <el-row :gutter="24"></el-row>
                    <orderItemsPack :order="form" :create="true"></orderItemsPack>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="onSubmit" v-if="loading">{{$t('创建新订单')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import orderItemsPack from './order.items.pack.vue'
    import editor from '../common/editor.vue'
    let form_tpl={
        address:{
            region:'',
            postcode:'',
            street:'',
            city:'',
            country_id:'',
            email:'',
            firstname:'',
            lastname:'',
            telephone:'',
        },
        items:[],
        comment:'',
        shipping_description:'',
    };
    var App= {
        components:{
            orderItemsPack,
            editor
        },
        data () {
            let validateAddress = (rule, value, callback) => {
                for(let i in value){
                    if(!value[i]) {
                        callback(new Error(i+' is required'));
                        return;
                    }
                }
                callback();
            };
            let validateItems = (rule, value, callback) => {
                if (value.length <1) {
                    callback(new Error('items is required'));
                } else {
                    callback();
                }
            };
            return {
                form:JSON.parse(JSON.stringify(form_tpl)),
                rules:{
                    comment: [
                        { required: true, trigger: 'blur' },
                    ],
                    address: [
                        { validator: validateAddress, trigger: 'blur' },
                    ],
                    shipping_description:[
                        { required: true, trigger: 'blur' },
                    ],
                    items:[
                        { validator: validateItems, trigger: 'blur' },
                    ],
                },
                loading:false,
            };
        },
        mounted(){
            this.loading=true;
        },
        methods: {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.createOrder.code:
                        this.form=JSON.parse(JSON.stringify(form_tpl));
                        let that=this;
                        vk.alert(i18n.t('订单编号')+':'+json.data.ext_order_id,function(){
                            that.$router.replace({ path: '/order/list/approved' })
                        });
                        break;
                }
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
            onSubmit(){
                this.form.comment=this.$refs.textarea.val();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        vk.http(uri.createOrder,this.form,this.then);
                    } else {
                        return false;
                    }
                });
            },
        }
    }
    export default {i18n,...App}
</script>