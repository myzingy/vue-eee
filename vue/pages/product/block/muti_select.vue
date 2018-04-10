<template>
    <div>
        <el-select filterable v-model="curList" multiple @change="selectChange" :placeholder="placeholder">
            <el-option
                    v-for="(item,key) in optionList"
                    :key="key"
                    :label="item"
                    :value="key">
            </el-option>
        </el-select>
    </div>

</template>

<script>
    import i18n from '../../../local'
    import vk from '../../../vk.js'
    import uri from '../../../uri.js'
    let App ={
        props: ['list','placeholder','optionList'],
        data() {
            return {
                curList:[],
                copyUrlKey:'',
            }
        },
        computed: {

        },
        mounted(){

            this.assignList(this.list);
        },
        watch:{
            'list':function(newVal){
                this.assignList(newVal);
            },


        },
        methods : {
            selectChange:function(){
                this.$emit('listenSelect',this.curList);
            },
            assignList:function(list){
                if(!list){
                    this.curList = [];
                }else if(this.isJsonString(list)){
                    this.curList = JSON.parse(list);
                }else{
                    this.curList = list;
                }

            },
            isJsonString: function(str) {
                if(typeof str !='string') return false;
                try {

                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }
        }
    }
    export default {i18n,...App};
</script>
