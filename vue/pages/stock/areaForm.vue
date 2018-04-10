<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">

			<el-form-item :label="$t('国家地区简称')" prop="pr">
                <el-input v-model="form.shortname"></el-input>
            </el-form-item>

            <el-form-item :label="$t('名称')" prop="pr">
                <el-input v-model="form.name"></el-input>
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
                form: {
                    shortname:'',
                    name:'',
                },
                formRules: {
                    shortname: [
                        { required: true, message: i18n.t('请输入国家地区简称'), trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: i18n.t('请输入名称'), trigger: 'blur' },
                    ],
                }
            }
        },
        watch:{
            'dialogFormAttributes': function(newVal, oldVal) {
                if(newVal.type=='add'){
                    this.$refs['form'].resetFields();
                }
                this.getArea();
            },
        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.areaAdd.code:
                    case uri.areaUpdate.code:
                        this.$emit('listenToSave',{});
                        break;

                    case uri.getArea.code:
                        this.form = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.dialogFormAttributes.type =='add'?uri.areaAdd : uri.areaUpdate;
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
            getArea(){
                if(this.dialogFormAttributes.type!='update') return;
                vk.http(uri.getArea,{id:this.dialogFormAttributes.id},this.then);
            }
        },
        mounted(){
            this.getArea();
        }
    }
    export default {i18n,...App};
</script>
