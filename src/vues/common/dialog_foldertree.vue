<template>
	<div>
		<el-row>
		  	<el-col :span="24">
				<el-button type="text" size="mini" icon="el-icon-caret-right" v-for="item in items" @click="itemClickPrev(item.id)">{{item.name}}</el-button>
			</el-col>
		</el-row>
		<el-row>
		  	<el-col :span="24">
		  		<!--列表-->
		  		<el-card class="box-card">
		  			<el-table v-loading="loading" :data="table.data" :stripe="false" size="small" height="300px">
						<el-table-column prop="filename" label="文件名">
							<template slot-scope="scope">
								<img :src="scope.row.fileicon" style="vertical-align: middle;margin-right: 10px;" />
								<span class="link" @click="itemClickEnter(scope.row.rowindex)">{{scope.row.filename}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="createtime" label="修改日期" width="140"></el-table-column>
					</el-table>
				</el-card>
				<!--弹出框-->
				<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
					:show-close="true" @close="cancel" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
					<createfolder ref="form" v-if="dialog.type=='createfolder'" v-on:closeAndRefresh="createFolderClose"></createfolder>
				</el-dialog>
			</el-col>
			<el-col :span="24">
				<el-button type="text" size="mini" icon="el-icon-folder-add" @click="createFolderUI">创建目录</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import createfolder from './dialog_createfolder.vue';
	export default{
		data(){
			return {
				loading:false,
				items:[
					{"id":"0","name":"全部文件"}
				],
				search:{
					idjson:"",
					shareid:"",
					pid:"0"
				},
				table:{
					data:[]
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
			createfolder
		},
		created(){
			//this.searchs();
		},
		methods:{
			searchs(){
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/filecommon/findFolderList',{
					"pid":this.search.pid,
					"idjson":"",
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.data;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.rowindex=i;
								d.fileicon="data:image/png;base64,"+d.fileicon;
							}
						}					
						this.table.data=rows;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
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
				this.items.push({
					"id":row.id,
					"name":row.filename
				});
				this.search.pid=row.id;
				this.searchs();
			},
			//////////////////////////////////////////////////////////////////
			createFolderUI(){
				this.dialog.width="550px";
				this.dialog.title="新建文件夹";
				this.dialog.visible=true;
				this.dialog.type="createfolder";
				setTimeout(()=>{
					this.$refs.form.setPid(this.search.pid);
				},0);
			},
			createFolderClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			////////////////////////////////////////【以下是上传之前选择文件夹】/////////////////////////////////////////////
			setUploaderData(){
				this.search.pid="0";
				this.searchs();
			},
			openUploaderUI(){
				this.$emit("closeAndOpenUploader",this.search.pid);
			},
			////////////////////////////////////////【以下是分享转存】/////////////////////////////////////////////
			setZcData(idjson,shareid){
				this.search.idjson=idjson;
				this.search.shareid=shareid;
				this.search.pid="0";
				this.searchs();
			},
			saveFileFromShare(){
				if(this.search.idjson==null||this.search.idjson.length==0){
					this.alertMsg(1,"请选择需要转存的文件或文件夹");
					return;
				}
				this.$confirm('此操作将把选中文件转存到选中的文件夹下, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/shareextract/saveFromShare',{
        				"idjson":this.search.idjson,
        				"shareid":this.search.shareid,
        				"folderid":this.search.pid,
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.alertMsg(data.code,data.msg);
							this.$emit('closeDialog');
						}else{
							this.$message.error(data.msg);//防止token失效，跳转登录界面
						}
        				this.loading=false;
					});
        		});
			},
			////////////////////////////////////////【以下是回收站还原】/////////////////////////////////////////////
			setRubbishData(idjson){
				this.search.idjson=idjson;
				this.search.pid="0";
				this.searchs();
			},
			saveFileFromRubbish(){
				this.$confirm('是否确定还原?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/rubbish/recover',{
        				"idjson":this.search.idjson,
        				"folderid":this.search.pid,
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.$emit('closeDialog');
						}
						this.alertMsg(data.code,data.msg);
        				this.loading=false;
					});
        		});
			}
		}
	}
</script>

<style scoped="scoped">
	.link:hover{
		color: blue;
		cursor: pointer;
	}
	.nav{
		background: #FFFFFF;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #E4E7ED;
	}
</style>