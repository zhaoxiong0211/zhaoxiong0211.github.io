d3.csv("census.csv", function(err, data) {

    var config = {
        "color1": "#e0f3db",
        "color2": "#43a2ca",
        "stateDataColumn": "State",
        "valueDataColumn": "2010"
    }

    var WIDTH = $(window).width(),
        HEIGHT = $(window).height();

    var years = ["2010", "2011", "2012", "2013", "2014", "2015"];

    var map_Width = 835.0,
        map_Height = 485.0;

    var COLOR_COUNTS = 20;

    var changeFreq = 4000;

    var yearIndex = -1;

    var SCALE = 0.9 * Math.min(WIDTH / map_Width, HEIGHT / map_Height);

    function Interpolate(start, end, steps, count) {
        var s = start,
            e = end,
            final = s + (((e - s) / steps) * count);
        return Math.floor(final);
    }

    function Color(_r, _g, _b) {
        var r, g, b;
        var setColors = function(_r, _g, _b) {
            r = _r;
            g = _g;
            b = _b;
        };

        setColors(_r, _g, _b);
        this.getColors = function() {
            var colors = {
                r: r,
                g: g,
                b: b
            };
            return colors;
        };
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function valueFormat(d) {
        if (d > 1000000000) {
            return Math.round(d / 1000000000 * 10) / 10 + "B";
        } else if (d > 1000000) {
            return Math.round(d / 1000000 * 10) / 10 + "M";
        } else if (d > 1000) {
            return Math.round(d / 1000 * 10) / 10 + "K";
        } else {
            return d;
        }
    }

    var COLOR_FIRST = config.color1,
        COLOR_LAST = config.color2;

    var rgb = hexToRgb(COLOR_FIRST);

    var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

    rgb = hexToRgb(COLOR_LAST);
    var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

    var MAP_STATE = config.stateDataColumn;
    var MAP_VALUE = config.valueDataColumn;

    var width = WIDTH,
        height = HEIGHT;

    var valueById = d3.map();

    var startColors = COLOR_START.getColors(),
        endColors = COLOR_END.getColors();

    var colors = [];

    for (var i = 0; i < COLOR_COUNTS; i++) {
        var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
        var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
        var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
        colors.push(new Color(r, g, b));
    }

    var quantize = d3.scale.quantize()
        .domain([0, 1.0])
        .range(d3.range(COLOR_COUNTS).map(function(i) {
            return i
        }));

    var path = d3.geo.path();

    var svg = d3.select("#canvas-svg").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(error, names) {

        name_id_map = {};
        id_name_map = {};

        for (var i = 0; i < names.length; i++) {
            name_id_map[names[i].name] = names[i].id;
            id_name_map[names[i].id] = names[i].name;
        }

        data.forEach(function(d) {
            var id = name_id_map[d[MAP_STATE]];
            valueById.set(id, +d[MAP_VALUE]);
        });

        quantize.domain([d3.min(data, function(d) {
                return +d[MAP_VALUE]
            }),
            d3.max(data, function(d) {
                return +d[MAP_VALUE]
            })
        ]);



        d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
            //      console.log((topojson.feature(us, us.objects.states).features))
            var stateMap = svg.append("g")
                .attr("class", "states-choropleth")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("transform", "scale(" + SCALE + ")")
                .style("fill", function(d) {
                    if (valueById.get(d.id)) {
                        var i = quantize(valueById.get(d.id));
                        var color = colors[i].getColors();
                        return "rgb(" + color.r + "," + color.g +
                            "," + color.b + ")";
                    } else {
                        return "";
                    }
                })
                .attr("d", path)
                .on("mousemove", function(d) {
                    var html = "";

                    html += "<div class=\"tooltip_kv\">";
                    html += "<span class=\"tooltip_key\">";
                    html += id_name_map[d.id];
                    html += "</span>";
                    html += "<span class=\"tooltip_value\">";
                    html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
                    html += "";
                    html += "</span>";
                    html += "</div>";

                    $("#tooltip-container").html(html);
                    $(this).attr("fill-opacity", "0.8");
                    $("#tooltip-container").show();

                    var coordinates = d3.mouse(this);

                    var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;

                    if (d3.event.layerX < map_width / 2) {
                        d3.select("#tooltip-container")
                            .style("top", (d3.event.layerY + 15) + "px")
                            .style("left", (d3.event.layerX + 15) + "px");
                    } else {
                        var tooltip_width = $("#tooltip-container").width();
                        d3.select("#tooltip-container")
                            .style("top", (d3.event.layerY + 15) + "px")
                            .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
                    }
                })
                .on("mouseout", function() {
                    $(this).attr("fill-opacity", "1.0");
                    $("#tooltip-container").hide();
                })
                .on("click", function(d,i){
                    console.log("click")
                    getStateInfo(id_name_map[d.id]);
                })

            var stateNumber = svg.selectAll("text")
                .data(topojson.feature(us, us.objects.states).features)
                .enter()
                .append("text")
                .attr("transform", "scale(" + SCALE + ")")
                .text(function(d) {
                    return valueFormat(valueById.get(d.id));
                })
                .attr("x", function(d) {
                    return path.centroid(d)[0];
                })
                .attr("y", function(d) {
                    return path.centroid(d)[1];
                })
                .attr("opacity", 0)
                .attr("text-anchor", "middle")
                .attr('fill', '#333333')
                .attr('font-weight', '600')
                .attr('font-size', '6pt');

            svg.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) {
                    return a !== b;
                }))
                .attr("class", "states")
                .attr("transform", "scale(" + SCALE + ")")
                .attr("d", path);

            var textLabels = svg.selectAll("textLabel")
                .data(years)
                .enter()
                .append("text")
                .attr("class", "textLabel")
                .attr("x", function(d) {
                    return WIDTH - 100;
                })
                .attr("y", function(d, i) {
                    return 100 + i * 50;
                })
                .text(function(d) {
                    return d;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "#999999");

            var rectLabels = svg.append("rect")
                .attr("x", WIDTH - 60)
                .attr("y", 90)
                .attr("width", 2)
                .attr("height", 10)
                .attr("fill", "#999999");

            for (var i = 0; i <= 5; i++) {
                setTimeout(function() {
                    yearIndex = yearIndex + 1;
                    yearUpdate(yearIndex);
                }, i * changeFreq)
            }

            var yearTexts = document.getElementsByClassName("textLabel");
            for (var i = 0; i < yearTexts.length; i++) {
                yearTexts[i].addEventListener("click", function(event) {
                    curYear = event.target.textContent
                    yearUpdate(curYear-"2010");
                });
            }
            
            
            function yearUpdate(yearIndex){
                rectLabels.transition()
                        .duration(changeFreq)
                        .attr("height", 10 + yearIndex * 50)
                    var valueById = d3.map();
                    MAP_VALUE = years[yearIndex]
                    data.forEach(function(d) {
                        var id = name_id_map[d[MAP_STATE]];
                        valueById.set(id, +d[MAP_VALUE]);
                    });

                    quantize.domain([d3.min(data, function(d) {
                            return +d[MAP_VALUE]
                        }),
                        d3.max(data, function(d) {
                            return +d[MAP_VALUE]
                        })
                    ]);

                    stateNumber.transition()
                        .duration(changeFreq / 2)
                        .attr("opacity", "0")

                    setTimeout(function() {
                        stateNumber.transition()
                            .duration(changeFreq / 2)
                            .attr("opacity", "1")
                            .text(function(d) {
                                return valueFormat(valueById.get(d.id));
                            });
                    }, changeFreq / 2);
                    stateMap.transition()
                        .duration(changeFreq)
                        .style("fill", function(d) {
                            if (valueById.get(d.id)) {
                                var i = quantize(valueById.get(d.id));
                                var color = colors[i].getColors();
                                return "rgb(" + color.r + "," + color.g +
                                    "," + color.b + ")";
                            } else {
                                return "";
                            }
                        });
                    stateMap.on("mousemove", function(d) {
                        var html = "";

                        html += "<div class=\"tooltip_kv\">";
                        html += "<span class=\"tooltip_key\">";
                        html += id_name_map[d.id];
                        html += "</span>";
                        html += "<span class=\"tooltip_value\">";
                        html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
                        html += "";
                        html += "</span>";
                        html += "</div>";

                        $("#tooltip-container").html(html);
                        $(this).attr("fill-opacity", "0.8");
                        $("#tooltip-container").show();

                        var coordinates = d3.mouse(this);

                        var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;

                        if (d3.event.layerX < map_width / 2) {
                            d3.select("#tooltip-container")
                                .style("top", (d3.event.layerY + 15) + "px")
                                .style("left", (d3.event.layerX + 15) + "px");
                        } else {
                            var tooltip_width = $("#tooltip-container").width();
                            d3.select("#tooltip-container")
                                .style("top", (d3.event.layerY + 15) + "px")
                                .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
                        }
                    });
            }

        });

    });
});