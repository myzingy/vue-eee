
<template>

		<el-tag v-if="cur_end_time" :title="show_time" :type="isExpired ? 'success' : 'danger'">{{show_time}}</el-tag>

</template>
<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import moment from 'moment'
    var App= {
        props: ['end_time'],
        data() {
            return {
                cur_end_time:0,
                timer:null,
			};
        },
        computed: {
            show_time:function(){
                moment.locale('zh-cn');
                return moment().to(moment(this.cur_end_time))
            },
            isExpired:function(){
                return moment().isBefore(moment(this.cur_end_time))
			}
        },
        mounted(){
			if(this.end_time) this.cur_end_time = this.end_time;
        },
        watch: {

        },
        methods: {

        }
    }
    export default {i18n,...App};
</script>