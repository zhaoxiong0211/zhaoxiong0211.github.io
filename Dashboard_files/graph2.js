var display2 = {};
for(var i=0; i<data_new.length;i++)
{
    seconds = (data_new[i].date.getTime() / 1000).toString();
    display2[seconds] = data_new[i].value;
}

JSON_file = JSON.stringify(display2);
var url = URL.createObjectURL(new Blob([JSON_file], {type: "octet/stream"}));
console.log(url)

var cal = new CalHeatMap();
cal.init({
    itemSelector: "#cal-heatmap",
    domain: "month",
    subDomain: "x_day",
    itemName: ["Step", "Steps"],
    data: url,
    start: new Date(min.date.getYear()+1900, min.date.getMonth(), min.date.getDate()),
    cellSize: 30,
    cellPadding: 5,
    cellRadius: 15,
    domainMargin: 10,
    domainGutter: 20,
    range: 3,
    tooltip: true,
    domainDynamicDimension: false,
    displayLegend: false,
    previousSelector: "#cal-heatmap-PreviousDomain-selector",
    nextSelector: "#cal-heatmap-NextDomain-selector",
    subDomainTextFormat: "%d",
    domainLabelFormat: "%m-%Y",
    legend: [1000, 4000, 6000, 8000, 10000],
    legendColors: ["#f4decd", "#d9534f"],
});