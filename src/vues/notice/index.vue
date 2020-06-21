<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="3">&nbsp;</el-col>
		  	<el-col :span="18">
		  		<el-card class="box-card" :body-style="{padding:'50px'}" v-loading="loading">
	  				<div slot="header" class="clearfix">
	    				<span>通知列表</span>
	    				<el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-delete" @click="del">批量清空</el-button>
	    				<el-button style="float: right; padding: 3px 0;margin-right: 20px;" type="text" icon="el-icon-setting" @click="read">设置已阅</el-button>
	  				</div>
	  				<p style="text-align: center;color: red;" v-if="table.data.length==0">暂无记录</p>
			  		<el-timeline v-if="table.data.length>0">
				    	<el-timeline-item v-for="item in table.data" :timestamp="item.createtime" placement="top">
				      		<el-card>
				        		<h4>
				        			{{item.typename}}
				        			<el-tag type="warning" effect="dark" size="mini" v-if="item.status==0">待阅读</el-tag>
				        			<el-tag type="success" effect="dark" size="mini" v-if="item.status==1">已阅读</el-tag>
				        			{{item.readtime}}
				        		</h4>
				        		<p>{{item.content}}</p>
				      		</el-card>
				    	</el-timeline-item>
				  	</el-timeline>
				</el-card>
		  	</el-col>
		  	<el-col :span="3">&nbsp;</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :span="24" style="text-align: center;margin-top: 10px;">
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
		  	</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				loading:false,
				search:{
					
				},
				table:{
					height:document.body.clientHeight-175,
					data:[],
					currentpage:1,
	      			pagesize:10,
	      			total:0,
				}
			}
		},
		components:{
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
				this.$http.post('disk/notice/findList',{
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
			read(){
				this.$confirm('是否把所有通知更改为已阅读状态?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/notice/updateReadStatus',{
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
			del(){
				this.$confirm('是否清空所有的通知?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/notice/delete',{
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
			}
		}
	}
</script>

<style scoped="scoped">
</style>