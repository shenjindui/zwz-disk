<template>
	<div style="height: 100%;box-sizing: border-box;">
		<el-row style="height: 100%;">
			<el-col :span="1" style="border:1px solid #EBEEF5;height: 100%;">
				<div class="div">
					<i class="el-icon-arrow-left prevbtn" @click="prevPage" v-if="this.table.currentpage!=1" style="color: blue;"></i>
					<i class="el-icon-arrow-left prevbtn" v-if="this.table.currentpage==1" style="color: #C0C4CC;"></i>
				</div>
			</el-col>
			<el-col :span="22" style="height: 100%;">
				<div  v-for="(item,index) in table.data" class="img" :style="{'border':item.border}">
					<el-image style="max-height: 100%;max-width: 100%;" @click="selectThumbnail(index)" :src="item.fileicon" :fit="fit"></el-image>
				</div>
			</el-col>
			<el-col :span="1" style="border:1px solid #EBEEF5;height: 100%;">
				<div class="div">
					<i class="el-icon-arrow-right nextbtn" @click="nextPage" v-if="this.table.currentpage!=this.table.totalpage" style="color: blue;"></i>
					<i class="el-icon-arrow-right nextbtn" v-if="this.table.currentpage==this.table.totalpage" style="color: #C0C4CC;"></i>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				token:"",
				info:{
					index:"",
					id:"",
					filemd5:"",
					type:"",
					albumid:""
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:10,
	      			total:0,
	      			totalpage:0
				}
			}
		},
		created(){
			var index=this.$route.query.index;
			this.info.id=this.$route.query.id;
			this.info.filemd5=this.$route.query.filemd5;
			this.info.type=this.$route.query.type;//0关联相册，1未关联相册
			this.info.albumid=this.$route.query.albumid;
			this.token=this.$route.query.token;
			
			//通过index计算当前页数
			this.table.currentpage=(index%this.table.pagesize==0)?(index/this.table.pagesize):(parseInt(index/this.table.pagesize)+1);
			//计算index
			this.info.index=parseInt(index%this.table.pagesize)-1;
			//展示缩略图
			this.findThumbnails();
		},
		methods:{
			findThumbnails(){
				if(this.info.type==0){
					this.findInAlbumImg();
				}else if(this.info.type==1){
					this.findNotInAlbumImg();
				}
			},
			findInAlbumImg(){
				this.$http.post('disk/filealbum/findInAlbumImg',{
					"albumid":this.info.albumid,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":this.token
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.rows;
						for(var i=0;i<rows.length;i++){
							var d=rows[i];
							d.border="";
							d.fileicon=this.baseurl+"disk/fileopen/previewThumbnail?url="+d.thumbnailurl+"&token="+this.token;
						}
						this.table.data=rows;
						this.table.total=data.totalElements;
						this.table.totalpage=data.totalPage;
						
						//展示默认大图
						if(this.table.data.length<=this.info.index){
							this.info.index=0;
						}
						this.showDefaultBigImg();
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			findNotInAlbumImg(){
				this.$http.post('disk/filealbum/findNotInAlbumImg',{
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":this.token
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.rows;
						for(var i=0;i<rows.length;i++){
							var d=rows[i];
							d.border="";
							d.fileicon=this.baseurl+"disk/fileopen/previewThumbnail?url="+d.thumbnailurl+"&token="+this.token;
						}
						this.table.data=rows;
						this.table.total=data.totalElements;
						this.table.totalpage=data.totalPage;
						
						//展示默认大图
						if(this.table.data.length<=this.info.index){
							this.info.index=0;
						}
						this.showDefaultBigImg();
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			prevPage(){
				if(this.table.currentpage==1){
					this.alertMsg(1,"当前页是第一页");
					return;
				}
				this.table.currentpage=parseInt(this.table.currentpage)-1;
				this.findThumbnails();
			},
			nextPage(){
				if(this.table.currentpage==this.table.totalpage){
					this.alertMsg(1,"当前页是最后一页");
					return;
				}
				this.table.currentpage=parseInt(this.table.currentpage)+1;
				this.findThumbnails();
			},
			selectThumbnail(index){
				this.info.index=index;
				this.showDefaultBigImg();
			},
			showDefaultBigImg(){
				var fileid=this.table.data[this.info.index].id;
				var filename=this.table.data[this.info.index].filename;
				var url=this.baseurl+"disk/fileopen/writeByte?fileid="+fileid+"&token="+this.token;
				var pageInfo="总共"+this.table.totalpage+"页,当前第"+this.table.currentpage+"页,共"+this.table.total+"条记录";
				this.$emit('setData',fileid,filename,url,pageInfo);
				
				//边框颜色
				for(var i=0;i<this.table.data.length;i++){
					this.table.data[i].border="";
				}
				this.table.data[this.info.index].border="2px solid red";
			}
		}
	}
</script>

<style scoped="scoped">
	.div{
		width: 100%;
		height: 100%;
		position: relative;
		box-sizing: border-box;
	}
	.prevbtn{
		font-weight: bolder;font-size: 40px;cursor: pointer;
		position: absolute;
		top: 30%;
		left: 0px;
	}
	.nextbtn{
		font-weight: bolder;font-size: 40px;cursor: pointer;
		position: absolute;
		top: 30%;
		right: 0px;
	}
	.img{
		border:1px solid #EBEEF5;
		width: 120px;
		height: 100%;
		float: left;
		margin-left: 5px;
		cursor: pointer;
		box-sizing: border-box;
	}
</style>