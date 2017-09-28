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
var timedata=[];
var startTime=Date.now();
var endTime = Date.now();
var convertor = new BMap.Convertor();


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
var geoc = new BMap.Geocoder();  
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
    var ctx = $("#myChart");
    //ctx.canvas.parentNode.style.height = '128px';
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
        
        endTime = Date.now();
        // var originUrl = "https://www.loraflow.io/v1/application/data?appeui=8f1d7956939f95a0&token=1v84wa7375651a298f9ff8eb008fa&order=desc&startTime="+startTime+"&endTime="+endTime
        var originUrl = "https://www.loraflow.io/v1/application/data?appeui=8f1d7956939f95a0&token=1v84wa7375651a298f9ff8eb008fa&order=asc&start=1506591300000&limit=20";
        startTime = endTime;
        var lng1;
        var lng32;
        var lng16;
        var lng;

        var lat;
        var lat1;
        var lat120;
        var lat43;

        $.ajaxSetup({  
            async : false  
        }); 

        $.get(originUrl,null,function(data){
            var addr;
            var i;    
            for(i=0;i<data.list.length;i++){
              console.log("----2",data.list[i]);
              console.log("----1",data.list[i].data);
               var res = getHexToString(data.list[i].data);
               console.log("----",res);
               addr = JSON.parse(res).address;
               console.log("+++++",addr);
               console.log("---",addr);
              if(addr.lnt !== 0 && addr.lat !== 0 ){
                   break;
               }
            };
            if(i>=data.list.length) return;
            // console.log("123---",JSON.parse(getHexToString(addr)));

            var res = getHexToString(data.list[i].data);
            res = JSON.parse(res);
            $("#currentTemp").val(res.t + "°C");
            $("#currentHumi").val(res.h + "%");
            lat1 = res.address.lat;
            lat120 = parseInt((lat1 * 10000)/1000000);
            lat43 = ((lat1 * 10000)%1000000);
            lat = lat120 + parseFloat(lat43/600000);

            lng1 = res.address.lng;
            lng31 = parseInt((lng1 * 10000)/1000000);
            lng16 = ((lng1 * 10000)%1000000);
            lng = lng31 + parseFloat(lng16/600000);

            temp = res.t;
            humi = res.h;
        });


        var originalPoint = new BMap.Point(lng, lat);
        console.log("4444444",originalPoint);
        var pointArr = [];
        pointArr.push(originalPoint);
        translateCallback = function (data){
          console.log("see data status---",data);
          if(data.status === 0) {
             currentUser = data.points[0];
             console.log("callback------",currentUser);
          }
        };
        convertor.translate(pointArr, 1, 5, translateCallback);

        
        currentTime = new Date();
        timedata.push(currentTime.getHours()+':'+currentTime.getMinutes()+':'+currentTime.getSeconds());
        temps.push(randomScalingFactor());
        humis.push(randomScalingFactor()+10);
        map.closeInfoWindow(infoWindow,currentUser);
        linePoints.push(currentUser);
        geoc.getLocation(currentUser, function(rs){
            var addComp = rs.addressComponents;
            $("#currentAddress").val(addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber);
		});    
        addLine(linePoints);
        marker.setPosition(currentUser);       
        infoWindow = new BMap.InfoWindow('T:'+temp+'C°<br/>H:'+humi+'% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);
        map.panTo(currentUser); 
    }
    function showcharts(){
        var lineChartData = {
            labels: timedata,
            datasets: [{
                label: "Temperature",
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                fill: false,
                data: temps,
                yAxisID: "y-axis-1",
            }, {
                label: "Humidity",
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                fill: false,
                data: humis,
                yAxisID: "y-axis-2"
            }]
        };
        new Chart.Line(ctx, {
            data: lineChartData,
            options: {
                animation: {
                    duration: 0, // general animation time
                },
                hover: {
                    animationDuration: 0, // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, 
                responsive: true,
                hoverMode: 'index',
                stacked: false,
                title:{
                    display: true,
                    text:' Temperature and Humidity Trace Chart'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return  value+'°C';
                            }
                        },
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                    }, {
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "right",
                        id: "y-axis-2",
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return  value+'%';
                            }
                        },
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
    setInterval(showcharts,5000);
    marker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,currentUser); //开启信息窗口
	});

    angular.module("lotApp",[]).controller("sideController",function($scope){
    $scope.currentPos = "123";
    $scope.currentTem = "456";
    $scope.currentHum = "789";
    })

    
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
			ch = symbols.charAt(symbolIndex);
		}
		text += ch;
	}
    return text;
}

  
