<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
            <el-form-item :label="$t('工厂名称')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('概率')" prop="weight">
                <el-input-number v-model="form.weight"></el-input-number>
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
        props: ['updateFactoryArgs'],
        components:{
        },
        data() {
            return {
                form: {
                    name:'',
                    weight:0,
                },
                formRules: {
                    name: [
                        { required: true, message: i18n.t('请输入名称'), trigger: 'blur' },
                    ],
                    weight: [
                        { validator: (rule, value, callback) => {
                            if (value <= 0 || value >1 ) {
                                callback(new Error(i18n.t('概率必须在0-1之间')));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur' }
                    ],


                }
            }
        },
        computed: {
        },
        watch:{
            'updateFactoryArgs': function(newVal, oldVal) {
                if(newVal.type=='create'){
                    this.$refs['form'].resetFields();
                }
                this.fillFactory();
            },
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.factoryCreate.code:
                    case uri.factoryUpdate.code:
                        this.$emit('listenToSaveFactory',{});
                        break;
                    case uri.factoryInfo.code:
                        this.form = json.data;
                        break;

                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.updateFactoryArgs.type =='update'?uri.factoryUpdate : uri.factoryCreate;
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
            fillFactory(){
                if(this.updateFactoryArgs.type!='update') return;
                vk.http(uri.factoryInfo,{id:this.updateFactoryArgs.id,__force:true},this.then);
            }
        },
        mounted(){
            this.fillFactory();
        }
    }
    export default {i18n,...App};
</script>
