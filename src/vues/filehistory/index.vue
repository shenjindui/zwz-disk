<template>
	<div style="height: 100%;">
		<el-row>
		  	<el-col :span="24">
		  		<el-button type="text" size="mini" icon="el-icon-refresh" @click="refreshs">刷新</el-button>
				<el-button type="text" size="mini" icon="el-icon-caret-right" v-for="item in items" @click="itemClickPrev(item.id,item.historyid)">{{item.name}}</el-button>
			</el-col>
		</el-row>
		<el-row style="height: 90%;overflow: auto;">
		  	<el-col :span="24">
		  		<!--列表-->
	  			<el-table v-loading="loading" :data="table.data" size="small" :stripe="true">
					<el-table-column prop="filename" label="文件名">
						<template slot-scope="scope">
							<img :src="scope.row.icon" style="vertical-align: middle;margin-right: 10px;" />
							<span class="link" @click="itemClickEnter(scope.row.rowindex)">{{scope.row.filename}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="filesize" label="大小" width="150">
						<template slot-scope="scope">
							<span v-if="scope.row.filesize!=0">{{scope.row.filesize}}</span>
							<span v-if="scope.row.filesize==0">-</span>
						</template>
					</el-table-column>
					<el-table-column prop="operatetime" label="操作时间" width="200"></el-table-column>
					<el-table-column prop="operatenname" label="操作内容" width="150"></el-table-column>
					<el-table-column prop="remark" label="操作备注" width="300"></el-table-column>
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
	</div>
</template>

<script>
	export default {
		data(){
			return {
				loading:false,
				items:[
					{"id":"0","historyid":"","name":"全部文件"}
				],
				search:{
					historyid:"",
					pid:"0"
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
			findList(){
				this.loading=true;
				this.$http.post('disk/filehistory/findList',{
					"historyid":this.search.historyid,
					"pid":this.search.pid,
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
								d.icon="data:image/png;base64,"+d.fileicon;
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
			//////////////////////////////////////////////////////导航栏////////////////////////////////////////////////////////////
			itemClickPrev(id,historyid){
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
				this.search.historyid=historyid;
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
						"id":row.fileid,
						"historyid":row.id,
						"name":row.filename
					});
					this.search.pid=row.fileid;
					this.search.historyid=row.id;
					this.searchs();
				}else{
					//this.alertMsg(1,"您点击的是文件");
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.link:hover{
		color: blue;
		cursor: pointer;
	}
</style>