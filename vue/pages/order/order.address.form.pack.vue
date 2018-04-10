<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div style="display: inline-block;">
        <el-button type="warning" @click="openPackDialog"
                   v-if="order.status!='shipped'
                   && order.status!='cancelled'
                    && order.status!='return_completed'
                    && order.status!='return_process'"
        >
            {{$t('修改收货地址')}}
        </el-button>
        <el-dialog :title="$t('编辑信息')" :visible.sync="packDialogVisible"
                   :close-on-click-modal="true"
                   :close-on-press-escape="true"
                   :modal-append-to-body="false"
                   :append-to-body="true"
                   :modal="true"
                   width="750px"
        >
            <div>
                <el-form ref="form" :model="order" :rules="rules">
                    <el-form-item prop="address">
                        <el-row :gutter="21">
                            <el-col :span="8">
                                {{$t('地区')}}<br>
                                <el-input v-model="order.address.region" :placeholder="$t('地区')"></el-input>
                            </el-col>
                            <el-col :span="8">
                                {{$t('邮编')}}<br>
                                <el-input v-model="order.address.postcode" :placeholder="$t('邮编')"></el-input>
                            </el-col>
                            <el-col :span="8">
                                {{$t('街道')}}<br>
                                <el-input v-model="order.address.street" :placeholder="$t('街道')"></el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="21">
                            <el-col :span="8">
                                {{$t('城市')}}<br>
                                <el-input v-model="order.address.city" :placeholder="$t('城市')"></el-input>
                            </el-col>
                            <el-col :span="8">
                                {{$t('国家代码（两个字符：如US）')}}<br>
                                <el-input v-model="order.address.country_id"
                                          :readonly="order.status=='transferring'"
                                          :placeholder="$t('国家代码（两个字符：如US）')" maxlength="2"></el-input>
                            </el-col>
                            <el-col :span="8">
                                {{$t('邮箱')}}<br>
                                <el-input v-model="order.address.email" :placeholder="$t('邮箱')"></el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="21">
                            <el-col :span="8">
                                First Name<br>
                                <el-input v-model="order.address.firstname" placeholder="First Name"></el-input>
                            </el-col>
                            <el-col :span="8">
                                Last Name<br>
                                <el-input v-model="order.address.lastname" placeholder="Last Name"></el-input>
                            </el-col>
                            <el-col :span="8">
                                {{$t('电话')}}<br>
                                <el-input v-model="order.address.telephone" :placeholder="$t('电话')"></el-input>
                            </el-col>
                        </el-row>
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
    var App= {
        props:['order'],
        components:{
            
        },
        data () {
            let address={
                region:'',
                postcode:'',
                street:'',
                city:'',
                country_id:'',
                email:'',
                firstname:'',
                lastname:'',
                telephone:'',
            };
            let validateAddress = (rule, value, callback) => {
                for(let i in address){
                    if(!value[i]) {
                        callback(new Error(i+' is required'));
                        return;
                    }
                }
                callback();
            };
            return {
                packDialogVisible:false,
                rules:{
                    address: [
                        { validator: validateAddress, trigger: 'blur' },
                    ],
                },
            };
        },
        mounted(){

        },
        methods: {
            then(){
                this.packDialogVisible=false;
            },
            openPackDialog(){
                this.packDialogVisible=true;
            },
            packDialogSave(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //vk.http(uri.setOrderAddress,this.order,this.then);
                        this.packDialogVisible=false;
                        this.$emit('openCommentDialog',205,this.order);
                    } else {
                        return false;
                    }
                });
            },
        }
    }
    export default {i18n,...App}
</script>