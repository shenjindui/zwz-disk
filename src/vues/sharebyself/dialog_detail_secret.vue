<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card">
	  			<table>
	  				<tr>
	  					<td class="tdleft">提取类型：</td>
	  					<td>
	  						<span v-if="sharetype==0">有码提取</span>
	  						<span v-if="sharetype==1">无码提取</span>
	  					</td>
	  				</tr>
	  				<tr>
	  					<td class="tdleft">有效期：</td>
	  					<td>{{effectname}}</td>
	  				</tr>
	  				<tr>
	  					<td class="tdleft">提取链接：</td>
	  					<td>{{url}}</td>
	  				</tr>
	  				<tr>
	  					<td class="tdleft">提取码：</td>
	  					<td>{{code}}</td>
	  				</tr>
	  			</table>
			</el-card>
	  	</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				effectname:"",
				sharetype:"",
				url:"",
				code:""
			}
		},
		methods:{
			setData(effectname,sharetype,url,code){
				this.effectname=effectname;
				this.sharetype=sharetype;
				this.url=url;
				this.code=code;
			}
		}
	}
</script>

<style scoped="scoped">
	.tdleft{
		width: 120px;
		text-align: right;
	}
</style>