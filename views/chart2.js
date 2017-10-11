module.exports = showcharts2

function showcharts2(jqNode, labels, datas) {
    var lineChartData = {
        labels: labels,
        datasets: [{
            label: "Humidity",
            borderColor: window.chartColors.blue,
            backgroundColor: window.chartColors.blue,
            fill: false,
            data: datas,
            yAxisID: "y-axis-1",
        }]
    };
    new Chart.Line(jqNode, {
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
                display: false,
                text: 'Humidity Trace Chart'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 50,
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