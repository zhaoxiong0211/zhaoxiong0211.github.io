var margin = {
        top: 20,
        right: 120,
        bottom: 0,
        left: 80
    },
    width = document.getElementById("tree").clientWidth - margin.right - margin.left,
    height = document.getElementById("tree").clientHeight - margin.top - margin.bottom;

var basisMax = 104057242.14,
    basisMin = 90000;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var size = d3.scale.sqrt().domain([basisMin, basisMax]).range([2, 20])

var diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });

var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#tree").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

change("type");

function change(method) {
    svg.select("g").remove();

    console.log(method);
    root = method == "type" ? property_by_type : property_by_state;
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._basis = d.basis;
            d._info = d.info;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    root.children.forEach(collapse);
    update(root);

    d3.select(self.frameElement).style("height", document.getElementById("tree").clientHeight);

    function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = d.depth * 180;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", click);

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("stroke-width", function(d) {
                return d._children ? 2 : 0;
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -20 : 10;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 1e-6)
            .on("mouseover", function(d) {
                if (!(d.children || d._children)) {
                    console.log(d);
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);
                    div.html("Name: " + d.info["Property Name"] +
                            "</br>Address: " + d.info["Address"] + ", " + d.info["City"] + ", " + d.info["Postal State"] +
                            "</br>Zipcode: " + d.info["Zipcode"] +
                            "</br>Property Type: " + d.info["Property Type"] +
                            "</br>Class: " + d.info["Class"] +
                            "</br>Total Units: " + d.info["Total Units"] +
                            "</br>Total Rentable Square Feet:" + d.info["Total Rentable Square Feet"] +
                            "</br>Year Built: " + d.info["Year Built"] +
                            "</br>Year Renovated: " + d.info["Year Renovated"] +
                            "</br>Basis: " + d.info["Basis"])
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                }

            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", function(d) {
                return size(d.basis)
            })
            .style("stroke-width", function(d) {
                return d._children ? 2 : 0;
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("stroke-width", function(d) {
                return 2 * size(d.target.basis)
            })
            .attr("stroke-linecap", "round")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}