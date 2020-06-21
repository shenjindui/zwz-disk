<template>
	<div style="box-sizing: border-box;">
		<el-row :gutter="20" style="margin-bottom: 20px;">
		  	<el-col :span="12">
	  			<el-button type="text" icon="el-icon-back" @click="goBack" size="mini">返回</el-button>
	  			<el-button type="text" icon="el-icon-refresh" @click="searchs" size="mini">刷新</el-button>
	  			<el-button type="text" icon="el-icon-folder-checked" @click="checkAll" size="mini">全选</el-button>
	  			<el-button type="text" icon="el-icon-delete" @click="delAll" size="mini">批量删除</el-button>
	  			<el-button type="text" icon="el-icon-remove" @click="removeAll" size="mini">移出相册</el-button>
	  			<el-button type="text" icon="el-icon-remove" @click="moveAll" size="mini">移动至</el-button>
	  			<el-button type="text" icon="el-icon-plus" @click="addUI" size="mini">选择图片</el-button>
	  			<el-button type="text" icon="el-icon-upload2" @click="uploadUI" size="mini">上传图片</el-button>
		  	</el-col>
		  	<el-col :span="12" style="text-align: right;font-size: 20px;padding-right: 50px;">
		  		当前相册:<span style="color: red;">{{search.albumname}}</span>,
		  		当前第<span style="color: red;">{{table.currentpage}}</span>页,
		  		共<span style="color: red;">{{table.totalpage}}</span>页,
		  		共<span style="color: red;">{{table.total}}</span>条记录
		  	</el-col>
		</el-row>
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
		  				<img :src="item.fileicon"  @click="showImgUI(item.rowindex,item.id,item.filemd5)"/>
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
		<!--文件夹选择窗口-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" :fullscreen="dialog.fullscreen"
			:show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<!--移动-->
			<albummove ref="form" v-if="dialog.type=='albummove'" v-on:closeAndRefresh="albummoveClose"></albummove>
			
			<!--选择文件夹树-->
			<foldertree v-if="dialog.type=='foldertree'" ref="form" v-on:closeAndOpenUploader="folderTreeClose"></foldertree>
			<div v-if="dialog.type=='foldertree'" slot="footer" class="dialog-footer">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确 定</el-button>
  			</div>
		</el-dialog>
		
		<!--选择图片窗口-->
		<el-drawer :title="drawer.title" :size="drawer.width" :visible.sync="drawer.visible" :modal="false">
			<albumimg ref="albumimg" v-on:notCloseAndRefresh="selectImgClose"></albumimg>
		</el-drawer>
		
		<!--上传弹出框-->
		<el-dialog :title="uploader.title" :visible.sync="uploader.visible" :width="uploader.width"
			:show-close="true" @close="uploaderClose" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<uploader ref="uploader" v-if="uploader.type=='uploader'"></uploader>
		</el-dialog>
	</div>
</template>

<script>
	import albumimg from './dialog_album_img.vue';
	import uploader from '../common/dialog_uploader.vue';
	import foldertree from '../common/dialog_foldertree.vue';
	import albummove from './dialog_album_move.vue';
	
	export default{
		data(){
			return {
				loading:false,
				checkall: false,
				ids:[],
				search:{
					albumid:'',
					albumname:''
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:14,
	      			total:0,
	      			totalpage:0
				},
				dialog:{
					fullscreen:false,
      				width:"",
      				type:"",
      				visible: false,
      				title:''
	      		},
	      		drawer:{
      				width:"",
      				visible:false,
      				type:"",
      				title:""
      			},
      			uploader:{
      				title:'文件上传',
      				width:"800px",
      				type:"",
      				visible: false
      			}
			}
		},
		components:{
			albumimg,
			uploader,
			foldertree,
			albummove
		},
		created(){
			this.search.albumid=this.$route.query.id;
			this.search.albumname=this.$route.query.albumname;
			this.searchs();
		},
		methods:{
			goBack(){
				this.$router.push("/main/filepicture/index/album");
			},
			searchs(){
				this.table.currentpage=1;
				this.checkall=false;
				this.ids=[];
				this.findList();
			},
			findList(){
				this.loading = true
				this.$http.post('disk/filealbum/findInAlbumImg',{
					"albumid":this.search.albumid,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					this.loading = false;
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
						this.table.totalpage=data.totalPage;
					}else{
						this.alertMsg(data.code,data.msg);
					}
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
			////////////////////////////////////////////////////////////////////////
			uploadUI(){
				this.dialog.fullscreen=false;
				this.dialog.width="550px";
				this.dialog.title="选择上传目录";
				this.dialog.visible=true;
				this.dialog.type="foldertree";
				setTimeout(()=>{
					this.$refs.form.setUploaderData();
				},0);
			},
			addUI(){
				this.drawer.width="1090px";
				this.drawer.type="albumimg";
				this.drawer.title="选择图片";
				this.drawer.visible=true;
				setTimeout(()=>{
					this.$refs.albumimg.initData(this.search.albumid);
				},0);
			},
			showImgUI(index,id,filemd5){
				var routerJump=this.$router.resolve({
					path:"/component/thumbnail",
					query:{
						index:index,
						id:id,
						filemd5:filemd5,
						type:0,
						albumid:this.search.albumid,
						token:sessionStorage.getItem("token")
					}
				});
				window.open(routerJump.href,'_blank');
			},
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
			removeAll(){
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
				
				this.$confirm('是否将图片删除移出相册?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filealbum/removeImgOutAlbum',{
        				"idjson":JSON.stringify(arrs),
        				"albumid":this.search.albumid,
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
			moveAll(){
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
				this.dialog.title="移动图片";
				this.dialog.visible=true;
				this.dialog.type="albummove";
				setTimeout(()=>{
					this.$refs.form.setData(JSON.stringify(arrs));
				},0);
			},
			/////////////////////////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.openUploaderUI();
				},0);
			},
			folderTreeClose(pid){
				this.dialog.visible=false;
				this.dialog.type="";
				
				this.uploader.visible=true;
				this.uploader.type="uploader";
				
				setTimeout(()=>{
					this.$refs.uploader.setData(pid,this.search.albumid);
				},0);
			},
			uploaderClose(){
				this.uploader.visible=false;
				this.uploader.type="";
				this.searchs();
			},
			selectImgClose(code){
				this.searchs();
			},
			albummoveClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			}
		}
	}
</script>

<style scoped="scoped">
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