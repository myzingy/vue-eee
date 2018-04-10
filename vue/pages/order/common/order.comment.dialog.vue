<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <el-dialog :visible.sync="outerCommonDialogVisible"
               :fullscreen="false"
               :modal="true"
               :close-on-click-modal="true"
               :close-on-press-escape="true"
               append-to-body
    >
        <comment ref="comment" :form="operationData" :params="{}" @commentSaveAfter="commentSaveAfter"></comment>
        <div slot="footer" class="dialog-footer">
            <el-button @click="outerDialogSave"
                       type="primary">
                {{$t('保 存')}}
            </el-button>
            <el-button @click="outerCommonDialogVisible = false">{{$t('关 闭')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'

    import i18n from '../../../local'
    import comment from '../../common/comment.vue'
    var App= {
        props:['order'],
        components:{
            comment,
        },
        data () {
            return {
                outerCommonDialogVisible:false,
                cateStr:'',
                operationData:{},
            };
        },
        mounted(){

        },
        methods: {
            ...vk,
            commentSaveAfter(obj){
                this.outerCommonDialogVisible=false;
                this.$emit('commentSaveAfter',obj);
            },
            outerDialogSave(){
                let type='order';
                if(this.operationData.order_id && this.operationData.sku){
                    type='order_item';
                }
                let operationData= JSON.parse(JSON.stringify(this.operationData));
                if(type=='order'){
                    delete operationData.histories;
                    delete operationData.remarks;
                    if(this.cateStr!=205){
                        delete operationData.address;
                    }
                    delete operationData.items;
                    delete operationData.package;
                }
                this.$refs.comment.commentSave({
                    type:type,
                    target_id:this.operationData.order_id || this.operationData.id,
                    item:operationData,
                    ext_order_id:this.operationData.ext_order_id,
                    code:this.cateStr,
                });
            },
            openCommentDialog(cateStr,params={}){
                this.operationData=this.order;
                console.log(cateStr,params);
                if(params.row){
                    this.operationData=params.row;
                }
                this.outerCommonDialogVisible=true;
                this.cateStr=cateStr;
                var that=this;
                setTimeout(function(){
                    that.$refs.comment.initPage(cateStr,cateStr>1000);
                },0);
            },

        }
    }
    export default {i18n,...App}
</script>