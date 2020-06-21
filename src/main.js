//开发环境（直连）
var baseurl="http://127.0.0.1:8012/netdisk-web-perpc/";
var socketurl="127.0.0.1:8013/netdisk-service-provider";
var uploadurl="http://127.0.0.1:7012";

//运行环境（经过Nginx转发）
/*var baseurl="http://106.15.248.223:80/netdisk-web-perpc/";
var socketurl="106.15.248.223:80/netdisk-service-provider";
var uploadurl="http://106.15.248.223:80/disk";*/

//////////////////////////////////////////////////////////////////////////////////////////////

Vue.prototype.baseurl=baseurl;//后台接口
Vue.prototype.socketurl=socketurl;//socket服务器
Vue.prototype.uploadurl=uploadurl;

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'
import VueUuid from 'vue-uuid'

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
    
import CodeDiff from 'vue-code-diff'

import utils from './assets/js/utils.js'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueClipboard);
Vue.use(VueUuid);
Vue.use(VueCodemirror);
Vue.use(mavonEditor);
Vue.use(CodeDiff);
Vue.use(utils);

import App from './App.vue';
import login from './vues/login.vue';
import index from './vues/index.vue';

import fileallindex from './vues/fileall/index.vue';
import fileallindexcard from './vues/fileall/index_card.vue';
import filedocumentindex from './vues/filedocument/index.vue';
import filevideoindex from './vues/filevideo/index.vue';
import filemusicindex from './vues/filemusic/index.vue';
import fileotherindex from './vues/fileother/index.vue';

//图片相关
import filepictureindex from './vues/filepicture/index.vue';
import filepictureindexalbum from './vues/filepicture/index_album.vue';
import filepictureindexalbumfile from './vues/filepicture/index_album_file.vue';
import filepictureindexfile from './vues/filepicture/index_file.vue';

//我的分享
import sharebyselfindex from './vues/sharebyself/index.vue';
//朋友分享
import sharebyfriendsindex from './vues/sharebyfriends/index.vue';
//回收站
import rubbishindex from './vues/rubbish/index.vue';
//通知
import noticeindex from './vues/notice/index.vue';
//搜索
import searchindex from './vues/search/index.vue';
//最近操作
import filehistoryindex from './vues/filehistory/index.vue';
//分享提取
import sharepwd from './vues/shareextract/share_pwd.vue';
import sharelist from './vues/shareextract/share_list.vue';

//封装组件
import component from './vues/component/dialog_detail.vue';
import compare from './vues/component/compare.vue';

import create_excel from './vues/component/create_excel.vue';
import create_markdown from './vues/component/create_markdown.vue';
import create_ppt from './vues/component/create_ppt.vue';
import create_text from './vues/component/create_text.vue';
import create_word from './vues/component/create_word.vue';

import edit_markdown from './vues/component/edit_markdown.vue';
import edit_office from './vues/component/edit_office.vue';
import edit_text from './vues/component/edit_text.vue';

import play_audio from './vues/component/play_audio.vue';
import play_video from './vues/component/play_video.vue';

import preview_image from './vues/component/preview_image.vue';
import preview_markdown from './vues/component/preview_markdown.vue';
import preview_office from './vues/component/preview_office.vue';
import preview_pdf from './vues/component/preview_pdf.vue';
import preview_text from './vues/component/preview_text.vue';

import thumbnail from './vues/component/thumbnail.vue';

Vue.http.options.emulateJSON=true;
Vue.http.options.root=baseurl;

var router=new VueRouter({
	routes:[
		{path:'/',redirect:'/toLogin'},
		{path:"/toLogin",component:login},
		
		{path:"/sharepwd/:id",component:sharepwd},
		{path:"/sharelist/:id",component:sharelist},
		
		{path:"/main",component:index,children:[
			{path:'/main',redirect:'fileall/index'},
			{path:"filehistory/index",component:filehistoryindex},
			{path:"fileall/index",component:fileallindex},
			{path:"fileall/indexcard",component:fileallindexcard},
			{path:"filedocument/index",component:filedocumentindex},
			{path:"filepicture/index",component:filepictureindex,children:[
				{path:'/main/filepicture/index',redirect:'album'},
				{path:"album",component:filepictureindexalbum},
				{path:"albumfile",component:filepictureindexalbumfile},
				{path:"file",component:filepictureindexfile}
			]},
			{path:"filevideo/index",component:filevideoindex},
			{path:"filemusic/index",component:filemusicindex},
			{path:"fileother/index",component:fileotherindex},
			{path:"sharebyself/index",component:sharebyselfindex},
			{path:"sharebyfriends/index",component:sharebyfriendsindex},
			{path:"rubbish/index",component:rubbishindex},
			{path:"search/index",component:searchindex},
			{path:"notice/index",component:noticeindex}
		]},
		{path:"/component",component:component,children:[
			{path:"compare",component:compare},
		
			{path:"create_excel",component:create_excel},
			{path:"create_markdown",component:create_markdown},
			{path:"create_ppt",component:create_ppt},
			{path:"create_text",component:create_text},
			{path:"create_word",component:create_word},
			
			{path:"edit_markdown",component:edit_markdown},
			{path:"edit_office",component:edit_office},
			{path:"edit_text",component:edit_text},
			
			{path:"play_audio",component:play_audio},
			{path:"play_video",component:play_video},
			
			{path:"preview_image",component:preview_image},
			{path:"preview_markdown",component:preview_markdown},
			{path:"preview_office",component:preview_office},
			{path:"preview_pdf",component:preview_pdf},
			{path:"preview_text",component:preview_text},
			
			{path:"thumbnail",component:thumbnail}
		]}
	]
});

new Vue({
  	el: '#app',
  	created(){
  	},
  	router:router,
  	render: h => h(App)
})
