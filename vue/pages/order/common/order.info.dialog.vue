<style lang="stylus" rel="stylesheet/scss">
    .orderInfoPack{width: 100%;float: left;}
</style>
<template>
    <el-dialog :title="$t('详细信息')" :visible.sync="outerDialogVisible" :fullscreen="false"
               :modal="true"
               width="95%"
               top="50px"
               :close-on-click-modal="true"
               :close-on-press-escape="true"
               class="dialog-compact"
    >
        <orderInfoPack ref="orderInfoPack" class="orderInfoPack"
                       :order="order" @openCommentDialog="openCommentDialog"
                       :style="{'overflow-y': 'auto',height:height(140)+'px'}"
        ></orderInfoPack>
        <!--
        <orderInfoPack ref="orderInfoPackRight" class="orderInfoPack"
                       :order="order" @openCommentDialog="openCommentDialog"
                       :style="{'overflow-y': 'auto',height:height(140)+'px'}"
        ></orderInfoPack>
        -->
        <div style="clear: both"></div>
    </el-dialog>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'

    import i18n from '../../../local'
    import orderInfoPack from  '../order.info.pack.vue';
    var App= {
        props:['order'],
        components:{
            orderInfoPack
        },
        data () {
            return {
                outerDialogVisible:false,
            };
        },
        mounted(){

        },
        methods: {
            ...vk,
            openCommentDialog(cateStr,params={}){
                that.$emit('openCommentDialog',cateStr,params);
            },
            initPage(){
                this.outerDialogVisible=true;
                let that=this;
                setTimeout(function(){
                    that.$refs.orderInfoPack.initPage();
                },0);
            },

        }
    }
    export default {i18n,...App}
</script>