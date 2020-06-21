<template>
	<div style="height: 100%;width: 60%;margin: 0 auto;background:white;">
		<div class="top">
  			<el-button type="default" size="mini" @click="save" icon="el-icon-plus" class="btn">保存文档</el-button>
		</div>
		<div class="content">
			<codemirror v-model="value" :options="options" class="editor"></codemirror>
		</div>
	</div>
</template>

<script>
	export default {
        data() {
            return {
            	token:"",
            	info:{
            		pid:"",
					filename:""
            	},
            	value:"",
	            options: {
	                lineNumbers: true,
	                highlightDifferences: true
	            }
            }
        },
        created(){
        	this.info.pid=this.$route.query.pid;
			this.info.filename=this.$route.query.filename;
			this.token=this.$route.query.token;
        },
        methods:{
			save(){
				this.$confirm('是否保存文档?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/fileedit/addFile',{
        				"pid":this.info.pid,
        				"filename":this.info.filename,
        				"content":this.value,
        				"token":this.token
        			}).then(response => {
        				this.loading=false;
						var data=response.body;
						if(data.code==0){
							//跳转到预览界面
							this.$router.push({
								path:"/component/preview_text",
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
		box-sizing: border-box;
	}
	.editor{
		border:1px solid #DCDFE6;
	}
</style>
