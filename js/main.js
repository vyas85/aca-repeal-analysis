//Width and height of map
var width = 800;
var height = 500;

var lowColor = '#ebf5f9'
var highColor = '#163d50'

// D3 Projection
var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("display","blocks");



//add title to svg
svg.append("text")
    .attr("class","maptext")
    .attr("x", (width / 2+110))
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Percent Increase in Insured Patients by State (2010-2015)");


// Load in my states data!
d3.csv("UninsuredChange.csv", function(data) {
    var dataArray = [];

    for (var d = 0; d < data.length; d++) {
        dataArray.push(parseFloat(data[d].Change))
    }
    console.log(dataArray);
    var minVal = d3.min(dataArray)
    var maxVal = d3.max(dataArray)
    var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])

    // Load GeoJSON data and merge with states data
    d3.json("us-states.json", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

            // Grab State Name
            var dataState = data[i].State;

            // Grab data value
            var dataValue = data[i].Change;

            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;

                    // Stop looking through the JSON
                    break;
                }
            }
        }

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([40, 0])
            .html(function(d) {
                return "<strong style = 'font-size:12px'>"+d.properties.name+"</strong> <strong style='color:red;font-size:12px'>" + d.properties.value + " %</strong>";
            });

        svg.call(tip);




        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) { return ramp(d.properties.value) })
            .on('mouseover',tip.show )
            .on('mouseout',tip.hide)
            /*.on('mouseout', function() {
                d3.select(".d3-tip")
                    .transition()
                    .delay(2000)
                    .duration(600)
                    .style("opacity",0)
                    .style('pointer-events', 'none')
            })*/;

        // add a legend
        var w = 140, h = 300;

        var key = d3.select("#map")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "legend");

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", highColor)
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", lowColor)
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w - 100)
            .attr("height", h)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([h, 0])
            .domain([minVal, maxVal]);

        var yAxis = d3.axisRight(y);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(41,10)")
            .call(yAxis);


    });
});
