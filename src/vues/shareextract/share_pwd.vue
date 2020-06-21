<template>
	<div style="height: 100%;background: #F2F6FC;">
		<el-container style="height: 100%;">
			<el-header class="header">
				<span class="logo">
					<img src="../../assets/img/logo.png" />
				</span>												
				<!--<el-link type="primary" class="topright"><i class="el-icon-switch-button"></i>退出</el-link>
				<el-link type="success" class="topright"><i class="el-icon-s-custom"></i>{{nickname}}</el-link>-->
			</el-header>
			<el-main style="height: 100%;padding-top: 200px;box-sizing: border-box;">
				<el-card class="box-card login" :body-style="{padding:'0px'}">
				  	<div class="loginheader">
				  		<i class="el-icon-user-solid"></i>
				  		{{shareuser}}给您分享了私密文件
				  	</div>
				  	
				  	<el-form v-loading="loading" ref="form" label-position="top" :model="form" label-width="150px" style="padding: 20px;">
		  				<el-form-item label="请输入提取码：">
		    				<el-input v-model="form.code" style="width: 300px;" placeholder="请输入提取码"></el-input>
		    				<el-button type="primary" @click="validateCode">提取文件</el-button>
		  				</el-form-item>
		  				<el-form-item>
		    				<span style="color: red;">{{form.errormsg}}</span>
		  				</el-form-item>
		  			</el-form>
				</el-card>
    		</el-main>
		</el-container>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				form:{
					shareuser:"",
					id:"",
					code:"",
					errormsg:""
				}
			}
		},
		created(){
			var id=this.$route.params.id;
			this.form.id=id;
			
			this.findOne();
		},
		methods:{
			findOne(){
				this.loading=true;
    			this.$http.post('disk/shareextract/findShareInfo',{
    				"id":this.form.id
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						if(data.data.sharetype==0){
							//有码提取
							this.shareuser=data.data.shareuser;
						}else{
							//无码提取
							this.$router.push({
							    path:'/sharelist/'+this.form.id
							});
						}
					}else{
						this.alertMsg(data.code,data.msg);
					}
    				this.loading=false;
				});
			},
			validateCode(){
				this.loading=true;
    			this.$http.post('disk/shareextract/validateCode',{
    				"id":this.form.id,
    				"code":this.form.code
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						var token=data.data;
						if(token!=null&&token.length!=0){
							sessionStorage.setItem("sharecodetoken",token);
						}
						
						this.$router.push({
						    path:'/sharelist/'+this.form.id
						});
					}else{
						this.form.errormsg=data.msg;
					}
    				this.loading=false;
				});
			}
		}
	}
</script>

<style>
	.header{
		background: white;
		/*box-shadow: 0 6px 0 rgba(0,0,0,.05);
		z-index: 11111;*/
		border-bottom: 1px solid #f4f4f4;
		box-shadow: 0px 3px 3px rgba(0,0,0,.05);
		z-index: 1111;
	}
	.logo{
		display: inline-block;
		height: 60px;
		line-height: 60px;
	}
	.logo img{
		vertical-align: middle;
	}
	.topright{
		float: right;
		margin-right: 30px;
		margin-top: 20px;
	}
	
	.loginheader{
		line-height: 60px;
		background: #409EFF;
		color: white;
		padding-left: 10px;
	}
	.login{
		box-sizing: border-box;
		width: 450px;
		height: 230px;
		margin: 0 auto;
	}
</style>