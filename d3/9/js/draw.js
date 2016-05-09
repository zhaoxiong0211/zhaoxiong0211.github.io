var width = 960,
    height = 1160;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("./sfmaps/streets.json", function(error, sf) {
    if (error) return console.error(error);

    var projection = d3.geo.mercator()
        .center([-122.433701, 37.767683])
        .scale(250000)
        .translate([width / 2, height / 2]);
    
    var path = d3.geo.path()
        .projection(projection);
    
    svg.selectAll("path")
        .data(sf.features)
      .enter().append("path")
        .attr("d", path)
        .attr("fill","none")
        .attr("stroke","#999999");
})
