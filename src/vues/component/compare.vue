<template>
	<div v-loading="loading" style="height: 100%;width: 100%;margin: 0 auto;background:white;">
		<code-diff :old-string="data.oldStr" :new-string="data.nowStr" :context="data.context" :outputFormat="data.outputFormat"/>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				token:"",
				code:"UTF-8",
				info:{
					filemd5:"",
					prevfilemd5:""
				},
				data:{
					nowStr: '',
      				oldStr: '',
      				outputFormat:"side-by-side",
      				context:100000
				}
			}
		},
		created(){
			this.info.filemd5=this.$route.query.filemd5;
			this.info.prevfilemd5=this.$route.query.prevfilemd5;
			this.token=this.$route.query.token;
			
			this.findNowData();
			this.findOldData();
		},
		methods:{
			findNowData() {
				this.loading=true;
				this.$http.post('disk/fileopen/writeTextStrByMd5',{
    				"filemd5":this.info.filemd5,
    				"code":this.code,
    				"token":this.token
    			}).then(response => {
    				this.loading=false;
					var data=response.body;
					if(data.code==0){
						this.data.nowStr=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
      		},
      		findOldData() {
      			this.loading=true;
				this.$http.post('disk/fileopen/writeTextStrByMd5',{
    				"filemd5":this.info.prevfilemd5,
    				"code":this.code,
    				"token":this.token
    			}).then(response => {
    				this.loading=false;
					var data=response.body;
					if(data.code==0){
						this.data.oldStr=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
      		}
		}
	}
</script>

<style scoped="scoped">
</style>