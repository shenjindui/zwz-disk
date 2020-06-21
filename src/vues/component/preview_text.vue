<template>
	<div style="height: 100%;width: 60%;margin: 0 auto;background:white;">
			
		<!--头部-->
		<div class="top">
			<el-radio-group v-model="code" style="margin-left: 30px;" @change="changeCode">
				<el-radio label="UTF-8">UTF-8编码</el-radio>
	  			<el-radio label="GBK">GBK编码</el-radio>
  			</el-radio-group>
  			(<span style="color: red;">温馨提示：如果内容显示乱码,请更改编码进行预览</span>)
  			
  			<el-button-group class="btn">
  				<el-button type="default" size="mini" icon="el-icon-download" @click="download">下载</el-button>
				<el-button type="default" size="mini" icon="el-icon-share" @click="share">分享</el-button>
				<el-button type="default" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
				<el-button type="default" size="mini" icon="el-icon-s-order" @click="historyUI">历史</el-button>
			</el-button-group>
		</div>
		
		<!--内容展示-->
		<div class="content" style="overflow-x: auto;">
			<pre>{{value}}</pre>
		</div>
		
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" :show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<share ref="form" v-if="dialog.type=='share'" v-on:shareClose="shareClose"></share>
			<edithistory ref="form" v-if="dialog.type=='edithistory'"></edithistory>
		</el-dialog>
	</div>
</template>

<script>
	import share from '../common/dialog_share.vue';
	import edithistory from '../common/dialog_edithistory.vue';
	
	export default {
        data() {
            return {
            	token:"",
            	code:"UTF-8",
            	value:"",
            	info:{
            		id:"",
            		filename:"",
            		filemd5:""
            	},
            	dialog:{
      				width:"",
      				type:"",
      				visible: false,
      				title:''
      			}
            }
        },
        components:{
			share,
			edithistory
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
        	download(){
				location.href=this.baseurl+"disk/filedownload/download?fileid="+this.info.id+"&token="+this.token;
			},
			share(){
				var name=this.info.filename;
				var id=this.info.id;
				
				this.dialog.width="800px";
				this.dialog.title="分享文件："+name+"共1个文件";
				this.dialog.visible=true;
				this.dialog.type="share";
				
				var arrs=new Array();
				arrs.push({
					"id":id
				});
				
				setTimeout(()=>{
					this.$refs.form.setData(JSON.stringify(arrs),name,0);
				},0);
			},
			edit(){
				//跳转到预览界面
				this.$router.push({
					path:"/component/edit_text",
					query:{
						"id":this.info.id,
						"filename":this.info.filename,
						"filemd5":this.info.filemd5,
						"token":this.token
					}
				});
			},
			historyUI(){
				this.dialog.width="1000px";
				this.dialog.title="编辑版本";
				this.dialog.visible=true;
				this.dialog.type="edithistory";
				setTimeout(()=>{
					this.$refs.form.showList(this.info.id);
				},0);
			},
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			}
        }
    }
</script>

<style scoped>
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
		background: #303030;
	  	color: #f1f1f1;
	}
</style>
