<style lang="stylus" rel="stylesheet/scss">
    .el-transfer-panel {width: 40%}
</style>
<template>
    <el-transfer v-model="users_data" :data="allData"
                 :footer-format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                    }"
    >
    </el-transfer>
</template>

<script>
    import Vue from 'vue'
    import vk from '../../vk.js';
    import uri from '../../uri.js';
    import i18n from '../../local'
    var App= {
        props:['users','role_id'],
        data:function(){
            return {
                users_data: [],
                allData:[],
                rightChecked:[],
                radio:"1",
            }
        },
        mounted(){
            this.initPage();
        },
        methods:{
            initPage(){
                this.generateData();
                this.users_data=this.users;
            },
            getFormData(){
                return this.users_data;
            },
            generateData(){
                var data=[];
                var conf=vk.getCache(uri.getConf)['data'];
                if(conf.users.length>0){
                    conf.users.map((r)=>{
                        data.push({
                            key: r.id,
                            label: r.username,
                        });
                    });
                }
                this.allData=data;
            },
            then(json,code){
                switch(code) {
                    case uri.bindRoles.code:
                        this.$emit('submitRelation');
                        break;
                }
            },
            submitRelation(){
                vk.http(uri.bindRoles,{'data':this.users_data,'type':'users','role':this.role_id},this.then);
            },
        },
    }
    export default {i18n,...App}
</script>