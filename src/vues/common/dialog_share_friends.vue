<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
	  				<el-tree ref="tree" :props="props" :load="loadNode" lazy  show-checkbox :check-strictly="true" :check-on-click-node="true" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
				</el-card>
		  	</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :span="24" style="text-align: center;margin-top: 10px;">
		  		<el-button type="primary" @click="save">开始分享</el-button>
		  	</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				pid:"0",
				type:"root",
				form:{
					fileids:"",
					title:"",
					type:""
				},
				resolve:null,
				props: {
          			label: 'label',
          			children: 'children',
          			isLeaf: 'leaf'
        		}
			}
		},
		created(){
		},
		methods:{
			setData(fileids,title,type){
				this.form.fileids=fileids;
				this.form.title=title;
				this.form.type=type;
			},
			loadNode(node, resolve){
				this.resolve=resolve;
				if(node.data==undefined){
					this.pid=0;
				}else{
					this.pid=node.data.id;
					this.type=node.data.type;
				}
				setTimeout(() => {
					this.loadData(resolve);
				},500);
			},
			handleNodeClick(node) {
				this.pid=node.id;
				this.type=node.type;
			},
			loadData(resolve){
				this.$http.post('disk/filecommon/findUserTree',{
					"pid":this.pid,
					"type":this.type,
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
			save(){
				var nodes=this.$refs.tree.getCheckedNodes();
				if(nodes==null||nodes.length==0){
					this.alertMsg(1,"请选择需要分享的用户");
					return;
				}
				var arrs=new Array();
				for(var i=0;i<nodes.length;i++){
					arrs.push({
						"userid":nodes[i].id,
						"username":nodes[i].label
					});
				}
				this.$confirm('此操作将文件分享给选中的好友, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filecommon/shareFriends',{
        				"idjson":this.form.fileids,
        				"title":this.form.title,
        				"userJson":JSON.stringify(arrs),
        				"type":this.form.type,
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.$emit('friendsResult');
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
	.ullist{
		
	}
	.ullist li{
		list-style-type: none;
		margin-bottom: 5px;
	}
	
</style>