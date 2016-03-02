var daylySteps = [0, 0, 0, 0]
var daylySteps_index = ["<3000", "3000-7000", "7000-10000", ">10000"]
var daily_sum = 0;

for(var i=0; i<data_new.length; i++)
{
	daily_sum += 1;
	if(data_new[i].value < 3000){
		daylySteps[0] += 1;
	}
	else if(data_new[i].value < 7000){
		daylySteps[1] += 1;
	}
	else if(data_new[i].value < 10000){
		daylySteps[2] += 1;
	}
	else{
		daylySteps[3] += 1;
	}
}

console.log(daylySteps);

var daylySteps_data = [];
for (var i=0; i<daylySteps.length;i++){
	daylySteps_data.push({
		"index": daylySteps_index[i],
		"value": daylySteps[i]
	})
};

////////////////////
draw_4();
function draw_4(){
  d3.select("#svg_graph4").remove();
var width_4 = document.getElementById("pieChart").offsetWidth,
    height_4 = document.getElementById("pieChart").offsetWidth,
    radius_4 = Math.min(width_4, height_4) / 2;
console.log(width_4,height_4,radius_4);
var τ = 2 * Math.PI; // http://tauday.com/tau-manifesto

var legendRectSize = 18;                                  // NEW
var legendSpacing = 4;                                    // NEW

var color_4 = d3.scale.ordinal()
    .range(["#f1d2bc", "#eaab8d", "#e69073", "#d9534f"]);

var color_list = ["#f1d2bc", "#eaab8d", "#e69073", "#d9534f"]

var arc_4 = d3.svg.arc()
    .outerRadius(radius_4 - 10)
    .innerRadius(80)
    .startAngle(0);

var labelArc_4 = d3.svg.arc()
    .outerRadius(radius_4 - 20)
    .innerRadius(radius_4 - 20);

var pie_4 = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

angle_data = pie_4(daylySteps_data);

var svg_4 = d3.select("#pieChart").append("svg")
.attr("id", "svg_graph4")
    .attr("width", width_4)
    .attr("height", height_4)
  .append("g")
    .attr("transform", "translate(" + width_4 / 2 + "," + height_4 / 2 + ")");

// Add the background arc, from 0 to 100% (τ).
var background = svg_4.append("path")
    .datum({endAngle: τ})
    .style("fill", "#ddd")
    .attr("d", arc_4);

// Add the foreground arc in orange, currently showing 12.7%.
var foreground_3 = svg_4.append("path")
    .datum({endAngle: 0})
    .style("fill", "#d9534f")
    .attr("d", arc_4);

var foreground_2 = svg_4.append("path")
    .datum({endAngle: 0})
    .style("fill", "#e69073")
    .attr("d", arc_4);

var foreground_1 = svg_4.append("path")
    .datum({endAngle: 0})
    .style("fill", "#eaab8d")
    .attr("d", arc_4);

var foreground_0 = svg_4.append("path")
    .datum({endAngle: 0})
    .style("fill", "#f1d2bc")
    .attr("d", arc_4);

// setTimeout(function() {
//   foreground.transition()
//       .duration(750)
//       .call(arcTween, Math.random() * τ);
// });
$("#pieChart").on('appear', function() {
console.log("appear");

foreground_3.transition()
      .duration(1750)
      .call(arcTween, angle_data[3].endAngle);

foreground_2.transition()
      .duration(1750)
      .call(arcTween, angle_data[2].endAngle);

foreground_1.transition()
      .duration(1750)
      .call(arcTween, angle_data[1].endAngle);

    foreground_0.transition()
      .duration(1750)
      .call(arcTween, angle_data[0].endAngle)

  var g_4 = svg_4.selectAll(".arc")
      .data(angle_data)
    .enter().append("g")
      .attr("class", "arc")
      .on("click", function(d){console.log(d);});

    g_4.append("text")
  	  .attr("id","pie_text")
      .attr("transform", function(d) { return "translate(" + labelArc_4.centroid(d) + ")"; })
      .attr("dy", ".35em")
       .attr("text-anchor", "middle") 
      .text(function(d) { return d3.round(d.data["value"]/daily_sum, 2)*100 + "%"; })
      .attr('opacity', 0)
       .transition()
      .duration(1750)
      .attr('opacity', 1);

   var legend = svg_4.selectAll('.legend')                     // NEW
          .data(color_list)                                   // NEW
          .enter()                                                // NEW
          .append('g')                                            // NEW
          .attr('class', 'legend')                                // NEW
          .attr('transform', function(d, i) {                     // NEW
            var height_tem = legendRectSize + legendSpacing;          // NEW
            var offset_tem =  height_tem * color_4.length / 2;     // NEW
            var horz = -1 * legendRectSize;                       // NEW
            var vert = i * height_tem - 4*offset_tem;                       // NEW
            return 'translate(' + horz + ',' + vert + ')';        // NEW
          });                                                     // NEW

        legend.append('rect')                                     // NEW
          .attr('width', legendRectSize)                          // NEW
          .attr('height', legendRectSize)                         // NEW
          .style('fill', function(d, i){return color_list[i];})                                   // NEW
          .style('stroke',  function(d, i){return color_list[i];});                                // NEW
          
        legend.append('text')                                     // NEW
          .attr('x', legendRectSize + legendSpacing)              // NEW
          .attr('y', legendRectSize - legendSpacing)              // NEW
          .text(function(d, i) { return daylySteps_index[i]; });                       // NEW


});


$("#pieChart").appear();

// Every so often, start a transition to a new random angle. Use transition.call
// (identical to selection.call) so that we can encapsulate the logic for
// tweening the arc in a separate function below.
function arcTween(transition, newAngle) {
	transition.attrTween("d", function(d) {
	var interpolate = d3.interpolate(d.endAngle, newAngle);

    return function(t) {

      d.endAngle = interpolate(t);
	  return arc_4(d);
    };
})
}

var div_4 = d3.select("#pieChart").append("div")
    .attr("class", "tooltip")
    .style("display", "none");
  }

// function pieChartClick(d) {
// 	console.log(d);
// }

  // var g_4 = svg.selectAll(".arc")
  //     .data(pie_4(daylySteps_data))
  //   .enter().append("g")
  //     .attr("class", "arc");

  // g_4.append("path")
  //     .attr("d", arc_4)
  //     .style("fill", function(d) { console.log(d); return color_4(d.data["index"]); });

  // g_4.append("text")
  // 	  .attr("id","pie_text")
  //     .attr("transform", function(d) { return "translate(" + labelArc_4.centroid(d) + ")"; })
  //     .attr("dy", ".35em")
  //      .attr("text-anchor", "middle") 
  //     .text(function(d) { return d.data["index"]; });