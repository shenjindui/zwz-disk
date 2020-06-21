<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card">
	  			<el-form ref="form" :inline="false" :model="form" label-width="0px" v-loading="loading">
		  			<el-form-item label="">
		    			<el-input v-model="form.filename" placeholder="请输入名称" style="width: 360px;">
		    				<template slot="append">.{{form.filesuffix}}</template>
		    			</el-input>
		    			<el-button type="primary" @click="save">开始创建</el-button>
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
					pid:"",
					filename:"",
					filesuffix:""
				}
			}
		},
		methods:{
			setSuffix(suffix,pid){
				this.form.filesuffix=suffix;
				this.form.pid=pid;
			},
			save(){
				var filename=this.form.filename;
				if(filename==null||filename.length==0){
					this.alertMsg(1,"请输入文档名称");
					return;
				}
				
				this.$confirm('是否继续创建文档?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.$emit('closeAndRefresh');
        			
        			var code="";
        			if(this.form.filesuffix=="md"){
        				code="create_markdown";
        			}else if(this.form.filesuffix=="txt"){
        				code="create_text";
        			}
        			
        			var routerJump=this.$router.resolve({
						path:"/component/"+code,
						query:{
							pid:this.form.pid,
							filename:this.form.filename+"."+this.form.filesuffix,
							token:sessionStorage.getItem("token")
						}
					});
					window.open(routerJump.href,'_blank');
        		});
			}
		}
	}
</script>

<style scoped="scoped">
</style>