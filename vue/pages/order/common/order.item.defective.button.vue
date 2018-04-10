<style lang="stylus" rel="stylesheet/scss">
      .box{
          width: 80px;
          height: 80px;
          padding: 0;
          margin: 0;
          overflow: hidden;
          img{
              width: 100%;
              height: 100%;
              padding: 0;
              margin: 0;
              overflow: hidden;
          }
      }
</style>
<template>
    <div>
        <el-button type="warning"
                   @click="openCommentDialog()">
            {{$t('次 品')}}
        </el-button>
        <el-dialog :visible.sync="outerCommonDialogVisible"
                   :fullscreen="false"
                   :modal="true"
                   :close-on-click-modal="true"
                   :close-on-press-escape="true"
                   append-to-body
                   :title="$t('添加次品')"
        >

            <el-form ref="form" :model="item" label-width="80px" :rules="rules">

                <el-form-item label="SKU">
                    <el-input v-model="item.sku" readonly></el-input>
                </el-form-item>
                <el-form-item :label="$t('次品原因')">
                    <cate ref="cate" :cate="'96'" :multiple="true" style="max-height: 300px;overflow-y: auto;"></cate>
                </el-form-item>
                <el-form-item :label="$t('次品数量')" prop="num">
                    <el-input v-model="item.num"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <div class="box">
                        <v-img :src="itemThumb()"></v-img>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="outerDialogSave"
                           type="primary">
                    {{$t('保 存')}}
                </el-button>
                <el-button @click="outerCommonDialogVisible = false">{{$t('关 闭')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'

    import i18n from '../../../local'
    import comment from '../../common/comment.vue'
    import cate from '../../common/cate.vue';
    var App= {
        props:['item'],
        components:{
            comment,
            cate
        },
        data () {
            return {
                outerCommonDialogVisible:false,
                rules: {
                    num:[ {type:'string',
                        pattern: /^[1-9][\d]*$/,
                        trigger: 'blur',
                        required: true,
                        message:"invalid number" }],
                },
            };
        },
        mounted(){

        },
        methods: {
            ...vk,
            then(json,code){
                switch(code) {
                    case uri.itemDefectiveAdd.code:
                        this.item.num="";
                        this.outerCommonDialogVisible=false;
                        break;
                }
            },
            outerDialogSave(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.item.cate_ids=this.$refs.cate.getCateIds();
                        if(this.item.cate_ids==''){
                            vk.alert(i18n.t('原因必填'));
                            return false;
                        }
                        vk.http(uri.itemDefectiveAdd,this.item,this.then);
                    } else {
                        return false;
                    }
                });
            },
            openCommentDialog(){
                this.outerCommonDialogVisible=true;
                var that = this;
                setTimeout(function(){
                    that.$refs.cate.initPage(96);
                },300)
            },
            itemThumb(){
                let url=vk.cgi('file/product?id='+this.item.product_id);
                if(this.item.attr){
                    try{
                        let attr=JSON.parse(this.item.attr);
                        return attr[0].remote_url || url;
                    }catch(e){}
                }
                return url;
            },

        }
    }
    export default {i18n,...App}
</script>