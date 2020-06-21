<template>
	<div style="height: 100%;box-sizing: border-box;">
		<el-row style="height: 77%;box-sizing: border-box;">
			<el-col :span="24" style="height: 100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
				<imgbig ref="imgbig"></imgbig>
			</el-col>
		</el-row>
		<el-row style="height: 8%;box-sizing: border-box;">
			<el-col :span="24" style="height: 100%;">
				<tool ref="tool"></tool>
			</el-col>
		</el-row>
		<el-row style="height: 15%;box-sizing: border-box;">
			<el-col :span="24" style="height: 100%;">
				<imgsmall ref="imgsmall"  v-on:setData="setData"></imgsmall>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import imgbig from './thumbnail_img_big.vue';
	import imgsmall from './thumbnail_img_small.vue';
	import tool from './thumbnail_tool.vue';
	export default{
		data(){
			return {
			}
		},
		components:{
			imgbig,
			imgsmall,
			tool
		},
		created(){
		},
		methods:{
			setData(fileid,filename,url,pageInfo){
				setTimeout(()=>{
					this.$refs.imgbig.setUrl(url);
					this.$refs.tool.setData(fileid,filename,pageInfo);
				},0);
			}
		}
	}
</script>

<style scoped="scoped">
	
</style>