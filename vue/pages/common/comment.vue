<style lang="stylus" rel="stylesheet/scss">
</style>
<template>
    <div>
        <template v-if=" cateStr=='307' ">
            <el-tabs type="border-card" @tab-click="handleTabsClick" v-model="tabsChecked">
                <template v-for="item in form.items">
                    <el-tab-pane :name="item.id" v-if="item.item_type!='fictitious'
                    && item.item_type!='suit' && item.item_status=='shipped'">
                        <span slot="label" >
                            <el-checkbox :label="item.id" :key="item.id"
                                         v-model="mod.item_o_ids[item.id]">
                                {{""}}
                            </el-checkbox>
                            {{item.sku}}<i v-if="item.size_type!='none'">({{item.size_type}})</i>
                        </span>
                        <div style="font-size: 14px;">
                            <el-radio-group v-model="mod.item_o_type[item.id]" @change="itemTypeChange"
                                            style="float: left; margin-top: 5px;">
                                <el-radio label="1010">{{$t('退 货')}}</el-radio>
                                <el-radio label="1003">{{$t('换 货')}}</el-radio>

                            </el-radio-group>
                            <el-input style="width:150px; margin-left: 20px; margin-top: -10px;"
                                      v-model="mod.item_o_num[item.id]"
                                      :placeholder="$t('Return quantity')"
                                      value="1"
                            ></el-input>
                            <cate :ref="getCateRef(item.id)" :cate="mod.item_o_type[item.id]"
                                  @checkChangeAfter="checkChangeAfter"
                                  style="max-height: 300px;overflow-y: auto;" :multiple="true"></cate>
                        </div>
                    </el-tab-pane>
                </template>
            </el-tabs>

        </template>

        <el-form label-position="top" label-width="80px" :model="form">
            <el-form-item v-if=" cateStr=='307' ">
                <el-col :span="11">
                    <el-form-item :label="$t('物流公司')" >
                        <el-input v-model="mod.shipping_method"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item :label="$t('物流单号')" >
                        <el-input v-model="mod.shipping_track_no"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item v-if=" cateStr=='1011' ">
                <el-checkbox-group v-model="mod.item_ids">
                    <el-checkbox v-for="item in form.items" :label="item.id" :key="item.id"
                                 v-if="item.item_type!='fictitious'
                    && item.item_type!='suit' && item.item_status=='shipped'">{{item.sku}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="" v-if="showCate">
                <cate ref="cate" :cate="cateStr" style="max-height: 300px;overflow-y: auto;"></cate>
            </el-form-item>
            <el-form-item :label="$t('退款金额')" v-if=" cateStr=='1005' ">
                <el-input v-model="mod.refund"></el-input>
            </el-form-item>

            <el-form-item :label="cateStr=='223'?$t('Remark details'):$t('备注信息')">
                <editor :value="textarea" :option="{}" ref="textarea"></editor>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import i18n from '../../local'
    import editor from './editor.vue';
    import cate from './cate.vue';
    import vk from '../../vk';
    import uri from '../../uri';
    let mod={
        item_ids:[],
        catex_ids:[],
        item_o_ids:{},
        item_o_type:{},
        item_o_type_cate:{},
        item_o_num:{},
    };
    var App= {
        components:{
            editor,
            cate,
        },
        props: {
            form:{
                type:Object,
            },
            params:{
                type:Object,
                required: true,
            },

        },
        data () {

            return {
                cateStr:"",
                showCate:false,
                textarea:"",
                obj:{},
                mod:JSON.parse(JSON.stringify(mod)),
                tabsChecked:0,
                tabsCheckedPrev:0,
            }
        },
        mounted(){

        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.setComment.code:
                        this.$emit('commentSaveAfter',this.obj);
                        break;
                }
            },
            commentSave(obj){
                let textarea=this.$refs.textarea.val();

                if(!textarea){
                    vk.toast(i18n.t('备注')+' '+i18n.t('validate.required'));
                    return false;
                }
                obj.textarea=textarea;
                if(this.showCate){
                    let issue_tags=this.$refs.cate.getCateID();
                    if(!issue_tags){
                        vk.toast(i18n.t('类目')+' '+i18n.t('validate.required'));
                        return false;
                    }
                    obj.issue_tags=issue_tags;
                }
                if(this.cateStr=='1011'){ //重发
                    if(this.mod.item_ids.length<1){
                        vk.toast('Item '+i18n.t('validate.required'));
                        return false;
                    }
                }
                if(this.mod) obj['mod']=this.mod;
                this.obj=obj;
                vk.http(uri.setComment,obj,this.then);
            },
            initPage(cateStr,showCate=false){
                this.cateStr=cateStr;
                this.showCate=showCate;
                this.mod= JSON.parse(JSON.stringify(mod));
                this.textarea='';
                let that=this;
                let old_items=JSON.stringify(this.form.items);
                this.form.items=[];
                setTimeout(function(){
                    if(that.showCate){
                        that.$refs.cate.initPage();
                    }
                    console.log('initPage',that.$refs);
                    if(that.form.items){
                        that.form.items.map((item,index)=>{
                            if(index==0){
                                that.tabsCheckedPrev=item.id;
                                that.tabsChecked=item.id;
                            }
                        });
                    }
                    that.$refs.textarea.initPage();
                    if(old_items){
                        that.form.items=JSON.parse(old_items);
                    }
                },100);

            },
            handleTabsClick($self){
                console.log('handleTabsClick',this.tabsCheckedPrev,this.tabsChecked,$self.name);
                this.tabsCheckedPrev=$self.name;
            },
            getCateRef(id){
                return 'catex_'+id;
            },
            itemTypeChange(val){
                console.log('itemTypeChange',val,this.tabsChecked);
                //this.mod.item_o_type_cate[this.tabsChecked]=""+val;
                let cid=this.getCateRef(this.tabsChecked);
                let com=this.$refs[cid][0];
                com.initPage(val);
                this.mod.item_o_type_cate[this.tabsChecked]="";
            },
            checkChangeAfter(cate_id,checkedFlag='none'){
                console.log('checkChangeAfter',cate_id);
                if(checkedFlag=='none'){
                    this.mod.item_o_type_cate[this.tabsChecked]=cate_id;
                }else{
                    let item_o_type_cate=this.mod.item_o_type_cate[this.tabsChecked]?
                        this.mod.item_o_type_cate[this.tabsChecked]:[];
                    if(checkedFlag){
                        item_o_type_cate.push(cate_id);
                    }else{
                        item_o_type_cate.splice(item_o_type_cate.findIndex(val => val === cate_id), 1);
                    }
                    console.log('checkChangeAfter::item_o_type_cate',item_o_type_cate);
                    this.mod.item_o_type_cate[this.tabsChecked]=item_o_type_cate;
                }

            }
        }
    }
    export default {i18n,...App}
</script>