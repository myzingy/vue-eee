<style lang="stylus" rel="stylesheet/scss">

</style>
<template>
    <div>
        <el-dialog :title="$t('详细信息')" :visible.sync="dialogTableVisible"
                   :fullscreen="false"
                   :append-to-body="true"
                   :modal="true"
                   width="80%"
                   top="50px"
        >
            <commentList :type="type" :target="target" ref="commentList"></commentList>
        </el-dialog>
        <template v-if="hasComment">
            <el-badge is-dot class="item" v-if="noSee" style="margin-top: 5px;">
                <el-button @click="getData" type="primary">{{$t('备注查看')}}</el-button>
            </el-badge>
            <el-button @click="getData" type="warning" v-else="">{{$t('备注查看')}}</el-button>
        </template>
    </div>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    import commentList from './comment.list.vue';
    var App= {

        props: {
            target:{
                type:Object,
                required: true,
            },
            type:{
                type:String,
                required: true,
            },
            noSee:{
                type:Boolean,
                default: false
            },
            hasComment:{
                type:Boolean,
                default: true
            }

        },
        components:{
            commentList
        },
        data () {
            return {
                dialogTableVisible:false,
            };
        },
        mounted(){
        },
        methods: {
            ...vk,
            popoverCommentLoading(){
                return this.getDataing;
            },
            getData(){
                this.noSee=false;
                this.dialogTableVisible=true;
                let that=this;
                setTimeout(function(){
                    that.$refs.commentList.getData();
                },100);

            },
        }
    }
    export default {i18n,...App}
</script>