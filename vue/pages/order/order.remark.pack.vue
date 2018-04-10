<style lang="stylus" rel="stylesheet/scss">
    .remarks {
        img{max-width: 100px; max-height: 100px;}
    }
</style>
<template>
    <div class="remarks" v-if="$router.power('remark')">
        <div class="form-read">
            <h4>{{$t('客服备注')}}</h4>
            <div style="margin-left: 50px;">
                <el-table
                        :data="getRemarks"
                        border
                        style="width:99%;">
                    <el-table-column
                            prop="uid"
                            label="User"
                            width="160"
                    >
                        <template slot-scope="props">
                            {{props.row.nickname}}({{props.row.uid}})
                            <br>
                            {{date('',props.row.created_at)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Content"
                    >
                        <template slot-scope="props">
                            <div v-if="props.row.imgs" class="comment-list-image">
                                <span v-for="(src,key) in props.row.imgs">
                                    <v-img :src="src"></v-img>
                                </span>
                            </div>
                            <div v-html="props.row.content"></div>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </div>
        <el-button type="primary" @click="addRemark" size="medium"
                   style="margin-left: 50px; margin-top: 5px;">
            {{$t('添加客服备注')}}
        </el-button>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    var App= {
        props:['order'],
        computed:{
            getRemarks(){
                let data=this.order.remarks;
                if(data){
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
                }
                return data;
            },
        },
        data () {
            return {

            };
        },
        mounted(){

        },
        methods: {
            ...vk,
            addRemark(){
                this.$emit('openCommentDialog',223,this.order);
            },
        }
    }
    export default {i18n,...App}
</script>