'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.dashboard',
    'myApp.net',
    'myApp.version',
    'smart-table',
    'myApp.articleService'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
      .when("/articles/:type/:condition",{
        templateUrl: '/view1/view1.html',
        controller: 'View1Ctrl'
      })
      .when("/page/:id", {
        templateUrl: '/view2/view2.html',
        controller: 'View2Ctrl'
      })
      .when("/net", {
          templateUrl: '/net/net.html',
          controller: 'netCtrl'
      })
      .when("/dashboard", {
          templateUrl: '/dashboard/dashboard.html',
          controller: 'DashboardCtrl'
      })
      .when("/graph", {
          templateUrl: '/graph/graph.html',
          controller: 'graphCtrl'
      });
}]);
