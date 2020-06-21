<template>
	<el-row>
	  	<el-col :span="24">
	  		<el-card class="box-card" v-loading="loading" v-if="filetype==0">
	  			<table class="table">
	  				<tr>
	  					<td class="tdleft">子文件夹数量：</td>
	  					<td>{{folderinfo.foldernum}}</td>
	  				</tr>
	  				<tr>
	  					<td class="tdleft">子文件数量：</td>
	  					<td>{{folderinfo.filenum}}</td>
	  				</tr>
	  				<tr>
	  					<td class="tdleft">文件夹大小：</td>
	  					<td>{{folderinfo.totalsizename}}</td>
	  				</tr>
	  			</table>
			</el-card>
			<el-card class="box-card" v-loading="loading" v-if="filetype==1">
				<table class="table">
	  				<tr>
	  					<td class="tdleft">文件大小：</td>
	  					<td>{{fileinfo.filesize}}</td>
	  				</tr>
	  				<tr>
	  					<td class="tdleft">图片尺寸：</td>
	  					<td>{{fileinfo.imgsize}}</td>
	  				</tr>
	  				<tr>
	  					<td class="tdleft">文件MD5码：</td>
	  					<td>{{fileinfo.filemd5}}</td>
	  				</tr>
	  			</table>
			</el-card>
		</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				fileid:"",
				filetype:0,
				folderinfo:{
					foldernum:0,
					filenum:0,
					totalsizename:""
				},
				fileinfo:{
					filesize:"",
					imgsize:"",
					filemd5:""
				}
			}
		},
		methods:{
			showInfo(fileid,filetype){
				this.fileid=fileid;
				this.filetype=filetype;
				
				if(filetype==0){
					this.showFolderInfo();
				}else if(filetype==1){
					this.showFileInfo();
				}
			},
			showFolderInfo(){
				this.loading=true;
    			this.$http.post('disk/filecommon/findFolderProp',{
    				"id":this.fileid,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.folderinfo.filenum=data.data.filenum;
						this.folderinfo.foldernum=data.data.foldernum;
						this.folderinfo.totalsizename=data.data.totalsizename;
					}else{
						this.alertMsg(data.code,data.msg);
					}
    				this.loading=false;
				});
			},
			showFileInfo(){
				this.loading=true;
    			this.$http.post('disk/filecommon/findOne',{
    				"id":this.fileid,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.fileinfo.filesize=data.data.filesize;
						this.fileinfo.imgsize=data.data.imgsize;
						this.fileinfo.filemd5=data.data.filemd5;
					}else{
						this.alertMsg(data.code,data.msg);
					}
    				this.loading=false;
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.table{
		width: 100%;
	}
	.table .tdleft{
		width: 120px;
		text-align: right;
		padding-right: 10px;
	}
</style>