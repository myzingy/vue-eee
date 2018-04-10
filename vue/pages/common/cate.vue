<style lang="stylus" rel="stylesheet/scss">
</style>
<template>
    <el-tree
            :data="tableData"
            :props="defaultProps"
            show-checkbox
            ref="tree"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @check-change="checkChange"
            :render-content="renderContent">
    </el-tree>
</template>
<script>
    import i18n from '../../local'
    import vk from '../../vk';
    import uri from '../../uri';
    var App= {
        components:{

        },
        props: {
            cate:{
                type:String,
                required: true,
                default:"",
            },
            multiple:{
                type:Boolean,
                default:false,
            }

        },
        data () {
            return {
                tableData:[],
                cate_id:"",
                defaultProps:{
                    children:'children',
                    label:'id',
                },
            }
        },
        mounted(){

        },
        methods: {
            then(json,code){
                switch(code) {
                    case uri.getCategories.code:
                        this.setTableData(json.data);
                        console.log(this.tableData);
                        break;
                }
            },
            initPage(cate){
                let catex=cate||this.cate;
                console.log('this.cate',catex);
                this.$refs.tree.setCheckedKeys([]);
                if(catex){
                    //this.$refs.tree.setCheckedKeys([]);
                    let conf=vk.getCache(uri.getConf)['data'].CATE;
                    console.log('cate',conf);
                    if(conf[catex]){
                        this.cate_id=conf[catex];
                        console.log('cate_id',catex);
                        this.getData();
                    }else{
                        this.cate_id= catex;
                        console.log('cate_id',catex);
                        this.getData();
                    }
                }
            },
            getData(){
                vk.http(uri.getCategories,{},this.then);
            },
            setTableData(data){
                if(typeof data == 'object'){
                    data.map((_d)=>{
                        if(_d.id==this.cate_id) {
                            _d.disabled=true;
                            this.tableData=[_d];
                            return false;
                        }
                        if(_d.children){
                            return this.setTableData(_d.children);
                        }
                    });
                }
            },
            checkChange(node,flag){
                console.log('checkChange',node,flag);
                if(this.multiple){ //多选
                    this.$emit('checkChangeAfter',node.id,flag);
                    return;
                }
                if(flag){
                    this.$refs.tree.setCheckedKeys([]);
                    this.$refs.tree.setCheckedKeys([node.id]);
                    this.$emit('checkChangeAfter',node.id);
                }
            },
            getCateID(){
                return this.$refs.tree.getCheckedKeys()[0];
            },
            getCateIds(){
                return this.$refs.tree.getCheckedKeys();
            },
            renderContent(h, { node, data, store }) {
                return (
                        <span style="width:100%">
                        <span>
                            <span>{i18n.t('order.issue.'+node.label)}</span>
                        </span>
                    </span>
                );
            },
        }
    }
    export default {i18n,...App}
</script>