<template>
    <div>
        <el-cascader :placeholder="$t('common.please_select')"
                     :expand-trigger="configs.expandTrigger"
                     :options="categoryTree"
                     :clearable="true"
                     v-model="categorySelected"
                     @change="selectChange"
                     :change-on-select="configs.changeOnSelect"
                     :props="categoryProps">
        </el-cascader>
    </div>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    let App ={
        props: ['category_id','params'],
        data() {
            return {
                categoryTree:[],
                categoryList:[],
                categorySelected:[],
                categoryProps: {
                    value: 'key',
                    label: 'name',
                },
            }
        },
        computed: {
            configs:function(){
                if(!this.params){
                    return {changeOnSelect:false,expandTrigger:'hover'};
                }
                return this.params;
            }
        },
        mounted(){
            vk.http(uri.categoryTree,{status:1},this.then);
        },

        methods : {
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.categoryTree.code:
                        this.categoryTree = json.data;
                        //this.fillSelect();
                        break;
                }

            },
            init(){
                this.fillSelect();
            },
            selectChange(){
                let index = this.categorySelected[this.categorySelected.length-1];
                if(!index){
                    this.$emit('listenCategorySelect',{category_id:0,categorySelected:[]});
                }
                let categoryList = this.getCategoryList();
                for(let i=0;i<categoryList.length;i++){
                    if(categoryList[i].key==index){
                        this.$emit('listenCategorySelect',{category_id:categoryList[i].id,categorySelected:this.categorySelected});
                        break;
                    }
                }
            },
            tree2list:function(node){
                let list = [];
                for(let i=0;i<node.length;i++){
                    list.push({id:node[i].id,key:node[i].key,pid:node[i].pid});
                    if(node[i].children){
                        let son = this.tree2list(node[i].children);
                        for(let j=0;j<son.length;j++){
                            list.push({id:son[j].id,key:son[j].key,pid:son[j].pid});
                        }
                    }
                }
                return list;
            },
            fillSelect(){
                if(this.category_id){
                    let cateList = this.getCategoryList();
                    this.categorySelected = this.getNodeOfCategory(this.category_id,cateList);
                    this.$emit('listenCategorySelect',{category_id:this.category_id,categorySelected:this.categorySelected});
                }

            },
            getCategoryList(){
                if(this.categoryList.length==0){
                    this.categoryList = this.tree2list(this.categoryTree);
                }
                return this.categoryList;
            },
            getNodeOfCategory(category_id,list){
                let vv = '';
                let res = [];
                for(let i in list){
                    if(list[i].id==category_id){
                        vv = list[i];
                        res.unshift(list[i].key);
                        break;
                    }
                }
                if(vv=='') return [];
                while(vv.pid!=0){
                    for(let i in list){
                        if(list[i].id==vv.pid){
                            vv = list[i];
                            res.unshift(list[i].key);
                            break;
                        }
                    }
                }

                return res;
            },
            clearSelect(){
                this.categorySelected = [];
            }
        }
    }
    export default {i18n,...App};
</script>
