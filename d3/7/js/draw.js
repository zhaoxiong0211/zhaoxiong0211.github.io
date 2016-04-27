var margin = {top: 20, right: 20, bottom: 20, left: 20},
width = 150 - margin.left - margin.right,
height = 150 - margin.top - margin.bottom;

var idx = 0;

var stage = 0;

redraw(stage);
function redraw(state){
    d3.selectAll("svg").remove();
    
    if (state == 0) {
        var data = dataAll.slice();
    }
    else {
        var data = dataAll.slice(dataAll.length - 5);
    }

    var parseDate = d3.time.format("%Y").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };

    var x = d3.time.scale()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

    var svg = d3.select("#chart")
    .selectAll("svg")
    .data(data)
    .enter()
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([1990,2012]);
    y.domain([0,d3.max(data, function(d,i) { return d3.max(d, function(d2,i){ return d2.close})})]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", width)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Year");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-1em")
      .style("text-anchor", "end")
      .text("Price ($)");

    svg.append("path")
      .attr("class", "line_"+state)
      .attr("d", line);

    var info = svg.append("text")
                    .attr("x", width/2)
                    .attr("y", 12)
                    .text("test")
                    .style("text-anchor","middle")
                    .attr("font-size", "12px")
                    .attr("fill", "#999999")
                    .style("opacity", "0");

    var title = svg.append("text")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("dy", "-.5em")
                    .text(function(d,i) {return "Chart" + (i+1);})
                    .style("text-anchor","start")
                    .attr("font-size", "16px")
                    .attr("fill", "#999999");

    var focus = svg.append("g")
      .attr("class", "focus_" + state)
      .style("display", "none");

    focus.append("circle")
      .attr("r", 4.5);

    //focus.append("text")
    //  .attr("x", 9)
    //  .attr("dy", ".35em");

    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function(d,i) { idx = i; focus.style("display", null); })
      .on("mouseout", function(d,i) {focus.style("opacity", "0"); })
      .on("mousemove", mousemove);
    
    function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data[idx], x0, 1),
        d0 = data[idx][i - 1],
        d1 = data[idx][i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")")
        .style("opacity", function(da,i) {if(i!=idx) {return "0";}})

    info.transition()
        .duration(10)
        .text(d.date + " | " + formatCurrency(d.close))
        .style("opacity", function(d,i) {return i==idx ? "1" : "0"});
    }
}

$(".btn-default").on('click', function (e) {
    if (e.target.textContent == "Next"){
        stage += 1;
    }
    else {
        stage -= 1;
    }
    stage = stage % 2;
    redraw(stage);
});