var data_graph1 = new Array();
                $.ajax( {  
                    url : "./Dashboard_files/export_lily.xml",  
                    dataType : "xml",  
                    async : false,
                    error : function(xml) {  
                        alert('error loading XML document' + xml);  
                    },  
                    success : function(xml) {  
                        $(xml).find("Record").each(function() { 
                        if($(this).attr("type")=="HKQuantityTypeIdentifierStepCount"){
                            var value = $(this).attr("value");
                            var year = $(this).attr("startDate").substring(0,4);
                            var month = $(this).attr("startDate").substring(4,6);
                            var day = $(this).attr("startDate").substring(6,8);
                            // console.log(year + month + day)
                            data_graph1.push({
                                "date": new Date(year + '-' + month + '-' + day),
                                "value": Math.floor(parseFloat(value))
                            });
                        }
                        })

                    }
                });

var lastSlide = 1;

console.log(data_graph1[0])

var min = data_graph1.reduce(function (a, b) { return a.date < b.date ? a : b; }); 

var all_date = data_graph1.map(function(a) {return a.date;});
var min_date_index = all_date.indexOf(min.date);

console.log(min);
console.log(min_date_index);

var data_new = []
for(var i=min_date_index; i<data_graph1.length; i++)
{
    data_new.push({
        "date" : data_graph1[i].date,
        "value" : data_graph1[i].value
    })
}
console.log(data_new)
draw_1();
//////////////////////////////////////////////////////
function draw_1(){
  // var isGraph_1 = document.getElementById("graph1");
  // if (isGraph_1.clientHeight != 0){
  d3.select("#svg_graph1").remove();
var graph1_width = document.getElementById("graph1").offsetWidth-40;
// var graph1_height = document.getElementById("graph1").offsetHeight-20;
// var graph1_width = 900;


var margin = {top: 10, right: 10, bottom: graph1_width*0.15, left: 40},
    margin2 = {top: graph1_width*0.6*0.8, right: 10, bottom: graph1_width*0.15*0.5, left: 40},
    width = graph1_width - margin.left - margin.right,
    height = graph1_width*0.6 - margin.top - margin.bottom,
    height2 = graph1_width*0.6 - margin2.top - margin2.bottom;

// var parseDate = d3.time.format("%Y-%m-%d").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;


var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%d-%m")),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(d3.time.format("%m-%Y")),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var line = d3.svg.line()
    .interpolate("cardinal")   
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var area = d3.svg.area()
    .interpolate("cardinal")   
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.close); });

var area2 = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.close); });

var svg = d3.select("#graph1")
    .append("svg")
    .attr("id","svg_graph1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
      .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // .append("g")
  // .attr("class", "focus")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus_tem = svg.append("g")
    .attr("class", "focus")

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + 0 + "," + margin2.top + ")");

  var data = data_new.map(function(d) {
      return {
         date: d.date,
         close: d["value"]
      };
      
  });

  console.log(data);


  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));
  x2.domain(x.domain());
  y2.domain(y.domain());


  focus_tem.append("linearGradient")
      .attr("id", "temperature-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", y(0))
      .attr("x2", 0).attr("y2", y(20000))
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#fff"},
        {offset: "20%", color: "#d9534f"},
        {offset: "100%", color: "#d9534f"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });


  focus_tem.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus_tem.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Steps");

  focus_tem.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

focus_tem.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  focus_tem.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);


  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);

    brush.extent([new Date(data_new[data_new.length-31].date), new Date(data_new[data_new.length-1].date)]);
    context.select('.brush').call(brush);
        brushed();

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
    var show_date = (d.date.getYear()+1900) + "-" + (d.date.getMonth()+1) + "-" + (d.date.getDate()+1);
    // console.log(show_date);
    // focus.select("text").text(show_date);
    // focus.select("text").text(show_date);
    focus.select("foreignObject").remove();
    focus.append("foreignObject")
  .append("xhtml:div")
  .attr("id", "focus_tooltip")
  .html(show_date+ "<br>"+ "Steps: " + d.close);
  }

  function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus_tem.select(".area").attr("d", area);
  focus_tem.select(".line").attr("d", line);
  focus_tem.select(".x.axis").call(xAxis);
}
// }
}

function resize(){
draw_1();
draw_2();
draw_3();
draw_4();
}

// setInterval(function(){ 
//   // console.log("lalal")
//   var h_1 = document.getElementById("graph1").clientHeight;
//   var h_2 = document.getElementById("cal-heatmap").clientHeight;
//   var h_3 = document.getElementById("weekBarChart").clientHeight;
//   var h_4 = document.getElementById("pieChart").clientHeight;
//   console.log(h_1, h_2, h_3, h_4);
//   if (h_1 != 0) curSlide = 1;
//   else if (h_2 != 0) curSlide = 2;
//   else if (h_3 != 0) curSlide = 3;
//   else if (h_4 != 0) curSlide = 4;
//   console.log(curSlide);
//   if (lastSlide != curSlide)
//   {
//     console.log("here");
//     switch (curSlide) {
//       case 1:
//         draw_1();
//         break;
//       case 2:
//         draw_2();
//         break;
//       case 3:
//         draw_3();
//         break;
//       case 4:
//         draw_4();
//         break;
//     }
//      lastSlide = curSlide;
//   }
// }, 500);

// var intHdl = setInterval(function count_clear() {
//   // click_count = 0;
//   // width = img_plate.clientWidth;
//   // if(click_start == 1 && slow == 5 && finished == false && width != 0) {    
//   //   alert("Too slow!");
//   //   console.log("SLOOOOOOOW");
//   //   slow = 0;
//   // }
//   // slow += 1;
//   console.log("123456");
// }, 1000);
// window.onload= function () {
//   document.getElementById('slides').addEventListener('change',loadXMLDoc, false);
//   document.getElementById('slides2').addEventListener('change',loadXMLDoc, false);

//   function loadXMLDoc(){
//     alert('worked');
//   }
// }
// document.getElementById("preS").addEventListener("click", curSlide = curSlide + 1;
//   if(curSlide == 5) curSlide = 1;
//   if(curSlide == 1) draw_1();
//   else if(curSlide == 2) draw_2();
//   else if(curSlide == 3) draw_3();
//   else if(curSlide == 4) draw_4();
//   );