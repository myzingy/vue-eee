<style lang="stylus" rel="stylesheet/scss">
	.login
		padding 50px
		text-align center
		.line
			padding 5px
			input
				padding 0 10px
				line-height 28px


		button
			padding 0 20px
			margin-top 20px
			line-height 28px
	.fb-signin-button {
		display: inline-block;
		padding: 20px 20px;
		border-radius: 5px;
		background-color: #4267b2;
		color: #fff;
	}
</style>
<template>
	<div>
		<v-header title="ERP 3.0">
			<router-link slot="left" to="?"></router-link>
		</v-header>
		<el-card class="box-card">
			<el-form ref="form" :model="form" label-width="120px">
				<el-form-item label="User Name">
					<el-input v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item label="Pass Word">
					<el-input type="password" @keyup.enter.native="onSubmit" v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">Login</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
    import Vue from 'vue'
    import { mapActions } from 'vuex'
    import { USER_SIGNIN } from '../../store/user.js'
    import vk from '../../vk.js'
	import uri from '../../uri.js'
    export default {
        data() {
			return {
				form: {
					username: '',
                    password:'',
				},
			}
		},
		methods: {
			...mapActions([USER_SIGNIN]),
            mounted(){
                window.sessionStorage.clear();
            },
			then(json,code){
			    switch (code){
					case uri.login.code:
                        this.USER_SIGNIN(json.data);
                        if(!localStorage.getItem('data')){
                            localStorage.setItem('data', '{"MenuStyle":false}')
                        }
                        vk.http(uri.getConf,{__force:true},this.then);
					break;
                    case uri.getConf.code:
                        //this.USER_SIGNIN(this.form);
                        this.$router.replace({ path: '/home' })
                        setTimeout("location.reload();",500);
                        break;
				}
			},
            onSubmit() {
				vk.http(uri.login,this.form,this.then);
			},
		}
    }
</script>