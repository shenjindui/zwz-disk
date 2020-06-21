<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card">
	  			<el-form ref="form" :inline="false" :model="form" label-width="100px" v-loading="loading">
		  			<el-form-item label="登录账号：">
		    			<el-input v-model="form.username" placeholder="请输入登录账号"></el-input>
		  			</el-form-item>
		  			<el-form-item label="登录密码：">
		    			<el-input v-model="form.password" placeholder="请输入登录密码" type="password"></el-input>
		  			</el-form-item>
		  			<el-form-item>
		    			<el-button-group>
		    				<el-button type="primary" @click="save">登录</el-button>
		    			</el-button-group>
		  			</el-form-item>
		  		</el-form>
			</el-card>
	  	</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				form:{
					username:'',
					password:""
				}
			}
		},
		methods:{
			save(){
				this.loading=true;
				this.$http.post('security/login',{
					"username":this.form.username,
					"password":this.form.password
				}).then(response => {
					this.loading=false;
					var data=response.body;
					this.alertMsg(data.code,data.msg);
					if(data.code==0){
						this.addSession(data.data.id,data.data.nickname,data.data.token);
						this.$emit('closeDialog',this.form.username);
					}
				});
			}
		}
	}
</script>

<style>
</style>