<template>
	<div style="height: 100%;text-align: center;box-sizing: border-box;padding-top: 10px;padding-bottom: 10px;">
		<el-image style="max-height: 100%;max-width: 100%;cursor: pointer;" :src="url" :preview-src-list="srcList" :fit="fit"></el-image>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				url:"",
				fit:"fill",
				srcList:[]
			}
		},
		created(){
			
		},
		methods:{
			setUrl(url){
				this.url=url;
				this.srcList=[];
				this.srcList.push(url);
			}
		}
	}
</script>

<style scoped="scoped">
</style>