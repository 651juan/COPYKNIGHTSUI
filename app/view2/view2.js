'use strict';

angular.module('myApp.view2', ['ngRoute'])


.controller('View2Ctrl', ['$routeParams', 'articleService','$filter', '$http', '$scope',function($routeParams, articleService, $filter, $http, $scope) {
  console.log('cont2');
        function init() {
            $http.get('http://localhost:8080/article').then(function (result) {
                var ans = result['data']['articles'].filter(function (el) {
                    return el.pageid == $routeParams.id;
                });
                $scope.citation = ans[0].citation;
                $scope.title = ans[0].title;
                $scope.authors = ans[0].authors;

            });

            $http.get('http://localhost:8080/similar/' + $routeParams.id).then(function (result) {
                $scope.similar = result['data']['articles'];
            });
        }
        init();
}]);