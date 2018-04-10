<style lang="stylus" rel="stylesheet/scss">
    .image_preview {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 0px;
            line-height: 0px;
        }
    }

</style>
<template>
    <div style="display: inline-block;">
        <img :src="src" :style="mstyle" @click="openimageDialog"></img>
        <el-dialog class="image_preview" :modal="true"
                   :visible.sync="imageDialogVisible" :show-close="false" width="60%"
                   :append-to-body="true" top="50px">
            <img width="100%" :src="sourceView" />
        </el-dialog>
    </div>
</template>
<script>
    var App= {
        props: {
            src: {
                type: String,
                required: true,
            },
            source: {
                type: String,
                default: '',
            },
            mstyle: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                imageDialogVisible:false,
                sourceView:'',
            };
        },
        computed: {

        },
        mounted(){
            this.sourceView=this.source?this.source:this.src;
        },
        watch: {
            'src':function(){
                this.sourceView=this.source?this.source:this.src;
            }
        },
        methods: {
            openimageDialog(){
                this.imageDialogVisible = true;
            },
        }
    }
    export default App;
</script>