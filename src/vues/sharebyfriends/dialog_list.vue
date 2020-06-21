<template>
	<div style="background: #F2F6FC;">
		<el-card class="box-card" :body-style="{padding:'20px'}">
			<!--导航-->
			<el-row>
			  	<el-col :span="22">
					<el-button type="text" size="mini" icon="el-icon-caret-right" v-for="item in items" @click="itemClickPrev(item.id)">{{item.name}}</el-button>
				</el-col>	
				<el-col :span="2">
					<el-button type="primary" size="mini" icon="el-icon-plus" v-if="checkedcount==0" disabled>转存</el-button>
					<el-button type="primary" size="mini" icon="el-icon-plus" v-if="checkedcount>0" @click="zcUI">转存</el-button>
				</el-col>
			</el-row>
			<!--表格-->
			<el-table v-loading="loading" :data="files" size="medium" height="330" @selection-change="selectionChange">
	  			<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="icon" label="文件名">
					<template slot-scope="scope">
						<img :src="scope.row.icon" style="vertical-align: middle;margin-right: 10px;" />
						<span class="link" @click="itemClickEnter(scope.row.id,scope.row.filename,scope.row.filetype)">{{scope.row.filename}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="filesize" label="大小" width="250">
					<template slot-scope="scope">
						<span v-if="scope.row.filesize!=0">{{scope.row.filesize}}</span>
						<span v-if="scope.row.filesize==0">-</span>
					</template>
				</el-table-column>
				<el-table-column prop="createtime" label="修改日期" width="300"></el-table-column>
			</el-table>
		</el-card>
		
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
			:show-close="true" @close="cancel" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<foldertree ref="form" v-if="dialog.type=='zc'" v-on:closeDialog="zcClose"></foldertree>
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='zc'">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import foldertree from '../common/dialog_foldertree.vue';
	
	export default{
		data(){
			return {
				loading:false,
				id:"",
				pid:"0",
				items:[
					{"id":"0","name":"全部文件"}
				],
				checkedcount:0,
				checkeditems:[],
				files:[],
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
			
		},
		methods:{
			setData(id){
				this.id=id;
				this.items=[];
				this.items.push({
					"id":0,
					"name":"全部文件"
				});
				this.pid=0;
				this.findList();
			},
			findList(){
				this.loading=true;
    			this.$http.post('disk/sharebyfriends/findShareList',{
    				"id":this.id,
    				"pid":this.pid,
    				"token":sessionStorage.getItem("token")
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.data;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.icon="data:image/png;base64,"+d.fileicon;
							}
						}			
						this.files=rows;
					}else{
						this.files=[];
						this.alertMsg(data.code,data.msg);
					}
    				this.loading=false;
				});
			},
			//勾选checkbox
			selectionChange(val){
				this.checkedcount=val.length;
				this.checkeditems=[];
				for(var i=0;i<val.length;i++){
					this.checkeditems.push({
						"id":val[i].id
					});
				}
			},
			//////////////////////////////////////////////////////导航栏////////////////////////////////////////////////////////////
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
				this.pid=id;
				this.findList();
			},
			itemClickEnter(id,name,filetype){
				if(filetype==1){
					//this.alertMsg(1,"您点击的是文件!");
					return;
				}
				this.items.push({
					"id":id,
					"name":name
				});
				this.pid=id;
				this.findList();
			},
			//////////////////////////////////////////////////////转存////////////////////////////////////////////////////////////
			zcUI(){
				this.dialog.width="550px";
				this.dialog.title="转存到";
				this.dialog.visible=true;
				this.dialog.type="zc";
				
				var ids=JSON.stringify(this.checkeditems);
				
				setTimeout(()=>{
					this.$refs.form.setZcData(ids,this.id);
				},0);
			},
			//////////////////////////////////////////////////////窗口////////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.saveFileFromShare();
				},0);
			},
			zcClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				
				this.$emit("zcResultClose");
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