<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
            <el-form-item :label="$t('唯一编号')" prop="serial_id">
                <el-input v-model="form.serial_id"></el-input>
            </el-form-item>
            <!--<el-form-item label="配件名称" prop="name">-->
                <!--<el-input v-model="form.name"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('图片')" prop="pic">
                <upload_block v-bind:param="picsConfig.param" v-bind:pics="form.pic" v-on:listenToPics="receivePics" v-model="form.pic"></upload_block>
            </el-form-item>
            <el-form-item :label="$t('规格')" prop="specifications">
                <el-input v-model="form.specifications"></el-input>
            </el-form-item>
            <el-form-item :label="$t('形状')" prop="shape">
                <el-select v-model="form.shape" :placeholder="$t('请选择')">
                    <el-option
                            v-for="(item, index) in stoneAttributes.shape"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('形状英文')" prop="mg_shape">
                <el-input v-model="form.mg_shape"></el-input>
            </el-form-item>
            <el-form-item :label="$t('切割')" prop="cutting">
                <el-select v-model="form.cutting" :placeholder="$t('请选择')">
                    <el-option
                            v-for="(item, index) in stoneAttributes.cutting"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('颜色')" prop="color">
                <el-input v-model="form.color"></el-input>
            </el-form-item>
            <el-form-item :label="$t('色系')" prop="mg_color">
                <el-input v-model="form.mg_color"></el-input>
            </el-form-item>
            <el-form-item :label="$t('材质')" prop="material">
                <el-select v-model="form.material" :placeholder="$t('请选择')">
                    <el-option
                            v-for="(item, index) in stoneAttributes.material"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('重量')" prop="weight">
                <el-input-number v-model="form.weight" :min="0" :controls=false></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('品牌')" prop="brand">
                <el-select v-model="form.brand" :placeholder="$t('请选择')">
                    <el-option
                            v-for="(item, index) in stoneAttributes.brand"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
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
    import upload_block from '../common/upload.vue';
    let App ={
        props: ['updateFittingsArgs'],
        components:{
            upload_block
        },
        data() {
            return {
                form: {
                    serial_id:0,
                    type:'stone',
                    name:'',
                    specifications:'',
                    shape:'',
                    cutting:'',
                    color:'',
                    weight:'',
                    brand:'',
                    material:'',
                },
                fittingsAttributes:{},
                formRules: {
                    serial_id: [
                        { required: true, message: i18n.t('请输入配件编号'), trigger: 'blur' },
                    ],
//                    name: [
//                        { required: true, message: '请输入配件名称', trigger: 'blur' },
//                    ],
                    type: [
                        {required: true, message: i18n.t('请选择类型'), trigger: 'change' }
                    ],
                    brand: [
                        { required: true, message: i18n.t('请选择配件品牌'), trigger: 'change' }
                    ],

                },
                picsConfig:{
                    param:{
                        cate:'stones',
                        accept:'.jpg,.png',
                        size:'500kb',
                        multi:false
                    }
                },
            }
        },
        computed: {
            stoneAttributes:function(){
                return this.fittingsAttributes.stone ? this.fittingsAttributes.stone : {};
            }
        },
        watch:{
            'updateFittingsArgs': function(newVal, oldVal) {
                if(newVal.type=='create'){
                    this.$refs['form'].resetFields();
                }
                this.fillFittings();
            },
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.fittingsCreate.code:
                    case uri.fittingsUpdate.code:
                        this.$emit('listenToSaveFittings',{});
                        break;
                    case uri.fittingsInfo.code:
                        this.form = json.data;
                        break;
                    case uri.fittingsAttributes.code:
                        this.fittingsAttributes = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.updateFittingsArgs.type =='update'?uri.fittingsUpdate : uri.fittingsCreate;
                        vk.http(url,that.form,that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm',{aa:123});
            },
            fillFittings(){
                if(this.updateFittingsArgs.type!='update') return;
                vk.http(uri.fittingsInfo,{id:this.updateFittingsArgs.id,__force:true},this.then);
            },
            receivePics(data){
                this.form.pic = data;
                console.log(data);
            },
        },
        mounted(){
            vk.http(uri.fittingsAttributes,{},this.then);
            this.fillFittings();
        }
    }
    export default {i18n,...App};
</script>
