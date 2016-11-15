'use strict';

angular.module('myApp.table', ['ngRoute'])
    .controller('TableCtrl', ['$routeParams','$http', '$q','$scope', '$location', '$rootScope', function($routeParams, $http, $q, $scope, $location, $rootScope) {
    $scope.displayedCollection = [];
        var industries = {
            INDUSTRY_1 : "Advertising" ,
            INDUSTRY_2 : "Architectural",
            INDUSTRY_3 : "Computer consultancy",
            INDUSTRY_4 : "Computer programming",
            INDUSTRY_5 : "Creative, arts and entertainment",
            INDUSTRY_6 : "Cultural education",
            INDUSTRY_7 : "Film and motion pictures",
            INDUSTRY_8 : "PR and communication",
            INDUSTRY_9 : "Photographic activities",
            INDUSTRY_10: "Programming and broadcasting",
            INDUSTRY_11: "Publishing of books, periodicals and other publishing",
            INDUSTRY_12: "Software publishing (including video games)",
            INDUSTRY_13: "Sound recording and music publishing",
            INDUSTRY_14: "Specialised design",
            INDUSTRY_15: "Television programmes",
            INDUSTRY_16: "Translation and interpretation",
            UNKNOWN_INDUSTRY: "UNKNOWN"
        };

        function getIndustryString(string) {
            return industries[string];
        }


        var url = getUrl($routeParams.type, $routeParams.condition);
    $scope.title = getTitle($routeParams.type, $routeParams.condition);

    getData();

    function getData() {
        $http.get(url).then(function (result) {
            $scope.rowCollection  = result['data']['articles'];
            for (var x in $scope.rowCollection) {
                var authorString = "";
                for (var a in $scope.rowCollection[x].authors) {
                    authorString = authorString.concat($scope.rowCollection[x].authors[a]);
                    authorString = authorString.concat("\n");
                }
                $scope.rowCollection[x].authorString = authorString;
                $scope.rowCollection[x].rank = (x*1)+1;
                if ($routeParams.type == "wordcloud") {
                    $scope.rankOn = 1;
                } else {
                    $scope.rankOn = 0;
                }
            }
            $scope.displayedCollection = result['data']['articles'];
        });
    }

    function getUrl(type, condition) {
        if (type == undefined) {
            console.log ("INVALID URL");
        } else {
            if (type == 'all') {
                return 'http://localhost:8080/article'
            } else {
                return 'http://localhost:8080/' + type + '/' + condition + '/';
            }
        }
    }

    function getTitle(type, condition) {
        if (type == undefined) {
            console.log ("INVALID URl");
        } else {
            if (type == 'all') {
                return 'All Articles'
            }
            else if (type == 'industry') {
                return 'Filtered Article with ' + type + ' = ' + getIndustryString(condition);
            }
            else if (type == 'wordcloud'){
                return 'Filtered Article with ' + 'keyword' + ' = ' + condition;
            }
            else {
                return 'Filtered Article with ' + type + ' = ' + condition;
                }
        }
    }

    $scope.view = function view(row) {
        window.location = "http://localhost:8000/#!/page/" + row.pageid;
    }

}]);