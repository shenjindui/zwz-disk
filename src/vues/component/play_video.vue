<template>
	<div style="height: 100%;background: #F2F6FC;">
		<el-container style="height: 100%;">
			<el-header class="header">
				<span class="logo">
					<img src="../../assets/img/logo.png" />
				</span>							
				<el-button-group style="float: right;margin-right: 10px;margin-top: 15px;">
  					<el-button type="primary" size="mini" icon="el-icon-download" @click="download">下载</el-button>
  					<el-button type="primary" size="mini" icon="el-icon-share" @click="share">分享</el-button>
				</el-button-group>
				<span style="color: red;float: right;margin-right: 10px;margin-top: 17px;">温馨提示：不支持.avi格式的视频在线播放,请下载到本地播放.</span>
			</el-header>
			<el-main style="height: 100%;box-sizing: border-box;">
				<el-card class="box-card login" style="width: 1000px;margin: 0 auto;">
					<div style="line-height: 30px;font-size: 14px;">
						{{video.filename}}
						(<span style="color: red;">{{video.filesize}}</span>)
					</div>
					<video :src="url" controls="controls" style="width: 100%;">您的浏览器不支持视频播放</video>
				</el-card>
    		</el-main>
		</el-container>
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
            	dialog:{
      				width:"",
      				type:"",
      				visible: false,
      				title:''
      			},
      			token:"",
            	video:{
            		id:"",
            		filename:"",
            		filesize:""
            	},
               	url:""
            }
        },
        components:{
			share
		},
        created(){
        	this.video.id=this.$route.query.id;
        	this.video.filename=this.$route.query.filename;
        	this.video.filesize=this.$route.query.filesize;
        	this.token=this.$route.query.token;
        	this.url=this.baseurl+"disk/fileopen/writeByte?fileid="+this.video.id+"&token="+this.token;
        },
        methods:{
        	download(){
				location.href=this.baseurl+"disk/fileedit/download?fileid="+this.video.id+"&token="+this.token;
			},
			share(){
				var name=this.video.filename;
				var id=this.video.id;
				
				this.dialog.width="800px";
				this.dialog.title="分享文件："+name+"共1个图片";
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
	.header{
		background: white;
		/*box-shadow: 0 6px 0 rgba(0,0,0,.05);
		z-index: 11111;*/
		border-bottom: 1px solid #f4f4f4;
		box-shadow: 0px 3px 3px rgba(0,0,0,.05);
		z-index: 1111;
	}
	.logo{
		display: inline-block;
		height: 60px;
		line-height: 60px;
	}
	.logo img{
		vertical-align: middle;
	}
</style>
