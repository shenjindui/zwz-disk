<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card">
	  			<el-table v-loading="loading" :data="data" size="small">
		  			<el-table-column prop="username" label="好友姓名"></el-table-column>
					<el-table-column prop="zcstatus" label="转存状态" width="150"></el-table-column>
					<el-table-column prop="zctime" label="转存时间" width="200"></el-table-column>
				</el-table>
			</el-card>
	  	</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				data:[]
			}
		},
		methods:{
			setData(id){
				this.loading=true;
				this.$http.post('disk/sharebyself/findFriends',{
					"shareid":id,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.data=data.data;
					}
					this.loading=false;
				});
			}
		}
	}
</script>

<style>
</style>