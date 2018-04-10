<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
            <el-form-item :label="$t('key')" prop="key">
                <el-input v-model="form.key"></el-input>
            </el-form-item>
            <el-form-item :label="$t('名称')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('类别')" prop="category">
                <el-input v-model="form.category"></el-input>
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
        props: ['updateSeriesArgs'],
        components:{
            upload_block
        },
        data() {
            return {
                form: {
                    key:'',
                    name:'',
                    category:''
                },
                formRules: {
                    key: [
                        { required: true, message: i18n.t('请输入key'), trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],


                },

            }
        },
        computed: {

        },
        watch:{
            'updateSeriesArgs': function(newVal, oldVal) {
                if(newVal.type=='create'){
                    this.$refs['form'].resetFields();
                }
                this.fillSeries();
            },
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.productSeriesCreate.code:
                    case uri.productSeriesUpdate.code:
                        this.$emit('listenToSaveSeries',{});
                        break;
                    case uri.productSeriesInfo.code:
                        this.form = json.data;
                        break;

                }
            },
            onSubmit(formName) {
                let that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let url = that.updateSeriesArgs.type =='update'?uri.productSeriesUpdate : uri.productSeriesCreate;
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
            fillSeries(){
                if(this.updateSeriesArgs.type!='update') return;
                vk.http(uri.productSeriesInfo,{id:this.updateSeriesArgs.id,__force:true},this.then);
            },
            receivePics(data){
                this.form.pic = data;
                console.log(data);
            },
        },
        mounted(){
            this.fillSeries();
        }
    }
    export default {i18n,...App};
</script>
