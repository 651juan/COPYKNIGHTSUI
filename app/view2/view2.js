'use strict';

angular.module('myApp.view2', ['ngRoute'])


.controller('View2Ctrl', ['$routeParams', 'articleService','$filter',function($routeParams, articleService, $filter) {
  console.log('cont2');
  var newTemp = $filter("filter")(articleService.getArticle(), {pageid: $routeParams.id});
  console.log(articleService.getArticle());
}]);