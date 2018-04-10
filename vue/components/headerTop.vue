<style lang="stylus" rel="stylesheet/scss">
    .overflow-y{ overflow-y: auto;}
    .header .el-select{
        height:30px;
        &:hover .el-input__inner{
            background: #222;
            color:#fff;
            border: 0;
            height:30px;
        }
        .el-input__inner{
            background: #222;
            color:#fff;
            border: 0;
            height:30px;
        }
    }
</style>
<template>
    <div>
        <v-header :title="$t('统计')">
            <div slot="left">
                <i class="el-icon-menu" @click="setMenuStyle" :style="getMenuStyle()"></i>
                <el-select v-model="site.current" :placeholder="$t('Site')" @change="SiteSelected" style="width: 120px;" popper-class="header-select">
                    <el-option
                            v-for="item in site.list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="langx" :placeholder="$t('Language')" @change="LanguageChecked" style="width: 120px;" popper-class="header-select">
                    <el-option
                            v-for="item in [{key:'zh',label:'中 文'},{key:'en',label:'English'}]"
                            :key="item.key"
                            :label="item.label"
                            :value="item.key">
                    </el-option>
                </el-select>
            </div>
            <div slot="right">
                <el-button type="text" @click="openDialog()">{{user.nickname?user.nickname:user.username}} </el-button>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <router-link  to="/signout"> {{$t('登出')}}</router-link>
            </div>
        </v-header>
        <el-dialog :title="$t('编辑')" :visible.sync=" dialogTableVisible " :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <userForm ref="userForm"
                      :form="form"
                      :username="true"
                      v-on:submitRelation="submitRelation"></userForm>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="closeDialog">{{$t('取 消')}}</el-button>
                        <el-button type="primary" @click="updateDialog">{{$t('确 定')}}</el-button>
                      </span>
        </el-dialog>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState,mapActions } from 'vuex'
    import { SET } from '../store/data.js'
    import { USER_SIGNIN } from '../store/user.js'
    import vk from '../vk.js';
    import uri from '../uri.js';
    import i18n from '../local';
    import userForm from '../pages/system/userForm.vue';

    var App={
        components:{
            userForm
        },
        data:function(){
            return {
                contentHash:"",
                langx:'zh',
                site:{
                    current:'',
                    list:{}
                },
                dialogTableVisible:false,
                form:{},
            }
        },
        computed: mapState({
            user: state => state.user,
            lang:state => state.data.lang||"zh",
            c_site:state => state.data.site||"",
            MenuStyle:state => state.data.MenuStyle||false,
        }),
        mounted(){
            vk.loading(false);
            console.log('store.state.data',this.ac_id);

            this.langx=this.lang?this.lang:'zh';
            i18n.locale=this.langx;
            console.log('this.langx',this.langx);
            this.setContentHash(location.hash);
            this.getSiteList();
        },
        methods:{
            ...mapActions([SET,USER_SIGNIN]),
            acChecked:function(ac_id){
                var old_id=this.ac_id;
                this.CKECKED_AC({ac_id:ac_id});
                this.ac_idx=ac_id;
                if(old_id!=ac_id)
                    location.reload();
            },
            then(json,code){
                switch(code){
                    case uri.commoditySiteList.code:
                        this.site.list = json.list.map(t => {return {id:t.id,name:t.name,title:t.title}});

                        if(this.c_site) {
                            this.site.current = this.c_site;
                        }else{
                            this.site.list.length == 1 ? this.SiteSelected(this.site.list[0]) : false;
                        }
                }
            },
            getAcsList(){
                //vk.http(uri.getAcsList,{},this.then);
                //vk.http(uri.getFBAccounts,{},this.then);
            },
            setContentHash(hash){
                hash=hash.replace('#/','');
                //if(!hash) return;
                console.log('setContentHash',hash);
                this.contentHash=hash.replace('#/','');
            },
            LanguageChecked(lang){
                var old_id=this.lang;
                this.SET({lang:lang});
                //ElementUI.locale(lang);
                i18n.locale=lang;
                this.langx=lang;
                if(old_id!=lang)
                    location.reload();
            },
            SiteSelected(id){
                var old_id=this.c_site;
                this.SET({site:id,siteInfo:this.site.list.filter(t => t.id==id)[0]});
                if(old_id!=id)
                    location.reload();
            },
            openDialog(){
                this.dialogTableVisible=true;
                let that=this;
                Object.assign(this.form,this.user);
                setTimeout(function(){
                    that.$refs.userForm.initPage();
                },0);
            },
            closeDialog(){
                this.dialogTableVisible=false;
            },
            updateDialog(){
                this.$refs.userForm.submitRelation();
            },
            submitRelation(){
                this.USER_SIGNIN(this.form);
                this.closeDialog();
            },
            getSiteList(){
                vk.http(uri.commoditySiteList,{searchArgs:{auth:1}},this.then);
            },
            setMenuStyle(){
                this.SET({MenuStyle:!this.MenuStyle});
            } ,
            getMenuStyle(){
                return this.MenuStyle?{color:'#409EFF'}:{color:'#E6A23C'};
            }
        },
    }
    export default {i18n,...App}
</script>