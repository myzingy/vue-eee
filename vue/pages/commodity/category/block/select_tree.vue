<template>
    <div style="position: absolute;z-index:99">
        <el-tree
                :data="data" :props="defaultProps"
                ref="tree"
                show-checkbox
                :node-key="keyName"
                :check-strictly="true"
                :default-checked-keys="selected"
                @check-change="handleCheckChange">
        </el-tree>
    </div>

</template>

<script>
    import i18n from '../../../../local'
    import vk from '../../../../vk.js'
    import uri from '../../../../uri.js'
    let App ={
        props: {
            site_id: {
                type: String,
                default: () => ''
            },
            selectedCategory: {
                type: Array,
                default: () => []
            },
            keyName:{
                type: String,
                default: () => 'id'
            }
        },
        data() {
            return {
                data:[
                    {
                        id:0,
                        magento_id:0,
                        name:i18n.t('选择类目'),
                        children:[]
                    }
                ],
                selected:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        computed: {
        },
        mounted(){
            if(this.selectedCategory) this.selected = this.selectedCategory;
            vk.http(uri.commodityCategoryTree,{site_id:this.site_id},this.then);
        },
        watch:{
            'selectedCategory':function(newVal){
                this.$refs.tree.setCheckedKeys(newVal);
            },
        },
        methods : {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.commodityCategoryTree.code:
                        this.$set(this.data[0],'children',json.data);
                        break;
                }

            },
            handleCheckChange(data) {
                let keys = this.$refs.tree.getCheckedNodes().map(t => {return t[this.keyName]})
                let selectMagento = this.$refs.tree.getCheckedNodes().map(t => {return t.magento_id})
                this.$emit('listenCategorySelect',[keys,selectMagento]);
            }
        }
    }
    export default {i18n,...App};
</script>
