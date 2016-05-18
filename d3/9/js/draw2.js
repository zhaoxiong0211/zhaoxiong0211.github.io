app.directive('geo', function(){
  function link(scope, el, attr){
      var width = document.getElementById("canvas-svg").clientWidth,
          height = document.getElementById("canvas-svg").clientHeight;

        var svg = d3.select(el[0]).append("svg")
            .attr("width", width)
            .attr("height", height);
      
        var projection = d3.geo.mercator()
                .center([-122.433701, 37.767683])
                .scale(240000)
                .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        var size = d3.scale.linear()
                    .domain([-1, 50])
                    .range([4,10])
      
        var g = svg.append("g");

        d3.json("./sfmaps/streets.json", function(error, sf) {
            if (error) return console.error(error);

            g.selectAll("path")
                .data(sf.features)
              .enter().append("path")
                .attr("d", path)
                .attr("fill","none")
                .attr("stroke-width",1.5)
                .attr("stroke","rgba(96,164,218,0.8)");

            var circles = g.selectAll("points")
            
            scope.$watch('data', update, true);
            update();
            
            function update(){
                if(!scope.data){ return };            
                var data = scope.data;
                circles = circles.data(data)
                circles.exit().remove();
//                var circleCenter = circles.enter()
//                              .append("circle")
//                              .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
//                              .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
//                              .attr("r", function (d) { return size(d.speedKmHr)*0.5; })
//                              .style("fill", function(d) { return "rgba(197,0,26,0.8)"; });
                
                circles.enter()
                      .append("circle")
                      .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
                      .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
                      .attr("r", function (d) { return size(d.speedKmHr); })
                      .style("stroke", "black")
                      .style("stroke-width", 0)
                      .style("fill", function(d) { return "rgba(197,0,26,0.5)"; })
                      .on("mouseover", function(d,i){
                            console.log(d)
                        })
            }
            
            console.log(scope.filterli)
            scope.$watch('filterli', filterRoute, true);
            
            function filterRoute(){
                if(!scope.filterli){ return };   
                var filters = scope.filterli;
                console.log(filters);
                circles.transition()
                    .duration(200)
                    .style("stroke-width", function(d){
                        idx = filters.indexOf(d.tag);
                        console.log(idx, d.tag);
                        if(idx === -1){
                            return 0;
                        }
                        else{
                            return 2;
                        }
                    })
            }
            
            
        })
        
        // zoom and pan
        var zoom = d3.behavior.zoom()
            .on("zoom",function() {
                g.attr("transform","translate("+ 
                    d3.event.translate.join(",")+")scale("+d3.event.scale+")");
                g.selectAll("path")  
                    .attr("d", path); 
          });

        svg.call(zoom)
    };
  return {
    link: link,
    restrict: 'E',
    scope: { data: '=', filterli: '=' }
  };
});