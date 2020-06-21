<template>
	<div style="height: 100%;">
		<div style="text-align: center;box-sizing: border-box;padding-top: 10px;">
			<span style="color: red;">{{pageInfo}}</span>
			<el-button-group>
				<el-button type="default" size="mini" icon="el-icon-download" @click="download">下载</el-button>
				<el-button type="default" size="mini" icon="el-icon-share" @click="shareUI">分享</el-button>
				<el-button type="default" size="mini" icon="el-icon-picture">水印</el-button>
				<el-button type="default" size="mini" icon="el-icon-crop">裁剪</el-button>
				<el-button type="default" size="mini" icon="el-icon-setting" @click="setAlbumImg" v-if="info.type=='0'">设置封面</el-button>
				<el-button type="default" size="mini" icon="el-icon-document" @click="showInfo">基本信息</el-button>
			</el-button-group>
		</div>
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" :show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<share ref="form" v-if="dialog.type=='share'" v-on:shareClose="shareClose"></share>
			<info ref="form" v-if="dialog.type=='info'"></info>
		</el-dialog>
	</div>
</template>

<script>
	import share from '../common/dialog_share.vue';
	import info from './thumbnail_info.vue';
	
	export default{
		data(){
			return {
				token:"",
				pageInfo:"",
				info:{
					id:"",
					filename:"",
					type:"",
					albumid:""
				},
				dialog:{
      				width:"",
      				type:"",
      				visible: false,
      				title:''
      			}
			}
		},
		created(){
			this.info.type=this.$route.query.type;//0关联相册，1未关联相册
			this.info.albumid=this.$route.query.albumid;
			this.token=this.$route.query.token;
		},
		components:{
			share,
			info
		},
		methods:{
			setData(id,name,pageInfo){
				this.info.id=id;
				this.info.filename=name;
				this.pageInfo=pageInfo;
			},
			download(){
				location.href=this.baseurl+"disk/filedownload/download?fileid="+this.info.id+"&token="+this.token;
			},
			shareUI(){
				var name=this.info.filename;
				var id=this.info.id;
				
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
			showInfo(){
				this.dialog.width="600px";
				this.dialog.title="图片信息";
				this.dialog.visible=true;
				this.dialog.type="info";
				setTimeout(()=>{
					this.$refs.form.setData(this.info.id,this.token);
				},0);
			},
			setAlbumImg(){
				this.$confirm('是否将该图片设置为相册默认封面?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.$http.post('disk/filealbum/setAlbumCover',{
        				"fileid":this.info.id,
        				"albumid":this.info.albumid,
        				"token":this.token
        			}).then(response => {
						var data=response.body;
						this.alertMsg(data.code,data.msg);
					});
        		});
			},
			/////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			shareClose(){
				this.dialog.visible=false;
				this.dialog.type="";
			}
		}
	}
</script>

<style scoped="scoped">
</style>