var weekday_summary = [];
var weekday_count = [];

var weekday_index = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var weekday_data = [];
for (var i=0; i<data_new.length;i++)
{
	weekday = data_new[i].date.getDay();
	if(weekday_count[weekday] == null){
		weekday_count[weekday] = 1;
		weekday_summary[weekday] = data_new[i].value;
	}
	else
	{
		weekday_count[weekday] += 1;
		weekday_summary[weekday] += data_new[i].value;
	}
}

console.log(weekday_count)
console.log(weekday_summary)

for (var i=0; i<weekday_summary.length;i++)
{
	weekday_data.push({
		"index": weekday_index[i],
		"average": weekday_summary[i] / weekday_count[i]
	})
}

draw_3();
///////////////////////////////////
function draw_3(){
  d3.select("#svg_graph3").remove();
var margin_3 = {top: 20, right: 20, bottom: 30, left: 10},
    width_3 = document.getElementById("weekBarChart").offsetWidth - margin_3.left - margin_3.right,
    height_3 = document.getElementById("weekBarChart").offsetWidth - margin_3.top - margin_3.bottom;

// var width_3 = 800;
// var height_3 = 600;

var x_3 = d3.scale.ordinal()
    .rangeRoundBands([0, width_3], .1);

var y_3 = d3.scale.linear()
    .range([height_3, 0]);

var xAxis_3 = d3.svg.axis()
    .scale(x_3)
    .orient("bottom");

var yAxis_3 = d3.svg.axis()
    .scale(y_3)
    .orient("left")
    .ticks(10, "%");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Average:</strong> <span style='color:red'>" + Math.floor(d.average) + "</span>";
  })

var svg_3 = d3.select("#weekBarChart").append("svg")
.attr("id", "svg_graph3")
    .attr("width", width_3 + margin_3.left + margin_3.right)
    .attr("height", height_3 + margin_3.top + margin_3.bottom)
  .append("g")
    .attr("transform", "translate(" + 0 + "," + margin_3.top + ")");

svg_3.call(tip);

  x_3.domain(weekday_data.map(function(d) { return d.index; }));
  y_3.domain([0, d3.max(weekday_data, function(d) { return d.average; })]);

  svg_3.append("g")
      .attr("class", "x axis")
      .attr("id", "bar_text")
      .attr("transform", "translate(0," + height_3 + ")")
      .call(xAxis_3);

  // svg_3.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis_3)
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Frequency");

  svg_3.selectAll(".bar")
      .data(weekday_data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x_3(d.index); })
      .attr("width", x_3.rangeBand())
      .attr("y", function(d) { return y_3(d.average); })
      .attr("height", function(d) { return height_3 - y_3(d.average); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
    }