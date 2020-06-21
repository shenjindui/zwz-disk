<template>
	<el-row :gutter="20">
		<el-col :span="1">&nbsp;</el-col>
	  	<el-col :span="22" v-loading="loading">
	  		<el-button-group>
	  			<el-button type="primary" size="small" icon="el-icon-refresh" @click="searchs">刷新</el-button>
	  			<el-button type="primary" size="small" icon="el-icon-folder-checked" @click="checkAll">全选</el-button>
	  			<el-button type="primary" size="small" icon="el-icon-plus" @click="addAll">加入相册</el-button>
	  			<el-button type="primary" size="small" icon="el-icon-delete" @click="delAll">批量删除</el-button>
	  		</el-button-group>
	  		<el-card class="box-card" style="margin-top: 10px;margin-bottom: 10px;height: 500px;overflow-y: auto;">
	  			<div v-if="table.data.length==0" style="text-align: center;padding-top: 120px;font-size: 20px;color: #9b9b9b;">
					<img src="../../assets/img/nodata.png" /><br />
					暂无记录
				</div>
	  			<div v-if="table.data.length>0">
		  			<ul>
			  			<li class="pic-group-item" v-for="item in table.data" :key="item.id">
			  				<input type="checkbox" v-model="ids" :value="item.id">
			  				<img :src="item.fileicon" @click="showImgUI(item.rowindex,item.id,item.filemd5)">
			  			</li>
			  		</ul>
		  		</div>
	  		</el-card>
	  		<!--分页-->
			<el-pagination
				@size-change="sizechange"
				@current-change="currentchange"
				@prev-click="prevClick"
	      		@next-click="nextClick"
	      		:page-sizes="[10,15]"
	      		:current-page="table.currentpage"
	      		:page-size="table.pagesize"
	      		:total="table.total"
	      		layout="total, sizes, prev, pager, next, jumper">
	    	</el-pagination>
	  	</el-col>
	  	<el-col :span="1">&nbsp;</el-col>
	</el-row>
</template>

<script>
	export default {
		data(){
			return {
				loading:false,
				albumid:"",
				checkall: false,
				ids:[],
				search:{
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:15,
	      			total:0,
				}
			}
		},
		components:{
		},
		created(){
		},
		methods:{
			initData(albumid){
				this.albumid=albumid;
				this.searchs();
			},
			searchs(){
				this.table.currentpage=1;
				this.checkall=false;
				this.ids=[];
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/filealbum/findNotInAlbumImg',{
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.rows;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.rowindex=(this.table.currentpage-1)*this.table.pagesize+i+1;
								d.fileicon=this.baseurl+"disk/fileopen/previewThumbnail?url="+d.thumbnailurl+"&token="+sessionStorage.getItem("token");
							}
						}					
						this.table.data=rows;
						this.table.total=data.totalElements;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
			sizechange(pagesize){
				this.table.pagesize=pagesize;
				this.findList();
			},
			currentchange(currentpage){
				this.table.currentpage=currentpage;
				this.findList();
			},
			prevClick(){
				this.table.currentpage=this.table.currentpage-1;
				this.findList();
			},
			nextClick(){
				this.table.currentpage=this.table.currentpage+1;
				this.findList();
			},
			///////////////////////////////////////////////////////////
			checkAll(){
				var _this = this;
		        if (this.checkall) {
		            this.ids = [];
		        } else {
		            this.ids = [];
		            this.table.data.forEach(function (item) {
		                _this.ids.push(item.id);
		            });
		        }
		        if (this.ids.length == this.table.data.length) {
		            this.checkall = true;
		        }else{
		        	this.checkall = false;
		        }
			},
			delAll(){
				if(this.ids.length==0){
					this.alertMsg(1,"请选择图片");
					return;
				}
				var arrs=new Array();
				for(var i=0;i<this.ids.length;i++){
					arrs.push({
						"id":this.ids[i]
					});
				}
				
				this.$confirm('是否将图片删除到垃圾回收站?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filecommon/delete',{
        				"ids":JSON.stringify(arrs),
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.searchs();
						}
						this.alertMsg(data.code,data.msg);
        				this.loading=false;
					});
        		});
			},
			addAll(){
				if(this.ids.length==0){
					this.alertMsg(1,"请选择图片");
					return;
				}
				var arrs=new Array();
				for(var i=0;i<this.ids.length;i++){
					arrs.push({
						"id":this.ids[i]
					});
				}
				
				this.$confirm('是否把所有图片添加到此相册当中?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filealbum/setImgToAlbum',{
        				"albumid":this.albumid,
        				"idjson":JSON.stringify(arrs),
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.$emit('notCloseAndRefresh');
							this.searchs();
						}
						this.alertMsg(data.code,data.msg);
        				this.loading=false;
					});
        		});
			},
			showImgUI(index,id,filemd5){
				var routerJump=this.$router.resolve({
					path:"/component/openimg2",
					query:{
						index:index,
						id:id,
						filemd5:filemd5,
						token:sessionStorage.getItem("token")
					}
				});
				window.open(routerJump.href,'_blank');
			}
		}
	}
</script>

<style scoped="scoped">
	/*=======================================================================*/
	ol, ul {
	    list-style: none;
	}
	.pic-group-item {
	    position: relative;
	    float: left;
	    margin-top: 5px;
	    margin-left: 5px;
	    cursor: pointer;
	    box-sizing: border-box;
	    width: 160px;
	    height: 180px;
	    border: 1px solid #d5d7df;
	    background: white;
	}
	
	/*==============图片fffcf4===============*/
	.pic-group-item input{
		z-index: 100;
		position: absolute;
		top: 4px;
		right: 4px;
	}
	.pic-group-item img{
	    max-width: 150px;
	    max-height: 150px;
	    
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    -webkit-transform: translate(-50%, -50%);
	    -ms-transform: translate(-50%, -50%);
	    transform: translate(-50%, -50%);
	}
</style>