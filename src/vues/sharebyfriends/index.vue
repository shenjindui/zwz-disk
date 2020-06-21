<template>
	<div style="height: 100%;">
		<el-row>
		  	<el-col :span="24">
  				<el-form :inline="true" :model="search" class="demo-form-inline" size="small">
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
				  		</el-button-group>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row> 	
		<!--================================================================================-->
		<el-row style="height: 85%;overflow: auto;">
		  	<el-col :span="24">
		  		<!--列表-->
	  			<el-table v-loading="loading" :data="table.data" size="small" :stripe="true">
	  				<el-table-column prop="icon" label="状态" width="100">
						<template slot-scope="scope">
							<el-tag type="success" size="mini" v-if="scope.row.status==0">正　常</el-tag>
							<el-tag type="danger" size="mini" v-if="scope.row.status==1">已失效</el-tag>
							<el-tag type="danger" size="mini" v-if="scope.row.status==2">已取消</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="savecount" label="转存状态" width="100">
						<template slot-scope="scope">
							<el-tag type="success" size="mini" v-if="scope.row.savecount!=0">已转存</el-tag>
							<el-tag type="danger" size="mini" v-if="scope.row.savecount==0">未转存</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="分享标题"></el-table-column>
					<el-table-column prop="shareuser" label="分享人" width="150"></el-table-column>
					<el-table-column prop="sharetime" label="分享时间" width="200"></el-table-column>
					<el-table-column prop="cz" label="操作" width="150">
						<template slot-scope="scope">
							<el-button v-if="scope.row.status==0" type="primary" size="mini" @click="zcUI(scope.row.id)">转存</el-button>
						</template>
					</el-table-column>
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
			
			<dialoglist ref="form" v-on:zcResultClose="zcResultClose"></dialoglist>
			
			<div slot="footer" class="dialog-footer">
    			<el-button @click="cancel()">取 消</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dialoglist from './dialog_list.vue';
	export default {
		data(){
			return {
				loading:false,
				search:{
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
			changeStatus(v){
				this.search.status=v;
				this.searchs();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/sharebyfriends/findList',{
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
			//////////////////////////////////////////////////////
			zcUI(id){
				this.dialog.width="1000px";
				this.dialog.title="文件列表";
				this.dialog.visible=true;
				this.dialog.type="";
				
				setTimeout(()=>{
					this.$refs.form.setData(id);
				},0);
			},
			//////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			zcResultClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			}
		}
	}
</script>

<style scoped="scoped">
</style>