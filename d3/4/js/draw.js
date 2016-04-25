function resize(){
    redraw();
}

redraw();
function redraw(){
    var wMaior = document.getElementById("chart-radar").clientWidth;
    var wMenor = document.getElementById("chart-radar").clientHeight;
    
    console.log(wMaior, wMenor)

    var colorscale = d3.scale.category10();
    var legendOptions = ['Streaming', "Vinyl"];
    var size = 2;
    var json = [
        [
            {"axis":"Rock","value":0},
            {"axis":"Alternative","value":0},
            {"axis":"Heavy Metal","value":0},
            {"axis":"Pop","value":0},
            {"axis":"Hip Hop","value":0},
            {"axis":"Electric","value":0},
        ]
    ];
    if (size > 0) {
        var json = [
            [
                {"axis":"Rock","value":3},
                {"axis":"Alternative","value":3},
                {"axis":"Heavy Metal","value":3.2},
                {"axis":"Pop","value":4.5},
                {"axis":"Hip Hop","value":3.2},
                {"axis":"Electric","value":3.1},
            ],
            [
                {"axis":"Rock","value":3.5},
                {"axis":"Alternative","value":4.8},
                {"axis":"Heavy Metal","value":2.8},
                {"axis":"Pop","value":2.8},
                {"axis":"Hip Hop","value":2.5},
                {"axis":"Electric","value":2.5},
            ]
        ];
    }

    function drawRadarCharts() {
        drawRadarChart('#chart-radar', wMenor*0.75, wMenor*0.75);
    };

    function drawRadarChart(divId, w, h) {
        var textSizeLevels = "10px !important";
        var textSizeTooltip = "13px !important";
        var textSizeLegend = "12px !important";
        var circleSize = 5;
        var strokeWidthPolygon = "2px";

        var RadarChart = {
            draw: function(id, data, options) {
                var cfg = {
                    radius: circleSize,
                    w: w,
                    h: h,
                    factor: 1,
                    factorLegend: .85,
                    levels: 3,
                    maxValue: 0,
                    radians: 2 * Math.PI,
                    opacityArea: 0.001,
                    ToRight: 5,
                    TranslateX: (document.getElementById("chart-radar").clientWidth - w)/2,
                    TranslateY: (document.getElementById("chart-radar").clientHeight - w)/2,
                    ExtraWidthX: document.getElementById("chart-radar").clientWidth - w,
                    ExtraWidthY: 100,
                    color: d3.scale.category10()
                };
                
                // edit content in cfg
                if ('undefined' !== typeof options) {
                    for (var i in options) {
//                        console.log(i);
                        if ('undefined' !== typeof options[i]) {
                            cfg[i] = options[i];
                        }
                    }
                }

                cfg.maxValue = Math.round(Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}));})));
                var allAxis = (data[0].map(function(i, j){return i.axis;}));
//                console.log("allAxis: ", allAxis)
                var total = allAxis.length;
                var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
                console.log(cfg.w,cfg.h,radius);
//                cfg.TranslateX = (document.getElementById("chart-radar").clientWidth - 2 * radius) / 2;
//                cfg.TranslateY = (document.getElementById("chart-radar").clientHeight - 2 * radius) / 2;
                d3.select(id)
                    .select("svg").remove();

                var g = d3.select(id)
                    .append("svg")
                    .attr("width", cfg.w+cfg.ExtraWidthX)
                    .attr("height", cfg.h+cfg.ExtraWidthY)
                    .attr("class", "graph-svg-component")
                    .append("g")
                    .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

                var tooltip;

                // Circular segments
                for (var j=0; j<cfg.levels; j++) {
                    var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
                    g.selectAll(".levels")
                    .data(allAxis)
                    .enter()
                    .append("svg:circle")
                    .attr("cx", function (d) { return radius;})
                    .attr("cy", function (d) { return radius; })
                    .attr("r", function (d) { return levelFactor; })
                    .attr("class", "circle")
                    .style("stroke", "rgb(54,70,91)")
                    .style("stroke-opacity", "0.75")
                    .style("stroke-width", function (d,i) { return j==4 ? "3px" : "1px"; })
                    .style("fill","none");
                }

                // Text indicating at what % each level is
//                for (var j=0; j<cfg.levels; j++) {
//                    var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
//                    g.selectAll(".levels")
//                    .data([1]) //dummy data
//                    .enter()
//                    .append("svg:text")
//                    .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
//                    .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
//                    .attr("class", "legend")
//                    .style("font-family", "sans-serif")
//                    .style("font-size", textSizeLevels)
//                    .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
//                    .attr("fill", "#737373")
//                    .text((j+1)*cfg.maxValue/cfg.levels);
//                }

                series = 0;

                var axis = g.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", axis);

                axis.append("line")
                .attr("x1", cfg.w/2)
                .attr("y1", cfg.h/2)
                .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "rgba(44,57,71,0.7)")
                .style("stroke-width", "1.5px");

                axis.append("text")
                .attr("class", "legend")
                .text(function(d){return d;})
//                .style("font-family", "sans-serif")
                .style("font-size", textSizeLegend)
                .attr("text-anchor", function(d, i){
                    if (i==0 || i==3) {return "middle";}
                    else if (i==1 || i == 2) {return "end"}
                    else {return "start"}
                })
                .attr("dy", "0.5em")
                .attr("dx",  function(d, i){
                    if (i==0 || i==3) {return "0em";}
                    else if (i==1 || i == 2) {return "0.5em"}
                    else {return "-0.5em"}
                })
                .attr("fill","rgb(80,102,129)")
                .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
                .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
                
                
                var mainGradient = g.append('linearGradient')
                    .attr('id', 'mainGradient');
                // Create the stops of the main gradient. Each stop will be assigned
                // a class to style the stop using CSS.
                mainGradient.append('stop')
                    .attr('class', 'stop-left')
                    .attr('offset', '0');
                mainGradient.append('stop')
                    .attr('class', 'stop-right')
                    .attr('offset', '1');

                
                color = ["rgb(53,69,88)","url(#mainGradient)"]
                data.forEach(function(y, x) {
                    dataValues = [];
                    g.selectAll(".nodes")
                    .data(y, function(j, i) {
                        dataValues.push([
                            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                        ]);
                    });
                    dataValues.push(dataValues[0]);
                    g.selectAll(".area")
                    .data([dataValues])
                    .enter()
                    .append("polygon")
                    .attr("class", "radar-chart-series_"+series)
                    .style("stroke-width", strokeWidthPolygon)
                    .style("stroke", "none")
                    .attr("points",function(d) {
                        var str="";
                        for (var pti=0;pti<d.length;pti++) {
                            str=str+d[pti][0]+","+d[pti][1]+" ";
                        }
                        return str;
                    })
                    .style("fill", function(j, i) {
                        return color[x];
                    })
                    .style("fill-opacity", 0.8)
                    .on('mouseover', function (d) {
                        z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                        g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", 1);
                    })
                    .on('mouseout', function() {
                        g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.8);
                    });

                    series++;
                });

                series=0;

                data.forEach(function(y, x) {
                    g.selectAll(".nodes")
                    .data(y).enter()
                    .append("svg:circle")
                    .attr("class", "radar-chart-series_"+series)
                    .attr('r', cfg.radius)
                    .attr("alt", function(j){return Math.max(j.value, 0);})
                    .attr("cx", function(j, i){
                        dataValues.push([
                            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                        ]);
                        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                    })
                    .attr("cy", function(j, i){
                        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                    })
                    .attr("data-id", function(j){
                        return j.axis;
                    })
                    .style("fill", cfg.color(series)).style("fill-opacity", .0)
                    .on('mouseover', function (d){
                        newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                        newY =  parseFloat(d3.select(this).attr('cy')) - 5;

                        tooltip.attr('x', newX)
                        .attr('y', newY)
                        .text(d.value)
                        .transition(200)
                        .style('opacity', 1)
                        .style("fill","white");

                        z = "polygon." + d3.select(this).attr("class");
                        g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1); 
                        g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", 1);
                    })
                    .on('mouseout', function(){
                        tooltip.transition(200)
                        .style('opacity', 0);
                        g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                    })
                    .append("svg:title")
                    .text(function(j){
                        return Math.max(j.value, 0);
                    });

                    series++;
                });

                //Tooltip
                tooltip = g.append('text')
                .style('opacity', 0)
                .style('font-family', 'sans-serif')
                .style('font-size', textSizeTooltip);
            }
        };

        // Options for the Radar chart, other than default
        var myOptions = {
            w: w
            ,h: h
//            ,ExtraWidthX: 1000
            ,labelScale: 0.7
            ,levels: 5
            ,levelScale: 0.85
            ,facetPaddingScale: 1.9
            ,maxValue: 0.6
            ,showAxes: true
            ,showAxesLabels: true
            ,showLegend: true
            ,showLevels: true
            ,showLevelsLabels: false
            ,showPolygons: true
            ,showVertices: true
        };

        RadarChart.draw(divId, json, myOptions);

        ////////////////////////////////////////////
        /////////// Initiate legend ////////////////
        ////////////////////////////////////////////

//        var svg = d3.select('#chart-radar')
//        .selectAll('svg')
//        .append('svg')
//        .attr("width", w)
//        .attr("height", h)
//        .style("font-size", textSizeLegend);
//
//        // Initiate Legend
//        var legend = svg.append("g")
//        .attr("class", "legend")
//        .attr("height", 100)
//        .attr("width", 200)
//        .attr('transform', 'translate('+(-document.getElementById("chart-radar").clientWidth/2+100)+","+(document.getElementById("chart-radar").clientHeight-150)+')');
//
//        // Create colour squares
//        legend.selectAll('rect')
//        .data(legendOptions)
//        .enter()
//        .append("circle")
//        .attr("cx", w - 8)
//        .attr("cy", function(d, i) {
//            return 20+(i-1) * 20 + 6;
//        })
//        .attr("r", 8)
////        .attr("height", 10)
//        .style("fill", function(d, i) {
//            return color[1-i];
//        });
//
//        // Create text next to squares
//        legend.selectAll('text')
//        .data(legendOptions)
//        .enter()
//        .append("text")
//        .attr("x", w + 3)
//        .attr("y", function(d, i) {
//            return i * 20 + 9;
//        })
//        .attr("font-size", textSizeLegend)
//        .attr("fill", "#ffffff")
//        .text(function(d) {
//            return d;
//        });
    };

    function update() {
        console.log("here");
        json = [
            [
                {"axis":"A","value":0},
                {"axis":"B","value":0},
                {"axis":"C","value":0},
                {"axis":"D","value":0},
                {"axis":"E","value":0},
                {"axis":"F","value":0},
                {"axis":"G","value":0},
                {"axis":"H","value":0},
                {"axis":"I","value":0}
            ]
        ];
        drawRadarChart('#chart-radar', wMaior, wMaior);
    };

    drawRadarCharts();

    d3.select("button").on("click", update);
}