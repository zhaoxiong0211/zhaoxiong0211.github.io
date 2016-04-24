console.log(data);

var width = document.getElementById("graph").clientWidth,
    height = document.getElementById("graph").clientHeight,
    margin = 20,
    graphMarginLeft = 200,
    graphMarginRight = 50;

var rMax = d3.max(data, function(d) {return d.value}),
    rMin = d3.min(data, function(d) {return d.value}),
    rRangeMin = height/2 - margin-150,
    rRangeMax = height/2 - margin;

var colorGray = "#CCCCCC",
    colorYellow = "rgb(230,206,0)",
    colorDarkGray = "#666666";

var scale = d3.scale.linear()
            .domain([rMin, rMax])
            .range([rRangeMin, rRangeMax]);

var g = d3.select("#graph")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

// circles, line and text
var circles = g.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class","circle")
                .attr("cx", function (d) { return height/2+graphMarginLeft; })
                .attr("cy", function (d) { return height/2; })
                .attr("r", function (d) { return scale(d.value); })
                .attr("fill", "none")
                .style("stroke", function(d) { return colorGray; })
                .style("stroke-width", "1px")
                .on("mouseover",function(d,i){
                    circles.transition()
                        .duration(1)
                        .style("stroke", function(d,j) { 
                            return i==j ? colorYellow : colorGray; 
                        })
                        .style("stroke-width", function(d,j) { 
                                return i==j ? "2px": "1px"; 
                        })
                    line.transition()
                        .duration(1)
                        .attr("x1", function (d) { 
                            return (height/2+200)-scale(data[i].value); 
                        })
                    textValue.transition()
                        .duration(1)
                        .text(function(d) {return data[i].value;})
                    
                    var cities = document.getElementsByClassName("city");
                    
                    for(var n=0; n<cities.length; n++){
                        city = cities[n];
                        city.classList.toggle("visible", n==i);
                    }
                });

var line = g.selectAll("line")
                .data([data[0]])
                .enter()
                .append("line")
                .attr("x1", function (d) { return (height/2+graphMarginLeft)-scale(d.value); })
                .attr("y1", height/2)
                .attr("x2", function (d) { return margin; })
                .attr("y2", height/2)
                .attr("stroke-width", 1)
                .attr("stroke", colorYellow);

var textValue = g.selectAll("text")
                .data([data[0]])
                .enter()
                .append("text")
                .attr("x", margin)
                .attr("y", height/2)
                .attr("dy", "-.3em")
                .text(function(d) {return d.value;})
                .attr("font-size", "54px")
                .attr("fill", colorYellow);

var textValueInfo = g.append("text")
                .attr("x", margin)
                .attr("y", height/2)
                .attr("dy", "1.3em")
                .text("square feet per person")
                .attr("font-size", "13px")
                .attr("fill", colorGray);

// left-top info
var textInfo = g.append("text")
                .attr("x", margin)
                .attr("y", 80)
                .attr("dy", "-.8em")
                .text("PERSONAL SPACE")
                .attr("font-size", "10px")
                .attr("fill", colorDarkGray);

var lineTopLeft = g.append("line")
                .attr("x1", function (d) { return (height/2+graphMarginLeft)-scale(rMax); })
                .attr("y1", 80)
                .attr("x2", function (d) { return margin; })
                .attr("y2", 80)
                .attr("stroke-width", 1)
                .attr("stroke", colorGray);

// img
var img = g.append("svg:image")
            .attr("xlink:href", "../person.png")
            .attr("x", (height/2+graphMarginLeft)-rRangeMin*0.6/2)
            .attr("y", height/2-rRangeMin*0.6/2)
            .attr("width", rRangeMin*0.6)
            .attr("height", rRangeMin*0.6);

// right list

var rightStart = height + graphMarginLeft + graphMarginRight,
    rightWidth = 250,
    rightListHeight = (height/2 - 80) * 2; 

var cityHeader = g.append("text")
                .attr("x", rightStart)
                .attr("y", 80)
                .attr("dy", "-.8em")
                .text("CITIES")
                .attr("font-size", "10px")
                .attr("fill", colorDarkGray);

var lineright = g.append("line")
                .attr("x1", rightStart)
                .attr("y1", 80)
                .attr("x2", rightStart + rightWidth)
                .attr("y2", 80)
                .attr("stroke-width", 1)
                .attr("stroke", colorGray);
	
d3.select("#graph")
    .append("div")
    .attr("class", "listSpace")
    .attr("id", "listSpace1")
    .style("height", rightListHeight + "px")
    .style("width", (rightWidth/2-10) + "px")
    .style("transform", "translate(" + rightStart + "px" + "," + (-height + 80) + "px" + ")")

d3.select("#graph")
    .append("div")
    .attr("class", "listSpace")
    .attr("id", "listSpace2")
    .style("height", rightListHeight + "px")
    .style("width", (rightWidth/2-10) + "px")
    .style("transform", "translate(" + (rightStart+20) + "px" + "," + (-height+ 80) + "px" + ")")

var listSpace1 = document.getElementById("listSpace1");
var listSpace2 = document.getElementById("listSpace2");
var dataLength = data.length;

data.forEach(function(d,i) {
    if(i<dataLength/2){
        var node = document.createElement("LI");
        node.setAttribute("class","city");
        node.setAttribute("id","city_"+i);
        var textnode = document.createTextNode(d.city);
        node.appendChild(textnode);
        listSpace1.appendChild(node);
    }
    else{
        var node = document.createElement("LI");
        node.setAttribute("class","city");
        node.setAttribute("id","city_"+i);
        var textnode = document.createTextNode(d.city);
        node.appendChild(textnode);
        listSpace2.appendChild(node);
    }
})

// From list to svg
var tables = document.getElementsByClassName("listSpace");
for (var m=0; m<2; m++){
    table = tables[m];
    table.addEventListener("mouseover", function( event ) {
//        event.target.style.backgroundColor = colorYellow;
        peers = event.target.parentElement.childNodes
        for (var k=0; k<peers.length;k++){
            if (peers[k].classList.contains("visible")){
                peers[k].classList.remove("visible");
            }
        }
        cur = event.target.textContent;
        curID = event.target.id.split("_")[1];
        circles.transition()
                .duration(1)
                .style("stroke", function(d,j) {
                    return d.city == cur ? colorYellow : colorGray; 
                })
                .style("stroke-width", function(d,j) { 
                        return d.city == cur ? "2px": "1px"; 
                })
        line.transition()
            .duration(1)
            .attr("x1", function (d) { 
                return (height/2+200)-scale(data[curID].value); 
            })
        textValue.transition()
            .duration(1)
            .text(function(d) {return data[curID].value;})
    }, false);
}