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

	<el-dialog class="image_preview" :modal="dialogModal"
			:visible.sync="imageDialogVisible" :show-close="false" :width="dialogWidth"
			:before-close="handleClose"
			:append-to-body="appendToBody">
		<img width="100%" :src="url" />
	</el-dialog>

</template>
<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    var App= {
        props: ['url','dialogVisible','width','modal','appendToBody'],
        data() {
            return {
                imageDialogVisible:false,
				dialogWidth:'30%',
				dialogModal:true,
				dialogAppendToBody:true,
			};
        },
        computed: {

        },
        mounted(){
            this.imageDialogVisible = this.dialogVisible;
            if(this.modal===false) this.dialogModal = false;
            this.setDialogWidth();
        },
        watch: {
            'dialogVisible':function(nVal){
                this.imageDialogVisible = nVal;
                this.setDialogWidth();
			}
        },
        methods: {
            setDialogWidth(){
                if(this.width){
                    if(this.width > window.screen.availWidth){
                        this.dialogWidth = '80%'
					}else{
                        this.dialogWidth = (this.width+40)+'px'
					}
				}
			},
            handleClose(done) {
                this.imageDialogVisible = false;
                this.$emit('closeImagePreview')
//                this.$confirm('确认关闭？')
//                    .then(_ => {
//                        done();
//                    })
//                    .catch(_ => {});
            },

        }
    }
    export default {i18n,...App};
</script>