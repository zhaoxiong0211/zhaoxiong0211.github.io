var PI = 3.14159265359,
    count = 17,
    unit = PI / count,
    data = [],
    data_behind = [];

for(var i=0; i<count*2; i++){
//    var cur = Math.sin((unit*i))*0.3+2;
    data.push(Math.sin((unit*i))*0.3+2);
    data_behind.push(Math.sin(unit*(i+8))*0.3+2);
}


var w = document.getElementById("wave").clientWidth,
    h = document.getElementById("wave").clientHeight,
    margin = 20,
    y = d3.scale.linear().domain([1, 3]).range([0 + margin, h - margin]),
    x = d3.scale.linear().domain([0, data.length-1]).range([0, w]);

var vis = d3.select("#wave")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
 
var g = vis.append("svg:g")
    .attr("transform", "translate(" + 0 + "," + h + ")");

var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d,i) { return x(i); })
    .y0(h)
    .y1(function(d) { return -1 * y(d); });

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d,i) { return x(i); })
    .y(function(d) { return -1 * y(d); })

var areaPart_behind = g.append("path")
    .attr("class", "area")
    .attr("id", "behind")
    .attr("d", area(data_behind));

var areaPart = g.append("path")
    .attr("class", "area")
    .attr("d", area(data));

var linePart = g.append("path")
    .attr("class","line")
    .attr("d", line(data));

function redraw() {
    areaPart_behind.transition()
            .duration(100)
            .attr("d", area(data_behind))
    linePart.transition()
            .duration(100)
            .attr("d", line(data))
    areaPart.transition()
            .duration(100)
            .attr("d", area(data))
}

setInterval(function() {
    var first = data.shift(),
        first_behind = data_behind.shift();
    data.push(first);
    data_behind.push(first_behind);
    redraw();
},100)