$(document).ready(function(){
    var map = new BMap.Map("allmap");    // 创建Map实例
    map.centerAndZoom('苏州', 15);// 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("苏州");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var currentUser = getCurrentUser();
    var mk = new BMap.Marker(currentUser);
	map.addOverlay(mk);
	map.panTo(currentUser);
    var opts = {
	  width : 200,     // 信息窗口宽度
	  height: 100,     // 信息窗口高度
	  title : "pork" , // 信息窗口标题
	}
    var infoWindow = new BMap.InfoWindow('T:16C°<br/>H:80% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow,currentUser);
    mk.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,currentUser); //开启信息窗口
	});
});
function opendoor(){
    alert("You opened door");
}
function getCurrentUser(){
    return new BMap.Point(120.61990712,31.31798737);
}