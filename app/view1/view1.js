'use strict';

angular.module('myApp.view1', ['ngRoute','datatables'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', '$q', 'DTOptionsBuilder', 'DTColumnBuilder', function($http, $q, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(getData());

    function getData() {
        var defer = $q.defer();
        $http.get('http://localhost:8080/article?category=Category:Studies&limit=10&getContent=true&cmContinue').then(function (result) {
            defer.resolve(result['data']['articles']);
        });
        return defer.promise;
    }

    vm.dtColumns = [
        DTColumnBuilder.newColumn('pageid').withTitle('ID'),
        DTColumnBuilder.newColumn('name').withTitle('Name'),
        DTColumnBuilder.newColumn('year').withTitle('Year')
    ];

}]);