app.directive('geo', function(){
  function link(scope, el, attr){
      var margin_Width = 50,
          margin_Height = 50;

      var width = document.getElementById("geoCard").clientWidth - 2 * margin_Width,
          height = document.getElementById("geoCard").clientHeight - 2 * margin_Height;

      var projection = d3.geo.albersUsa()
          .scale(Math.min(width/780, height/454)*1000)
          .translate([width / 2, height / 2]);

      var path = d3.geo.path()
          .projection(projection);

      var svg = d3.select(el[0]).append("svg")
          .attr("width", width + 2 * margin_Width)
          .attr("height", height + 2 * margin_Height)
          .append("g")
          .attr("transform", "translate(" + margin_Width + "," + margin_Height + ")");

      svg.insert("path", ".graticule")
          .datum(topojson.feature(us, us.objects.land))
          .attr("class", "land")
          .attr("d", path);

      svg.insert("path", ".graticule")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) {
              return a !== b;
          }))
          .attr("class", "state-boundary")
          .attr("d", path);
      
      var colors = ["rgba(237,28,36,0.5)", "rgba(0,169,157,0.5)", "rgba(252,238,33,0.5)", "rgba(100,100,100,0.5)"]
      
      var colors_Detail = ["By Quantity", "By Dollar", "By Both", "Others"]
      
      var legendCir = svg.selectAll("legendCircle")
                      .data(colors)
                      .enter()
                      .append("circle")
                      .attr("class", "legendCircle")
                      .attr("cx", function (d,i) { return margin_Width + 10 +i*100; })
                      .attr("cy", function (d,i) { return 20; })
                      .attr("r", function (d) { 
                          return 6;
                        })
                      .style("fill", function(d) { return d;});
      
      var legendText = svg.selectAll("legendText")
                      .data(colors_Detail)
                      .enter()
                      .append("text")
                      .attr("class", "legendText")
                      .attr("x", function (d,i) { return margin_Width + 20 +i*100; })
                      .attr("y", function (d,i) { return 26; })
                      .text(function(d) { return d;});
      
      var circles = svg.selectAll("points");
      
      var div = d3.select(el[0]).append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);
    
      scope.$watch('data', update, true);
      update();
      
      function update(){
          svg.selectAll(".cityCircle").remove();
          svg.selectAll(".line").remove();
          svg.selectAll(".detail_Q").remove();
          svg.selectAll(".detail_D").remove();
          svg.selectAll("foreignobject").remove();
          
          var temData = scope.data;
          var temCities = [];
          for (var item in temData){
              var temPositionInMap = projection([cityInfo[item]["Longitude"],cityInfo[item]["Latitude"]]);
              if (temPositionInMap !== null){
                  temCities.push([temPositionInMap[0], temPositionInMap[1], temData[item].quantity, temData[item].dollar, item]);
              }
          }

          var quantityMax = d3.max(temCities, function(city){ return city[2]});
          var dollarMax = d3.max(temCities, function(city){ return city[3]});
          var quantityMin = d3.min(temCities, function(city){ return city[2]});

          var sizeRange = d3.scale.sqrt().domain([quantityMin, quantityMax]).range([4,20])

          circles.data(temCities)
              .enter()
              .append("circle")
              .attr("class", "cityCircle")
              .attr("cx", function (d) { return d[0]; })
              .attr("cy", function (d) { return d[1]; })
              .attr("r", function (d) { 
                  if (d[2] == quantityMax || d[3] == dollarMax) { return 20; }
                  return 4;
                })
              .style("fill", function(d) {
                  if (d[2] == quantityMax && d[3] == dollarMax) { return "rgba(252,238,33,0.5)"}
                  if (d[2] == quantityMax) { return "rgba(237,28,36,0.5)"; }
                  if (d[3] == dollarMax) { return "rgba(0,169,157,0.5)"; }
                  return "rgba(100,100,100,0.5)";
                })
               .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html(d[4].split("_")[0] + ", " + d[4].split("_")[1] + "</br>Quantity: " + d[2] + "</br>Dollar: " + d[3].toFixed(2))	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
          
          var quantityCity = [],
              dollarCity= [];
          
          temCities.forEach(function(d){
              if(d[2] == quantityMax){
                  quantityCity.push(d);
              }
              if(d[3] == dollarMax){
                  dollarCity.push(d);
              }
          })
                    
          var line_Q = svg.selectAll("lines")
                        .data(quantityCity)
                        .enter()
                        .append("line")
                        .attr("class","line")
                         .attr("x1", function(d){return d[0]})
                         .attr("y1", function(d){return d[1]})
                         .attr("x2", function(d){return d[0]})
                         .attr("y2", function(d){return Math.min(d[1]+200,height)})
                         .attr("stroke-width", 1)
                         .attr("stroke", "rgba(50,50,50,1)");
          
          var line_D = svg.selectAll("lines")
                        .data(dollarCity)
                        .enter()
                        .append("line")
                        .attr("class","line")
                         .attr("x1", function(d){return d[0]})
                         .attr("y1", function(d){return d[1]})
                         .attr("x2", function(d){return d[0]})
                         .attr("y2", function(d){return Math.max(d[1]-200,0)})
                         .attr("stroke-width", 1)
                         .attr("stroke", "rgba(50,50,50,1)");
          
          var text_Q = svg.selectAll("text_Q")
                        .data(quantityCity)
                        .enter()
                        .append("foreignObject")
                        .attr("x", function(d) { return Math.min(d[0]+10,width-120+margin_Width); })
                        .attr("y", function(d) { return Math.min(d[1]+20, height-170+margin_Height); })
                        .attr("width", 120)
                        .append("xhtml:div")
                        .attr("class", "detail_Q")
                        .html(function(d) {return "City</br>With Most</br>Transactions</br><span>By Quantity</span></br></br><span>" + d[4].split("_")[0] + "</span></br>" + d[4].split("_")[1] + ", Quantity: " + d[2]})
          
          var text_D = svg.selectAll("text_D")
                        .data(dollarCity)
                        .enter()
                        .append("foreignObject")
                        .attr("x", function(d) { return Math.max(-margin_Width,d[0]-130); })
                        .attr("y", function(d) { return Math.max(d[1]-200,0); })
                        .attr("width", 120)
                        .append("xhtml:div")
                        .attr("class", "detail_D")
                        .html(function(d) {return "City</br>With Most</br>Transactions</br><span>By Dollar</span></br></br><span>" + d[4].split("_")[0] + "</span></br>" + d[4].split("_")[1] + ", Dollar: " + d[3].toFixed(2)})

      }
      
  };
  return {
    link: link,
    restrict: 'E',
    scope: { data: '=' }
  };
});