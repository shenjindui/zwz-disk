<template>
	<div style="height: 100%;">
		<el-row>
		  	<el-col :span="24">
		  		<el-form :inline="true" :model="search" class="demo-form-inline" size="small">
					<el-form-item label="类型">
						<el-select v-model="search.type" @change="changeType" placeholder="请选择类型">
		    				<el-option label="请选择类型" value=""></el-option>
		    				<el-option label="私密链接分享" value="0"></el-option>
		    				<el-option label="好友分享" value="1"></el-option>
		  				</el-select>
					</el-form-item>
  					<el-form-item label="状态">
  						<el-select v-model="search.status" @change="changeStatus" placeholder="请选择状态">
		    				<el-option label="请选择状态" value=""></el-option>
		    				<el-option label="正常" value="0"></el-option>
		    				<el-option label="已失效" value="1"></el-option>
		    				<el-option label="已取消" value="2"></el-option>
		  				</el-select>
  					</el-form-item>
  					<el-form-item>
		  				<el-button-group>
				  			<el-button type="primary" icon="el-icon-refresh" @click="refreshs">刷新</el-button>
				  			
							<el-button type="warning" icon="el-icon-close" @click="cancelShare" v-if="ids.length>0">取消分享</el-button>
							<el-button type="warning" icon="el-icon-close" v-if="ids.length==0" disabled>取消分享</el-button>
				  		</el-button-group>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row> 	
		<!--================================================================================-->
		<el-row style="height: 85%;overflow: auto;">
		  	<el-col :span="24">
		  		<!--列表-->
	  			<el-table v-loading="loading" :data="table.data" size="mini" :stripe="true" @selection-change="selectionChange">
		  			<el-table-column width="55">
		  				<template slot-scope="scope">
		  					<input type="checkbox" v-if="scope.row.status==0" v-model="ids" :value="scope.row.id"/>
						</template>
		  			</el-table-column>
		  			<el-table-column prop="icon" label="状态" width="100">
						<template slot-scope="scope">
							<el-tag type="success" size="mini" v-if="scope.row.status==0">正　常</el-tag>
							<el-tag type="danger" size="mini" v-if="scope.row.status==1">已失效</el-tag>
							<el-tag type="danger" size="mini" v-if="scope.row.status==2">已取消</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="分享标题">
						<template slot-scope="scope">
							<el-button type="text" @click="showFileUI(scope.row.id)">{{scope.row.title}}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="shareuser" label="分享人" width="150"></el-table-column>
					<el-table-column prop="sharetime" label="分享时间" width="180"></el-table-column>
					<el-table-column prop="type" label="分享类型" width="200">
						<template slot-scope="scope">
							<el-button type="text" v-if="scope.row.type==0" @click="showDetailSecretUI(scope.row.effectname,scope.row.sharetype,scope.row.url,scope.row.code)">私密链接分享</el-button>
							<el-button type="text" v-if="scope.row.type==1" @click="showDetailFriendsUI(scope.row.id)">好友分享</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="savecount" label="转存数量" width="100"></el-table-column>
				</el-table>
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
			
			<dialogdetailsecret ref="form" v-if="dialog.type=='secret'"></dialogdetailsecret>
			<dialogdetailfriends ref="form" v-if="dialog.type=='friends'"></dialogdetailfriends>
			<dialoglist ref="form" v-if="dialog.type=='filelist'"></dialoglist>
			
			<div slot="footer" class="dialog-footer">
    			<el-button @click="cancel()">取 消</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dialogdetailsecret from './dialog_detail_secret.vue';
	import dialogdetailfriends from './dialog_detail_friends.vue';
	import dialoglist from './dialog_list.vue';
	export default {
		data(){
			return {
				loading:false,
				ids:[],
				search:{
					type:"",
					status:""
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
			dialogdetailsecret,
			dialogdetailfriends,
			dialoglist
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
			changeType(v){
				this.search.type=v;
				this.searchs();
			},
			changeStatus(v){
				this.search.status=v;
				this.searchs();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/sharebyself/findList',{
					"type":this.search.type,
					"status":this.search.status,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.table.data=data.rows;
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
			///////////////////////////////////////////////////
			cancelShare(){
				if(this.ids.length==0){
					this.alertMsg(1,"请选记录");
					return;
				}
				var arrs=new Array();
				for(var i=0;i<this.ids.length;i++){
					arrs.push({
						"id":this.ids[i]
					});
				}
				
				this.$confirm('是否取消分享选中的记录?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/sharebyself/cancelShare',{
        				"idjson":JSON.stringify(arrs),
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.ids=[];
							this.searchs();
						}
						this.alertMsg(data.code,data.msg);
        				this.loading=false;
					});
        		});
			},
			//////////////////////////////////////////////////////////////////
			showDetailSecretUI(effectname,sharetype,url,code){
				this.dialog.width="800px";
				this.dialog.title="私密链接分享详情";
				this.dialog.visible=true;
				this.dialog.type="secret";
				
				setTimeout(()=>{
					this.$refs.form.setData(effectname,sharetype,url,code);
				},0);
			},
			showDetailFriendsUI(id){
				this.dialog.width="800px";
				this.dialog.title="好友分享详情";
				this.dialog.visible=true;
				this.dialog.type="friends";
				
				setTimeout(()=>{
					this.$refs.form.setData(id);
				},0);
			},
			showFileUI(id){
				this.dialog.width="1000px";
				this.dialog.title="文件列表";
				this.dialog.visible=true;
				this.dialog.type="filelist";
				
				setTimeout(()=>{
					this.$refs.form.setData(id);
				},0);
			},
			//////////////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			}
		}
	}
</script>

<style scoped="scoped">
</style>