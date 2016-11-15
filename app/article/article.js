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
                $scope.name = ans[0].name;
                if (ans[0].datasets != undefined) {
                    $scope.countries = ans[0].datasets.countries;
                    $scope.industry = [];
                    for (var x in ans[0].datasets.industry) {
                        var tempIndustry = {};
                        tempIndustry.enum = ans[0].datasets.industry[x];
                        tempIndustry.string = getIndustryString(ans[0].datasets.industry[x]);
                        $scope.industry.push(tempIndustry);
                    }
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

                collapsableTree();
            });

            $http.get('http://localhost:8080/similar/' + $routeParams.id).then(function (result) {
                $scope.similar = result['data']['articles'];
            });

        }

        function getIndustryString(string) {
            return industries[string];
        }


        init();

        function collapsableTree() {
            function createData(articles) {

                function getArticleObject(name) {
                    for(var article in articles) {
                        if(articles[article].name == name) {
                            return articles[article];
                        }
                    }
                    return null;
                }

                function createNodeList(currentRoot){
                    var article = getArticleObject(currentRoot.name);
                    if(article != null) {
                        //currentRoot.name = article.title;
                        currentRoot.url = "http://localhost:8000/#!/page/"+article.pageid;
                        var tmpChildren = [];
                        for (var reference in article['references']) {
                            var refName = article['references'][reference];
                            var tmpChild = {};
                            tmpChild.name = refName;
                            createNodeList(tmpChild);
                            tmpChildren[tmpChildren.length] = tmpChild;
                        }
                        currentRoot.children = tmpChildren;
                    }else{
                        currentRoot.size = 500;
                    }
                }



                var result = {};

                result.name = $scope.name;
                createNodeList(result);
                return result;
            }



            var m = [20, 500, 20, 500],
                w = 1920 - m[1] - m[3],
                h = 600 - m[0] - m[2],
                i = 0,
                root;

            /*var m = [20, 120, 20, 120],
                w = 1920 - m[1] - m[3],
                h = 800 - m[0] - m[2],
                i = 0,
                root;*/

            var tree = d3.layout.tree()
                .size([h, w]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });

           var vis = d3.select("#chart").append("svg:svg")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .append("svg:g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

            d3.json("http://localhost:8080/article", function(json) {
                root = createData(json['articles']);
                root.x0 = h / 2;
                root.y0 = 0;

                function toggleAll(d) {
                    if (d.children) {
                        d.children.forEach(toggleAll);
                        toggle(d);
                    }
                }

                // Initialize the display to show a few nodes.
                root.children.forEach(toggleAll);
                toggle(root.children[0]);
                /*toggle(root.children[1].children[2]);
                 toggle(root.children[9]);
                 toggle(root.children[9].children[0]);*/

                update(root);
            });

            function update(source) {
                var duration = d3.event && d3.event.altKey ? 5000 : 500;

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse();

                // Normalize for fixed-depth.
                nodes.forEach(function(d) { d.y = d.depth * 180; });

                // Update the nodes…
                var node = vis.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("svg:g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .on("click", function(d) { toggle(d); update(d); });

                nodeEnter.append("svg:circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

                nodeEnter.append("svg:text")
                    .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                    .text(function(d) { return d.name; })
                    .style("fill-opacity", 1e-6).on("click", function (d) {
                    if (d.url) {
                        window.open(d.url);
                    }
                });

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = vis.selectAll("path.link")
                    .data(tree.links(nodes), function(d) { return d.target.id; });

                // Enter any new links at the parent's previous position.
                link.enter().insert("svg:path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    })
                    .transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            // Toggle children.
            function toggle(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
            }
        }
    }]);