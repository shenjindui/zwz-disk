<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
		  			<el-table v-loading="loading" :data="table.data" border stripe size="mini" height="400">
						<el-table-column type="index" width="50"></el-table-column>
						<el-table-column prop="edittime" label="编辑时间" width="150"></el-table-column>
						<el-table-column prop="editusername" label="编辑人" width="100"></el-table-column>
						<el-table-column prop="filemd5" label="当前版本MD5"></el-table-column>
						<el-table-column prop="prevfilemd5" label="上一版本MD5"></el-table-column>
						<el-table-column prop="cz" label="操作" width="80">
							<template slot-scope="scope">
				        		<el-button size="mini" type="text" @click="showUI(scope.row.filemd5,scope.row.prevfilemd5)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--分页-->
					<el-pagination
						@size-change="sizechange"
						@current-change="currentchange"
						@prev-click="prevClick"
			      		@next-click="nextClick"
			      		:page-sizes="[10]"
			      		:current-page="table.currentpage"
			      		:page-size="table.pagesize"
			      		:total="table.total"
			      		layout="total, sizes, prev, pager, next, jumper">
			    	</el-pagination>
				</el-card>
		  	</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		data() {
			return {
				loading:false,
				table:{
      				search:{
      					fileid:''
      				},
      				currentpage:1,
      				pagesize:10,
      				total:0,
        			data: []
      			}
			}
		},
		methods:{
			showList(fileid){
				this.table.search.fileid=fileid;
				this.searchs();
			},
      		searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/filecommon/findEditHistory',{
					"fileid":this.table.search.fileid,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					this.loading=false;
					var data= response.body;
					if(data.code==0){
						this.table.data=data.rows;
						this.table.total=data.totalElements;
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
			showUI(filemd5,prevfilemd5){
				var routerJump=this.$router.resolve({
					path:"/component/compare",
					query:{
						filemd5:filemd5,
						prevfilemd5:prevfilemd5,
						token:sessionStorage.getItem("token")
					}
				});
				window.open(routerJump.href,'_blank');
			}
		}
	}
</script>

<style scoped="scoped">
</style>