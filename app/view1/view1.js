'use strict';

angular.module('myApp.view1', ['ngRoute'])

.controller('View1Ctrl', ['$http', '$q','articleService','$scope', '$location', function($http, $q, articleService, $scope, $location) {
    $scope.displayedCollection = [];

    function getData() {
        $http.get('http://localhost:8080/article?category=Category:Studies&limit=100&getContent=true&cmContinue').then(function (result) {
            $scope.rowCollection  = result['data']['articles'];
            $scope.displayedCollection = result['data']['articles'];
            articleService.setArticleList(result['data']['articles']);
            console.log(articleService.getArticle());
        });
    }

    getData();

    $scope.view = function view(row) {
        $location.path = '/page/' + row.pageid;
    }


}]);