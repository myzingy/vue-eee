<template>
    <div>

<template  v-for="(item, index) in spu_set">

    <el-autocomplete
            v-model="input_spu_set[index]"
            :fetch-suggestions="querySearchAsync"
            valueKey="spu"
            :placeholder="$t('product.validate.input',{name:$t('product.product.spu')})"
            @select="productSelect($event,index)"
            @keyup.enter.native="addInput(index)" @keyup.delete.native="deleteInput(index)">
        <template slot-scope="props">
            <div class="name">{{ props.item.name }}</div>
            <span style="font-size: 12px;color: #b4b4b4;">{{ props.item.spu }}</span>
        </template>
    </el-autocomplete>

</template>
    </div>

</template>

<script>
    import i18n from '../../../../local'
    import vk from '../../../../vk.js'
    import uri from '../../../../uri.js'
    let App ={
        props: ['set','startNum'],
        data() {
            return {
                input_spu_set:[],
                spu_set:[],
                inputStartNum:1,
                copyUrlKey:'',
                formRules: {
                    category_id: [
                        { required: true, message: i18n.t('product.validate.choose',{name:i18n.t('product.product.category_name')}), trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: i18n.t('product.validate.input',{name:i18n.t('product.product.name')}), trigger: 'blur' },
                    ],
                }
            }
        },
        computed: {

        },
        mounted(){
            if(this.startNum) this.inputStartNum = this.startNum;
            this.spu_set = this.set && this.set.length>0 ? this.set : this.getDefaultNum();
            this.input_spu_set = JSON.parse(JSON.stringify(this.spu_set));
        },
        watch:{
            'set':function(val){
                this.spu_set = val && val.length>0 ? val : this.getDefaultNum();
                this.input_spu_set = JSON.parse(JSON.stringify(this.spu_set));
            },
            'startNum':function(val){
                if(val) this.inputStartNum = val;
                this.spu_set = this.set && this.set.length>0 ? this.set : this.getDefaultNum();

            },
        },
        methods : {
            fillFinish(){

                this.$emit('listenToSpuSet', this.spu_set);
            },
            addInput(index){
                this.input_spu_set.push('');
                this.spu_set.push('');
            },
            deleteInput(index){
                if(this.input_spu_set[index].length <=0){
                    if(this.input_spu_set.length > this.inputStartNum){
                        this.input_spu_set.splice(index,1);
                        this.spu_set.splice(index,1);
                    }else{
                        this.spu_set[index] = '';
                    }

                }
                this.$emit('listenToSpuSet', this.spu_set);
            },
            getDefaultNum(){
                return Array(this.inputStartNum).fill().map((e,i)=>'')
            },
            querySearchAsync(queryString, cb) {
                //if (!queryString || queryString.length < 3) return false;

                vk.http(uri.commodityList, {searchArgs: {spu: queryString}}, function (json, code) {
                    if (json.code != 200) {
                        this.$message(json.message);
                        return;
                    }
                    cb(json.list.map(function (v) {
                        return {spu: v.product.spu, name: v.product.name,id:v.id}
                    }));
                })

            },
            productSelect(item,index) {
                this.spu_set[index] = item.spu;
                this.$emit('listenToSpuSet', this.spu_set);
            },
        }
    }
    export default {i18n,...App};
</script>
