<template>
        <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
            <el-form-item :label="$t('标题')" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item :label="$t('名称')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('版本')" prop="version">
                <el-select v-model="form.version" @change="versionChange" :placeholder="$t('请选择')">
                    <el-option
                            v-for="item in ['v1','v2']"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <v1_config ref="v1_configs_id" v-if="form.version=='v1'" :configs="form.configs"></v1_config>
            <v2_config ref="v2_configs_id" v-if="form.version=='v2'" :configs="form.configs"></v2_config>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">{{$t('保存')}}</el-button>
                <el-button @click="closeForm">{{$t('取消')}}</el-button>
            </el-form-item>
        </el-form>
</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    import v1_config from './v1_config.vue'
    import v2_config from './v2_config.vue'
    let App ={
        props: ['updateSiteArgs'],
        components:{
            v1_config:v1_config,
            v2_config:v2_config,
        },
        data() {
            return {
                form: {
                    title:'',
                    name:'',
                    version:'',
                    shape:'',
                    configs:{},
                },
                formRules: {
                    title: [
                        { required: true, message: i18n.t('请输入标题'), trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: i18n.t('请输入名称'), trigger: 'blur' },
                    ],
                    version: [
                        {required: true, message: i18n.t('请选择版本'), trigger: 'change' }
                    ],

                }
            }
        },
        computed: {
        },
        watch:{
            'updateSiteArgs': function(newVal, oldVal) {
                if(newVal.type=='create'){
                    this.$refs['form'].resetFields();
                }
                this.fillSite();
            },
        },
        methods: {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.commoditySiteCreate.code:
                    case uri.commoditySiteUpdate.code:
                        this.$emit('listenToSaveSite',{});
                        break;
                    case uri.commoditySiteInfo.code:
                        this.form = json.data;
                        break;
                }
            },
            onSubmit(formName) {
                let flag = false;

                this.$refs[formName].validate(function(valid){
                    flag = valid;
                });

                let configs = false;
                if(this.form.version=='v1'){
                    configs = this.$refs.v1_configs_id.getData();
                }else{
                    configs = this.$refs.v2_configs_id.getData();
                }
                if(!configs) return;
                this.form.configs = configs;
                let url = this.updateSiteArgs.type =='update'?uri.commoditySiteUpdate : uri.commoditySiteCreate;
                vk.http(url,this.form,this.then);
            },

            closeForm(){
                this.$refs['form'].resetFields();
                this.$emit('closeForm',{aa:123});
            },
            fillSite(){
                if(this.updateSiteArgs.type!='update') return;
                vk.http(uri.commoditySiteInfo,{id:this.updateSiteArgs.id,__force:true},this.then);
            },
            versionChange(){

            }
        },
        mounted(){
            this.fillSite();
        }
    }
    export default {i18n,...App};
</script>
