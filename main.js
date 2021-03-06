window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var symbols = " !\"#$%&'()*+,-./0123456789:;<=>?@";
var loAZ = "abcdefghijklmnopqrstuvwxyz";
symbols+= loAZ.toUpperCase();
symbols+= "[\\]^_`";
symbols+= loAZ;
symbols+= "{|}~";
var temp = 10;
var humi = 50;
var linePoints = [];
var temps = [];
var humis = [];
var lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
        label: "My First dataset",
        borderColor: window.chartColors.red,
        backgroundColor: window.chartColors.red,
        fill: false,
        data: temps,
        yAxisID: "y-axis-1",
    }, {
        label: "My Second dataset",
        borderColor: window.chartColors.blue,
        backgroundColor: window.chartColors.blue,
        fill: false,
        data: humis,
        yAxisID: "y-axis-2"
    }]
};
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
$(document).ready(function(){  
    var map = new BMap.Map("allmap");  // 创建Map实例
    map.centerAndZoom('苏州', 15);// 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("苏州");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.addOverlay(marker);   
    map.panTo(currentUser);
    hexSample = '7b2268223a35372e30302c2274223a32352e30307d';
    //alert(getHexToString(hexSample));
    var myLayout = $("body").layout({
        applyDefaultStyles: true,
        west_size:100,
        south_size:100
    });
    var ctx = document.getElementById("myChart").getContext("2d");
     
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
        temps.push(randomScalingFactor());
        humis.push(randomScalingFactor());
        map.closeInfoWindow(infoWindow,currentUser);
        currentUser = new BMap.Point(120.61990712,31+   (Math.random() * 0.007 + 0.0000015), 31.31798737 + (Math.random() * 0.007 + 0.000000015));
        linePoints.push(currentUser);
       
        addLine(linePoints);
        marker.setPosition(currentUser);       
        infoWindow = new BMap.InfoWindow('T:'+temp+'C°<br/>H:'+humi+'% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);
        map.panTo(currentUser); 
    }
    function showcharts(){
        new Chart.Line(ctx, {
            data: lineChartData,
            options: {
                responsive: true,
                hoverMode: 'index',
                stacked: false,
                title:{
                    display: true,
                    text:'Chart.js Line Chart - Multi Axis'
                },
                scales: {
                    yAxes: [{
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                    }, {
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "right",
                        id: "y-axis-2",
    
                        // grid line settings
                        gridLines: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    }],
                }
            }
        });
    }
    setInterval(show,5000);
    setInterval(showcharts,1000);
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
function randomScalingFactor(){
    return Math.round(rand(-100, 100));
}
function rand(){
    var seed = Date.now();
    var min = 0;
    var max = 100;
    seed = (seed * 9301 + 49297) % 233280;
    return min + (seed / 233280) * (max - min);
}

function getHexToString(hexStr){
    var hex = "0123456789abcdef";
	var text = "";
	var i=0;

    for( i=0; i<hexStr.length; i=i+2 )
	{
		var char1 = hexStr.charAt(i);
		if ( char1 == ':' )
		{
			i++;
			char1 = hexStr.charAt(i);
		}
		var char2 = hexStr.charAt(i+1);
		var num1 = hex.indexOf(char1);
		var num2 = hex.indexOf(char2);
		var value = num1 << 4;
		value = value | num2;

		var valueInt = parseInt(value);
		var symbolIndex = valueInt - 32;
		var ch = '?';
		if ( symbolIndex >= 0 && value <= 126 )
		{
			ch = symbols.charAt(symbolIndex)
		}
		text += ch;
	}
    return text;
}
