angular.module('myApp.net', ['ngRoute']).controller('netCtrl', ['articleService', '$http','$scope',function(articleService,$http, $scope) {
    initialize().then (
        function (control) {
            doTheTreeViz(control);
        }
    );

    function doTheTreeViz(control) {
        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

        var svg = control.svg;

       // svg = svg.call(zoom).append('svg:g');
        //control.svg = svg;

        var force = control.force;
        force.nodes(control.nodes)
            .links(control.links)
            .start();

        // Update the links
        var link = svg.selectAll("line.link")
            .data(control.links, function (d) {
                return d.unique;
            });

        // Enter any new links
        link.enter().insert("svg:line", ".node")
            .attr("class", "link")
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            })
            .append("svg:title")
            .text(function (d) {
                return d.source[control.options.nodeLabel] + ":" + d.target[control.options.nodeLabel];
            });

        // Exit any old links.
        link.exit().remove();


        // Update the nodes
        var node = svg.selectAll("g.node")
            .data(control.nodes, function (d) {
                return d.unique;
            });

        node.select("circle")
            .style("fill", function (d) {
                return getColor(d);
            })
            .attr("r", function (d) {
                return getRadius(d);
            })

        // Enter any new nodes.
        var nodeEnter = node.enter()
            .append("svg:g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("dblclick", function (d) {
                control.nodeClickInProgress = false;
                if (d.url)window.open(d.url);
            })
            .on("click", function (d) {
                // this is a hack so that click doesnt fire on the1st click of a dblclick
                if (!control.nodeClickInProgress) {
                    control.nodeClickInProgress = true;
                    setTimeout(function () {
                        if (control.nodeClickInProgress) {
                            control.nodeClickInProgress = false;
                            if (control.options.nodeFocus) {
                                d.isCurrentlyFocused = !d.isCurrentlyFocused;
                                doTheTreeViz(makeFilteredData(control));
                            }
                        }
                    }, control.clickHack);
                }
            })
            .call(force.drag);

        nodeEnter
            .append("svg:circle")
            .attr("r", function (d) {
                return getRadius(d);
            })
            .style("fill", function (d) {
                return getColor(d);
            })
            .append("svg:title")
            .text(function (d) {
                return d[control.options.nodeLabel];
            });

        if (control.options.nodeLabel) {
            // text is done once for shadow as well as for text
            nodeEnter.append("svg:text")
                .attr("x", control.options.labelOffset)
                .attr("dy", ".31em")
                .attr("class", "shadow")
                .style("font-size", control.options.labelFontSize + "px")
                .text(function (d) {
                    return d.shortName ? d.shortName : d.name;
                });
            nodeEnter.append("svg:text")
                .attr("x", control.options.labelOffset)
                .attr("dy", ".35em")
                .attr("class", "text")
                .style("font-size", control.options.labelFontSize + "px")
                .text(function (d) {
                    return d.shortName ? d.shortName : d.name;
                });
        }

        // Exit any old nodes.
        node.exit().remove();
        control.link = svg.selectAll("line.link");
        control.node = svg.selectAll("g.node");
        force.on("tick", tick);


        if (control.options.linkName) {
            link.append("title")
                .text(function (d) {
                    return d[control.options.linkName];
                });
        }


        function tick() {
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        }

        function getRadius(d) {
            var r = control.options.radius * (control.options.nodeResize ? Math.sqrt(d[control.options.nodeResize]) / Math.PI : 1);
            return control.options.nodeFocus && d.isCurrentlyFocused ? control.options.nodeFocusRadius : r;
        }

        function getColor(d) {
            return control.options.nodeFocus && d.isCurrentlyFocused ? control.options.nodeFocusColor : control.color(d.group);
        }

        function zoomed() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

    }

    function makeFilteredData(control, selectedNode) {
        // we'll keep only the data where filterned nodes are the source or target
        var newNodes = [];
        var newLinks = [];

        for (var i = 0; i < control.data.links.length; i++) {
            var link = control.data.links[i];
            if (link.target.isCurrentlyFocused || link.source.isCurrentlyFocused) {
                newLinks.push(link);
                addNodeIfNotThere(link.source, newNodes);
                addNodeIfNotThere(link.target, newNodes);
            }
        }
        // if none are selected reinstate the whole dataset
        if (newNodes.length > 0) {
            control.links = newLinks;
            control.nodes = newNodes;
        }
        else {
            control.nodes = control.data.nodes;
            control.links = control.data.links;
        }
        return control;

        function addNodeIfNotThere(node, nodes) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].unique == node.unique) return i;
            }
            return nodes.push(node) - 1;
        }
    }

    function organizeData(control) {

        for (var i = 0; i < control.nodes.length; i++) {
            var node = control.nodes[i];
            node.unique = i;
            node.isCurrentlyFocused = false;
        }

        for (var i = 0; i < control.links.length; i++) {
            var link = control.links[i];
            link.unique = i;
            link.source = control.nodes[link.source];
            link.target = control.nodes[link.target];
        }
        return control;
    }


    function initialize() {

        var initPromise = $.Deferred();

        getTheData().then(function (data) {
            var control = {};
            control.data = data;
            control.divName = "#chart";

            control.options = $.extend({
                stackHeight: 12,
                radius: 5,
                fontSize: 14,
                labelFontSize: 8,
                nodeLabel: null,
                markerWidth: 0,
                markerHeight: 0,
                width: $(control.divName).outerWidth(),
                gap: 1.5,
                nodeResize: "",
                linkDistance: 80,
                charge: -120,
                styleColumn: null,
                styles: null,
                linkName: null,
                nodeFocus: true,
                nodeFocusRadius: 25,
                nodeFocusColor: "black",
                labelOffset: "5",
                gravity: .05,
                height: $(control.divName).outerHeight()
            }, control.data.d3.options);


            var options = control.options;
            options.gap = options.gap * options.radius;
            control.width = options.width;
            control.height = options.height;
            control.data = control.data.d3.data;
            control.nodes = control.data.nodes;
            control.links = control.data.links;
            control.color = d3.scale.category20();
            control.clickHack = 200;
            organizeData(control);

            control.svg = d3.select(control.divName)
                .append("svg:svg")
                .attr("width", control.width)
                .attr("height", control.height);


            // get list of unique values in stylecolumn
            control.linkStyles = [];
            if (control.options.styleColumn) {
                var x;
                for (var i = 0; i < control.links.length; i++) {
                    if (control.linkStyles.indexOf(x = control.links[i][control.options.styleColumn].toLowerCase()) == -1)
                        control.linkStyles.push(x);
                }
            }
            else
                control.linkStyles[0] = "defaultMarker";

            control.force = d3.layout.force().size([control.width, control.height])
                .linkDistance(control.options.linkDistance)
                .charge(control.options.charge)
                .gravity(control.options.gravity);


            initPromise.resolve(control);
        });
        return initPromise.promise();
    }


    function getTheData() {
        var dataPromise = $.Deferred();
        // return a promise if data is being received asynch and resolve it when done.
        d3.json("http://localhost:8080/article", function(error, result) {
            if (error) throw error;
            var articles = result['articles'];

            var d3Object = {};
            d3Object.d3 = {};
            d3Object.d3.options = {
                radius:2.5,
                fontSize:9,
                labelFontSize:9,
                gravity:0.1,
                height:960,
                width:1600,
                nodeFocusColor:"black",
                nodeFocusRadius:25,
                nodeFocus:true,
                linkDistance:150,
                charge:-220,
                nodeResize:"count",
                nodeLabel:"label",
                linkName:"tag"
            };

            d3Object.d3.data = {};
            var tmpLinks = [];
            var tmpNodes = [];

            var allArticlesReferences = {};
            console.time('GeneratingData');

            for (var article in articles) {
                allArticlesReferences[articles[article]['name'].trim()] = 1;
                for (var reference in articles[article]['references']) {
                    var tmp = articles[article]['references'][reference].trim();
                    if(allArticlesReferences.hasOwnProperty(tmp)){
                        allArticlesReferences[tmp] += 1;
                    }else{
                        allArticlesReferences[tmp] = 1;
                    }
                }
            }

            for (var title in allArticlesReferences) {
                if (allArticlesReferences.hasOwnProperty(title)) {
                    var tmpNode = {};
                    var article = getArticleObject(title);
                    if(article == null) {
                        tmpNode.name = title;
                        tmpNode.count = allArticlesReferences[title]*200;
                        tmpNode.group = "Not_Defined";
                        tmpNode.linkCount = tmpNode.count;
                        tmpNode.label = title;
                        tmpNode.userCount = true;
                        tmpNode.url = null; //change to a static page that shows article not yet defined or take user to create article page
                    }else{
                        tmpNode.name = article.title;
                        tmpNode.count = allArticlesReferences[title];
                        tmpNode.group = "Defined";
                        tmpNode.linkCount = tmpNode.count*200;
                        tmpNode.label = title;
                        tmpNode.userCount = true;
                        tmpNode.url = "http://localhost:8000/#!/page/"+article.pageid;
                    }
                    tmpNodes[tmpNodes.length] = tmpNode;
                }
            }

            for (var article in articles) {
                var tmpTitle = articles[article]['name'].trim();
                for (var reference in articles[article]['references']) {
                    var tmpRefTitle = articles[article]['references'][reference].trim()
                    var tmpLink = {};
                    tmpLink.source = getNodeIdx(tmpTitle);
                    if(tmpLink.source == -1) {
                        console.error("Source Node Not Found", tmpTitle);
                    }
                    tmpLink.target = getNodeIdx(tmpRefTitle)
                    if(tmpLink.target == -1) {
                        console.error("Target Node Not Found", tmpRefTitle);
                    }

                    tmpLink.depth = 9; //Dont know what this is
                    tmpLink.count = 1*100; //Dont know what this is
                    tmpLink.linkName = tmpTitle+":"+tmpRefTitle;

                    tmpLinks[tmpLinks.length] = tmpLink;
                }
            }

            d3Object.d3.data.links = tmpLinks;
            d3Object.d3.data.nodes = tmpNodes;
            dataPromise.resolve(d3Object);

            console.timeEnd('GeneratingData');

            function getArticleObject(name) {
                for(var article in articles) {
                    if(articles[article].name == name) {
                        return articles[article];
                    }
                }
                return null;
            }

            function getNodeIdx(nodeName) {
                for(var node in tmpNodes) {
                    if(tmpNodes[node].label == nodeName){
                        return node;
                    }
                }
                return -1;
            }
        });
        return dataPromise.promise();
    }

}]);