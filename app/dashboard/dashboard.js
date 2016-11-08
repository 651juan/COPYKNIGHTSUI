angular.module('myApp.dashboard', ['ngRoute'])


    .controller('DashboardCtrl', ['articleService', '$http','$scope',function(articleService,$http, $scope) {

        function init() {
            $.getJSON("articles.json", function(json) {
                console.log(json); // this will show the info it in firebug console
                $scope.citation = json.articles[0].citation;
                $scope.title = json.articles[0].title;
                $scope.authors = json.articles[0].authors;
                $scope.$apply();
            });

        }
        init();

    }])


