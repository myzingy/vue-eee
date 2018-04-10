<style lang="stylus" rel="stylesheet/scss">
	.btn
		padding 50px
		text-align center
		button
			padding 5px 10px


</style>
<template>
	<div>
		<v-header :title="$t('退出')">
			<router-link slot="left" to="/home">{{$t('返回')}}</router-link>
		</v-header>
		<div class="btn">
			<button v-on:click="submit">{{$t('确认退出')}}</button>
		</div>
	</div>
</template>
<script>
    import { mapActions } from 'vuex'
    import { USER_SIGNOUT } from '../../store/user.js'
    import i18n from '../../local'
    let App = {
        methods: {
            ...mapActions([USER_SIGNOUT]),
            submit() {
                this.USER_SIGNOUT()
                //window.localStorage.clear();
                this.removeStorage('user');
				this.$router.replace({ path: '/login' })
            },
			removeStorage(prefix){
                var arr = []; // Array to hold the keys
				// Iterate over localStorage and insert the keys that meet the condition into arr
                for (var i = 0; i < localStorage.length; i++){
                    let sub_key = this.isBase64(localStorage.key(i)) ? atob(localStorage.key(i)) : localStorage.key(i)
                    if (sub_key.substring(0,prefix.length) == prefix) {
                        arr.push(localStorage.key(i));
                    }
                }

				// Iterate over arr and remove the items by key
                for (var i = 0; i < arr.length; i++) {
                    localStorage.removeItem(arr[i]);
                }
			},
            isBase64(str) {
				try {
					return btoa(atob(str)) == str;
				} catch (err) {
					return false;
				}
			}
        }
    }
    export default {i18n,...App};
</script>