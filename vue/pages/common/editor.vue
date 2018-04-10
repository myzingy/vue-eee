<style lang="stylus" rel="stylesheet/scss">
    .quill-editor {
        max-height: 400px;
        .ql-container {
            min-height: 100px;
            .ql-editor{
                max-height: 350px;
                overflow-y: auto;
            }
        }
        .ql-snow .ql-picker {
            line-height: 24px;
        }
    }

    .limit {
        height: 30px;
        border: 1px solid #ccc;
        line-height: 30px;
        text-align: right;

        span {
            color: #ee2a7b;
        }
    }

    .ql-snow .ql-editor img {
        max-width: 480px;
    }

    .ql-editor .ql-video {
        max-width: 480px;
    }
    #toolbar { display: none;}
</style>
<template>
    <quillEditor v-model="content"
                 :ref="myTextEditor"
                 :options="editorOption"
                 @change="onChange"
    >
        <div id="toolbar" slot="toolbar">
            <button type="button" @click="imgClick" :class="quillImageInput"></button>
        </div>
    </quillEditor>
</template>
<script>
    import i18n from '../../local'
    import {quillEditor} from 'vue-quill-editor' //调用编辑器
    import upload from './upload.vue'
    import vk from '../../vk';
    import uri from '../../uri';
    var App = {
        components: {
            quillEditor,
            upload
        },
        props: {
            value: {
                type: String
            },
            /*上传图片的地址*/
//            uploadUrl: {
//                type: String
//            },
            /*上传图片的file控件name*/
//            fileName: {
//                type: String
//            },
            /*option*/
            option: {
                type: Object,
                required: false,
            }
        },
        data () {
            //var toolbarOptions = ['bold', 'italic', 'underline', 'strike','blockquote','image'];
            var toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike','blockquote','image'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                
                ['clean']                                         // remove formatting button
            ];
            let that=this;
            return {
                fileName:'file',
                content: '',
                editorOption: {
                    modules: {
                        //toolbar: '#toolbar'
                        toolbar:{
                            container:toolbarOptions,
                            handlers: {
                                'image': function () {  // 劫持原来的图片点击按钮事件
                                    //document.querySelector('.quill-image-input').click()
                                    document.querySelector('.'+that.quillImageInput).click()
                                }
                            }
                        }

                    }
                },
            }
        },
        methods: {
            then(json, code){
                switch (code) {
                    case uri.upload.code:
                        this.editor.insertEmbed(this.editor.getSelection().index, 'image', vk.cgi(json.data.path));
                        break;
                }
            },
            onChange(){
                this.$emit('input', this.content)
            },
            /*选择上传图片切换*/
            onFileChange(e){
                var self = this;
                var fileInput = e.target;
                if (fileInput.files.length == 0) {
                    return;
                }
                this.editor.focus();
                var data = new FormData;
                data.append(this.fileName, fileInput.files[0]);
                vk.http(uri.upload, data, this.then);
            },
            /*点击上传图片按钮*/
            imgClick() {
                if (!this.uploadUrl) {
                    console.log('no editor uploadUrl');
                    return;
                }
                /*内存创建input file*/
                var input = document.createElement('input');
                input.type = 'file';
                input.name = this.fileName;
                input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
                input.onchange = this.onFileChange;
                input.click();
            },
            val(){
                return this.content.trim();
            },
            initPage(){
                this.content = this.value;
            },
        },
        computed: {
            quillImageInput(){
                return 'quill-image-input-'+parseInt(Math.random()*10000);
            },
            myTextEditor(){
                return 'myTextEditor';
            },
            editor() {
                console.log('computed','editor......')
                return this.$refs[this.myTextEditor].quill;
            }
        },
        mounted(){
            console.log('mounted','====')
            this.content = this.value;
            this.uploadUrl = this.uploadUrl ? this.uploadUrl
                : vk.cgi(uri.upload);
            if (!this.option) {
                this.option = {
                    'editor': 'mini', //mini|mid|max
                    'buttons': [],
                    'height': 280,
                }
            }
        },
        watch: {
            'value'(newVal, oldVal) {
                if (this.editor) {
                    if (newVal !== this.content) {
                        this.content = newVal
                    }
                }
            },
        }
    }
    export default {i18n, ...App}
</script>