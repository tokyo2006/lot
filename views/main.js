var showcharts = require('./chart1');
var showcharts2 = require('./chart2');
var createChartData = require('./chartData');

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var displayTemp;
var displayHumi;
//var startPlace = new BMap.Point(120.617021,31.336082);    //起点
var startPlace = new BMap.Point(120.734389,31.267565); 
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
var lstartTime = Date.now();//1506591300000; //1506657600000;//Date.now(); //1506591300000;//
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
var marker = new BMap.Marker(endPlace, {
    icon: myIcon
});
var geoc = new BMap.Geocoder();
var infoWindow = new BMap.InfoWindow('T:16C°<br/>H:80% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);

var datas1 = [];
var labels1 = []
function updateChart1 (item, label) {
    var ctx = $("#myChart");
    datas1 = createChartData(20, datas1, item, null);
    labels1 = createChartData(20, labels1, label, '');
    showcharts(ctx, labels1, datas1)
}

var datas2 = [];
var labels2 = [];
function updateChart2 (item, label) {
    var ctx = $("#myChart2");
    datas2 = createChartData(20, datas2, item, null);
    labels2 = createChartData(20, labels2, label, '');
    showcharts2(ctx, labels2, datas2)
}

const timeQueue = [];
const tempQueue = [];
const humiQueue = [];
function addTask (time, temp, humi) {
    timeQueue.push(time);
    tempQueue.push(temp);
    humiQueue.push(humi);
}

function taskConsumer () {
    if (timeQueue.length > 0) {
        var time = timeQueue.shift();
        var temp = tempQueue.shift();
        var humi = humiQueue.shift();

        updateChart1(temp, '');
        updateChart2(humi, '');
    }
    setTimeout(taskConsumer, 1000);
}
taskConsumer();

$(document).ready(function () {


    var map = new BMap.Map("allmap"); // 创建Map实例
    map.centerAndZoom('苏州', 20); // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    map.setCurrentCity("苏州"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    map.addOverlay(marker);

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
            // alert("new point lat:"+pts[0].lat+",lng: "+pts[0].lng)
            var lng = 120.734273, lat = 31.267561;
            var ptsMock = [new BMap.Point(lng, lat)]; 
            for(i=0;i<900;i++){
                lng-=0.000033/900;
                lat+=0.002710/900;
                ptsMock.push(new BMap.Point(lng, lat));
            }
            
            for(i=0;i<59;i++){
                lng+=0.000003;
                lat+=0.000001;
                ptsMock.push(new BMap.Point(lng, lat));
            }

            for(i=0;i<1503;i++){
                lng+=0.00000314;
                lat+=0.000001;
                ptsMock.push(new BMap.Point(lng, lat));
            }

            for (i=0;i<173;i++){
                lng += 0.000291/173;
                lat -= 0.000001;
                ptsMock.push(new BMap.Point(lng, lat));
            }

            var paths = ptsMock.length;    //获得有几个点
            // alert(paths);
			var carMk = new BMap.Marker(ptsMock[0],{icon:myIcon});
			map.addOverlay(carMk);
			i=0;
			function resetMkPoint(i){
                carMk.setPosition(ptsMock[i]);
                //alert(ptsMock[i].lat, ptsMock[i].lng);
                if (i === paths-1) {alert('stop');return;}
                i = Math.min(i+5, paths-1);
					setTimeout(function(){
                       // alert("new point lat:"+ptsMock[i].lat+",lng: "+ptsMock[i].lng)
                        resetMkPoint(i);
                        
					},500);
				}

			setTimeout(function(){
				resetMkPoint(0);
			},500);

		});
    }
    function show() {

        console.log("start time =======:", lstartTime);
        //var originUrl = "https://www.loraflow.io/v1/application/data?appeui=8f1d7956939f95a0&token=1v84wa7375651a298f9ff8eb008fa&order=desc&startTime="+startTime+"&endTime="+endTime+'&limit=24';
        var originUrl = "https://www.loraflow.io/v1/application/data?appeui=8f1d7956939f95a0&token=1v84wa7375651a298f9ff8eb008fa&order=asc&start=" + lstartTime + "&limit=20";
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
                    displayTemp = res.t;
                    displayHumi = res.h;
                    $("#currentTemp").text(displayTemp + "°C");
                    $("#currentHumi").text(displayHumi + "%");
                    if (timedata.length >= 20) timedata.shift();
                    if (temps.length >= 20) temps.shift();
                    if (humis.length >= 20) humis.shift();
                    var timeLabel = newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
                    timedata.push(timeLabel);
                    temps.push(temp);
                    humis.push(humi);

                    addTask(timeLabel, temp, humi);

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
                         map.addOverlay(marker);
                         //linePoints.push(currentUser);
                         //addLine(linePoints);
                         infoWindow = new BMap.InfoWindow('T:' + temp + 'C°<br/>H:' + humi + '% <br/><input id="door" type="button" onclick="opendoor();" value="Open Door" />', opts);
                         //map.panTo(currentUser);
                    }
                };
            }
        });
    }














    setInterval(show, 2000);
    // setInterval(function () {
    //     showcharts(ctx, timedata, temps)
    // }, 2000);
    // setTimeout(function(){
	// 	runningman();
	// },1000);
    // setInterval(showcharts2, 2000);

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

