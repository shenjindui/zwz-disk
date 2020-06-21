<template>
	<div style="height: 100%;">
		<el-container style="height: 100%;">
			<el-header class="header">
				<el-row>
	  				<el-col :span="4" class="headercol">
						<img src="../assets/img/logo.png" style="vertical-align: middle;"/>
	  				</el-col>
	  				<el-col :span="15" class="headercol right">
	  					<el-input placeholder="搜索您的文件" style="width: 250px;" v-model="keyword" size="small">
    						<el-button slot="append" icon="el-icon-search" @click="gotoSearchs"></el-button>
  						</el-input>
	  				</el-col>
	  				<el-col :span="5" class="headercol right">
						<el-popover width="400" trigger="click">
							<div>
								<ul class="ullist">
									<li v-for="item in notice.lists">
										<p>
											<span>
												<i class="el-icon-time"></i>
												{{item.createtime}}
											</span>
											<span>{{item.typename}}</span>
										</p>
										<p>{{item.content}}</p>
									</li>
								</ul>
								<div style="text-align: center;">
									<el-button size="small" style="width: 200px;" @click="enterNotice">进入通知管理</el-button>
								</div>
							</div>
  							<el-badge :value="notice.num" slot="reference" style="margin-right: 20px;">
								<el-button icon="el-icon-bell" size="small">通知</el-button>
							</el-badge>
						</el-popover>
						
						
	  					<el-popover width="160" v-model="visible">
		  					<p style="line-height: 30px;text-align: center;">是否退盘系统?</p>
		  					<div style="text-align: center; margin-top: 10px;">
		    					<el-button type="text" size="mini" @click="visible = false">取消</el-button>
		    					<el-button type="primary" size="mini" @click="logout">确定</el-button>
		  					</div>
		  					<el-button icon="el-icon-switch-button" size="small" slot="reference">{{nickname}}</el-button>
						</el-popover>
	  				</el-col>
	  			</el-row>
			</el-header>
			<el-container style="height: 100%;">
				<el-aside style="width: 200px;height: 100%;position: relative;">
					<el-menu
			      		:default-active="activeIndex"
			      		@select="handleSelected"
			      		style="box-sizing: border-box;height: 100%;"
			      		background-color="#f7f7f7"
			      		active-text-color="#409EFF"
			      		v-loading="loading"
			      		>
				      	<el-menu-item :index="item.id" class="item"  v-for="item in menus">
				        	<i :class="item.icon"></i>
				        	<span slot="title">{{item.name}}</span>
				      	</el-menu-item>
			    	</el-menu>
			    	<div class="capacity">
			    		<div style="font-size: 12px;color: #C0C4CC;">已用{{capacity.used}}/{{capacity.total}}</div>
			    		<div><el-progress :percentage="capacity.percentage" :show-text="false"></el-progress></div>
			    	</div>
				</el-aside>
    			<el-main style="overflow:auto;height: 100%;">
    				<router-view></router-view>
    			</el-main>
  			</el-container>
		</el-container>
		
		<!--广告弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
			:show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<notice></notice>
			<div slot="footer" class="dialog-footer">
    			<el-button @click="cancel()">关闭</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import notice from './notice.vue';
	export default {
		data(){
			return {
				keyword:"",
				websocket:null,
				capacity:{
					used:0,
					total:0,
					percentage:0,
				},
				notice:{
					num:0,
					lists:[]
				},
				visible:false,
				nickname:sessionStorage.getItem("username"),
				loading:false,
				menus:[],
				activeIndex:"",//默认选择哪个菜单
				
				dialog:{
      				width:"600px",
      				visible: true,
      				title:'须知'
      			}
			}
		},
		components:{
			notice
		},
		created() {
			//建立连接
			this.connectionSocket();
			//菜单
			this.findMenus();
			
			//默认选择菜单
			var activeIndex=sessionStorage.getItem("activeIndex");
			if(activeIndex==null){
				activeIndex="0";
			}
			this.activeIndex=activeIndex;
    	},
		mounted () {
			//监听窗口关闭事件，当窗口关闭时
    		window.addEventListener('beforeunload', e => {
    			this.websocket.close();
    		});
  		},
		methods: {
			connectionSocket(){
				if('WebSocket' in window){
					this.websocket=new WebSocket("ws://"+this.socketurl+"/websocket/"+sessionStorage.getItem("userid")+"/"+sessionStorage.getItem("token"));
				}else if('MozWebSocket' in window){
					this.websocket=new MozWebSocket("ws://"+this.socketurl+"/websocket/"+sessionStorage.getItem("userid")+"/"+sessionStorage.getItem("token"));
				}else{
					this.alertMsg(1,"WebSocket不支持该浏览器版本!");
				}
				
				this.websocket.onopen = this.open;
				this.websocket.onerror = this.error;
				this.websocket.onclose = this.close;
				this.websocket.onmessage=this.getMessage;
			},
			open: function () {
				/*this.$notify({
          			message: 'WebSocket连接服务器成功',
          			type: 'success'
        		});*/
		    },
		    close: function (e) {
		    	/*this.$notify.error({
          			message: 'WebSocket服务器连接断开'
        		});*/
        		if(this.websocket!=null){
        			this.connectionSocket();
        		}
		    },
		    error: function () {
		    	/*this.$notify.error({
          			message: 'WebSocket服务器连接异常'
        		});*/
		    },
		    getMessage: function (msg) {
		    	var data=msg.data;
		    	data=JSON.parse(data);
		    	if(data.type==0){//容量
		    		this.capacity.total=data.data.totalcapacityname;
		        	this.capacity.used=data.data.usedcapacityname;
		        	this.capacity.percentage=data.data.percentage;
		    	}else if(data.type==1){//通知
		    		/*this.$notify({
	          			message: '您有一条通知,请注意查收!',
	          			type: 'success'
	        		});*/
		    		this.notice.num=data.count;
		    		this.notice.lists=data.data;
		    	}
		    },
			findMenus(){
				this.loading=true;
				this.$http.post('menu/findList',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.menus=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
	    	handleSelected(index, path) {
	    		sessionStorage.setItem("activeIndex",index);
	    		var menu=this.menus[index];
	    		this.$router.push(menu.url);
	      	},
	      	gotoSearchs(){
				this.$router.push({
				    path:'/main/search/index',
				    query:{
				    	"keyword":this.keyword
				    }
				});
			},
			enterNotice(){
				this.$router.push({
				    path:'/main/notice/index'
				});
			},
	      	logout(){
	      		this.loading=true;
				this.$http.post('security/logout',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var code=response.body.code;
					var msg=response.body.msg;
					if(code==0){
						//清空session
						this.removeSession();
						//断开连接
						this.websocket.close(); 
						this.websocket=null;
			      		//登录页面
			      		this.$router.push("/");
					}else{
						this.alertMsg(code,msg);
					}
					this.loading=false;
				});
	      	},
	      	cancel(){
	      		this.dialog.visible=false;
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
	.headercol{
		height: 60;
		/*line-height: 60px;*/
		box-sizing: border-box;
		margin-top: 15px;
	}
	.right{
		text-align: right;
	}
	
	/*=======================================================*/
	.item{
		height: 40px;
		line-height: 40px;
	}
	
	/*=======================================================*/
	.capacity{
		padding-left: 20px;
		padding-right: 20px;
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		bottom: 50px;
	}
	
	/*=======================================================*/
	.ullist{
		
	}
	.ullist li{
		list-style-type: none;
		padding: 10px;
		margin-bottom: 10px;
		font-size: 13px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}
	
</style>
