
<template>

    <v-layout>
        <div slot="main">
			<div style="padding: 10px;">
				<el-upload
						class="upload-demo"
						action="/api/user.upload"
						:multiple="param.multi"
						:data="param"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:file-list="fileList2"
						list-type="picture-card">
					<el-button size="small" type="primary">{{$t('点击上传')}}</el-button>
					<div slot="tip" class="el-upload__tip">{{$t('上传限制',{ext:'jpg/png','size':'500kb'})}}</div>
				</el-upload>
			</div>
	    </div>
    </v-layout>
</template>
<script>
    import i18n from '../../local'
    var App= {
        data() {
            return {
                param:{
                    cate:'product',
					multi:true
                },
                dialogImageUrl: '',
                dialogVisible: false,
                fileList2:[]
            };
        },
        methods: {
            handleRemove(file, fileList) {
                var formData = new FormData();
                formData.append('id', file.id);
                this.$http.post('/api/user.remove',formData).then(function(success){
					console.log(success);
				}, function(err){
                    console.log(err);
				});
            },
            handleSuccess(response, file, fileList){
                let fileList2 = [],index=0;
                for(let i in fileList){
                    if(fileList[i].status !='success') return;
                    if('response' in fileList[i] && fileList[i].response.code==200){
                        fileList2[index] = fileList[i];
                        fileList2[index].name = fileList[i].response.data.name;
                        fileList2[index].id = fileList[i].response.data.id;
                        index++;
					}
                }
                this.fileList2 = fileList2;
			},
            handlePictureCardPreview(file) {
                console.log(file);
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            }
        }
    }
    export default {i18n,...App};
</script>