<template>
	<div style="height: 100%;background: #F2F6FC;">
		<!--内容展示-->
		<div class="content" style="overflow-x: auto;">
			<mavon-editor v-model="value" :editable="true" :navigation="true"
				 ref="md" @imgAdd="imgAdd" @imgDel="imgDel" @save="save"></mavon-editor>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				token:"",
				code:"UTF-8",
				value:"",
				info:{
					id:"",
					filename:"",
					filemd5:""
				}
			}
		},
		created(){
			this.info.id=this.$route.query.id;
			this.info.filename=this.$route.query.filename;
			this.info.filemd5=this.$route.query.filemd5;
			this.token=this.$route.query.token;
			
			this.showInfo();
		},
		methods:{
			showInfo(){
				this.$http.post('disk/fileopen/writeTextStr',{
    				"fileid":this.info.id,
    				"code":this.code,
    				"token":this.token
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.value=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			imgAdd(){
				alert("上传图片");
			},
			imgDel(){
				alert("删除图片");
			},
			save(){
				this.$confirm('是否保存文档?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/fileedit/editFile',{
        				"fileid":this.info.id,
        				"content":this.value,
        				"token":this.token
        			}).then(response => {
        				this.loading=false;
						var data=response.body;
						if(data.code==0){
							//跳转到预览界面
							this.$router.push({
								path:"/component/preview_markdown",
								query:{
									"id":data.data.id,
									"filename":data.data.filename,
									"filemd5":data.data.filemd5,
									"token":this.token
								}
							});
						}
						this.alertMsg(data.code,data.msg);
					});
        		});
			}
		}
	}
</script>

<style scoped="scoped">
	.top{
		border-left:1px solid #DCDFE6;
		border-right:1px solid #DCDFE6;
		border-top:1px solid #DCDFE6;
		height: 60px;
		line-height: 60px;
		background: #fcfcfc;
		box-sizing: border-box;
	}
	.top .btn{
		float: right;
		margin-top: 15px;
		margin-right: 10px;
	}
	.content{
		border:1px solid #DCDFE6;
		width: 100%;
		margin-bottom: 10px;
		box-sizing: border-box;
		padding: 10px;
	}
</style>