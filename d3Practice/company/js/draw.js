var companyName = document.getElementById("companyName")
companyName.style.lineHeight = companyName.clientHeight + "px";


// d3 from here
var margin = {top: 50, right: 0, bottom: 30, left: 60},
    width = document.getElementById("scatter").clientWidth - margin.left - margin.right,
    height = document.getElementById("scatter").clientHeight - margin.top - margin.bottom;

var brandInfo = {"name": "Apple", "followers":28392,"employees":9743,"commitment":21.35,"publications":8}

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
//    .range([0,10000])
    .tickValues([2000, 4000, 6000, 8000])
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues([0, 50, 100, 150, 200, 250])
    .orient("left");

var lineFunction = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
    .interpolate("linear");

var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(error, data) {
    console.log(data)
  if (error) throw error;

  data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
  });

  x.domain([0,10000]);
  y.domain([0,250]);
    
    // Draw the x Grid lines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_axis()
        .tickSize(-height, 0, 0)
        .tickFormat("")
    )

    // Draw the y Grid lines
  svg.append("g")            
    .attr("class", "grid")
    .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat("")
    )
    

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 0)
      .attr("dx", "-.3em")
      .attr("dy", "1.35em")
      .style("text-anchor", "end")
      .text("Employees");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
//      .attr("transform", "rotate(-90)")
      .attr("y", -margin.top/2)
      .attr("dx", "1.5em")
      .style("text-anchor", "end")
      .text("Publications")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return 4*d.size; })
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .style("fill", function(d) { return d.color; })
      .attr("opacity","0")
      .on("click",function(d,i){ console.log(d,i); clickFunction(d,i);})
      .transition()
        .delay(function(d,i){return i*50})
        .duration(500)
        .attr("opacity","1")
        .attr("r", function(d) { return 2*d.size; })
    
    // function for the x grid lines
    function make_x_axis() {
        return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
    }

    // function for the y grid lines
    function make_y_axis() {
      return d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(5)
    }
    
    function clickFunction(clickedItem, idx){
        
        //////////////////////////////////////////////////////////////////////////////
        //////////////////////       Animation in D3      ////////////////////////////
        //////////////////////////////////////////////////////////////////////////////
        
        // arc animation
        var arc = d3.svg.arc()
                    .innerRadius(2*clickedItem.size+5)
                    .outerRadius(2*clickedItem.size+8)
                    .startAngle(0)
                    .endAngle(2 * Math.PI);
        
        var arc_2 = d3.svg.arc()
                    .innerRadius(2*clickedItem.size+5)
                    .outerRadius(2*clickedItem.size+10)
                    .startAngle(0)
                    .endAngle(2 * Math.PI);

        svg.append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("fill", clickedItem.color)
            .attr("opacity", "0")
            .attr("transform", "translate("+x(clickedItem.x)+","+y(clickedItem.y)+")")
            .transition()
                .duration(300)
                .ease("sin")
                .attr("opacity", "1")
                .attr("d", arc_2);
        
        svg.selectAll(".arc")
            .transition()
            .delay(300)
            .duration(300)
            .ease("sin")
            .attr("opacity", "0");
        
        // line animation
        var lineData = [{"x":clickedItem.x,"y":clickedItem.y},{"x":clickedItem.x,"y":clickedItem.y}]
        var lineData_2 = [{"x":clickedItem.x,"y":clickedItem.y},{"x":clickedItem.x,"y":0}]
        
        var lineGraph = svg.append("path")
                        .attr("class", "movingLine")
                        .attr("d", lineFunction(lineData))
                        .attr("stroke", clickedItem.color)
                        .attr("stroke-width", 2)
                        .attr("fill", "none")
                        .transition()
                            .duration(300)
                            .ease("exp")
                            .attr("d", lineFunction(lineData_2));
        
        svg.selectAll(".movingLine")
            .transition()
            .delay(300)
            .duration(300)
            .ease("exp")
            .attr("d", lineFunction(lineData));
        
        // bottom circle animation
        svg.append("circle")
              .attr("class", "bottomCircle")
              .attr("r", function(d) { return 2*clickedItem.size; })
              .attr("cx", function(d) { return x(clickedItem.x); })
              .attr("cy", function(d) { return y(0); })
              .style("fill", function(d) { return clickedItem.color; })
              .attr("opacity", "0")
              .transition()
                .delay(300)
                .duration(150)
                .ease("sin")
                .attr("opacity", "1")
        
        svg.selectAll(".bottomCircle")
            .transition()
            .delay(450)
            .duration(150)
            .ease("sin")
            .attr("opacity", "0");
        
        // clear all animation
        setTimeout(function(){
            svg.selectAll(".arc").remove()
            svg.selectAll(".movingLine").remove()
            svg.selectAll(".bottomCircle").remove()
        },600);
        
        //////////////////////////////////////////////////////////////////////////////
        //////////////////       Animation in Brand Info      ////////////////////////
        //////////////////////////////////////////////////////////////////////////////
        
        // Brand info change animation
        var follower = document.getElementById("followers"),
            employee = document.getElementById("employees"),
            commitment = document.getElementById("commitment"),
            publication = document.getElementById("publications")
        
        var follower_unit = brandInfo.followers / 60.0,
            employee_unit = brandInfo.employees / 60.0,
            commitment_unit = brandInfo.commitment / 60.0,
            publication_unit = brandInfo.publications / 60.0
    
        var count = 0;
        
        var brandInfoChange = setInterval(function(){
            follower.innerHTML = Math.round(follower_unit * count);
            employee.innerHTML = Math.round(employee_unit * count);
            commitment.innerHTML = (commitment_unit * count).toFixed(2);
            publication.innerHTML = Math.round(publication_unit * count);
            count += 1;
            if(count == 60){
                count = 0;
                follower.innerHTML = brandInfo.followers;
                employee.innerHTML = brandInfo.employees;
                commitment.innerHTML = brandInfo.commitment;
                publication.innerHTML = brandInfo.publications;
                clearInterval(brandInfoChange);
            }
        },10)
        
        // Brand name change animation
        
        companyName.style.opacity = 0;
        setTimeout(function(){
            companyName.innerHTML = brandInfo.name;
            companyName.style.opacity = 1;
        },300)
        
        
        // Brand logo animation
        var logo = document.getElementById("logo")
        logo.style.opacity = 0;
        logo.src = "apple.png";
        setTimeout(function(){
            logo.style.opacity = 1;
        },300);
    }

});
