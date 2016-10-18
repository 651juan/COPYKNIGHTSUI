'use strict';

angular.module('myApp.view1', ['ngRoute','datatables'])

.controller('View1Ctrl', ['$http', '$q', 'DTOptionsBuilder', 'DTColumnBuilder','articleService','$scope', function($http, $q, DTOptionsBuilder, DTColumnBuilder, articleService, $scope) {
    var vm = this;

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(getData());

    function getData() {
        var defer = $q.defer();
        $http.get('http://localhost:8080/article?category=Category:Studies&limit=100&getContent=true&cmContinue').then(function (result) {
            defer.resolve(result['data']['articles']);
            articleService.setArticleList(result['data']['articles']);
            console.log(articleService.getArticle());
        });
        return defer.promise;
    }

    vm.dtColumns = [
        DTColumnBuilder.newColumn('pageid').withTitle('ID'),
        DTColumnBuilder.newColumn('name').withTitle('Name'),
        DTColumnBuilder.newColumn('year').withTitle('Year')
    ];


}]);