<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card" v-loading="loading">
				<div style="text-align: center;">
					<span style="font-size: 16px;">{{file.title}}</span>
				</div>
				<div style="text-align: center;">
					共<span style="font-size: 12px;color: red;">{{file.totalsize}}</span>；
					共<span style="font-size: 12px;color: red;">{{file.foldernum}}</span>个文件夹；
					共<span style="font-size: 12px;color: red;">{{file.filenum}}</span>个文件
				</div>
				<div v-if="file.isbig==0">
					<div style="text-align: center;margin-top: 20px;">
						<el-input size="small" v-model="downloadname" placeholder="下载名称" style="width: 200px;"></el-input>
						<el-select size="small" v-model="downloadsuffix" placeholder="下载格式" style="width: 100px;">
    						<el-option label="zip" value="zip"></el-option>
    						<el-option label="rar" value="rar"></el-option>
  						</el-select>
						<el-button size="small" type="primary" @click="download">下载</el-button>
					</div>
				</div>
				<div v-if="file.isbig==1">
					<div style="color: red;text-align: center;">合并文件下载最大支持200M,超过200M请使用客户端进行下载!</div>
				</div>
	  		</el-card>
	  	</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				msg:"",
				idjson:"",
				downloadname:"",
				downloadsuffix:"",
				file:{
					title:"",
					totalsize:"",
					filenum:0,
					foldernum:0,
					isbig:0
				}
			}
		},
		methods:{
			setData(idjson,title){
				this.idjson=idjson;
				this.file.title=title;
				this.getDownloadInfo();
			},
			getDownloadInfo(){
				this.loading=true;
    			this.$http.post('disk/filedownload/getDownloadInfo',{
    				"idjson":this.idjson,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
    				this.loading=false;
					var data=response.body;
					if(data.code==0){
						this.file.totalsize=data.data.totalsizename;
						this.file.filenum=data.data.filenum;
						this.file.foldernum=data.data.foldernum;
						this.file.isbig=data.data.isbig;
					}else{
						this.msg=data.msg;
					}
				});
			},
			download(){
				if(this.downloadname==null||this.downloadname.length==0){
					this.alertMsg(1,"请填写下载文件名称");
					return;
				}
				if(this.downloadsuffix==null||this.downloadsuffix.length==0){
					this.alertMsg(1,"请选择下载文件格式");
					return;
				}
				this.loading=true;
    			this.$http.post('disk/filedownload/mergeFiles',{
    				"downloadname":this.downloadname,
    				"downloadsuffix":this.downloadsuffix,
    				"idjson":this.idjson,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
    				this.loading=false;
					var data=response.body;
					if(data.code==0){
						var url=data.data+"&token="+sessionStorage.getItem("token");
						location.href=url;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			}
		}
	}
</script>

<style>
</style>