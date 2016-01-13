var data_graph1 = new Array();
                $.ajax( {  
                    url : "./Dashboard_files/export.xml",  
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
//////////////////////////////////////////////////////

var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 400, right: 10, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

// var parseDate = d3.time.format("%Y-%m-%d").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;


var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
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