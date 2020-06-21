<template>
	<div style="height: 100%;">
		<el-row style="margin-top:-18px;margin-left: -20px;margin-right: -20px;">
			<el-col :span="18" class="nav">
				<el-button type="text" icon="el-icon-upload2" @click="uploadUI" style="margin-left: 20px;">上传</el-button>
				
				<el-button type="text" icon="el-icon-download" @click="downloadBatch" v-if="checkedcount>0">下载</el-button>
				<el-button type="text" icon="el-icon-download" v-if="checkedcount==0" disabled>下载</el-button>
				
				<el-button type="text" icon="el-icon-share" @click="shareUI" v-if="checkedcount>0">分享</el-button>
				<el-button type="text" icon="el-icon-share" v-if="checkedcount==0" disabled>分享</el-button>
				
				<el-button type="text" icon="el-icon-delete" @click="deleteBatch" v-if="checkedcount>0">删除</el-button>
				<el-button type="text" icon="el-icon-delete" v-if="checkedcount==0" disabled>删除</el-button>
				
				<el-button type="text" icon="el-icon-edit" @click="renameUI" v-if="checkedcount==1">重命名</el-button>
				<el-button type="text" icon="el-icon-edit" v-if="checkedcount!=1" disabled>重命名</el-button>
				
				<el-button type="text" icon="el-icon-postcard" v-if="checkedcount==1" @click="propUI()">文件属性</el-button>
		  		<el-button type="text" icon="el-icon-postcard" v-if="checkedcount!=1" disabled>文件属性</el-button>
			</el-col>
			<el-col :span="4" class="nav" style="text-align: center;">
				<el-button type="text" icon="el-icon-refresh" @click="refreshs">刷新</el-button>
				<el-dropdown trigger="click" @command="handleCommand">
  					<span class="el-dropdown-link">
    					<el-button type="text" v-if="search.orderfield=='filename'&&search.ordertype=='ascending'" icon="el-icon-top">文件名称</el-button>
    					<el-button type="text" v-if="search.orderfield=='filename'&&search.ordertype=='descending'" icon="el-icon-bottom">文件名称</el-button>
    					<el-button type="text" v-if="search.orderfield=='filesize'&&search.ordertype=='ascending'" icon="el-icon-top">文件大小</el-button>
    					<el-button type="text" v-if="search.orderfield=='filesize'&&search.ordertype=='descending'" icon="el-icon-bottom">文件大小</el-button>
    					<el-button type="text" v-if="search.orderfield=='createtime'&&search.ordertype=='ascending'" icon="el-icon-top">创建日期</el-button>
    					<el-button type="text" v-if="search.orderfield=='createtime'&&search.ordertype=='descending'" icon="el-icon-bottom">创建日期</el-button>
  					</span>
  					<el-dropdown-menu slot="dropdown" style="width: 150px;">
    					<el-dropdown-item command="filename" icon="el-icon-sort">按名称排序</el-dropdown-item>
    					<el-dropdown-item command="filesize" icon="el-icon-sort">按大小排序</el-dropdown-item>
    					<el-dropdown-item command="createtime" icon="el-icon-sort">按时间排序</el-dropdown-item>
  					</el-dropdown-menu>
				</el-dropdown>
			</el-col>	
			<el-col :span="2" class="nav">
				<el-button type="text" icon="el-icon-tickets" @click="changeModel('list')" v-if="model=='card'">列表模式</el-button>
				<el-button type="text" icon="el-icon-menu" @click="changeModel('card')" v-if="model=='list'">卡片模式</el-button>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-form :inline="true" :model="search" class="demo-form-inline" size="small" style="margin-top: 10px;">
					<el-form-item label="文件类型">
						<el-select v-model="search.filesuffix" @change="changeType" placeholder="请选择类型">
    						<el-option label="请选择类型" value=""></el-option>
    						<el-option v-for="item in types" :label="item.suffix" :value="item.suffix"></el-option>
  						</el-select>
					</el-form-item>
  					<el-form-item label="文件名称">
    					<el-input v-model="search.filename" placeholder="请输入文件名称"></el-input>
  					</el-form-item>
  					<el-form-item>
  						<el-button type="primary" @click="searchs">搜索</el-button>
  					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<!--================================================================================-->
		<el-row v-if="model=='list'" style="height: 80%;overflow: auto;">
		  	<el-col :span="24">
		  		<!--列表-->
	  			<el-table v-loading="loading" :data="table.data" :stripe="false" size="small" @selection-change="selectionChange" @sort-change="sortChange">
		  			<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="filename" label="文件名" sortable>
						<template slot-scope="scope">
							<img :src="scope.row.fileicon" style="vertical-align: middle;margin-right: 10px;" />
							<span class="link" @click="itemClickEnter(scope.row.rowindex)">
								<span v-if="scope.row.pname.length>0">{{scope.row.pname}}/</span>
								{{scope.row.filename}}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="filesize" label="大小" width="250" sortable>
						<template slot-scope="scope">
							<span v-if="scope.row.filesize!=0">{{scope.row.filesizename}}</span>
							<span v-if="scope.row.filesize==0">-</span>
						</template>
					</el-table-column>
					<el-table-column prop="pname" label="所属目录" width="300">
						<template slot-scope="scope">
							<span class="link" style="color: blue;" @click="gotoFolder(scope.row.pid)"><i class="el-icon-folder-opened"></i>{{scope.row.pname}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="createtime" label="修改日期" width="200" sortable></el-table-column>
				</el-table>
		  	</el-col>
		</el-row>
		<!--================================================================================-->
		<el-row  v-if="model=='card'" style="height: 80%;overflow: auto;">
			<el-col :span="24">
				<div v-if="table.data.length==0" style="text-align: center;padding-top: 120px;font-size: 20px;color: #9b9b9b;">
					<img src="../../assets/img/nodata.png" /><br />
					暂无记录
				</div>
    			<el-card v-loading="loading" v-if="table.data.length>0" v-for="item in table.data" :key="item.id" :body-style="{padding: '5px'}" 
    				style="cursor: pointer;width: 160px;box-sizing: border-box;float: left;margin: 10px;position: relative;">
    				<!--图标-->
    				<div style="position: relative;width:100%;height: 140px;" @click="itemClickEnter(item.rowindex)">
    					<img :src="item.fileicon" style="max-width: 60%;max-height: 60%;position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);transform: translate(-50%, -50%);">
    				</div>
    				<!--操作按钮-->
    				<el-dropdown trigger="click" style="position: absolute;right: 10px;top: 10px;color: blue;">
						<span class="el-dropdown-link">
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown" style="width: 150px;">
							<el-dropdown-item icon="el-icon-share"><el-button type="text" @click="shareOneUI(item.id,item.filename)">分　享</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-delete"><el-button type="text" @click="deleteOne(item.id)">删　除</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit"><el-button type="text" @click="renameOneUI(item.id)">重命名</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-folder-opened"><el-button type="text" @click="gotoFolder(item.pid)">跳转至目录</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-postcard"><el-button type="text" @click="propOneUI(item.id,item.filetype)">属　性</el-button></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
    				<!--文字-->
      				<div style="font-size: 12px;color: #409EFF;border-top: 1px solid #F2F6FC;">
        				<span style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;display: inline-block;width: 100%;">
        					<span v-if="item.pname.length>0">{{item.pname}}/</span>
        					{{item.filename}}
        				</span>
        				<time style="color: #999;font-size: 12px;">{{ item.filesizename }}</time>
      				</div>
    			</el-card>
  			</el-col>
		</el-row>
		<!--================================================================================-->
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
			
			<open ref="form" v-if="dialog.type=='open'"></open>
			<rename ref="form" v-if="dialog.type=='rename'" v-on:closeAndRefresh="renameClose"></rename>
			<share ref="form" v-if="dialog.type=='share'" v-on:shareClose="shareClose"></share>
			<download ref="form" v-if="dialog.type=='download'"></download>
			<fileprop ref="form" v-if="dialog.type=='fileprop'"></fileprop>
			
			<foldertree ref="form" v-if="dialog.type=='foldertree'" v-on:closeAndOpenUploader="folderTreeClose"></foldertree>
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='foldertree'">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确 定</el-button>
  			</div>
  			
		</el-dialog>
		
		<!--上传弹出框-->
		<el-dialog :title="drawer.title" :visible.sync="drawer.visible" :width="drawer.width"
			:show-close="true" @close="uploaderClose" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<uploader ref="uploader" v-if="drawer.type=='uploader'"></uploader>
		</el-dialog>
	</div>
</template>

<script>
	import uploader from '../common/dialog_uploader.vue';
	import download from '../common/dialog_download.vue';
	import foldertree from '../common/dialog_foldertree.vue';
	import open from '../component/dialog_open.vue';
	import fileprop from '../common/dialog_prop.vue';
	
	import rename from '../common/dialog_rename.vue';
	import share from '../common/dialog_share.vue';
	
	export default {
		data(){
			return {
				loading:false,
				checkedcount:0,
				checkeditems:[],
				model:"list",
				types:[],
				search:{
					filesuffix:"",
					filename:"",
					orderfield:'createtime',
					ordertype:'descending'
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
      			},
      			drawer:{
      				title:'文件上传',
      				width:"800px",
      				type:"",
      				visible: false
      			}
			}
		},
		components:{
			uploader,
			download,
			foldertree,
			rename,
			share,
			open,
			fileprop
		},
		created(){
			this.findTypes();
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
			changeModel(model){
				this.model=model;
				this.checkedcount=0;
				this.checkeditems=[];
				this.searchs();
			},
			findTypes(){
				this.$http.post('disk/file/findTypeList',{
					"typecode":"video",
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.types=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			changeType(v){
				this.search.filesuffix=v;
				this.searchs();
			},
			searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/file/findSpecialList',{
					"typecode":"video",
					"filesuffix":this.search.filesuffix,
					"filename":this.search.filename,
					"showtype":this.model,
					"orderfield":this.search.orderfield,
					"ordertype":this.search.ordertype,
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
								d.rowindex=i;
								d.icon=d.fileicon;
								d.fileicon="data:image/png;base64,"+d.fileicon;
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
			//勾选checkbox
			selectionChange(val){
				this.checkedcount=val.length;
				this.checkeditems=[];
				for(var i=0;i<val.length;i++){
					this.checkeditems.push({
						"id":val[i].id,
						"name":val[i].filename
					});
				}
			},
			//按照创建时间排序
			sortChange(column){
				this.search.orderfield=column.prop;
				if(column.order==null){
					column.order="descending";
				}
				this.search.ordertype=column.order;
				this.searchs();
			},
			handleCommand(command){
				var order="";
				if(this.search.orderfield==command){
					if(this.search.ordertype=="ascending"){
						order="descending";
					}else if(this.search.ordertype=="descending"){
						order="ascending";
					}
				}else{
					order="descending";
				}
				
				this.search.orderfield=command;
				this.search.ordertype=order;
				this.searchs();
			},
			//////////////////////////////////////////////////////////////////////////////
			itemClickEnter(rowindex){
				var row=this.table.data[rowindex];
				if(row==null){
					this.alertMsg(1,"您点击的记录不存在");
					return;
				}
				if(row.filetype==0){
					this.items.push({
						"id":row.id,
						"name":row.filename
					});
					this.search.pid=row.id;
					this.searchs();
				}else{
					this.dialog.width="550px";
					this.dialog.title="文件打开";
					this.dialog.visible=true;
					this.dialog.type="open";
					setTimeout(()=>{
						this.$refs.form.setData(row.id,row.filename,row.icon,row.filesizename,row.filesuffix,row.filemd5);
					},0);
				}
			},
			/////////////////////////////////////////////////////////////////////////////
			uploadUI(){
				this.dialog.width="550px";
				this.dialog.title="选择上传目录";
				this.dialog.visible=true;
				this.dialog.type="foldertree";
				setTimeout(()=>{
					this.$refs.form.setUploaderData();
				},0);
			},
			gotoFolder(pid){
				this.loading=true;
    			this.$http.post('disk/filecommon/findParentListByPid',{
    				"pid":pid,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						sessionStorage.setItem("activeIndex",1);
						this.$router.push({
							path:"/main/fileall/index",
							query:{"parents":JSON.stringify(data.data)}
						});
					}else{
						this.alertMsg(data.code,data.msg);
					}
    				this.loading=false;
				});
			},
			shareUI(){
				var len=this.checkeditems.length;
				if(len==0){
					alertMsg(1,"请选择记录");
					return;
				}
				
				var title=this.checkeditems[0].name+"等共"+len+"个文件";
				
				this.dialog.width="800px";
				this.dialog.title="分享文件："+title;
				this.dialog.visible=true;
				this.dialog.type="share";
				
				setTimeout(()=>{
					this.$refs.form.setData(JSON.stringify(this.checkeditems),title,0);
				},0);
			},
			renameUI(){
				var len=this.checkeditems.length;
				if(len==0){
					alertMsg(1,"请选择记录");
					return;
				}else if(len>1){
					alertMsg(1,"只能选择一条记录");
					return;
				}
				
				this.dialog.width="550px";
				this.dialog.title="重命名";
				this.dialog.visible=true;
				this.dialog.type="rename";
				
				setTimeout(()=>{
					this.$refs.form.showInfo(this.checkeditems[0].id);
				},0);
			},
			deleteBatch(){
				this.$confirm('此操作将删除您勾选的记录, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filecommon/delete',{
        				"ids":JSON.stringify(this.checkeditems),
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
			downloadBatch(){
				var len=this.checkeditems.length;
				if(len==0){
					alertMsg(1,"请选择记录");
					return;
				}
				var title=this.checkeditems[0].name+"等共"+len+"个文件";
				var idjson="";
				for(var i=0;i<this.checkeditems.length;i++){
					if(i==0){
						idjson=this.checkeditems[i].id;
					}else{
						idjson=idjson+","+this.checkeditems[i].id;
					}
				}
				
				this.dialog.width="550px";
				this.dialog.title="文件合并下载";
				this.dialog.visible=true;
				this.dialog.type="download";
				setTimeout(()=>{
					this.$refs.form.setData(idjson,title);
				},0);
			},
			propUI(){
				var len=this.checkeditems.length;
				if(len==0){
					alertMsg(1,"请选择记录");
					return;
				}else if(len>1){
					alertMsg(1,"只能选择一条记录");
					return;
				}
				var fileid=this.checkeditems[0].id;
				var index=this.table.data.findIndex(item => {
					if(item.id==fileid){
						return true;
					}
				});
				var filetype=this.table.data[index].filetype;
				this.dialog.width="550px";
				this.dialog.title="文件属性";
				this.dialog.visible=true;
				this.dialog.type="fileprop";
				setTimeout(()=>{
					this.$refs.form.showInfo(fileid,filetype);
				},0);
			},
			/////////////////////////////////////////////////////////////////////////////
			propOneUI(fileid,filetype){
				this.dialog.width="550px";
				this.dialog.title="文件属性";
				this.dialog.visible=true;
				this.dialog.type="fileprop";
				setTimeout(()=>{
					this.$refs.form.showInfo(fileid,filetype);
				},0);
			},
			shareOneUI(id,name){
				var title=name+"共1个文件";
				
				this.dialog.width="800px";
				this.dialog.title="分享文件："+title;
				this.dialog.visible=true;
				this.dialog.type="share";
				var arrs=new Array();
				arrs.push({
					"id":id
				});
				setTimeout(()=>{
					this.$refs.form.setData(JSON.stringify(arrs),title,0);
				},0);
			},
			renameOneUI(id){
				this.dialog.width="550px";
				this.dialog.title="重命名";
				this.dialog.visible=true;
				this.dialog.type="rename";
				
				setTimeout(()=>{
					this.$refs.form.showInfo(id);
				},0);
			},
			deleteOne(id){
				var arrs=new Array();
				arrs.push({
					"id":id
				});
				this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
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
				
				this.drawer.type="uploader";
				this.drawer.visible=true;
				setTimeout(()=>{
					this.$refs.uploader.setData(pid,"");
				},0);
			},
			uploaderClose(){
				this.drawer.visible=false;
				this.drawer.type="";
				this.searchs();
			},
			renameClose(){
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
	.nav{
		background: #FFFFFF;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #E4E7ED;
	}
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
	/*=======================================================================*/
	ol, ul {
	    list-style: none;
	}
	.pic-group-item {
	    position: relative;
	    float: left;
	    margin: 0 48px 15px 0;
	    cursor: pointer;
	    box-sizing: border-box;
	    width: 187px;
	    height: 218px;
	    border: 1px solid #d5d7df;
	    background: white;
	}
	
	/*==============图片fffcf4===============*/
	.pic-group-item-pic {
	    z-index: 3;
	    box-sizing: border-box;
	    position: relative;
	     
	    width: 160px;
	    height: 160px;
	    background: white;
	    
	    top: 50%;
	    left: 50%;
	    margin-top: -100px;
	    margin-left: -80px;
	}
	.pic-group-item-pic img{
		width:128px;
		height:128px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -64px;
		margin-left: -64px;
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