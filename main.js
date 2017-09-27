
$(document).ready(function(){  
    var map = new BMap.Map("allmap");  // 创建Map实例
    map.centerAndZoom('苏州', 15);// 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("苏州");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var currentUser = getCurrentUser();
    var myIcon = new BMap.Icon("truck_mini.png", new BMap.Size(32, 70), {    
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
           // 图标中央下端的尖角位置。    
           anchor: new BMap.Size(10, 25),    
           // 设置图片偏移。   
           // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
           // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
           imageOffset: new BMap.Size(0, 0)   // 设置图片偏移    
         });      
        // 创建标注对象并添加到地图   
    var marker = new BMap.Marker(currentUser, {icon: myIcon});    
         
    map.addOverlay(marker);    
	map.panTo(currentUser);
    var opts = {
	  width : 200,     // 信息窗口宽度
	  height: 100,     // 信息窗口高度
	  title : "pork" , // 信息窗口标题
	}
    var infoWindow = new BMap.InfoWindow('T:16C°<br/>H:80% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow,currentUser);
    marker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,currentUser); //开启信息窗口
	});
    
});
function opendoor(){
    alert("You opened door");
}
function getCurrentUser(){
    return new BMap.Point(120.61990712,31.31798737);
}
