<template>
	<div style="height: 100%;background: white;">
		
		<!--头部-->
		<div class="top">
			<el-button-group class="btn">
				<el-button type="default" size="mini" icon="el-icon-download" @click="download">下载</el-button>
				<el-button type="default" size="mini" icon="el-icon-share" @click="share">分享</el-button>
			</el-button-group>
		</div>
		
		<!--内容-->
		<iframe :src="url"></iframe>
		
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" :show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<share ref="form" v-if="dialog.type=='share'" v-on:shareClose="shareClose"></share>
		</el-dialog>
	</div>
</template>

<script>
	import share from '../common/dialog_share.vue';
	export default {
        data() {
            return {
            	token:"",
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
      			},
 				url:""
            }
        },
        components:{
			share
		},
        created(){
        	this.info.id=this.$route.query.id;
			this.info.filename=this.$route.query.filename;
			this.info.filemd5=this.$route.query.filemd5;
			this.token=this.$route.query.token;
			
			this.url=this.baseurl+"disk/fileopen/writeByte?fileid="+this.info.id+"&token="+this.token;
        },
        methods:{
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
	iframe{
		border:1px solid #DCDFE6;
		width: 100%;
		height: 90%;
		box-sizing: border-box;
	}
</style>
