//开发环境
var baseurl="http://127.0.0.1:8012/netdisk-web-perpc/";
//运行环境
//var baseurl="http://106.15.248.223:80/netdisk-web-perpc/";

var maxsize="服务器配置比较低,控制单个上传文件不能超过20M,敬请谅解!";
var chunkSize=1048576;//每个切块的大小（1M）
var threads=1;//线程数