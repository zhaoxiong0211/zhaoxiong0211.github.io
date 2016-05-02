var graph2 = document.getElementById("graph2")
var stateN = document.getElementById("stateN")
var lineChart = document.getElementById("lineChart")
var backIcon = document.getElementById("backIcon")

function getStateInfo(state){
    if(graph2.classList.length == 2){
        graph2.classList.remove("show");
        setTimeout(function(){
            graph2.classList.add("show");
            stateN.textContent = state;
            drawLineChart(state);
        },1000);
    }
    else{
        graph2.classList.add("show");
        stateN.textContent = state;
        drawLineChart(state);
    }
}

function drawLineChart(state){
    d3.csv("census.csv", function(err, dataLine) {
        curStateInfo = $.grep(dataLine, function(e){ return e.State == state; });
        curStateInfo = curStateInfo[0];
        curStateData = [curStateInfo["2010"], curStateInfo["2011"], curStateInfo["2012"], curStateInfo["2013"], curStateInfo["2014"], curStateInfo["2015"]];
        years = ["2010", "2011", "2012", "2013", "2014", "2015"]
        stateData = []
        for(var i=0; i<6; i++){
            stateData.push({"year":years[i],"num":parseInt(curStateData[i])})
        }
        draw2(stateData);
    })
}

function draw2(data){
    d3.select("#lineC").remove();
    
    var margin = 50,
        width = lineChart.clientWidth - 2*margin,
        height = lineChart.clientHeight - 2*margin;
    
    var parseDate = d3.time.format("%Y").parse,
        bisectDate = d3.bisector(function(d) { return d.date; }).left;
//    formatValue = d3.format(",.2f"),
//    formatCurrency = function(d) { return "$" + formatValue(d); };
    
     data.forEach(function(d){
        d.year = parseDate(d.year);
        d.num = +d.num;
    })
     
    var x = d3.time.scale()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(6)
    .tickFormat(d3.time.format("%Y"))
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(6)
    .tickFormat(function(d) {return valueFormat(d)})
    .orient("left");

    var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.num); });

    var svg2 = d3.select("#lineChart")
    .append("svg")
    .attr("id","lineC")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

    x.domain([d3.min(data, function(d,i) {return d.year}),d3.max(data, function(d,i) {return d.year})]);
    y.domain([d3.min(data, function(d,i) {return d.num}), d3.max(data, function(d,i) {return d.num})]);

    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", width)
      .attr("dy", "-1em")
      .style("text-anchor", "end")
      .text("Year");

    svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Population");

    svg2.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
    
    var info = svg2.selectAll("infoText")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", function(d) {return x(d.year)})
                    .attr("y", function(d) {return y(d.num)})
                    .attr("dx", function(d,i) {return i<=4 ? "1em" : "-1em"})
                    .text(function(d,i) {return years[i] + " / " + d.num})
                    .style("text-anchor",function(d,i) {return i<=4 ? "start" : "end"})
                    .attr("font-size", "12px")
                    .attr("fill", "#999999")
                    .style("opacity", "0");
    
    var circles = svg2.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) { return x(d.year); })
                        .attr("cy", function (d) { return y(d.num); })
                        .attr("r", function (d) { return "3"; })
                        .style("fill", function(d) { return "rgb(95,168,157)"; })
                        .on("mouseover",function(d,i){
                            circles.transition()
                                    .duration(200)
                                    .attr("r", function (d2,j) { return i==j ? "6" : "3"; });
                            
                            info.transition()
                                .duration(200)
                                .style("opacity", function (d2,j) { return i==j ? "1" : "0"});
                        })
                        .on("mouseout",function(d,i){
                            circles.transition()
                                    .duration(200)
                                    .attr("r", "3");
                             info.transition()
                                .duration(200)
                                .style("opacity", "0");
                        });
    
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

}

backIcon.addEventListener("click", function(){
    graph2.classList.remove("show");
})