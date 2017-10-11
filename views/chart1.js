function showcharts(jqNode, labels, datas) {
        var lineChartData = {
        labels: labels,
        datasets: [{
            label: "Temperature",
            borderColor: window.chartColors.red,
            backgroundColor: window.chartColors.red,
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
                text: 'Temperature Trace Chart',
                position: 'top'
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

module.exports = showcharts
