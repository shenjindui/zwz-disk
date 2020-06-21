<template>
	<div style="height: 100%;">
		<el-row style="margin-top:-18px;margin-left: -20px;margin-right: -20px;">
			<el-col :span="18" class="nav">
				<el-dropdown trigger="click" placement="bottom-start" @command="handleCommandUpload">
  					<el-button type="text" icon="el-icon-upload2" style="margin-left: 20px;">上传</el-button>
  					<el-dropdown-menu slot="dropdown" style="width: 200px;">
					    <el-dropdown-item command="uploadFile" icon="el-icon-folder-add">上传文件</el-dropdown-item>
					    <el-dropdown-item command="uploadFolder" icon="el-icon-folder-add">上传文件夹</el-dropdown-item>
  					</el-dropdown-menu>
				</el-dropdown>				
				
		  		<el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
  					<el-button type="text" icon="el-icon-plus" style="margin-left: 10px;margin-right: 10px;">新建</el-button>
  					<el-dropdown-menu slot="dropdown" style="width: 200px;">
					    <el-dropdown-item command="folder" icon="el-icon-folder-add">新建文件夹</el-dropdown-item>
					    <el-dropdown-item command="txt" icon="el-icon-document">新建文本</el-dropdown-item>
					    <el-dropdown-item command="markdown" icon="el-icon-document">新建markdown文档</el-dropdown-item>
					    <el-dropdown-item command="word" icon="el-icon-document" disabled>新建Word文档</el-dropdown-item>
    					<el-dropdown-item command="excel" icon="el-icon-document" disabled>新建Excel表格</el-dropdown-item>
    					<el-dropdown-item command="ppt" icon="el-icon-document" disabled>新建PPT幻灯片</el-dropdown-item>
  					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
			<el-col :span="4" class="nav" style="text-align: center;">
				<el-button type="text" icon="el-icon-refresh" @click="refreshs">刷新</el-button>
				<el-dropdown trigger="click" @command="handleCommand2">
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
				<el-button type="text" icon="el-icon-tickets" @click="toggle()">列表模式</el-button>
			</el-col>
		</el-row>
		<el-row>
		  	<el-col :span="24">
				<el-button type="text" size="mini" icon="el-icon-caret-right" v-for="item in items" @click="itemClickPrev(item.id)">{{item.name}}</el-button>
			</el-col>
		</el-row>
		<!--================================================================================-->
		<el-row style="height: 85%;overflow: auto;">
			<el-col :span="24">
				<div v-if="table.data.length==0" style="text-align: center;padding-top: 120px;font-size: 20px;color: #9b9b9b;">
					<img src="../../assets/img/nodata.png" /><br />
					暂无记录
				</div>
    			<el-card v-if="table.data.length>0" v-for="item in table.data" :key="item.id" :body-style="{padding: '5px'}" class="card">
    				<!--图标-->
    				<div @click="itemClickEnter(item.rowindex)" style="height: 155px;text-align: center;">
    					<!--position: absolute;top: 40%;left: 50%;-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);transform: translate(-50%, -50%);-->
    					<img :src="item.icon" style="max-height: 100%;max-width: 100%;">
    				</div>
    				<!--操作按钮-->
    				<el-dropdown trigger="click" size="mini" style="position: absolute;right: 10px;top: 10px;color: red;">
						<span class="el-dropdown-link">
							<i class="el-icon-arrow-down el-icon--right" style="font-weight: bolder;"></i>
						</span>
						<el-dropdown-menu slot="dropdown" style="width: 120px;">
							<el-dropdown-item icon="el-icon-share"><el-button size="mini" type="text" @click="shareUI(item.id,item.filename)">分　享</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-delete"><el-button size="mini" type="text" @click="del(item.id)">删　除</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-document-copy"><el-button size="mini" type="text" @click="copyUI(item.id)">复制到</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-document-remove"><el-button size="mini" type="text" @click="moveUI(item.id)">移动到</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit"><el-button size="mini" type="text" @click="renameUI(item.id)">重命名</el-button></el-dropdown-item>
							<el-dropdown-item icon="el-icon-postcard"><el-button size="mini" type="text" @click="propUI(item.id,item.filetype)">属　性</el-button></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
    				<!--文字-->
      				<div style="font-size: 12px;color: #409EFF;background: #F2F6FC;padding: 5px;box-sizing: border-box;">
        				<span style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;display: inline-block;width: 100%;">
        					{{item.filename}}
        				</span>
        				<span style="color: #999;font-size: 12px;">{{ item.filesizename }}</span>
      				</div>
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
			
			<createdocument ref="form" v-if="dialog.type=='createdocument'" v-on:closeAndRefresh="createDocumentClose"></createdocument>
			<createfolder ref="form" v-if="dialog.type=='createfolder'" v-on:closeAndRefresh="createFolderClose"></createfolder>
			<rename ref="form" v-if="dialog.type=='rename'" v-on:closeAndRefresh="renameClose"></rename>
			<share ref="form" v-if="dialog.type=='share'" v-on:shareClose="shareClose"></share>
			<open ref="form" v-if="dialog.type=='open'"></open>
			<fileprop ref="form" v-if="dialog.type=='fileprop'"></fileprop>
			
			<dialogcopy ref="form" v-if="dialog.type=='copy'" v-on:closeAndRefresh="copyToClose"></dialogcopy>
			<dialogmove ref="form" v-if="dialog.type=='move'" v-on:closeAndRefresh="moveToClose"></dialogmove>
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='copy'||dialog.type=='move'">
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
	import createfolder from '../common/dialog_createfolder.vue';
	import createdocument from '../common/dialog_createdocument.vue';
	import rename from '../common/dialog_rename.vue';
	import share from '../common/dialog_share.vue';
	import fileprop from '../common/dialog_prop.vue';
	
	import dialogcopy from './dialog_copy.vue';
	import dialogmove from './dialog_move.vue';
	import open from '../component/dialog_open.vue';
	
	export default {
		data(){
			return {
				loading:false,
				items:[
					{"id":"0","name":"全部文件"}
				],
				search:{
					pid:0,
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
			createfolder,
			createdocument,
			rename,
			share,
			dialogcopy,
			dialogmove,
			open,
			fileprop
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
				this.findList();
			},
			toggle(){
				this.$router.push("/main/fileall/index");
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/file/findListCard',{
					"pid":this.search.pid,
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
								if(d.typecode=="picture"){
									d.icon=this.baseurl+"disk/fileopen/previewThumbnail?url="+d.thumbnailurl+"&token="+sessionStorage.getItem("token");
								}else{
									d.icon="data:image/png;base64,"+d.fileicon;
								}
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
			handleCommand2(command){
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
			//////////////////////////////////////////////////////导航栏////////////////////////////////////////////////////////////
			itemClickPrev(id){
				//条目
				var index=this.items.findIndex(item => {
					if(item.id==id){
						return true;
					}
				});
				
				var newitems=new Array();
				this.items.some((item,i) => {
					if(i<=index){
						newitems.push(item);
					}
				});
				this.items=[];
				this.items=newitems;
				
				//查询
				this.search.pid=id;
				this.searchs();
			},
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
						this.$refs.form.setData(row.id,row.filename,row.fileicon,row.filesizename,row.filesuffix,row.filemd5);
					},0);
				}
			},
			///////////////////////////////////////////////////////按钮操作///////////////////////////////////////////////////////////
			handleCommand(command){
				if(command=="folder"){
					this.createFolderUI();
				}else if(command=="txt"){
					this.createDocumentUI("txt");
				}else if(command=="markdown"){
					this.createDocumentUI("md");
				}
			},
			handleCommandUpload(command){
				if(command=="uploadFile"){
					this.uploadUI('file');
				}else if(command=="uploadFolder"){
					this.uploadUI('folder');
				}
			},
			createDocumentUI(suffix){
				this.dialog.width="550px";
				this.dialog.title="新建文档";
				this.dialog.visible=true;
				this.dialog.type="createdocument";
				setTimeout(()=>{
					this.$refs.form.setSuffix(suffix,this.search.pid);
				},0);
			},
			createFolderUI(){
				this.dialog.width="550px";
				this.dialog.title="新建文件夹";
				this.dialog.visible=true;
				this.dialog.type="createfolder";
				setTimeout(()=>{
					this.$refs.form.setSuffix(suffix);
				},0);
			},
			uploadUI(type){
				this.drawer.type="uploader";
				this.drawer.visible=true;
				if(type=="file"){
					this.drawer.title="上传文件";
				}else{
					this.drawer.title="上传文件夹";
				}
				setTimeout(()=>{
					this.$refs.uploader.setData2(this.search.pid,type);
				},0);
			},
			renameUI(id){
				this.dialog.width="550px";
				this.dialog.title="重命名";
				this.dialog.visible=true;
				this.dialog.type="rename";
				
				setTimeout(()=>{
					this.$refs.form.showInfo(id);
				},0);
			},
			copyUI(id){
				this.dialog.width="550px";
				this.dialog.title="复制到";
				this.dialog.visible=true;
				this.dialog.type="copy";
				
				var arrs=new Array();
				arrs.push({
					"id":id
				});
				
				setTimeout(()=>{
					this.$refs.form.setId(JSON.stringify(arrs));
				},0);
			},
			moveUI(id){
				this.dialog.width="550px";
				this.dialog.title="移动到";
				this.dialog.visible=true;
				this.dialog.type="move";
				
				var arrs=new Array();
				arrs.push({
					"id":id
				});
				
				setTimeout(()=>{
					this.$refs.form.setId(JSON.stringify(arrs));
				},0);
			},
			shareUI(id,filename){
				this.dialog.width="800px";
				this.dialog.title="分享文件："+filename;
				this.dialog.visible=true;
				this.dialog.type="share";
				
				var arrs=new Array();
				arrs.push({
					"id":id
				});
				
				setTimeout(()=>{
					this.$refs.form.setData(JSON.stringify(arrs),filename,0);
				},0);
			},
			del(id){
				this.$confirm('此操作将删除记录, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			var arrs=new Array();
        			arrs.push({
        				"id":id
        			});
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
			propUI(fileid,filetype){
				this.dialog.width="550px";
				this.dialog.title="文件属性";
				this.dialog.visible=true;
				this.dialog.type="fileprop";
				setTimeout(()=>{
					this.$refs.form.showInfo(fileid,filetype);
				},0);
			},
			///////////////////////////////////////////////////////弹出框///////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.save();
				},0);
			},
			renameClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			createFolderClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			createDocumentClose(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			copyToClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			moveToClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			uploaderClose(){
				this.drawer.type="";
				this.drawer.visible=false;
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
	.link:hover{
		color: blue;
		cursor: pointer;
	}
	/*卡片列表*/
	.clearfix:before,.clearfix:after {
	    display: table;
	    content: "";
	}	  
	.clearfix:after {
	    clear: both
	}
	.nav{
		background: #FFFFFF;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #E4E7ED;
	}
	.card{
		cursor: pointer;
		width: 180px;
		/*height: 200px;*/
		box-sizing: border-box;
		float: left;margin: 5px;
		position: relative;
	}
</style>