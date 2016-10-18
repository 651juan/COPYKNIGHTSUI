angular.module('myApp.dashboard', ['ngRoute'])


.controller('DashboardCtrl', ['articleService', '$http',function(articleService,$http) {

    function init() {
        $http.get('http://localhost:8080/year').then(function (result) {
            var data = {
                labels: [],
                series: [[]]
            };
            var keys = Object.keys(result['data']);

            for (var i = 0; i < keys.length; i++) {
                data.labels.push(keys[i]);
                data.series[0].push({
                    meta: 'Studies found for ' + keys[i],
                    value: result['data'][keys[i]]
                });

            }

            console.log(data);
            new Chartist.Bar('.ct-chart', data, options, responsiveOptions);
        });
    }

    var options = {
        seriesBarDistance: 10,
        width: 700,
        height: 500,
        plugins: [
            Chartist.plugins.tooltip()
        ]


    };

    var responsiveOptions = [
        ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value[0];
                }
            }
        }]
    ];

    init();

}]);