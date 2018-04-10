<style lang="stylus" rel="stylesheet/scss">

</style>
<template>

    <v-layout>
        <div slot="main">
			<div v-if="loading">
				
			</div>
	    </div>
    </v-layout>
</template>
<script>
    var App= {
        data () {
            return {
                loading:false
            };
        },
        mounted(){
            this.loading=true;
        },
    }
    export default App;
</script>