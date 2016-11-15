'use strict';

angular.module('myApp.table', ['ngRoute'])
    .controller('TableCtrl', ['$routeParams','$http', '$q','$scope', '$location', '$rootScope', function($routeParams, $http, $q, $scope, $location, $rootScope) {
    $scope.displayedCollection = [];

    var url = getUrl($routeParams.type, $routeParams.condition);
    $scope.title = getTitle($routeParams.type, $routeParams.condition);

    getData();

    function getData() {
        $http.get(url).then(function (result) {
            $scope.rowCollection  = result['data']['articles'];
            for (var x in $scope.rowCollection) {
                var authorString = "";
                for (var a in $scope.rowCollection[x].authors) {
                    authorString = authorString.concat($scope.rowCollection[x].authors[a]);
                    authorString = authorString.concat("\n");
                }
                $scope.rowCollection[x].authorString = authorString;
            }
            $scope.displayedCollection = result['data']['articles'];
        });
    }

    function getUrl(type, condition) {
        if (type == undefined) {
            console.log ("INVALID URL");
        } else {
            if (type == 'all') {
                return 'http://localhost:8080/article'
            } else {
                return 'http://localhost:8080/' + type + '/' + condition + '/';
            }
        }
    }

    function getTitle(type, condition) {
        if (type == undefined) {
            console.log ("INVALID URl");
        } else {
            if (type == 'all') {
                return 'All Articles'
            }
            else if (type == 'wordcloud'){
                return 'Filtered Article with ' + 'keyword' + ' = ' + condition;
            }
            else {
                return 'Filtered Article with ' + type + ' = ' + condition;
                }
        }
    }

    $scope.view = function view(row) {
        window.location = "http://localhost:8000/#!/page/" + row.pageid;
    }

}]);