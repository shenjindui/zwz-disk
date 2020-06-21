<template>
	<div style="height: 100%;">
		<el-row>
			<el-col :span="24">
  				<el-button-group>
		  			<el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshs">刷新</el-button>
		  			
		  			<el-button type="primary" size="small" icon="el-icon-delete" @click="del" v-if="checkedcount>0">彻底删除</el-button>
					<el-button type="primary" size="small" icon="el-icon-delete" v-if="checkedcount==0" disabled>彻底删除</el-button>
					
					<el-button type="primary" size="small" icon="el-icon-refresh-left" @click="recoverUI" v-if="checkedcount>0">还原</el-button>
					<el-button type="primary" size="small" icon="el-icon-refresh-left" v-if="checkedcount==0" disabled>还原</el-button>
		  		</el-button-group>
			</el-col>
		</el-row> 	
		<!--================================================================================-->
		<el-row style="height: 85%;overflow: auto;">
		  	<el-col :span="24">
		  		<!--列表-->
	  			<el-table v-loading="loading" :data="table.data" size="mini" :stripe="true" @selection-change="selectionChange" @sort-change="sortChange">
		  			<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="icon" label="文件名">
						<template slot-scope="scope">
							<img :src="scope.row.fileicon" style="vertical-align: middle;margin-right: 10px;" />
							<span class="link" @click="itemClickEnter(scope.row.id,scope.row.filename)">{{scope.row.filename}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="deletetime" label="删除时间" width="200" sortable></el-table-column>
					<el-table-column prop="filesize" label="大小" width="250">
						<template slot-scope="scope">
							<span v-if="scope.row.filesize!=0">{{scope.row.filesize}}</span>
							<span v-if="scope.row.filesize==0">-</span>
						</template>
					</el-table-column>
					<el-table-column prop="remainday" label="剩余保留天数" width="200"></el-table-column>
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
			:show-close="true" @close="cancel" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<foldertree ref="form" v-if="dialog.type=='recover'" v-on:closeDialog="recoverClose"></foldertree>
			
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='recover'">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import foldertree from '../common/dialog_foldertree.vue';
	export default {
		data(){
			return {
				loading:false,
				checkedcount:0,
				checkeditems:[],
				search:{
					
				},
				table:{
					height:document.body.clientHeight-175,
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
			foldertree
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
				this.$http.post('disk/rubbish/findList',{
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
								d.fileicon="data:image/png;base64,"+d.fileicon;
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
			//勾选checkbox
			selectionChange(val){
				this.checkedcount=val.length;
				this.checkeditems=[];
				for(var i=0;i<val.length;i++){
					this.checkeditems.push({
						"id":val[i].id,
						"name":val[i].filename
					});
				}
			},
			//按照创建时间排序
			sortChange(column){
				this.search.timeorder=column.order;
				this.searchs();
			},
			///////////////////////////////////////////////////
			del(){
				this.$confirm('是否删除选中的记录?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/rubbish/delete',{
        				"idjson":JSON.stringify(this.checkeditems),
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
			//////////////////////////////////////////////////////转存////////////////////////////////////////////////////////////
			recoverUI(){
				this.dialog.width="550px";
				this.dialog.title="还原到";
				this.dialog.visible=true;
				this.dialog.type="recover";
				
				setTimeout(()=>{
					this.$refs.form.setRubbishData(JSON.stringify(this.checkeditems));
				},0);
			},
			//////////////////////////////////////////////////////窗口////////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.saveFileFromRubbish();
				},0);
			},
			recoverClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			}
		}
	}
</script>

<style scoped="scoped">
</style>