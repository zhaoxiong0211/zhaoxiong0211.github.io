var graph2 = document.getElementById("graph2")
var stateN = document.getElementById("stateN")
var lineChart = document.getElementById("lineChart")

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
     
    console.log(data);

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
//    console.log(d3.min(data, function(d,i) {return d.num}))
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
    
    var circles = svg2.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) { return x(d.year); })
                        .attr("cy", function (d) { return y(d.num); })
                        .attr("r", function (d) { return "3"; })
                        .style("fill", function(d) { return "rgb(95,168,157)"; });
    
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

//    var info = svg.append("text")
//                    .attr("x", width/2)
//                    .attr("y", 12)
//                    .text("test")
//                    .style("text-anchor","middle")
//                    .attr("font-size", "12px")
//                    .attr("fill", "#999999")
//                    .style("opacity", "0");
//
//    var title = svg.append("text")
//                    .attr("x", 0)
//                    .attr("y", 0)
//                    .attr("dy", "-.5em")
//                    .text(function(d,i) {return "Chart" + (i+1);})
//                    .style("text-anchor","start")
//                    .attr("font-size", "16px")
//                    .attr("fill", "#999999");
//
//    var focus = svg.append("g")
//      .attr("class", "focus_" + state)
//      .style("display", "none");
//
//    focus.append("circle")
//      .attr("r", 4.5);

    //focus.append("text")
    //  .attr("x", 9)
    //  .attr("dy", ".35em");

//    svg.append("rect")
//      .attr("class", "overlay")
//      .attr("width", width)
//      .attr("height", height)
//      .on("mouseover", function(d,i) { idx = i; focus.style("display", null); })
//      .on("mouseout", function(d,i) {focus.style("opacity", "0"); })
//      .on("mousemove", mousemove);
//    
//    function mousemove() {
//        var x0 = x.invert(d3.mouse(this)[0]),
//            i = bisectDate(data[idx], x0, 1),
//            d0 = data[idx][i - 1],
//            d1 = data[idx][i],
//            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")")
//            .style("opacity", function(da,i) {if(i!=idx) {return "0";}})
//
//        info.transition()
//            .duration(10)
//            .text(d.date + " | " + formatCurrency(d.close))
//            .style("opacity", function(d,i) {return i==idx ? "1" : "0"});
//        }
}