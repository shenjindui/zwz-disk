<template>
	<div>
		<el-form ref="form" :model="form" label-width="150px">
			<el-form-item label="链　接：">
				<el-input v-model="form.url"></el-input>
  			</el-form-item>
  			<el-form-item label="提取码：" v-if="form.code!=''">
  				<el-input v-model="form.code" style="width: 80px;"></el-input>
  			</el-form-item>
  			<el-form-item>
  				<el-button type="primary" @click="copyWithcode" v-if="form.code!=''">复制链接及提取码</el-button>
  				<el-button type="primary" @click="copy" v-if="form.code==''">复制链接</el-button>
  			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	var _this=null;
	export default{
		data(){
			return {
				form:{
					url:"",
					code:""
				}
			}
		},
		created(){
			_this=this;
		},
		methods:{
			setData(url,code){
				this.form.url=url;
				this.form.code=code;
			},
			copy(){
				var txt="链接地址："+this.form.url;
				this.$copyText(txt).then(function (e) {
					_this.alertMsg(0,"复制成功");
        		}, function (e) {
          			_this.alertMsg(1,"复制失败");
        		});
			},
			copyWithcode(){
				var txt="链接地址："+this.form.url+" 提取码："+this.form.code;
				this.$copyText(txt).then(function (e) {
					_this.alertMsg(0,"复制成功");
        		}, function (e) {
          			_this.alertMsg(1,"复制失败");
        		});
			}
		}
	}
</script>

<style scoped="scoped">
</style>