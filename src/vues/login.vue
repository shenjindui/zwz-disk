<template>
	<div style="background: #fff;height: 100%;padding-top: 100px;box-sizing: border-box;">
		<el-card class="box-card login">
		  	<div slot="header" class="clearfix">
		  		<img src="../assets/img/logo.png" />
		    	<!--<span style="color: black;font-weight: bold;">企业网盘登录入口</span>-->
		  	</div>
		  	<el-form ref="form" :model="form" label-width="0px" v-loading="loading">
  				<el-form-item>
    				<el-input v-model="form.username" class="input" placeholder="请输入登录账号"></el-input>
  				</el-form-item>
  				<el-form-item>
    				<el-input type="password" v-model="form.password" class="input" placeholder="请输入登录密码"></el-input>
  				</el-form-item>
  				<el-form-item>
    				<el-button type="warning" class="input" @click="onSubmit">登录</el-button>
  				</el-form-item>
  			</el-form>
  			<p style="color: blue;">登录账号：test&nbsp;&nbsp;登录密码：test</p>
  			<p style="color: blue;margin-bottom: 10px;">登录账号：admin&nbsp;&nbsp;登录密码：123456</p>
  			<p style="color: red;">温馨提示：服务器容量有限，会对网盘系统的数据进行不定时的清理，敬请谅解！</p>
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				form:{
					username:'',
					password:''
				}
			}
		},
		created(){
		},
		methods:{
			onSubmit(){
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
						this.$router.push("/main");
					}
				});
			}
		}
	}
</script>

<style>
	.login{
		width: 500px;
		height: 564px;
		margin: 0 auto;
		padding: 64px 75px 48px;
		box-sizing: border-box;
		-webkit-box-shadow: 0px 20px 80px 0px rgba(0,0,0,0.3);
	}
	.input{
		width: 100%;
	}
</style>