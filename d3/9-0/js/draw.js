var width = document.getElementById("canvas-svg").clientWidth,
    height = document.getElementById("canvas-svg").clientHeight;

var svg = d3.select("#canvas-svg").append("svg")
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
    
    var tagList = []
    d3.xml("http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni", function(error, data) {
        routeList = [].map.call(data.querySelectorAll("route"), function(route) {
            return {
              tag: route.getAttribute("tag"),
              title: route.getAttribute("title")
            };
        });
        
        routeList.forEach(function(route,i){
            // iDiv
            var iDiv = document.createElement('div');
            iDiv.id = 'route'+route.tag;
            iDiv.className = 'checkbox-inline';
            iDiv.innerHTML = '<label><input type="checkbox" value="" checked>' + route.tag + "</label>";
            document.getElementById('rList').appendChild(iDiv);
//            document.getElementById('rList').insertBefore(iDiv, document.getElementById('rList').nextSibling);

            // Now create and append to labelDiv
//            var labelDiv = document.createElement('label');
//            iDiv.innerHTML = '<label><input type="checkbox" value="">' + route.tag + "</label>";
//            iDiv.appendChild(labelDiv);            
        })
        
//        console.log(tagList.length);
        drawVehicle();
        
        function drawVehicle(){
            var milliseconds = (new Date).getTime() - 15*1000;
            routeList.forEach(function(route,i){
//                console.log(d,i)
                d3.xml("http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&r="+route.tag+"&t="+milliseconds, function(error, data) {
//                    console.log(data);
                    dataPosition = [].map.call(data.querySelectorAll("vehicle"), function(vehicle) {
                        return {
                          lat: parseFloat(vehicle.getAttribute("lat")),
                          lon: parseFloat(vehicle.getAttribute("lon"))
                        };
                    });
//                    console.log(dataPosition);

                    var circles = svg.selectAll("points")
                                  .data(dataPosition)
                                  .enter()
                                  .append("circle")
                                  .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
                                  .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
                                  .attr("r", function (d) { return 3; })
                                  .style("fill", function(d) { return "rgba(215,146,8,0.8)"; });

                })
            })
        }
    });
})
