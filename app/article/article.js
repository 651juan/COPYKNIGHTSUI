'use strict';

angular.module('myApp.article', ['ngRoute'])


.controller('ArticleCtrl', ['$routeParams','$filter', '$http', '$scope',function($routeParams, $filter, $http, $scope) {
  console.log('cont2');
        function init() {
            $http.get('http://localhost:8080/article').then(function (result) {
                var ans = result['data']['articles'].filter(function (el) {
                    return el.pageid == $routeParams.id;
                });
                $scope.citation = ans[0].citation;
                $scope.title = ans[0].title;
                $scope.authors = ans[0].authors;
                if (ans[0].datasets != undefined) {
                    $scope.industry = ans[0].datasets.industry;
                }
                $scope.words = [];
                for (var value in ans[0].wordCloud) {
                    var temp = {};
                    temp.text = value;
                    temp.weight = ans[0].wordCloud[value];
                    temp.link = 'http://localhost:8000/#!/articles/wordcloud/'.concat(value);
                    $scope.words.push(temp);
                }
                $('#demo').jQCloud($scope.words, {
                    width: 500,
                    height: 350
                });

            });

            $http.get('http://localhost:8080/similar/' + $routeParams.id).then(function (result) {
                $scope.similar = result['data']['articles'];
            });

        }
        init();
}]);