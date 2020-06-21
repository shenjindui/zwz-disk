<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-button type="text" icon="el-icon-plus" @click="createAlbum">新建相册</el-button>
		  		<el-card class="box-card" style="margin-bottom: 10px;">
					<div v-if="table.data.length==0" style="color: red;height: 160px;line-height: 160px;text-align: center;">
			  			暂无相册
			  		</div>
			  		<div class="mod-pic-group" v-if="table.data.length>0">
			  			<ul>
				  			<li class="pic-group-item" v-for="item in table.data">
				  				<!--图片-->
				  				<div class="pic-group-item-pic" @click="save(item.id)">
				  					<!--数量-->
				  					<span style="color: red;z-index: 100;font-size: 26px;font-weight: bold;position: absolute;bottom: 0px;right: 0px;">{{item.count}}</span>
				  					<!--150*111-->
				  					<img src="../../assets/img/album.png" v-if="item.coverurl==''"/>
				  					<img :src="item.fileicon" v-if="item.coverurl!=''">
				  				</div>
				  				
				  				<!--底部-->
				  				<div class="pic-group-item-txt">
				  					<p class="tit">{{item.albumname}}</p>
				  				</div>
				  			</li>
				  		</ul>
			  		</div>					
				</el-card>
		  	</el-col>
		  	<el-col :span="24" style="text-align: center;">
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
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
			:show-close="false" @close="cancel" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
			<dialogalbumadd ref="form" v-if="dialog.type=='add'" v-on:closeAndRefresh="albumAddClose"></dialogalbumadd>
			<div slot="footer" class="dialog-footer">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确 定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dialogalbumadd from './dialog_album_add.vue';
	export default{
		data() {
			return {
				loading:false,
				idjson:"",
				table:{
      				search:{
      				},
      				currentpage:1,
      				pagesize:10,
      				total:0,
        			data: []
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
			dialogalbumadd
		},
		methods:{
			reset(){
			},
			setData(idjson){
				this.idjson=idjson;
				this.searchs();
			},
      		searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('disk/filealbum/findPageList',{
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data= response.body;
					if(data.code==0){
						var rows=data.rows;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.fileicon=this.baseurl+"disk/fileopen/previewThumbnail?url="+d.coverurl+"&token="+sessionStorage.getItem("token");
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
			///////////////////////////////////////////////////////////////////
			createAlbum(){
				this.dialog.width="550px";
				this.dialog.title="新建相册";
				this.dialog.visible=true;
				this.dialog.type="add";
			},
			save(albumid){
				this.$confirm('此操作将把选中的图片移到该相册里面, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filealbum/setImgToAlbum',{
        				"albumid":albumid,
        				"idjson":this.idjson,
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.$emit('closeAndRefresh');
						}
						this.alertMsg(data.code,data.msg);
        				this.loading=false;
					});
        		});
			},
			////////////////////////////////////////
			albumAddClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.save();
				},0);
			}
		}
	}
</script>

<style scoped="scoped">
	ol, ul {
	    list-style: none;
	}
	.pic-group-item {
	    position: relative;
	    float: left;
	    margin: 0 20px 15px 0;
	    cursor: pointer;
	    box-sizing: border-box;
	    width: 120px;
	    height: 140px;
	    border: 1px solid #d5d7df;
	    background: #FCFCFC;
	    box-shadow: 0 1px 4px rgba(0,0,0,.15);
	}
	
	/*==============图片fffcf4===============*/
	.pic-group-item-pic {
	    z-index: 3;
	    box-sizing: border-box;
	    position: relative;
	     
	    width: 100px;
	    height: 100px;
	    background: #FCFCFC;
	    
	    top: 50%;
	    left: 50%;
	    margin-top: -68px;
	    margin-left: -50px;
	}
	.pic-group-item-pic img{
		width:80px;
		height:80px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -40px;
		margin-left: -40px;
	}
	/*==============底部===============*/
	.pic-group-item-txt {
		position: absolute;
		bottom: 0px;
		width: 100%;
	    box-sizing: border-box;
	    background: #FCFCFC;
	    height: 36px;
	    line-height: 36px;
	    color: #606266;
	    border-top:1px solid #F5F5F5;
	}
	.pic-group-item-txt .tit {
		font-size: 14px;
		padding-left: 5px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    vertical-align: middle;
	}
	/*==============操作===============*/
	.operate{
		display: none;
		position: absolute;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #E4E7ED;
		z-index: 1000;
		text-align: center;
	}
	.pic-group-item:hover .operate{
		display: block;
	}
</style>