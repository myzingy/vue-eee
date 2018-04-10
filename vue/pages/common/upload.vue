
<template>

		<el-upload
				class="upload-demo"
				:action="uri"
				:multiple="configs.multi"
				:accept="configs.accept"
				:data="configs"
				:on-remove="handleRemove"
				:on-success="handleSuccess"
				:file-list="fileList"
				list-type="picture-card">
			<el-button size="small" type="primary">{{$t('点击上传')}}</el-button>
			<div slot="tip" class="el-upload__tip">
				<el-button v-if="fileList.length>1" v-for="(value, key) in fileList" :key="key" @click="sortPics(key)" size="small" type="primary">←</el-button>
			</div>
			<div slot="tip" class="el-upload__tip">{{$t('上传限制',{ext:configs.accept,'size':configs.size})}}</div>
		</el-upload>

</template>
<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    var App= {
        props: ['param','pics'],
        data() {
            return {
                uri:'/api/'+uri.upload.act,
                fileList:[]
			};
        },
        computed: {
            configs:function(){
                let def = {multi:true,accept:'.jpg,.png',size:'500kb'};
                if(!this.param){
                    return def
                }
                return Object.assign(def, this.param);
            },
            currentPics: function () {
                let pics = [];
                for(let i=0;i<this.fileList.length;i++){
					pics.push(this.fileList[i].id);
				}
                return pics;
            }
        },
        mounted(){
			//this.fillFileList();
        },
        watch: {
            pics: function(newVal, oldVal) { // watch it
                this.fillFileList();
            }
        },
        methods: {
            handleRemove(file, fileList) {
                let that = this;
                var formData = new FormData();
                formData.append('id', file.id);
                vk.http(uri.removeFile,formData,function(success){
                    console.log(success);
                    that.fileList = fileList.filter(t => t.id != formData.id);
                    that.sendMsgToParent(that.currentPics);
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
                this.fileList = fileList2;
                if(!this.configs.multi && fileList.length>1){
                    this.handleRemove(fileList[0],fileList);
				}
                this.sendMsgToParent(this.currentPics);
			},
			fillFileList(){
                let that = this;
                if(!that.pics || that.pics.length==0) {
                    that.fileList = [];
                    return;
				};
                let fids = that.pics;
                if(typeof fids =='string') fids = fids.split(',');
                vk.http(uri.getFile,{pics:fids},function(json){
                    if(json.code ==200){
                        let list = [];
                        for(let i=0;i<json.data.length;i++){
                            list[i] = {id:json.data[i].id,name:json.data[i].name,url:json.data[i].path};
                            list[i].response = {code:200,data:list[i]};
                        }
                        that.fileList = list;
                    }else{
                        that.$message(json.message);
                    }
                });
			},
            sortPics(key){
			    if(key==0) return;
			    let one = this.fileList[key];
			    this.fileList.splice(key,1);
			    this.fileList.splice(key-1,0,one);
                this.$emit('listenToPics',this.currentPics);
			},
			sendMsgToParent(pics){
                this.$emit('listenToPics',pics)
			}
        }
    }
    export default {i18n,...App};
</script>