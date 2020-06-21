<template>
	<el-row :gutter="20">
	  	<el-col :span="24" style="box-sizing: border-box;">
	  		<iframe :src="url" style="width: 100%;height:450px;border: none;"></iframe>
	  	</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				url:"",
				uuid:this.$uuid.v1()
			}
		},
		created(){
		},
		methods:{
			//文档、视频、音乐、图片、其他===上传
			setData(folderid,albumid){
				this.url=this.uploadurl+"/public/html/upload_file.html?uuid="+this.uuid+"&folderid="+folderid+"&albumid="+albumid+"&token="+sessionStorage.getItem("token");
			},
			//全部===上传
			setData2(folderid,type){
				var page="";
				var albumid="";
				if(type=="file"){
					page="upload_file.html";
				}else if(type=="folder"){
					page="upload_folder.html";
				}
				this.url=this.uploadurl+"/public/html/"+page+"?uuid="+this.uuid+"&folderid="+folderid+"&albumid="+albumid+"&token="+sessionStorage.getItem("token");
			}
		}
	}
</script>

<style scoped="scoped">
</style>