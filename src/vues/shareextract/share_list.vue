<template>
	<div style="height: 100%;background: #F2F6FC;">
		<el-container style="height: 100%;">
			<el-header class="header">
				<span class="logo">
					<img src="../../assets/img/logo.png" />
				</span>												
				<!--<el-link type="primary" class="topright"><i class="el-icon-switch-button"></i>退出</el-link>-->
				<el-link type="success" class="topright" v-if="nickname!=''&&nickname!=null"><i class="el-icon-s-custom"></i>{{nickname}}</el-link>
				<el-link type="success" class="topright" v-if="nickname==''||nickname==null"><i class="el-icon-s-custom"></i>未登录</el-link>
			</el-header>
			<el-main style="height: 100%;">
				<el-card class="box-card" style="overflow:auto;height: 100%;">
  					<div slot="header" class="clearfix">
  						<p style="line-height: 40px;">
  							<span><i class="el-icon-s-grid" style="margin-right: 10px;"></i>{{info.title}}</span>
  							
  							<el-button type="primary" size="small" style="float: right;" v-if="nickname!=''&&nickname!=null&&checkedcount==0" disabled>转存网盘</el-button>
    						<el-button type="primary" size="small" style="float: right;" v-if="nickname!=''&&nickname!=null&&checkedcount>0" @click="zcUI">转存网盘</el-button>
    						<el-button type="primary" size="small" style="float: right;margin-right: 10px;" v-if="nickname==''||nickname==null" @click="loginUI">登录网盘</el-button>
  						</p>
    					<p style="line-height: 30px;font-size: 14px;">
    						<i class="el-icon-s-custom"></i>{{info.shareuser}}
    						&nbsp;&nbsp;
    						<i class="el-icon-time"></i>{{info.sharetime}}
    						&nbsp;&nbsp;
    						失效时间：{{info.effectname}}
    						<el-tag type="danger" effect="dark" size="mini" v-if="info.status==1">已失效</el-tag>
    						<el-tag type="danger" effect="dark" size="mini" v-if="info.status==2">已取消分享</el-tag>
    					</p>
  					</div>
  					<div>
  						<!--导航-->
  						<el-row>
						  	<el-col :span="24">
								<div style="font-size: 14px;margin-top: 10px;">
									<a href="javascipt:void(0);" style="text-decoration: none;" v-for="item in items" @click="itemClickPrev(item.id)">{{item.name}} > </a>
								</div>
							</el-col>
						</el-row>
						<!--表格-->
  						<el-table v-loading="loading" :data="files" size="medium" @selection-change="selectionChange">
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
  					</div>
				</el-card>
    		</el-main>
		</el-container>
		
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
			:show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<login ref="form" v-if="dialog.type=='login'" v-on:closeDialog="loginClose"></login>
			
			<foldertree ref="form" v-if="dialog.type=='zc'" v-on:closeDialog="zcClose"></foldertree>
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='zc'">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import login from './dialog_login.vue';
	import foldertree from '../common/dialog_foldertree.vue';
	
	export default{
		data(){
			return {
				loading:false,
				id:"",
				pid:"0",
				nickname:localStorage.getItem("username"),
				info:{
					id:"",
					title:"",
					shareuser:"",
					sharetime:"",
					effectname:"",
					sharetype:"",
					status:""
				},
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
			login,
			foldertree
		},
		created(){
			//session
			var token=localStorage.getItem("token");
			var username=localStorage.getItem("username");
			if(token!=null&&token.length!=0){
				sessionStorage.setItem("token",token);
			}
			if(username!=null&&username.length!=0){
				sessionStorage.setItem("username",username);
			}
			//获取参数
			this.id=this.$route.params.id;
			
			//加载数据
			this.findOne();
			this.findList();
		},
		methods:{
			findOne(){
				this.loading=true;
    			this.$http.post('disk/shareextract/findShareInfo',{
    				"id":this.id
    			}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.info.id=data.data.id;
						this.info.title=data.data.title;
						this.info.shareuser=data.data.shareuser;
						this.info.sharetime=data.data.sharetime;
						this.info.effectname=data.data.effectname;
						this.info.sharetype=data.data.sharetype;
						this.info.status=data.data.status;
					}else{
						this.alertMsg(data.code,data.msg);
					}
    				this.loading=false;
				});
			},
			findList(){
				this.loading=true;
    			this.$http.post('disk/shareextract/findShareList',{
    				"id":this.id,
    				"pid":this.pid,
    				"token":sessionStorage.getItem("sharecodetoken")
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
			loginUI(){
				this.dialog.width="550px";
				this.dialog.title="网盘登录";
				this.dialog.visible=true;
				this.dialog.type="login";
			},
			zcUI(){
				this.dialog.width="550px";
				this.dialog.title="转存到";
				this.dialog.visible=true;
				this.dialog.type="zc";
				
				var ids=JSON.stringify(this.checkeditems);
				setTimeout(()=>{
					this.$refs.form.setZcData(ids,this.info.id);
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
			loginClose(nickname){
				this.dialog.visible=false;
				this.dialog.type="";
				this.nickname=nickname;
			},
			zcClose(){
				this.dialog.visible=false;
				this.dialog.type="";
			}
		}
	}
</script>

<style scoped="scoped">
	.header{
		background: white;
		/*box-shadow: 0 6px 0 rgba(0,0,0,.05);
		z-index: 11111;*/
		border-bottom: 1px solid #f4f4f4;
		box-shadow: 0px 3px 3px rgba(0,0,0,.05);
		z-index: 1111;
	}
	.logo{
		display: inline-block;
		height: 60px;
		line-height: 60px;
	}
	.logo img{
		vertical-align: middle;
	}
	.topright{
		float: right;
		margin-right: 30px;
		margin-top: 20px;
	}
	.file{
		margin-left: 33px;
	}
	.item{
		height: 40px;
		line-height: 40px;
	}
	.link:hover{
		color: blue;
		cursor: pointer;
	}
</style>