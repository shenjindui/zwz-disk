<template>
	<div style="height: 100%;width: 60%;margin: 0 auto;background:white;">
		<div class="top">
			<el-radio-group v-model="code" style="margin-left: 30px;" @change="changeCode">
				<el-radio label="UTF-8">UTF-8编码</el-radio>
	  			<el-radio label="GBK">GBK编码</el-radio>
  			</el-radio-group>
  			(<span style="color: red;">温馨提示：如果内容显示乱码,请更改编码进行预览</span>)
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
            		id:"",
            		filename:"",
            		filemd5:""
            	},
            	code: "UTF-8",
            	value:"",
	            options: {
	                lineNumbers: true,
	                highlightDifferences: true
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
			changeCode(v){
        		this.code=v;
        		this.showInfo();
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
