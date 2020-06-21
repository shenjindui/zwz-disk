<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card">
	  			<el-form ref="form" :inline="false" :model="form" :rules="rules" label-width="100px" v-loading="loading">
		  			<el-form-item label="名称：" prop="name">
		    			<el-input v-model="form.name" placeholder="请输入文件夹名称" style="width: 250px;"></el-input>
		    			<el-button type="primary" @click="save">保存</el-button>
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
					pid:'',
					name:""
				},
				rules: {
          			name: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }]
				}
			}
		},
		methods:{
			setPid(pid){
				this.form.pid=pid;
				this.form.name="";
			},
			save(){
				this.$refs['form'].validate((valid) => {
        			if (valid) {
        				this.$confirm('此操作将创建文件夹, 是否继续?', '提示', {
		          			confirmButtonText: '确定',
		          			cancelButtonText: '取消',
		          			type: 'warning'
		        		}).then(() => {
		        			this.loading=true;
		        			this.$http.post('disk/filecommon/addFolder',{
		        				"pid":this.form.pid,
		        				"name":this.form.name,
		        				"token":sessionStorage.getItem("token")
		        			}).then(response => {
								var data=response.body;
								if(data.code==0){
							        this.$emit('closeAndRefresh');
								}
								this.alertMsg(data.code,data.msg);
		        				this.loading=false;
							});
		        		});
          			}
        		});
			}
		}
	}
</script>

<style scoped="scoped">
</style>