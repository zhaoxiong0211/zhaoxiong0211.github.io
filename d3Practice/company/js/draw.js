var margin = {top: 50, right: 0, bottom: 30, left: 60},
    width = document.getElementById("scatter").clientWidth - margin.left - margin.right,
    height = document.getElementById("scatter").clientHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
//    .range([0,10000])
    .tickValues([2000, 4000, 6000, 8000])
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues([0, 50, 100, 150, 200, 250])
    .orient("left");

var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(error, data) {
    console.log(data)
  if (error) throw error;

  data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
  });

  x.domain([0,10000]);
  y.domain([0,250]);
    
    // Draw the x Grid lines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_axis()
        .tickSize(-height, 0, 0)
        .tickFormat("")
    )

    // Draw the y Grid lines
  svg.append("g")            
    .attr("class", "grid")
    .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat("")
    )
    

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 0)
      .attr("dx", "-.3em")
      .attr("dy", "1.35em")
      .style("text-anchor", "end")
      .text("Employees");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
//      .attr("transform", "rotate(-90)")
      .attr("y", -margin.top/2)
      .attr("dx", "1.5em")
      .style("text-anchor", "end")
      .text("Publications")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return 4*d.size; })
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .style("fill", function(d) { return d.color; })
      .attr("opacity","0")
      .on("click",function(d,i){ console.log(d,i); clickFunction(d,i);})
      .transition()
        .delay(function(d,i){return i*50})
        .duration(500)
        .attr("opacity","1")
        .attr("r", function(d) { return 2*d.size; })
    
    // function for the x grid lines
    function make_x_axis() {
        return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
    }

    // function for the y grid lines
    function make_y_axis() {
      return d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(5)
    }
    
    function clickFunction(clickedItem, idx){
        var arc = d3.svg.arc()
                    .innerRadius(2*clickedItem.size+5)
                    .outerRadius(2*clickedItem.size+8)
                    .startAngle(0)
                    .endAngle(2 * Math.PI);
        
        var arc_2 = d3.svg.arc()
                    .innerRadius(2*clickedItem.size+5)
                    .outerRadius(2*clickedItem.size+10)
                    .startAngle(0)
                    .endAngle(2 * Math.PI);

        svg.append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("fill", clickedItem.color)
            .attr("opacity", "0")
            .attr("transform", "translate("+x(clickedItem.x)+","+y(clickedItem.y)+")")
            .transition()
                .duration(300)
                .ease("sin")
                .attr("opacity", "1")
                .attr("d", arc_2);
        
        svg.selectAll(".arc")
            .transition()
            .delay(300)
            .duration(300)
            .ease("sin")
            .attr("opacity", "0");
        
        setTimeout(function(){
            svg.selectAll(".arc").remove()
        },600);
    }

});
