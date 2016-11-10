angular.module('myApp.graph', ['ngRoute']).controller('graphCtrl', ['$http','$scope',function($http, $scope) {

    $scope.graphs = [
        {   name : 'Year',
            url : 'http://localhost:8080/year'
        },
        {
            name : 'Country',
            url : 'http://localhost:8080/country'
        },
        {
            name : 'Author',
            url : 'http://localhost:8080/author'
        },
        {
            name : 'Industry',
            url : 'http://localhost:8080/industry'
        },
        {
            name : 'Fundamental',
            url : 'http://localhost:8080/fundamental'
        },
        {
            name : 'Evidence',
            url : 'http://localhost:8080/evidence'
        }];

    function init() {
        var x;
        for (x in $scope.graphs) {
            window[$scope.graphs[x].name] = getData($scope.graphs[x].name, $scope.graphs[x].url);
        }
    }

    function getData(name, url) {
        $http.get(url).then(function (result) {
            var data = {
                labels: [],
                datasets: [{
                    label: name,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    data: []
                }]
            };
            var keys = Object.keys(result['data']);

            for (var i = 0; i < keys.length; i++) {
                data.labels.push(keys[i]);
                data.datasets[0].data.push(result['data'][keys[i]]);

            }

            console.log(data);
            var ctx = document.getElementById(name);
            return new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {}
            });
        });

    }

    init();

}]);
