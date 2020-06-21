<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card">
	  			<el-form ref="form" :inline="false" :model="form" label-width="0px" v-loading="loading">
		  			<el-form-item label="">
		    			<el-input v-model="form.filename" placeholder="请输入名称" style="width: 360px;">
		    				<template slot="append" v-if="form.filetype==1">.{{form.filesuffix}}</template>
		    			</el-input>
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
					id:'',
					filename:"",
					filesuffix:"",
					filetype:""
				}
			}
		},
		methods:{
			showInfo(id){
				this.$http.post('disk/filecommon/findOne',{
    				"id":id,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.form.id=data.data.id;
						this.form.filesuffix=data.data.filesuffix;//格式
						this.form.filetype=data.data.filetype;//0文件夹，1文件
						//文件名称
						if(this.form.filetype==0){
							this.form.filename=data.data.filename;
						}else if(this.form.filetype==1){
							var filename=data.data.filename;
							var basename = filename.substring(0,filename.lastIndexOf('.'));
							this.form.filename=basename;
						}
					}else{
						this.alertMsg(code,msg);
					}
				});
			},
			save(){
				this.$confirm('此操作将重命名文件/文件夹, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			var name=this.form.filename;
        			if(this.form.filetype==1){
        				name=name+"."+this.form.filesuffix;
        			}
        			this.loading=true;
        			this.$http.post('disk/filecommon/rename',{
        				"id":this.form.id,
        				"filename":name,
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
		}
	}
</script>

<style scoped="scoped">
</style>