'use strict';

angular.module('myApp.view2', ['ngRoute'])


.controller('View2Ctrl', ['$routeParams', 'articleService','$filter', '$http',function($routeParams, articleService, $filter, $http) {
  console.log('cont2');
    $http.get('http://localhost:8080/article').then(function (result) {
       var ans = result['data']['articles'].filter(function (el) {
            return el.pageid == $routeParams.id;
        });
        console.log(ans);
    });
}]);