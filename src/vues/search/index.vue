<template>
	<div>
		<el-row>
		  	<el-col :span="24">
		  		<div style="text-align: center;">
		  			<el-input placeholder="搜索您的文件" size="medium" v-model="search.keyword" style="width: 300px;"></el-input>
		  			<el-button type="primary" size="medium" @click="searchs">搜索</el-button>
		  		</div>
		  	</el-col>
		</el-row>
		<el-row>
		  	<el-col :span="24">
		  		<div class="container" v-loading="loading">
		  			<div class="header">
		  				共<span style="color: red;">{{table.total}}</span>条数据,
		  				当前第<span style="color: red;">{{table.currentpage}}</span>页,
		  				共<span style="color: red;">{{table.totalpage}}</span>页
		  			</div>
		  			<ul class="ullist">
		  				<li v-if="table.data.length==0" style="color: red;text-align: center;line-height: 60px;">
		  					搜索记录为空
		  				</li>
		  				<li v-if="table.data.length!=0" v-for="item in table.data">
							<div>
								<img :src="item.icon" style="vertical-align: middle;" />
								<span class="link" @click="itemClickEnter(item.rowindex)" v-html="item.filename"></span>
							</div>
							<div style="padding-left: 39px;">
								<!--时间-->
								<span style="margin-right: 10px;font-size: 12px;">
									<i class="el-icon-alarm-clock"></i>{{item.createtime}}
								</span>
								<!--上传人-->
								<span style="margin-right: 10px;font-size: 12px;">
									<i class="el-icon-user"></i>{{item.createusername}}
								</span>
								<!--大小-->
								<span style="margin-right: 10px;font-size: 12px;">
									{{item.filesize}}
								</span>
								<!--所属目录-->
								<span @click="gotoFolder(item.pname)" style="float: right;font-size: 12px;padding-right: 10px;color: blue;cursor: pointer;">
									<i class="el-icon-folder"></i>根目录/<span v-for="child in item.pname">{{child.name}}/</span>
								</span>
							</div>
		  				</li>
		  			</ul>
		  		</div>
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
		    	
		    	<!--弹出框-->
				<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
					:show-close="true" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
					
					<open ref="form" v-if="dialog.type=='open'"></open>
				</el-dialog>
		  	</el-col>
		</el-row>
	</div>
</template>

<script>
	import open from '../component/dialog_open.vue';
	export default{
		data(){
			return {
				loading:false,
				search:{
					keyword:""
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:10,
	      			total:0,
	      			totalpage:0
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
			open
		},
		created(){
			this.search.keyword=this.$route.query.keyword;
			this.searchs();
		},
		methods:{
			searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/file/search',{
					"filename":this.search.keyword,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					this.loading=false;
					var data=response.body;
					if(data.code==0){
						var rows=data.rows;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.rowindex=i;
								d.icon="data:image/png;base64,"+d.fileicon;
								d.pname=JSON.parse(d.pname);
							}
						}					
						this.table.data=rows;
						this.table.total=data.totalElements;
						this.table.totalpage=data.totalPage;
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
			//==================================================================
			itemClickEnter(rowindex){
				var row=this.table.data[rowindex];
				if(row==null){
					this.alertMsg(1,"您点击的记录不存在");
					return;
				}
				if(row.filetype==1){
					this.dialog.width="550px";
					this.dialog.title="文件打开";
					this.dialog.visible=true;
					this.dialog.type="open";
					setTimeout(()=>{
						this.$refs.form.setData(row.id,row.filename,row.fileicon,row.filesize,row.filesuffix,row.filemd5);
					},0);
				}
			},
			gotoFolder(pname){
				sessionStorage.setItem("activeIndex",1);
				this.$router.push({
					path:"/main/fileall/index",
					query:{"parents":JSON.stringify(pname)}
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.container{
		width: 1000px;
		margin: 0 auto;
		margin-top: 20px;
		margin-bottom: 20px;
	    border: 1px solid #d1d5da;
	    border-radius: 3px;
	    box-sizing: border-box;
	}
	.container .header{
		background-color: #f6f8fa;
		height: 60px;
		line-height: 60px; 
		box-sizing: border-box;
		padding-left: 20px;
		border-bottom: 1px solid #d1d5da;
	}
	.ullist{
		
	}
	.ullist li{
		list-style-type: none;
		font-size: 14px;
		border-bottom: 1px solid #d1d5da;
		box-sizing: border-box;
		padding-left: 20px;
		padding-top: 5px;
		padding-bottom: 5px;
	}
	.link{
		color: #24292e!important;
		cursor: pointer;
		font-weight: 600!important;
		font-size: 16px!important;
	}
</style>