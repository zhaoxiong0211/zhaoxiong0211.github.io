var margin = {top: 20, right: 0, bottom: 100, left: 0},
    width = document.getElementById("chart").clientWidth - margin.left - margin.right,
    height = document.getElementById("chart").clientHeight - margin.top - margin.bottom;

var data = [
    {"key":"Heat",
    "value":[{"date" : "06-Oct-12","close" : 50},{"date" : "07-Oct-12","close" : 70},{"date" : "08-Oct-12","close" : 100},{"date" : "09-Oct-12","close" : 130},{"date" : "10-Oct-12","close" : 90},{"date" : "11-Oct-12","close" : 120},{"date" : "12-Oct-12","close" : 130}]},
    {"key":"Gas",
    "value":[{"date" : "06-Oct-12","close" : 30},{"date" : "07-Oct-12","close" : 50},{"date" : "08-Oct-12","close" : 70},{"date" : "09-Oct-12","close" : 80},{"date" : "10-Oct-12","close" : 50},{"date" : "11-Oct-12","close" : 70},{"date" : "12-Oct-12","close" : 70}]},
     {"key":"Electricity",
    "value":[{"date" : "06-Oct-12","close" : 0},{"date" : "07-Oct-12","close" : 20},{"date" : "08-Oct-12","close" : 30},{"date" : "09-Oct-12","close" : 35},{"date" : "10-Oct-12","close" : 20},{"date" : "11-Oct-12","close" : 40},{"date" : "12-Oct-12","close" : 40}]},
     {"key":"Water",
    "value":[{"date" : "06-Oct-12","close" : -20},{"date" : "07-Oct-12","close" : -30},{"date" : "08-Oct-12","close" : -50},{"date" : "09-Oct-12","close" : -45},{"date" : "10-Oct-12","close" : -70},{"date" : "11-Oct-12","close" : -80},{"date" : "12-Oct-12","close" : -100}]}
];

var color = ["rgb(178,38,87)", "rgb(221,96,68)","rgb(230,154,69)","rgb(99,163,166)"]
var for_text = [{"key":"Heat","dis":100,"sub":"2576kWh"},{"key":"Gas","dis":50,"sub":"2576kWh"},{"key":"Electricity","dis":20,"sub":"2576kWh"},{"key":"Water","dis":-50,"sub":"2576kWh"}]

//var average = [-0,35,45,55,25,15,35]

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(7)
    .tickFormat(d3.time.format("%m.%d %a"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var area_0 = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y0(function(d) {return y(0) })
    .y1(function(d) {return y(0) });

var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y0(function(d,i) { if (d.close>0) {return y(d.close);} else {return y(0)} })
    .y1(function(d,i) { if (d.close>0) {return y(0);} else {return y(d.close)} });

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//  data.forEach(function(d) {
//      d.value.forEach(function(d2) {
//        d2.date = parseDate(d2.date);
//        d2.close = +d2.close;
//    })
//  });

y.domain([-150, 150]);


function make_x_axis() {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(7)
}

//var data_temp = [{"key":"Heat","value":[{"date" : "06-Oct-12","close" : 50}]},{"key":"Gas","value":[{"date" : "06-Oct-12","close" : 30}]},{"key":"Electricity","value":[{"date" : "06-Oct-12","close" : 0}]},{"key":"Water","value":[{"date" : "06-Oct-12","close" : -20}]}];
//console.log(data_temp)
//var count = 2;
//var length = data.length

//var data_temp_before = $.extend(true, [], data_temp);
var isClicked = false;
var isXAxis = false;

data.forEach(function(d,i) {
//    var tem = d.value;
    var cur_value = d.value
    console.log(cur_value)
//    var before_value = data_temp[i].value
    var idx = i
    var keyName = d.key
//    console.log(cur_value)
//    console.log(idx)
    cur_value.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
      });
    
//    before_value.forEach(function(d) {
//        d.date = parseDate(d.date);
//        d.close = +d.close;
//      });

    x.domain(d3.extent(cur_value, function(d) { return d.date; }));
    if(isXAxis==false){
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(5," + (height+margin.bottom) + ")")
            .call(make_x_axis()
                .tickSize(0, 0, 0)
                .tickFormat("")
            )
            .transition()
                  .duration(2000)
                  .call(make_x_axis()
                        .tickSize(-(height/2+margin.bottom), 0, 0)
                        .tickFormat("")
                    );
        isXAxis = true;
    }

//    console.log(cur_value);
//    cur_value.forEach(function(d_tem,count){
//        var id = "the_SVG_" + idx;
//        if(count<7){
//            svg.selectAll("#"+id).remove();
            svg.append("path")
            //          .datum(cur_value)
              .attr("class", "area")
//              .attr("id", id)
              .attr("d", area_0(cur_value))
            //      .attr("x", function(d) { return x(d.date); })
            //      .attr("y0", y(0))
            //      .attr("y1", function(d) { return y(d.close); })
              .style("fill", function(d,i) { return color[idx]; })
              .on('click', function(d,i){ console.log(keyName); clickAnimation(idx)} )
              .transition()
//                .delay(function(d,i) {return count*500})
                .duration(2000)
                .attr("d", function(d,i) { return area(cur_value)});
//        }
//    })
})

setTimeout(function(){
    for_text.forEach(function(d,i){
        svg.append("text")
              .attr("class","keyTitle")
              .attr("x", function(d) { return (3*x(data[0].value[6].date)+x(data[0].value[5].date))/4; })
              .attr("y", y(for_text[i].dis))
              .attr("dy", ".35em")
              .attr("text-anchor", "end")
              .attr("opacity", 0)
              .text(function(d) { return for_text[i].key; })
              .transition()
                .duration(500)
                .attr("opacity", 1);
        
//        svg.append("svg:foreignObject")
//            .attr("class","subKey")
//            .attr("width", 20)
//            .attr("height", 20)
//            .attr("y", y(for_text[i].dis))
//            .attr("x", function(d) { return x(data[0].value[5].date); })
//            .append("xhtml:span")
//              .attr({ 'class': 'glyphicon glyphicon-play gly-rotate-270' })
        
//              .html("1234")
        
//         text_node = svg.selectAll(".subKey")
//         tspan = text_node.text(null).append("tspan").attr("x", 0).attr("y", 0).attr("dy", 1 + "em");

    })
},2000)

function clickAnimation(i){
//      svg.selectAll(".area")
//        .attr("opacity", 1)
//        .on("click", function(d, i) {
    if (isClicked == false){
        isClicked = true;
        var data_tem = data[i].value
        var cur_max = d3.max(data_tem, function(d) { return d.close; })
        var cur_min = d3.min(data_tem, function(d) { return d.close; })
        if (cur_max>0){
            if (cur_min>0){ y.domain([0, cur_max]);}
            else {y.domain([cur_min, cur_max]);}
        }
        else{
            y.domain([cur_min,0]);
        }
          svg.selectAll(".area").transition()
          .duration(500)
          .attr("d", function(d, j) {
              data_click = data[j].value
            return j != i ? area_0(data_click) : area(data_click);});
        
        svg.selectAll(".keyTitle")
//            .attr("transform","scale(1)")
            .transition()
            .duration(500)
            .attr("opacity", function(d,j){
            return j != i ? 0 : 1;
        })
            .style("font-size",function(d,j){
            return j != i ? "16px" : "24px";
        })
    }
    else {
        isClicked = false;
        y.domain([-150, 150]);
          svg.selectAll(".area").transition()
          .duration(500)
          .attr("d", function(d, j) {
              data_click = data[j].value
            return area(data_click);});
        svg.selectAll(".keyTitle").transition()
            .duration(500)
            .attr("opacity", function(d,j){
            return 1;
        })
            .style("font-size",function(d,j){
            return "16px";
        })
//            svg.selectAll(".keyTitle")[i]
//                .transition()
//                .attr("x", function(d) { return (3*x(data[0].value[6].date)+x(data[0].value[5].date))/4; })
//                .attr("y", function(d,j) {y(for_text[i].dis)})
//                .attr("dy", ".35em")
    }
//        })})
}


svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(5," + (height+margin.bottom) + ")")
  .call(xAxis)
  .selectAll("text")  
    .style("text-anchor", "start")
    .attr("dx", ".5em")
    .attr("transform", "rotate(270)" );

