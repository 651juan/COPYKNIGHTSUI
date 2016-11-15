'use strict';

angular.module('myApp.article', ['ngRoute'])


.controller('ArticleCtrl', ['$routeParams','$filter', '$http', '$scope',function($routeParams, $filter, $http, $scope) {
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

        function init() {
            $http.get('http://localhost:8080/article').then(function (result) {
                var ans = result['data']['articles'].filter(function (el) {
                    return el.pageid == $routeParams.id;
                });
                $scope.citation = ans[0].citation;
                $scope.title = ans[0].title;
                $scope.authors = ans[0].authors;
                $scope.abstract = ans[0].abstract;
                if (ans[0].datasets != undefined) {
                    var IndustryStrings = [];
                    for (var x in ans[0].datasets.industry) {
                        IndustryStrings[x] = getIndustryString(ans[0].datasets.industry[x]);
                    }
                    $scope.industryString = IndustryStrings;
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
        function getIndustryString(string) {
            return industries[string];
        }


    init();
}]);