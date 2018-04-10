<style lang="stylus" rel="stylesheet/scss">
    .comment-list-image {
        img{
            width: 100px;
            height: 100px;
        }
    }
</style>
<template>
    <div>
    <el-table :data="commentList" v-loading="popoverCommentLoading()" border
              style="width:100%;height:100%;">
        <el-table-column width="120" prop="name" :label="$t('备注人')">
            <template slot-scope="scope">
                {{getUserName(scope.row.uid)}}
            </template>
        </el-table-column>
        <el-table-column :label="$t('内容')">
            <template slot-scope="scope">
                <div>

                    <el-alert
                            :title="$t('order.history.'+scope.row.subject) "
                            type="success"
                            :closable="false">
                        <i style=" padding-left: 20px;" v-date="['',scope.row.created_at]"></i>
                    </el-alert>
                    <div v-if="scope.row.imgs" class="comment-list-image">
                        <span v-for="(src,key) in scope.row.imgs">
                            <v-img :src="src"></v-img>
                        </span>
                    </div>
                    <span v-html="scope.row.content"></span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    </div>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
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

        },
        components:{
        },
        data () {
            return {
                getDataing:false,
                commentList:[],
            };
        },
        mounted(){
            this.getData();
        },
        methods: {
            ...vk,
            then(json,code){
                this.getDataing=false;
                this.commentList=this.formatHtml(json.data);
            },
            popoverCommentLoading(){
                return this.getDataing;
            },
            getData(){
                this.getDataing=true;
                vk.http(uri.getComment,{type:this.type,target_id:this.target.id},this.then);
            },
            formatHtml(data){
                data.map(function(item){
                    let imgs=[];
                    item.content=item.content.replace(/<img src="([^"]+)">/g,function($0,$1){
                        imgs.push($1);
                        return ' ';
                    });
                    if(imgs){
                        item.imgs=imgs;
                    }
                    return item;
                });
                return data;
            },
        }
    }
    export default {i18n,...App}
</script>