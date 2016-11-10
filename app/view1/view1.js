'use strict';

angular.module('myApp.view1', ['ngRoute'])
    .controller('View1Ctrl', ['$routeParams','$http', '$q','articleService','$scope', '$location', function($routeParams, $http, $q, articleService, $scope, $location) {
    $scope.displayedCollection = [];

    var url = getUrl($routeParams.type, $routeParams.condition);
    var title = getTitle($routeParams.type, $routeParams.condition);
    getData();

    function getData() {
        $http.get(url).then(function (result) {
            $scope.rowCollection  = result['data']['articles'];
            $scope.displayedCollection = result['data']['articles'];
            articleService.setArticleList(result['data']['articles']);
            console.log(articleService.getArticle());
        });
    }

    function getUrl(type, condition) {
        if (type == undefined) {
            console.log ("INVALID URL");
        } else {
            if (type == 'all') {
                return 'http://localhost:8080/article'
            } else {
                return 'http://localhost:8080/' + type + '/' + condition;
            }
        }
    }

    function getTitle(type, condition) {
        if (type == undefined) {
            console.log ("INVALID URl");
        } else {
            if (type == 'all') {
                return 'All Articles'
            } else {
                return 'Filtered Article with ' + type + ' = ' + condition;
            }
        }
    }

    $scope.view = function view(row) {
        $location.path = '/page/' + row.pageid;
    }

}]);