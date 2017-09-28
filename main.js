
var temp = 10;
var humi = 50;
var linePoints = []
var currentUser = getCurrentUser(); 
linePoints.push(currentUser);
var pointsLen = linePoints.length,i,polyline;  
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

    function addLine(points){  
        

          if(pointsLen == 0){  
              return;  
          }  
          // 创建标注对象并添加到地图     
          for(i = 0;i <pointsLen;i++){  
              linePoints.push(new BMap.Point(points[i].lng,points[i].lat));  
          }  
        
          polyline = new BMap.Polyline(linePoints, {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});   //创建折线  
          map.addOverlay(polyline);   //增加折线  
     } 
    function show(){
        temp = Math.random()*20+20;
        humi = Math.random()*20+50;
        map.closeInfoWindow(infoWindow,currentUser);
        currentUser = new BMap.Point(120.61990712,31+   (Math.random() * 0.007 + 0.0000015), 31.31798737 + (Math.random() * 0.007 + 0.000000015));
        linePoints.push(currentUser);
        addLine(linePoints);
        marker.setPosition(currentUser);       
        infoWindow = new BMap.InfoWindow('T:'+temp+'C°<br/>H:'+humi+'% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts); 
    }
    setInterval(show,1000);
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



