function draw2(){
    
    var data2=[60,80,110,170,90,75,70,190,85,105,160,70,80,140,100]

var w2 = document.getElementById("barChart").clientWidth,
    h2 = document.getElementById("barChart").clientHeight,
    margin1 = 30,
    margin2 = 40,
    y2 = d3.scale.linear().domain([200, 0]).range([0 + margin1, h2 - margin1]),
    x2 = d3.scale.linear().domain([0, data2.length-1]).range([0 + margin2, w2 - margin2]).nice();

var xAxis = d3.svg.axis()
    .scale(x2)
    .tickValues([1, 3, 5, 7, 9, 11, 13])
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y2)
    .tickValues([0, 100, 200])
    .orient("left");

var vis2 = d3.select("#barChart")
    .append("svg:svg")
    .attr("id","barCanvas")
    .attr("width", w2)
    .attr("height", h2)

var g2 = vis2.append("svg:g");

g2.append("g")         
    .attr("class", "grid")
    .attr("transform", "translate(" + (margin1/2) + ",0)")
    .call(make_y_axis()
        .tickSize(-w2+margin2, 0, 0)
        .tickFormat("")
    )

g2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h2-margin1) + ")")
      .call(xAxis);

g2.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin2 + "," + 10 + ")")
      .call(yAxis);

function make_y_axis() {        
    return d3.svg.axis()
        .scale(y2)
        .orient("left")
        .ticks(5)
}

    setTimeout(function() {
        g2.selectAll(".bar")
              .data(data2)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d,i) { return x2(i); })
              .attr("width", 2)
              .attr("y", function(d) { return h2-margin1; })
              .attr("height", function(d) { return 1; })
        //      .attr('opacity', 0)
              .transition()
                .delay(function(d,i){return i *100;})
                .duration(100)
                .ease("quad-out")
                .attr("y", function(d) { return  y2(d)})
                .attr("height", function(d) {
                    return h2 - y2(d) - margin1;
                });
        //        .attr("opacity", 1);

        g2.selectAll("circle")
           .data(data2)
           .enter()
           .append("circle")
           .attr("class", "point")
           .attr("cx", function(d,i) { return x2(i) + 1; })
           .attr("cy", function(d) { return y2(d) + 1; })
           .attr("r", 3)
           .attr('opacity', 0)
           .transition()
            .delay(function(d,i){return i *100;})
            .duration(100)
            .ease('quad-out')
            .attr("opacity", 1);
        },500);
    
}