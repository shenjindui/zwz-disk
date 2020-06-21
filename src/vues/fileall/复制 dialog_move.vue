<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-button type="text" icon="el-icon-plus" @click="createFolderUI">新建目录</el-button>
	  		<el-card class="box-card" style="height: 300px;overflow-y: auto;">
	  			<el-tree v-loading="loading" :props="props" :load="loadNode" lazy  @node-click="handleNodeClick" :highlight-current="true">
			  		<span class="custom-tree-node" slot-scope="{ node, data }">
    					<span style="font-size: 14px;color:#606266;padding-top: 5px;padding-bottom: 5px;">
    						<img src="../../assets/img/folder.png" style="width: 20px;height: 20px;vertical-align: middle;" />
    						{{ node.label }}
    					</span>
  					</span>
			  	</el-tree>
			</el-card>
			<!--弹出框-->
			<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
				:show-close="true" @close="cancel" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
				<createfolder ref="form" v-if="dialog.type=='createfolder'" v-on:closeAndRefresh="createFolderClose"></createfolder>
			</el-dialog>
	  	</el-col>
	</el-row>
</template>

<script>
	import createfolder from '../common/dialog_createfolder.vue';
	export default{
		data(){
			return {
				loading:false,
				id:"",
				pid:"0",
				resolve:null,
				dialog:{
      				width:"",
      				type:"",
      				visible: false,
      				title:''
      			},
      			props: {
          			label: 'label',
          			children: 'children',
          			isLeaf: 'leaf'
        		}
			}
		},
		components:{
			createfolder
		},
		created(){
			
		},
		methods:{
			setId(id){
				this.id=id;
				this.pid="";
			},
			loadNode(node, resolve){
				this.resolve=resolve;
				if (node.level == 0) {
          			return resolve([{"id":"0","label": '我的文件夹' }]);
        		}
				if(node.data==undefined){
					this.pid=0;
				}else{
					this.pid=node.data.id;
				}
				setTimeout(() => {
					this.loadData(resolve);
				},500);
			},
			handleNodeClick(node) {
				this.pid=node.id;
			},
			loadData(resolve){
				this.$http.post('disk/filecommon/findFolderTree',{
    				"idjson":this.id,
    				"pid":this.pid,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
					var d=response.body;
					if(d.code==0){
						return resolve(d.data);
					}else{
						this.alertMsg(d.code,d.msg);
					}
				});
			},
			/////////////////////////////////////////////////////////////////////////////////////
			createFolderUI(){
				this.dialog.width="550px";
				this.dialog.title="新建文件夹";
				this.dialog.visible=true;
				this.dialog.type="createfolder";
				setTimeout(()=>{
					this.$refs.form.setPid(this.pid);
				},0);
			},
			createFolderClose(){
				this.dialog.visible=false;
				this.loadData(this.resolve);
			},
			/////////////////////////////////////////////////////////////////////////////////////
			save(){
				if(this.id==null||this.id.length==0){
					this.alertMsg(1,"请选择需要复制的记录");
					return;
				}else{
					if(JSON.parse(this.id).length==0){
						this.alertMsg(1,"请选择需要复制的记录");
						return;
					}
				}
				if(this.pid==null||this.pid.length==0){
					this.alertMsg(1,"请选择文件夹");
					return;
				}
				this.$confirm('此操作将把文件移动到选中的文件夹下, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filecommon/moveTo',{
        				"idjson":this.id,
        				"toid":this.pid,
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.$emit('closeAndRefresh');
						}
						this.alertMsg(data.code,data.msg);
        				this.loading=false;
					});
        		});
			},
			/////////////////////////////////////////////////////
			cancel(){
				this.dialog.type="";
				this.dialog.visible=false;
			}
		}
	}
</script>

<style scoped="scoped">
</style>