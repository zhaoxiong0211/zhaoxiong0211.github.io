var breakPoint = 768;
// var svgWidth = document.getElementById('barChart').clientWidth;
var length = document.getElementById('barChart').clientWidth < breakPoint ? 15 : 33;

var t = 1297110663,
    v = 70,
    data = d3.range(length).map(next);

function next() {
  return {
    time: ++t,
    value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5)))
  };
}

drawBar()

function drawBar(){

  d3.select("svg").remove();

  var w = (document.getElementById('barChart').clientWidth-40) / data.length,
      h = 280;

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
      .attr("height", h)
      .attr("transform", "translate(" + 20 + "," + 10 + ")");
  
  d3.select("#barChart").attr("align","center");
  // d3.select("#chart") //  thanks & +1 to chaitanya89

  chart1.selectAll("rect")
      .data(data)
    .enter().append("svg:rect")
      .attr("x", function(d, i) { return x(i) - .5; })
      .attr("y", function(d) { return h - y(d.value) - .5; })
      .attr("width", w)
      .attr("height", function(d) { return y(d.value); });


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
    var preLength = length;
    var curLength = document.getElementById('barChart').clientWidth < breakPoint ? 15 : 33;
    var dist = curLength - preLength;
    if (dist >=0){
      data.shift();
      for(var i=0;i<dist+1;i++) {
        data.push(next());
      }
    }
    else{
      for(var i=0;i<-dist+1;i++) {
        data.shift();
      }
      data.push(next());
    }
    length = curLength;
    redraw1();
  }, 1500);
}

setInterval(function() {
    var lastValue = data[data.length-1];
    document.getElementById('userAdd').textContent="New User in this Minute: " + lastValue.value;
},3000);

$( window ).resize(function() {
  drawBar();
});
