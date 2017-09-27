
var temp = 10;
var humi = 50;
var currentUser = getCurrentUser(); 
var opts = {
    width : 200,     // 信息窗口宽度
    height: 100,     // 信息窗口高度
    title : "pork" , // 信息窗口标题
  };
var myIcon = new BMap.Icon("truck_mini.png", new BMap.Size(32, 70), {    
    anchor: new BMap.Size(30, 10),    
    imageOffset: new BMap.Size(0, 0)   // 设置图片偏移    
  });  
var marker = new BMap.Marker(currentUser, {icon: myIcon});  
var infoWindow = new BMap.InfoWindow('T:16C°<br/>H:80% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts); 
var geoc = new BMap.Geocoder();   
$(document).ready(function(){  
    var map = new BMap.Map("allmap");  // 创建Map实例
    map.centerAndZoom('苏州', 15);// 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("苏州");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.addOverlay(marker);   
    map.panTo(currentUser);

    function show(){

        temp = Math.random()*0.5+20;
        humi = Math.random()*0.6+50;
   
        currentUser = new BMap.Point(120.61990712,31+   (Math.random() * 0.007 + 0.0000015), 31.31798737 + (Math.random() * 0.007 + 0.000000015));
        marker.setPosition(currentUser);
        map.panTo(currentUser);
        //alert('您的位置：'+currentUser.lng+','+currentUser.lat);
        // geoc.getLocation(currentUser, function(rs){
		// 	var addComp = rs.addressComponents;
		// 	alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
		// });        
        infoWindow = new BMap.InfoWindow('T:'+temp+'C°<br/>H:'+humi+'% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts); 
    }
    setInterval(show,10000);
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
