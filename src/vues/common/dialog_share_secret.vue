<template>
	<div>
		<el-form ref="form" :model="form" label-width="150px">
			<el-form-item label="分享形式：">
    			<el-radio-group v-model="form.sharetype">
	      			<el-radio label="0">有提取码</el-radio>
	      			<el-radio label="1">无提取码</el-radio>
	    		</el-radio-group>
  			</el-form-item>
  			<el-form-item label="有效期：">
    			<el-radio-group v-model="form.effect">
	      			<el-radio label="0">永久有效</el-radio>
	      			<el-radio label="7">7天</el-radio>
	      			<el-radio label="1">1天</el-radio>
	    		</el-radio-group>
  			</el-form-item>
  			<el-form-item>
  				<el-button type="primary" @click="save">创建连接</el-button>
  			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				form:{
					fileids:"",
					title:"",
					sharetype:"0",
					effect:"0",
					type:""
				}
			}
		},
		methods:{
			setData(fileids,title,type){
				this.form.fileids=fileids;
				this.form.title=title;
				this.form.type=type;
			},
			save(){
				this.$confirm('此操作将分享文件, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filecommon/shareSecret',{
        				"idjson":this.form.fileids,
        				"title":this.form.title,
        				"sharetype":this.form.sharetype,
        				"effect":this.form.effect,
        				"type":this.form.type,
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.$emit('secretResult',data.data.url,data.data.code);
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