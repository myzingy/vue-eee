<template>
	<div>
		<div :id="editorId" style="text-align:left"></div>
		<el-alert :title="tipMsg" type="info"></el-alert>
		<el-button type="primary" @click.native="clearEditor" icon="el-icon-delete"></el-button>

	</div>
</template>

<script>
    import E from 'wangeditor'
    export default {
        name: 'editor',
        props: ['editorId', 'editorContent','tipMsg'],
        data () {
            return {
                editor:null
            }
        },
        computed:{
            progressComplete:function(){

			}
		},
		watch:{
            'editorContent': function(newVal, oldVal) {
                let val = newVal ? newVal : '';
                this.editor.txt.html(val)
            },
		},
        methods: {
            listenToContent(html){
                this.$emit('listenToContent', html);
			},
            clearEditor(){
                this.editor.txt.clear();
                this.listenToContent('');
			}
        },
        mounted() {
            this.editor = new E('#'+this.editorId)

            this.editor.customConfig.onchange = (html) => {
				this.listenToContent(html);
            }
            this.editor.customConfig.uploadImgShowBase64 = true
            this.editor.create()
            this.editor.txt.html(this.editorContent)
        }
    }
</script>

<style scoped>
</style>