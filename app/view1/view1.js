'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http','$scope', function($http, $scope) {
  $http.get("http://localhost:8080/article?category=Category:Studies&limit=10&getContent=true&cmContinue")
      .then(function(response){
          console.log(response['data']['articles']);
        $scope.articles = response['data']['articles'];
      });
}]);