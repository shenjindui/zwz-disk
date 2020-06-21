import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

export default {
   	install(Vue, options) {
        Vue.prototype.alertMsg = function (code,msg) {
			if(code==0){
				this.$message({ message: msg, type: 'success'});
			}else{
				if("ssofail"==msg){
					this.$message.error("登录失效,请重新登录系统!");
					this.removeSession();
					this.$router.push("/");
				}else{
					this.$message.error(msg);
				}
			}
       	},
       	Vue.prototype.addSession = function (userid,username,token) {
       		//分享提取的时候用到
			localStorage.setItem("token",token);
			localStorage.setItem("userid",userid);
			localStorage.setItem("username",username);
			
			sessionStorage.setItem("token",token);
			sessionStorage.setItem("userid",userid);
			sessionStorage.setItem("username",username);
       	},
       	Vue.prototype.removeSession = function () {
       		localStorage.removeItem("token");
			localStorage.removeItem("userid");
			localStorage.removeItem("username");
					
			sessionStorage.removeItem("token");
			sessionStorage.removeItem("userid");
			sessionStorage.removeItem("username");
						
			sessionStorage.removeItem("activeIndex");
       	}
   }
}
