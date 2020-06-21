<template>
	<el-tabs v-model="activeName" @tab-click="handleClick">
    	<el-tab-pane label="图片分组" name="first">
    		<router-view v-if="activeName=='first'"></router-view>
    	</el-tab-pane>
    	<el-tab-pane label="待分组图片" name="second">
    		<router-view v-if="activeName=='second'"></router-view>
    	</el-tab-pane>
  	</el-tabs>
</template>

<script>
	export default{
		data(){
			return {
				activeName: 'first'
			}
		},
		created(){
		},
		methods:{
			handleClick(tab, event){
				this.activeName=tab.name;
				sessionStorage.setItem("filepictureactive",this.activeName);
				
				if(tab.name=="first"){
					this.$router.push("/main/filepicture/index/album");
				}else if(tab.name=="second"){
					this.$router.push("/main/filepicture/index/file");
				}
			}
		}
	}
</script>

<style scoped="scoped">
</style>