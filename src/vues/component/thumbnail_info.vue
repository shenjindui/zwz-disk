<template>
	<el-card class="box-card">
		<table style="width: 100%;">
			<tr>
				<td class="tdleft">图片名称：</td>
				<td>{{info.filename}}</td>
			</tr>
			<tr>
				<td class="tdleft">图片大小：</td>
				<td>{{info.filesize}}</td>
			</tr>
			<tr>
				<td class="tdleft">图片尺寸：</td>
				<td>{{info.imgsize}}</td>
			</tr>
			<tr>
				<td class="tdleft">上传人：</td>
				<td>{{info.createusername}}</td>
			</tr>
			<tr>
				<td class="tdleft">上传时间：</td>
				<td>{{info.createtime}}</td>
			</tr>
			<tr>
				<td class="tdleft">所属目录：</td>
				<td><span v-for="item in info.folders">{{item.name}}/</span></td>
			</tr>
		</table>
	</el-card>
</template>

<script>
	export default{
		data(){
			return {
				token:"",
				info:{
					id:"",
					createusername:"",
					createtime:"",
					filename:"",
					filesize:"",
					imgsize:"",
					folders:[]
				}
			}
		},
		methods:{
			setData(id,token){
				this.info.id=id;
				this.token=token;
				
				this.showInfo();
				this.showFolder();
			},
			showInfo(){
				this.$http.post('disk/filecommon/findOne',{
    				"id":this.info.id,
    				"token":this.token
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.info.createusername=data.data.createusername;
						this.info.createtime=data.data.createtime;
						this.info.filename=data.data.filename;
						this.info.filesize=data.data.filesize;
						this.info.imgsize=data.data.imgsize;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			showFolder(){
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
				});
			}
		}
	}
</script>

<style scoped="scoped">
	table tr td:last-child{
		text-align: left;
	}
	.tdleft{
		width: 120px;
		text-align: right;
		padding-right: 10px;
	}
</style>