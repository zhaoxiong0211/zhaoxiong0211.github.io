chart("data.csv", "orange");

var datearray = [];
var colorrange = [];


function chart(csvpath, color) {

colorrange = ["rgb(178,38,87)", "rgb(221,96,68)","rgb(230,154,69)","rgb(99,163,166)"];
strokecolor = colorrange[0];

var format = d3.time.format("%m/%d/%y");

var margin = {top: 20, right: 0, bottom: 100, left: 0};
var width = document.getElementById("chart").clientWidth - margin.left - margin.right;
var height = document.getElementById("chart").clientHeight - margin.top - margin.bottom;

//var tooltip = d3.select("#chart")
//    .append("div")
//    .attr("class", "remove")
//    .style("position", "absolute")
//    .style("z-index", "20")
//    .style("visibility", "hidden")
//    .style("top", "30px")
//    .style("left", "55px");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height-10, 0]);

var z = d3.scale.ordinal()
    .range(colorrange);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(7)
    .tickFormat(d3.time.format("%m.%d %a"));

var yAxis = d3.svg.axis()
    .scale(y);

var yAxisr = d3.svg.axis()
    .scale(y);

var stack = d3.layout.stack()
    .offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var nest = d3.nest() // group elements in array
    .key(function(d) { return d.key; });


var area_0 = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d,i) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0); });
    
var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var graph = d3.csv(csvpath, function(data) {
  data.forEach(function(d) {
    d.date = format.parse(d.date);
    d.value = +d.value;
  });

  var layers = stack(nest.entries(data));
//  var layers_temp = stack(nest.entries(data));
//console.log(data)
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    
//    console.log(layer);
//    layer.forEach(function(d,i) {
//        console.log(d.values);
//        svg.append("path")
//          .datum(d.values)
//          .attr("class", "area")
//          .attr("d", area);
//    })
    
//    .x(function(d) { return x(d.date); })
//    .y0(function(d) { return y(d.y0); })
//    .y1(function(d) { return y(d.y0); });
    
    var length1 = layers.length;
    var length2 = layers[0].values.length;
//    console.log(length1, length2, layers);
    var layers_temp = $.extend(true, [], layers);
    for (var i = 0; i<length1; i++){
//        layers_temp.push(layers[i]);
//        for (var j=0; j<length2; j++){
            layers_temp[i].values = layers_temp[i].values.slice(0,1)
//            layers_temp[i].values[j].y0 = 0;
//        }
    }
    
//    console.log(layers_temp, layers)
    
    var layers_temp_before = $.extend(true, [], layers_temp);
    
//    layers.forEach(function(d,i) {
//            idx = i;
//            cur_value = layers[i].values
//                svg.append("path")
//        //              .datum(cur_value)
//                  .attr("class", "area")
//                  .attr("d", area(cur_value))
//        //              .attr("x", function(d) { console.log(d); return x(d.date);})
//        //              .attr("y0", function(d) { return y(d.y0); })
//        //              .attr("y1", function(d) { return y(d.y0); })
//                  .style("fill", function(d) { return z(i); });
////                    .attr("opacity", 1)
////                    .on("click", function(d, i) {
////                      svg.selectAll(".area").transition()
////                      .duration(250)
////                      .attr("opacity", function(d, j) {
////                        return j != i ? 0.6 : 1;
////                    })});
////                  .transition()
////        //                .delay(function(d,i) {console.log(d,i); return i*100;})
////                    .duration(2000)
////                    .attr("d", area(cur_value));
//        });
    
    
//    console.log(layers_temp, layers);
    
    var layer = svg.selectAll(".layer")
                  .data(layers)
                .enter().append("path")
                  .attr("class", "layer")
                  .attr("d", function(d,i) { console.log(i); return area(d.values); })
                  .style("fill", function(d, i) { return z(i); });
    
//    var count = 0;
////    layers_temp = []
//    var loadingAnimation = setInterval(function() {
//        for (var i = 0; i<length1; i++){
////            for (var j = count; j<length2; j++){
//                layers_temp[i].values.push(layers[i].values[count]);
////            }
////            layers_temp[i].values[count].y0 = layers[i].values[count].y0;
//        }
////        layers_temp.push(layers[count])
//        count += 1;
//        drawLayers();
////        redraw();
//        if (count == 7){
//            clearInterval(loadingAnimation);
//        }
//    },500)
//    
//    function drawLayers(){
//        d3.selectAll(".area").remove();
//        layers.forEach(function(d,i) {
//            idx = i;
//            last_value = layers_temp_before[i].values
//            cur_value = layers_temp[i].values
//                svg.append("path")
//        //              .datum(cur_value)
//                  .attr("class", "area")
//                  .attr("d", area(last_value))
//        //              .attr("x", function(d) { console.log(d); return x(d.date);})
//        //              .attr("y0", function(d) { return y(d.y0); })
//        //              .attr("y1", function(d) { return y(d.y0); })
//                  .style("fill", function(d) { return z(i); })
//                  .transition()
//        //                .delay(function(d,i) {console.log(d,i); return i*100;})
//                    .duration(500)
//                    .attr("d", area(cur_value));
//        });
//        layers_temp_before = $.extend(true, [], layers_temp);
//    }
    
//    layers.selectAll("path")
//        .append("path")
//        .data(function (d) { console.log(d.values); return d.values; })
//        .attr("class", "area")
//        .attr("d", area);
//            .attr("d", function(d) { return area(d.values); })
////        .delay(function(d,i){return i *100;})
//        .duration(100)
//        .ease("quad-out")
//        .attr("d", function(d) { return  area(d.values)});
//
//.x(function(d) { return x(d.date); })
//    .y0(function(d) { return y(d.y0); })
//    .y1(function(d) { return y(d.y0 + d.y); });

    
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height+margin.bottom) + ")")
      .call(xAxis)
      .selectAll("text")  
        .style("text-anchor", "start")
        .attr("dx", ".5em")
        .attr("transform", "rotate(270)" );

//  svg.append("g")
//      .attr("class", "y axis")
//      .attr("transform", "translate(" + width + ", 0)")
//      .call(yAxis.orient("right"));
//
//  svg.append("g")
//      .attr("class", "y axis")
//      .call(yAxis.orient("left"));

//  svg.selectAll(".layer")
//    .attr("opacity", 1)
//    .on("click", function(d, i) {
//      svg.selectAll(".layer").transition()
//      .duration(250)
//      .attr("opacity", function(d, j) {
//        return j != i ? 0.6 : 1;
//    })})
//
//    .on("mousemove", function(d, i) {
//      mousex = d3.mouse(this);
//      mousex = mousex[0];
//      var invertedx = x.invert(mousex);
//      invertedx = invertedx.getMonth() + invertedx.getDate();
//      var selected = (d.values);
//      for (var k = 0; k < selected.length; k++) {
//        datearray[k] = selected[k].date
//        datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
//      }
//
//      mousedate = datearray.indexOf(invertedx);
//      pro = d.values[mousedate].value;
//
//      d3.select(this)
//      .classed("hover", true)
//      .attr("stroke", strokecolor)
//      .attr("stroke-width", "0.5px"), 
//      tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
//      
//    })
//    .on("mouseout", function(d, i) {
//     svg.selectAll(".layer")
//      .transition()
//      .duration(250)
//      .attr("opacity", "1");
//      d3.select(this)
//      .classed("hover", false)
//      .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
//  })
    
//  var vertical = d3.select("#chart")
//        .append("div")
//        .attr("class", "remove")
//        .style("position", "absolute")
//        .style("z-index", "19")
//        .style("width", "1px")
//        .style("height", "380px")
//        .style("top", "10px")
//        .style("bottom", "30px")
//        .style("left", "0px")
//        .style("background", "#fff");

//  d3.select("#chart")
//      .on("mousemove", function(){  
//         mousex = d3.mouse(this);
//         mousex = mousex[0] + 5;
//         vertical.style("left", mousex + "px" )})
//      .on("mouseover", function(){  
//         mousex = d3.mouse(this);
//         mousex = mousex[0] + 5;
//         vertical.style("left", mousex + "px")});
});
}