<template>
	<div>
		<el-tabs v-model="activeName" type="border-card" style="height: 400px;overflow-y: auto;">
	    	<el-tab-pane label="私密链接分享" name="first">
	    		<dialogsharesecret ref="secret" v-on:secretResult="secretResult" v-if="secrettype=='secret_share'"></dialogsharesecret>
	    		<dialogsharesecretresult ref="secret" v-if="secrettype=='secret_result'"></dialogsharesecretresult>
	    	</el-tab-pane>
	    	<el-tab-pane label="好友分享" name="second">
	    		<dialogsharefriends ref="friends" v-on:friendsResult="friendsResult"></dialogsharefriends>
	    	</el-tab-pane>
	  	</el-tabs>
	</div>
</template>

<script>
	import dialogsharesecret from './dialog_share_secret.vue';
	import dialogsharesecretresult from './dialog_share_secret_result.vue';
	import dialogsharefriends from './dialog_share_friends.vue';
	export default{
		data(){
			return {
				activeName:"first",
				secrettype:"secret_share",
				id:"",
				title:"",
				type:""
			}
		},
		components:{
			dialogsharesecret,
			dialogsharesecretresult,
			dialogsharefriends
		},
		methods:{
			setData(id,title,type){
				this.id=id;
				this.title=title;
				this.type=type;
				setTimeout(()=>{
					this.$refs.secret.setData(id,title,type);
					this.$refs.friends.setData(id,title,type);
				},0);
			},
			secretResult(url,code){
				this.secrettype="secret_result";
				setTimeout(()=>{
					this.$refs.secret.setData(url,code);
				},0);
			},
			friendsResult(){
				//关闭窗口
				this.$emit("shareClose");
			}
		}
	}
</script>

<style scoped="scoped">
</style>