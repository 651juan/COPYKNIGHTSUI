'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.table',
  'myApp.article',
  'myApp.dashboard',
    'myApp.net',
    'myApp.home',
    'myApp.graph',
    'smart-table'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
      .when("/articles/:type/:condition",{
        templateUrl: '/table/table.html',
        controller: 'TableCtrl'
      })
      .when("/page/:id", {
        templateUrl: '/article/article.html',
        controller: 'ArticleCtrl'
      })
      .when("/net", {
          templateUrl: '/net/net.html',
          controller: 'netCtrl'
      })
      .when("/home", {
          templateUrl: '/home/home.html',
          controller: 'HomeCtrl'
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
