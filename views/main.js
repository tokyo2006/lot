window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var startPlace = new BMap.Point(120.617021,31.336082);    //起点
var endPlace = new BMap.Point(120.739438,31.271713);    //终点
var temp = 10;
var humi = 50;
var linePoints = [];
var temps = [];
var humis = [];
var timedata = ['17:35:1','17:35:8','17:35:15','17:35:23','17:35:28','17:35:33','17:35:38',
'17:35:43','17:35:48','17:35:53','17:35:58','17:36:3','17:36:8','17:36:13','17:36:18',
'17:36:23','17:36:28','17:36:33','17:36:38','17:36:43'];
var startTime = Date.now();
var endTime = Date.now();
var convertor = new BMap.Convertor();
var lstartTime = 1506591300000; //1506657600000;//Date.now(); //1506591300000;//
var oldTime;
var currentUser = getCurrentUser();
linePoints.push(currentUser);
var pointsLen = linePoints.length,
    i, polyline;
var opts = {
    width: 200, // 信息窗口宽度
    height: 100, // 信息窗口高度
    title: "pork", // 信息窗口标题
};
var myIcon = new BMap.Icon("truck_mini.png", new BMap.Size(32, 70), {
    anchor: new BMap.Size(30, 10),
    imageOffset: new BMap.Size(0, 0) // 设置图片偏移    
});
var marker = new BMap.Marker(currentUser, {
    icon: myIcon
});
var geoc = new BMap.Geocoder();
var infoWindow = new BMap.InfoWindow('T:16C°<br/>H:80% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);
$(document).ready(function () {


    var map = new BMap.Map("allmap"); // 创建Map实例
    map.centerAndZoom('苏州', 20); // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    map.setCurrentCity("苏州"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    map.addOverlay(marker);
    map.panTo(currentUser);
    var drivePath = new BMap.DrivingRoute(map,{renderOptions:{map:map,autoViewport:true}}); //驾车实例
    drivePath.search(startPlace,endPlace);

    var myLayout = $("body").layout({
        applyDefaultStyles: true,
        north__closable: false, //可以被关闭  
        north__resizable: true, //可以改变大小  
        north__size: 120, //pane的大小 
        spacing_open: -1
    });
    var ctx = $("#myChart");

    var ctx2 = $("#myChart2");

    function addLine(points) {
        if (pointsLen == 0) {
            return;
        }

        polyline = new BMap.Polyline(points, {
            strokeColor: "red",
            strokeWeight: 2,
            strokeOpacity: 0.5
        }); //创建折线  
        map.addOverlay(polyline); //增加折线  
    }
    function runningman(){
        var car = new BMap.DrivingRoute(map); 
        car.search(startPlace,endPlace);
        car.setSearchCompleteCallback(function(){
			var pts = car.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
			var paths = pts.length;    //获得有几个点

			var carMk = new BMap.Marker(pts[0],{icon:myIcon});
			map.addOverlay(carMk);
			i=0;
			function resetMkPoint(i){
				carMk.setPosition(pts[i]);
				if(i < paths){
					setTimeout(function(){
						i++;
						resetMkPoint(i);
					},100);
				}
			}
			setTimeout(function(){
				resetMkPoint(5);
			},100);

		});
    }
    function show() {

        console.log("start time =======:", lstartTime);
        //var originUrl = "https://www.loraflow.io/v1/application/data?appeui=8f1d7956939f95a0&token=1v84wa7375651a298f9ff8eb008fa&order=desc&startTime="+startTime+"&endTime="+endTime+'&limit=24';
        var originUrl = "https://www.loraflow.io/v1/application/data?appeui=8f1d7956939f95a0&token=1v84wa7375651a298f9ff8eb008fa&order=asc&start=" + lstartTime + "&limit=10";
        lstartTime = oldTime == null ? lstartTime : oldTime + 1000;
        var origLng;
        var lng;
        var lat;
        var originLat;
     
        $.ajaxSetup({
            async: false
        });

        $.get(originUrl, null, function (data) {
            var addr;
            var i;
            console.log('111111111', data.list);
            if (data.list != null) {
                for (i = 0; i < data.list.length; i++) {
                    var timestamp = data.list[i]['$time'];
                    if (oldTime != null && oldTime == timestamp) {
                        break;
                    }
                    oldTime = timestamp;
                    var newDate = new Date();
                    newDate.setTime(timestamp);
                    var res = getHexToString(data.list[i].data);
                    res = JSON.parse(res);
                    console.log('updated', res.t, res.h);
                    addr = res.address;
                    temp = res.t;
                    humi = res.h;
                    $("#currentTemp").val(res.t + "°C");
                    $("#currentHumi").val(res.h + "%");
                    if (timedata.length >= 20) timedata.shift();
                    if (temps.length >= 20) temps.shift();
                    if (humis.length >= 20) humis.shift();
                    timedata.push(newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds());
                    temps.push(temp);
                    humis.push(humi);
                    if (addr.lnt == 0 || addr.lat == 0) {
                        continue;
                    } else {
                        originLat = res.address.lat;
                        lat = parseInt((originLat * 10000) / 1000000) + parseFloat(((originLat * 10000) % 1000000) / 600000);
                        origLng = res.address.lng;
                        lng = parseInt((origLng * 10000) / 1000000) + parseFloat(((origLng * 10000) % 1000000) / 600000);
                        var originalPoint = new BMap.Point(lng, lat);
                        console.log("4444444", originalPoint);
                        var pointArr = [];
                        pointArr.push(originalPoint);
                        convertor.translate(pointArr, 1, 5, translateCallback);
                    }
                }
                translateCallback = function (data) {
                    if (data.status === 0) {
                        currentUser = data.points[0];
                        map.closeInfoWindow(infoWindow, currentUser);
                        linePoints.push(currentUser);
                        geoc.getLocation(currentUser, function (rs) {
                            var addComp = rs.addressComponents;
                            $("#currentAddress").val(addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber);
                        });
                        marker.setPosition(currentUser);
                        linePoints.push(currentUser);
                        addLine(linePoints);
                        infoWindow = new BMap.InfoWindow('T:' + temp + 'C°<br/>H:' + humi + '% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);
                        map.panTo(currentUser);
                    }
                };
            }
        });
    }







    function showcharts() {
        var lineChartData = {
            labels: timedata,
            datasets: [{
                label: "Temperature",
                borderColor: window.chartColors.red,
                backgroundColor: window.chartColors.red,
                fill: false,
                data: temps,
                yAxisID: "y-axis-1",
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
                title: {
                    display: true,
                    text: ' Temperature Trace Chart'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: -10,
                            suggestedMax: 40,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return value + '°C';
                            }
                        },
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                    }
                    ],
                }
            }
        });
    }

    function showcharts2() {
        var lineChartData = {
            labels: timedata,
            datasets: [{
                label: "Humidity",
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                fill: false,
                data: humis,
                yAxisID: "y-axis-1",
            }]
        };
        new Chart.Line(ctx2, {
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
                title: {
                    display: true,
                    text: ' Humidity Trace Chart'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return value + '%';
                            }
                        },
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                    }],
                }
            }
        });
    }




    setInterval(show, 2000);
    setInterval(showcharts, 2000);
    setTimeout(function(){
		runningman();
	},10000);
    setInterval(showcharts2, 2000);

    marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, currentUser); //开启信息窗口
    });

    angular.module("lotApp", []).controller("sideController", function ($scope) {
        $scope.currentPos = "123";
        $scope.currentTem = "456";
        $scope.currentHum = "789";
    })


});

function opendoor() {
    alert("You opened door");
}

function getCurrentUser() {
    // return new BMap.Point(120.61990712,31.31798737);
    return new BMap.Point(120.73952113896, 31.271784510504);
}

function randomScalingFactor() {
    return Math.round(rand(-100, 100));
}

function rand() {
    var seed = Date.now();
    var min = 0;
    var max = 100;
    seed = (seed * 9301 + 49297) % 233280;
    return min + (seed / 233280) * (max - min);
}

function getHexToString(hexStr) {
    var symbols = " !\"#$%&'()*+,-./0123456789:;<=>?@";
    var loAZ = "abcdefghijklmnopqrstuvwxyz";
    symbols += loAZ.toUpperCase();
    symbols += "[\\]^_`";
    symbols += loAZ;
    symbols += "{|}~";
    var hex = "0123456789abcdef";
    var text = "";
    var i = 0;
    for (i = 0; i < hexStr.length; i = i + 2) {
        var char1 = hexStr.charAt(i);
        if (char1 == ':') {
            i++;
            char1 = hexStr.charAt(i);
        }
        var char2 = hexStr.charAt(i + 1);
        var num1 = hex.indexOf(char1);
        var num2 = hex.indexOf(char2);
        var value = num1 << 4;
        value = value | num2;

        var valueInt = parseInt(value);
        var symbolIndex = valueInt - 32;
        var ch = '?';
        if (symbolIndex >= 0 && value <= 126) {
            ch = symbols.charAt(symbolIndex);
        }
        text += ch;
    }
    return text;
}