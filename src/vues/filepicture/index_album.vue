<template>
	<div style="height: 100%;">
		<el-row>
		  	<el-col :span="24">
		  		<el-input placeholder="输入相册名称" style="width: 300px;" v-model="search.albumname" size="small"></el-input>
				<el-button icon="el-icon-search" @click="searchs" type="primary" size="small">搜索</el-button>
				<el-button icon="el-icon-plus" @click="addUI" type="primary" size="small">新建相册</el-button>
		  		<div style="margin-top: 20px;margin-bottom: 10px;" v-loading="loading">
		  			<div v-if="table.data.length==0" style="text-align: center;padding-top: 120px;font-size: 20px;color: #9b9b9b;">
						<img src="../../assets/img/nodata.png" /><br />
						暂无记录
					</div>
			  		<div class="mod-pic-group" v-if="table.data.length>0">
			  			<ul>
				  			<li class="pic-group-item" v-for="item in table.data">
				  				<!--图片-->
				  				<div class="pic-group-item-pic">
				  					<!--操作按钮-->
				  					<el-dropdown trigger="click" style="position: absolute;top:-5px;right: -5px;color: blue;z-index: 1000;">
	  									<span class="el-dropdown-link">
	    									<i class="el-icon-arrow-down el-icon--right"></i>
	  									</span>
	  									<el-dropdown-menu slot="dropdown">
	    									<el-dropdown-item icon="el-icon-edit">
	    										<a href="javascript:void(0);" class="link" @click="editUI(item.id)">编辑项目</a>
	    									</el-dropdown-item>
	    									<el-dropdown-item icon="el-icon-picture-outline" v-if="item.coverurl!=''">
	    										<a href="javascript:void(0);" class="link" @click="defaultCover(item.id)">默认封面</a>
	    									</el-dropdown-item>
	    									<el-dropdown-item icon="el-icon-share">
	    										<a href="javascript:void(0);" class="link" @click="shareUI(item.id,item.albumname)">分享相册</a>
	    									</el-dropdown-item>
	    									<el-dropdown-item icon="el-icon-delete">
	    										<a href="javascript:void(0);" class="link" @click="del(item.id)">删除相册保留图片</a>
	    									</el-dropdown-item>
	    									<el-dropdown-item icon="el-icon-delete">
	    										<a href="javascript:void(0);" class="link" @click="delCascade(item.id)">删除相册和图片</a>
	    									</el-dropdown-item>
	  									</el-dropdown-menu>
									</el-dropdown>
				  					<!--数量-->
				  					<span style="color: red;z-index: 100;font-size: 26px;font-weight: bold;position: absolute;bottom: 0px;right: 0px;">{{item.count}}</span>
				  					<!--150*111-->
				  					<img @click.stop="entryAlbum(item.id,item.albumname)" src="../../assets/img/album.png" v-if="item.coverurl==''"/>
				  					<img @click.stop="entryAlbum(item.id,item.albumname)" :src="item.fileicon" v-if="item.coverurl!=''">
				  				</div>
				  				
				  				<!--底部-->
				  				<div class="pic-group-item-txt">
				  					<p class="tit">{{item.albumname}}</p>
				  				</div>
				  			</li>
				  		</ul>
			  		</div>
		  		</div>
		  	</el-col>
	  	</el-row>
	  	<el-row>
	  		<el-col :span="24" style="text-align: center;">
				<el-pagination
					@size-change="sizechange"
					@current-change="currentchange"
					@prev-click="prevClick"
		      		@next-click="nextClick"
		      		:page-sizes="[10,20,30,40,50]"
		      		:current-page="table.currentpage"
		      		:page-size="table.pagesize"
		      		:total="table.total"
		      		layout="total, sizes, prev, pager, next, jumper">
		    	</el-pagination>
			</el-col>
	  	</el-row>
	  	<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
			:show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<share ref="form" v-if="dialog.type=='share'" v-on:shareClose="shareClose"></share>
			
			<albumadd ref="form" v-if="dialog.type=='add'" v-on:closeAndRefresh="addClose"></albumadd>
			<albumedit ref="form" v-if="dialog.type=='edit'" v-on:closeAndRefresh="editClose"></albumedit>
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='add'||dialog.type=='edit'">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确 定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import albumadd from './dialog_album_add.vue';
	import albumedit from './dialog_album_edit.vue';
	import share from '../common/dialog_share.vue';
	
	export default{
		data(){
			return {
				loading:false,
				search:{
					albumname:''
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:10,
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
			albumadd,
			albumedit,
			share
		},
		created(){
			this.searchs();
		},
		methods:{
			searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/filealbum/findPageList',{
					"albumname":this.search.albumname,
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
								d.fileicon=this.baseurl+"disk/fileopen/previewThumbnail?url="+d.coverurl+"&token="+sessionStorage.getItem("token");
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
			////////////////////////////////////////
			addUI(){
				this.dialog.width="550px";
				this.dialog.title="新建相册";
				this.dialog.visible=true;
				this.dialog.type="add";
				setTimeout(()=>{
					this.$refs.form.setData();
				},0);
			},
			editUI(id){
				this.dialog.width="550px";
				this.dialog.title="修改相册";
				this.dialog.visible=true;
				this.dialog.type="edit";
				setTimeout(()=>{
					this.$refs.form.showInfo(id);
				},0);
			},
			shareUI(id,name){
				this.dialog.width="800px";
				this.dialog.title="分享文件："+name+"共1个相册";
				this.dialog.visible=true;
				this.dialog.type="share";
				
				var arrs=new Array();
				arrs.push({
					"id":id
				});
				
				setTimeout(()=>{
					this.$refs.form.setData(JSON.stringify(arrs),name,1);
				},0);
			},
			entryAlbum(id,albumname){
				this.$router.push({
					path:"/main/filepicture/index/albumfile",
					query:{"id":id,"albumname":albumname}
				});
			},
			defaultCover(id){
				this.$confirm('是否使用默认图片做相册封面?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filealbum/deleteAlbumCover',{
        				"albumid":id,
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
			del(id){
				this.$confirm('此操作将删除相册,不会删除里面的图片, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filealbum/deleteAlbum',{
        				"albumid":id,
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
			delCascade(id){
				this.$confirm('此操作将删除相册并删除里面的图片, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filealbum/deleteAlbumCascade',{
        				"albumid":id,
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
			////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.save();
				},0);
			},
			addClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			editClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			shareClose(){
				this.dialog.visible=false;
				this.dialog.type="";
			}
		}
	}
</script>

<style scoped="scoped">
	ol, ul {
	    list-style: none;
	}
	.pic-group-item {
	    position: relative;
	    float: left;
	    margin: 0 30px 15px 0;
	    cursor: pointer;
	    box-sizing: border-box;
	    width: 187px;
	    height: 218px;
	    border: 1px solid #d5d7df;
	    background: #FCFCFC;
	    box-shadow: 0 1px 4px rgba(0,0,0,.15);
	}
	
	/*==============图片fffcf4===============*/
	.pic-group-item-pic {
	    z-index: 3;
	    box-sizing: border-box;
	    position: relative;
	     
	    width: 160px;
	    height: 160px;
	    background: #FCFCFC;
	    
	    top: 50%;
	    left: 50%;
	    margin-top: -100px;
	    margin-left: -80px;
	}
	.pic-group-item-pic img{
		width:150px;
		height:110px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -55px;
		margin-left: -75px;
	}
	/*==============底部===============*/
	.pic-group-item-txt {
		position: absolute;
		bottom: 0px;
		width: 100%;
	    box-sizing: border-box;
	    background: #FCFCFC;
	    height: 41px;
	    line-height: 41px;
	    color: #606266;
	    border-top:1px solid #F5F5F5;
	}
	.pic-group-item-txt .tit {
		font-size: 14px;
		padding-left: 5px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    vertical-align: middle;
	}
	/*==============操作===============*/
	.link{
		text-decoration: none;
		color: black;
	}
	.operate{
		display: none;
		position: absolute;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #E4E7ED;
		z-index: 1000;
		text-align: center;
	}
	.pic-group-item:hover .operate{
		display: block;
	}
</style>