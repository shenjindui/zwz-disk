<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
					<el-form v-loading="loading" :inline="false" ref="form" :model="form" :rules="rules" label-width="100px">
			  			<el-form-item label="相册名称：" prop="albumname">
			    			<el-input v-model="form.albumname" class="input" placeholder="请输入相册名称"></el-input>
			  			</el-form-item>
			  			<el-form-item label="相册说明：">
			    			<el-input v-model="form.albumdesc" class="input" placeholder="请输入相册说明"></el-input>
			  			</el-form-item>
			  		</el-form>
  				</el-card>
		  	</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		data() {
			return {
				loading:false,
				form:{
					"albumid":"",
					"albumname":"",
					"albumdesc":""
				},
				rules: {
          			albumname: [{ required: true, message: '请输入相册名称', trigger: 'blur' }]
				}
			}
		},
		methods:{
			reset(){
				this.form.albumid="";
				this.form.albumname="";
				this.form.albumdesc="";
			},
			showInfo(albumid){
				this.loading=true;
				this.$http.post('disk/filealbum/findOne',{
					"albumid":albumid,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data= response.body;
					if(data.code==0){
						this.form.albumid=data.data.id;
						this.form.albumname=data.data.albumname;
						this.form.albumdesc=data.data.albumdesc;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
			save() {
        		this.$refs['form'].validate((valid) => {
        			if (valid) {
        				this.$confirm('此操作将保存表单, 是否继续?', '提示', {
		          			confirmButtonText: '确定',
		          			cancelButtonText: '取消',
		          			type: 'warning'
		        		}).then(() => {
		        			
		        			this.loading=true;
	        				this.$http.post('disk/filealbum/updateAlbum',{
	        					"albumid":this.form.albumid,
								"albumname":this.form.albumname,
								"albumdesc":this.form.albumdesc,
								"token":sessionStorage.getItem("token")
							}).then(response => {
								var data= response.body;
								if(data.code==0){
									this.reset();
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
	.input{
		width: 300px;
	}
</style>