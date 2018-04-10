<style lang="stylus" rel="stylesheet/scss">
    .el-transfer-panel {width: 40%}
</style>
<template>
    <el-transfer :filterable="true" v-model="power_data" :data="allData"
                 :footer-format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                    }"></el-transfer>
</template>

<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js';
    import uri from '../../uri.js';
    import i18n from '../../local'
    import menux from '../../config/menu';
    var App= {
        props:['power','role_id','user_id'],
        data:function(){
            return {
                power_data: [],
                allData:[],
                menu:{},
            }
        },
        computed: mapState({
            lang:state => state.data.lang||"zh",
        }),
        mounted(){
            i18n.locale=this.lang;
            this.menu=menux(i18n);
            this.initPage();
        },
        methods:{
            initPage(){
                this.generateData();
                if(this.user_id){
                    this.getUserPower();
                }else{
                    this.power_data=this.power;
                }

            },
            getFormData(){
                 return this.power_data;
            },
            generateData(){
                var data=[];
                var conf=vk.getCache(uri.getConf)['data'];
                if(conf.power.length>0){
                    conf.power.map((r)=>{
                        data.push({
                            key: r.id,
                            label: this.powerLabel(r.name),
                        });
                    });
                }
                this.allData=data;
            },
            powerLabel(name){
                 for(let i in this.menu){
                     if(i==name) return this.menu[i].label;
                     if(this.menu[i].children){
                         let children=this.menu[i].children;
                         for(let ic in children){
                             if(ic==name) return this.menu[i].label+'-'+children[ic].label;
                         }
                     }
                }
                return i18n.t(name);
            },
            then(json,code){
                switch(code) {
                    case uri.bindRoles.code:
                        this.$emit('submitRelation');
                        break;
                    case uri.getPermissions.code:
                        let power=[];
                        json.data.map((r)=>{
                            power.push(r.id);
                        });
                        this.power_data=power;
                        break;
                }
            },
            submitRelation(){
                if(this.user_id){
                    vk.http(uri.bindRoles,{'data':this.power_data,'type':'u2p','role':this.user_id},this.then);
                }else{
                    vk.http(uri.bindRoles,{'data':this.power_data,'type':'power','role':this.role_id},this.then);
                }
            },
            getUserPower(){
                vk.http(uri.getPermissions,{'user_id':this.user_id,'type':'user'},this.then);
            }
        },
    }
    export default {i18n,...App}
</script>