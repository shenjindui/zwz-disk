<template>
	<div style="height: 100%;background: white;">
		<el-row :gutter="20" style="height: 100%;">
			<el-col :span="20" v-loading="loading" style="overflow-y: auto;height: 100%;overflow: auto;">
				<el-image :src="info.url" :preview-src-list="srcList" style="cursor: pointer;max-height:95%;max-width: 100%;"></el-image>
			</el-col>
			<el-col :span="4">
				<el-card class="box-card">
	  				<div slot="header" class="clearfix">
	  					<span>图片信息</span>
  						<el-dropdown trigger="click" size="mini" style="float: right;" @command="handleCommand">
  							<span class="el-dropdown-link" style="cursor: pointer;color: blue;">
    							更多操作<i class="el-icon-arrow-down el-icon--right"></i>
  							</span>
  							<el-dropdown-menu slot="dropdown">
						        <el-dropdown-item command="download" icon="el-icon-download">下载</el-dropdown-item>
						        <el-dropdown-item command="share" icon="el-icon-share">分享</el-dropdown-item>
						        <el-dropdown-item command="water" icon="el-icon-picture">水印</el-dropdown-item>
						        <el-dropdown-item command="crop" icon="el-icon-crop">裁剪</el-dropdown-item>
  							</el-dropdown-menu>
						</el-dropdown>
    					<!--<el-button type="text" size="mini" icon="el-icon-download" @click="download">下载</el-button>
						<el-button type="text" size="mini" icon="el-icon-share" @click="share">分享</el-button>
						<el-button type="text" size="mini" icon="el-icon-picture" @click="share">水印</el-button>
						<el-button type="text" size="mini" icon="el-icon-crop" @click="share">裁剪</el-button>-->
	  				</div>
	  				<ul class="ulinfo">
	  					<li class="limore"><i class="el-icon-document"></i>{{info.filename}}</li>
	  					<li><i class="el-icon-user"></i>{{info.createusername}}</li>
	  					<li><i class="el-icon-time"></i>{{info.createtime}}</li>
	  					<li><i class="el-icon-odometer"></i>{{info.imgsize}}</li>
	  					<li><i class="el-icon-odometer"></i>{{info.filesize}}</li>
	  					<li style="color: blue;">
	  						<span v-for="item in info.folders">{{item.name}}/</span>
	  					</li>
	  				</ul>
				</el-card>
			</el-col>
		</el-row>
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" :show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<share ref="form" v-if="dialog.type=='share'" v-on:shareClose="shareClose"></share>
		</el-dialog>
	</div>
</template>

<script>
	import share from '../common/dialog_share.vue';
	export default{
		data(){
			return {
				loading:false,
				token:"",
				srcList:[],
				info:{
					id:"",
					filename:"",
					filemd5:"",
					createusername:"",
					createtime:"",
					imgsize:"",
					filesize:"",
					url:"",
					folders:[]
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
			share
		},
		created(){
			this.info.id=this.$route.query.id;
			this.info.filename=this.$route.query.filename;
			this.info.filemd5=this.$route.query.filemd5;
			this.info.filesize=this.$route.query.filesize;
			this.token=this.$route.query.token;
			this.info.url=this.baseurl+"disk/fileopen/writeByte?fileid="+this.info.id+"&token="+this.token;
			this.srcList.push(this.info.url);
			
			this.showInfo();
			this.showFolder();
		},
		methods:{
			showInfo(){
				this.$http.post('disk/filecommon/findOne',{
    				"id":this.info.id,
    				"token":this.token
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.info.createusername=data.data.createusername;
						this.info.createtime=data.data.createtime;
						this.info.imgsize=data.data.imgsize;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			showFolder(){
				this.loading=true;
    			this.$http.post('disk/filecommon/findParentListById',{
    				"id":this.info.id,
    				"token":this.token
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.info.folders=[];
						this.info.folders.push({
							"id":"0",
							"name":"根目录"
						});
						for(var i=0;i<data.data.length;i++){
							this.info.folders.push({
								"id":data.data[i].id,
								"name":data.data[i].name
							});
						}
					}else{
						this.alertMsg(data.code,data.msg);
					}
    				this.loading=false;
				});
			},
			/////////////////////////////////////////////////////////////////////////////////////////////
			handleCommand(command){
				if(command=="download"){
					location.href=this.baseurl+"disk/filedownload/download?fileid="+this.info.id+"&token="+this.token;
				}else if(command=="share"){
					this.shareUI();
				}else if(command=="water"){
					
				}else if(command=="crop"){
					
				}
			},
			shareUI(){
				var name=this.info.filename;
				var id=this.info.id;
				
				this.dialog.width="800px";
				this.dialog.title="分享文件："+name+"共1张图片";
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
			waterUI(){
				
			},
			cropUI(){
				
			},
			/////////////////////////////////////////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			}
		}
	}
</script>

<style scoped="scoped">
	/*基本信息*/
	.ulinfo{
		
	}
	.ulinfo li{
		list-style-type: none;
		line-height: 30px;
		width: 100%;
		color: #606266;
		font-size: 12px;
	}
	.limore{
		white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    vertical-align: middle;
	}
	.ulinfo li i{
		margin-right: 10px;
		font-weight: bold;
	}
</style>