<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card" v-loading="loading">
				<div style="text-align: center;">
					<img :src="file.fileicon" style="vertical-align: middle;width: 32px;height: 32px;" />
					<span style="font-size: 12px;margin-right: 10px;">{{file.filename}}</span>
					<span style="font-size: 12px;">{{file.filesize}}</span>
				</div>
				<div style="text-align: center;margin-top: 20px;">
					<el-button size="small" type="primary" @click="download">下载</el-button>
					<el-button size="small" type="primary" v-for="item in components" @click="operate(item.componentcode)">{{item.componentname}}</el-button>
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
				components:[],
				file:{
					id:"",
					filename:"",
					fileicon:"",
					filesize:"",
					filesuffix:"",
					filemd5:""
				}
			}
		},
		methods:{
			setData(id,filename,fileicon,filesize,filesuffix,filemd5){
				this.file.id=id;
				this.file.filename=filename;
				this.file.fileicon="data:image/png;base64,"+fileicon;
				this.file.filesize=filesize;
				this.file.filesuffix=filesuffix;
				this.file.filemd5=filemd5;
				
				this.findComponentsBySuffix();
			},
			findComponentsBySuffix(){
				this.loading=true;
    			this.$http.post('disk/fileopen/findComponentsBySuffix',{
    				"filesuffix":this.file.filesuffix,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
    				this.loading=false;
					var data=response.body;
					if(data.code==0){
						this.components=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			download(){
				location.href=this.baseurl+"disk/filedownload/download?fileid="+this.file.id+"&token="+sessionStorage.getItem("token");
			},
			operate(code){
				var routerJump=this.$router.resolve({
					path:"/component/"+code,
					query:{
						id:this.file.id,
						filename:this.file.filename,
						filemd5:this.file.filemd5,
						filesize:this.file.filesize,
						token:sessionStorage.getItem("token")
					}
				});
				window.open(routerJump.href,'_blank');
			}
		}
	}
</script>

<style>
</style>