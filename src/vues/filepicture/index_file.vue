<template>
	<div>
		<el-row>
		  	<el-col :span="22">
				<el-button type="text" icon="el-icon-refresh" @click="refreshs">刷新</el-button>
				<el-button type="text" icon="el-icon-folder-checked" @click="checkAll">全选</el-button>
				<el-button type="text" icon="el-icon-plus" @click="addAlbumUI">加入相册</el-button>
			</el-col>
		</el-row> 	
		<!--================================================================================-->
		<el-row>
		  	<el-col :span="24">
		  		<div v-if="table.data.length==0" style="text-align: center;padding-top: 120px;font-size: 20px;color: #9b9b9b;">
					<img src="../../assets/img/nodata.png" /><br />
					暂无记录
				</div>
				<!--布局方法1-->
	  			<!--<ul v-loading="loading" v-if="table.data.length>0">
		  			<li class="pic-group-item" v-for="item in table.data" :key="item.id">
		  				<input type="checkbox" v-model="ids" :value="item.id">
		  				<img :src="item.fileicon" @click="showImgUI(item.rowindex,item.id,item.filemd5)"/>
		  			</li>
		  		</ul>-->
		  		
		  		<!--布局方法2-->
		  		<el-card v-loading="loading" v-if="table.data.length>0" v-for="item in table.data" :key="item.id" :body-style="{padding: '5px'}"
    				class="card">
    				<input type="checkbox" v-model="ids" :value="item.id" class="checkbox">
    				<img :src="item.fileicon" class="img" @click="showImgUI(item.rowindex,item.id,item.filemd5)">
    			</el-card>
		  	</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" style="text-align: center;">
				<el-pagination
					@size-change="sizechange"
					@current-change="currentchange"
					@prev-click="prevClick"
		      		@next-click="nextClick"
		      		:page-sizes="[14,28,42,56,70]"
		      		:current-page="table.currentpage"
		      		:page-size="table.pagesize"
		      		:total="table.total"
		      		layout="total, sizes, prev, pager, next, jumper">
		    	</el-pagination>
		   </el-col>
		</el-row>
		<!--================================================================================-->
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
			:show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<filealbum ref="form" v-if="dialog.type=='filealbum'" v-on:closeAndRefresh="filealbumClose"></filealbum>
		</el-dialog>
	</div>
</template>

<script>
	import filealbum from './dialog_file_album.vue';
	export default {
		data(){
			return {
				loading:false,
				checkall: false,
				ids:[],
				search:{
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:14,
	      			total:0,
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
			filealbum
		},
		created(){
			this.searchs();
		},
		methods:{
			refreshs(){
				this.$confirm('是否刷新列表?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.searchs();
        		});
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
			//////////////////////////////////////////////////////////////////////////////
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
			addAlbumUI(){
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
				
				this.dialog.width="800px";
				this.dialog.title="加入相册";
				this.dialog.visible=true;
				this.dialog.type="filealbum";
				setTimeout(()=>{
					this.$refs.form.setData(JSON.stringify(arrs));
				},0);
			},
			showImgUI(index,id,filemd5){
				var routerJump=this.$router.resolve({
					path:"/component/thumbnail",
					query:{
						index:index,
						id:id,
						filemd5:filemd5,
						type:1,
						token:sessionStorage.getItem("token")
					}
				});
				window.open(routerJump.href,'_blank');
			},
			/////////////////////////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			filealbumClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				
				this.ids=[];
				this.searchs();
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.createAlbum();
				},0);
			}
		}
	}
</script>

<style scoped="scoped">
	.link:hover{
		color: blue;
		cursor: pointer;
	}
	.divuploader{
		z-index: 100;
		width: 600px;
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
	/*=================================布局1======================================*/
	.card{
		cursor: pointer;
		width: 180px;
		height: 180px;
		box-sizing: border-box;
		float: left;
		margin: 5px;
		position: relative;
	}
	.checkbox{
		z-index: 100;
		position: absolute;
		top: 4px;
		right: 4px;
	}
	.img{
		position: absolute;
		top: 50%;left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}
	/*===============================布局2========================================*/
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