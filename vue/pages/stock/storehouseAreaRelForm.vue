<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">

            <el-form-item :label="$t('仓库')" prop="storehouse_id">
                <el-select v-model="form.storehouse_id" :placeholder="$t('仓库')">
                    <el-option
                            v-for="item in storehouses"
                            :key="item.id"
                            :label="$t(item.name)"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('覆盖地区')" prop="area_shortname">
                <el-select v-model="form.area_shortname" :placeholder="$t('覆盖地区')">
                    <el-option
                            v-for="item in area"
                            :key="item.shortname"
                            :label="$t(item.shortname)"
                            :value="item.shortname">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('物流类型')" prop="shipping_method_type">
                <el-select v-model="form.shipping_method_type" :placeholder="$t('物流类型')">
                    <el-option
                            v-for="(item, index) in shipmentMethodType"
                            :key="index"
                            :label="$t(item)"
                            :value="index">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('物流方式')" prop="shipping_method">
                <el-select v-model="form.shipping_method" :placeholder="$t('物流方式')">
                    <el-option
                            v-for="(item, index) in allShipmentMethod"
                            :key="index"
                            :label="$t(item)"
                            :value="index">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('时效')" prop="pr">
                <el-input v-model="form.duration"></el-input>
            </el-form-item>

			<el-form-item :label="$t('概率')" prop="pr">
                <el-input v-model="form.pr"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">{{$t('保存')}}</el-button>
                <el-button @click="closeForm">{{$t('取消')}}</el-button>
            </el-form-item>
        </el-form>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    let App ={
        props: ['dialogFormAttributes'],
        data() {
            return {
                storehouses:{},
                area:{},
                shipmentMethodType:{},
                allShipmentMethod:{},
                form: {
                    storehouse_id:'',
                    area_shortname:'',
                    shipping_method:'',
                    shipping_method_type:'',
                    pr:'',
                },
                formRules: {
                    storehouse_id: [
                        { required: true, message: i18n.t('请选择仓库'), trigger: 'blur' },
                    ],
                    area_shortname: [
                        { required: true, message: i18n.t('请选择仓库覆盖地区'), trigger: 'blur' },
                    ],
                    shipping_method: [
                        { required: true, message: i18n.t('请选择物流类型'), trigger: 'blur' },
                    ],
                    shipping_method_type: [
                        { required: true, message: i18n.t('请选择物流方式'), trigger: 'blur' },
                    ],
                    pr: [
                        { required: true, message: i18n.t('请输入概率'), trigger: 'blur' },
                    ],
                }
            }
        },
        watch:{
            'dialogFormAttributes': function(newVal, oldVal) {
                if(newVal.type=='add'){
                    this.$refs['form'].resetFields();
                }
                this.getStorehouseAreaRel();
            },
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.storehouseAreaRelAdd.code:
                    case uri.storehouseAreaRelUpdate.code:
                        this.$emit('listenToSave',{});
                        break;

                    case uri.getStorehouseAreaRel.code:
                        this.form = json.data;
                        break;

                    case uri.getAllStorehouse.code:
                        this.storehouses = json.data;
                        break;

                    case uri.getShipmentMethodType.code:
                        this.shipmentMethodType = json.data;
                        break

                    case uri.getAllShipmentMethod.code:
                        this.allShipmentMethod = json.data;
                        break;

                    case uri.getAllArea.code:
                        this.area = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.dialogFormAttributes.type =='add'?uri.storehouseAreaRelAdd : uri.storehouseAreaRelUpdate;
                        vk.http(url,that.form,that.then);
                    } else {
                        return false;
                    }
                });
            },
            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm');
            },
            getStorehouseAreaRel(){
                if(this.dialogFormAttributes.type!='update') return;
                vk.http(uri.getStorehouseAreaRel,{id:this.dialogFormAttributes.id},this.then);
            }
        },
        mounted(){
            this.getStorehouseAreaRel();
            vk.http(uri.getAllStorehouse,{},this.then);
            vk.http(uri.getShipmentMethodType,{},this.then);
            vk.http(uri.getAllShipmentMethod,{},this.then);
            vk.http(uri.getAllArea,{},this.then);
        }
    }
    export default {i18n,...App};
</script>
