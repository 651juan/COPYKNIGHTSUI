angular.module('myApp.articleService', []).service('articleService', function() {
    var articleList = [];

    var addArticle = function(newObj) {
        articleList.push(newObj);
    };

    var setArticleList = function(newlist) {
        articleList = newlist;
    };

    var getArticle = function(){
        return articleList;
    };

    return {
        addArticle: addArticle,
        setArticleList: setArticleList,
        getArticle: getArticle
    };

});
