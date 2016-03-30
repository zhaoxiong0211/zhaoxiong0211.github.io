var t = 1297110663,
    v = 70,
    data = d3.range(33).map(next);

function next() {
  return {
    time: ++t,
    value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5)))
  };
}
console.log("123")
var w = 20,
    h = 300;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);

var y = d3.scale.linear()
    .domain([0, 100])
    .rangeRound([0, h]);

var chart1 = d3.select("#barChart")
  .append("svg:svg")
    .attr("class", "chart")
    .attr("width", w * data.length - 1)
    .attr("height", h);

chart1.selectAll("rect")
    .data(data)
  .enter().append("svg:rect")
    .attr("x", function(d, i) { return x(i) - .5; })
    .attr("y", function(d) { return h - y(d.value) - .5; })
    .attr("width", w)
    .attr("height", function(d) { return y(d.value); });

chart1.append("svg:line")
    .attr("x1", 0)
    .attr("x2", w * data.length)
    .attr("y1", h - .5)
    .attr("y2", h - .5)
    .attr("stroke", "#000");

redraw1();

function redraw1() {

  chart1.selectAll("rect")
      .data(data)
    .transition()
      .duration(1000)
      .attr("y", function(d) { return h - y(d.value) - .5; })
      .attr("height", function(d) { return y(d.value); });

}

setInterval(function() {
  data.shift();
  data.push(next());
  redraw1();
}, 1500);
