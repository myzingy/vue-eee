
<template>
<div>
	<el-table v-if="!!formatData && formatData.length>0"
			:data="formatData"
			:show-header="false"
			border
			style="width: 100%">
		<el-table-column
				fixed
				prop="name"
				label="key"
                width="90"
        >
		</el-table-column>
		<el-table-column
				prop="content"
				label="val">
            <template slot-scope="props">
                <v-pen :value="props.row.content" :params="{key:'engravings',row:item,usDataKey:props.row.type+','+props.$index}"
                       @change="updatePen" :isPen="isPen"></v-pen>
            </template>
		</el-table-column>

	</el-table>
    <div v-for="(rows,key) in user_data.more">
        <el-alert
                :title="$t('product.user_set.'+key)"
                type="success"
                :closable="false">
        </el-alert>
        <el-table
                :data="rows"
                :show-header="false"
                border
                style="width: 95%; margin-left: 5%;">
            <el-table-column fixed prop="label" label="label">
                <template slot-scope="props">
                    {{key =='phrase' ? props.row.label : $t('product.user_set["'+props.row.label+'"]')}}
                    <span v-if="props.row.font">(字体：{{props.row.font}})</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="value"
                    label="value">
                <template slot-scope="props">
                    <v-pen :value="props.row.value" :params="{key:'more',row:item,usDataKey:key+','+props.$index}"
                           @change="updatePen" :isPen="isPen"></v-pen>
                </template>
            </el-table-column>

        </el-table>
    </div>

</div>
</template>
<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    var App= {
        props: ['user_data','isPen','item'],
        data() {
            return {
                cdata:'',
                title:'用户产品参数',
			};
        },
        computed: {
			formatData:function(){
			    let data = [],lst = this.user_data,has_engraving=false;
				for (var i in lst){
					switch (i){
						case 'color':
                            if(!!lst[i]) data.push({name:i18n.t('product.user_set.'+i),content:lst[i],type:'color'});
						    break;
                        case 'data':
                            let group = lst[i].length;
                            for (var j in lst[i]){
                                for(var k in lst[i][j].val){
                                    if(!!lst[i] && lst[i][j]['val'][k]){
                                        let sval = k=='stone' ? i18n.t('product.user_set.'+lst[i][j]['val'][k]) : lst[i][j]['val'][k];
                                        if(group>1 || isNaN(lst[i][j].key)){
                                            if((k+','+lst[i][j].key).indexOf('ngraving')>-1){
                                                has_engraving=true;
                                            }
                                            data.push({
                                                name:i18n.t('product.user_set.'+lst[i][j].key)+'['+i18n.t('product.user_set.'+k)+']',
                                                content:sval,
                                                type:k+','+lst[i][j].key
                                            });
										}else{
                                            if(k.indexOf('ngraving')>-1){
                                                has_engraving=true;
                                            }
                                            data.push({
                                                name:i18n.t('product.user_set.'+k),
                                                content:sval,
                                                type:k
                                            });
										}
									}
								}
                            }
                            break;
                        case 'more':
                            for (var j in lst[i]){
                                if(j.indexOf('ngraving')>-1){
                                    has_engraving=true;
                                }
                            }
                            break;

					}
				}
				if(!has_engraving && this.isPen){
				    data.push({
                        content: "",
                        name: i18n.t('product.user_set.engraving'),
                        type:"engraving",
                    });
                }
				return data;
			}
        },
        mounted(){
            this.cdata = this.user_data ? this.users_data : {};
        },
        watch: {

        },
        methods: {
            updatePen(val,params){
                console.log(val,params);
                var that=this;
                vk.confirm(i18n.t('修改订单信息可能会发生仓库变更，确认修改吗'),function(){
                    params.row.newVal=val;
                    if('engravings'==params.key || 'more'==params.key){
                        Object.assign(params.row,{'usDataKey':params.usDataKey,paramsKey:params.key});
                        that.$emit('openCommentDialog',204,params);
                    };
                });

            },
        }
    }
    export default {i18n,...App};
</script>