var w = 1200,
    h = 1900,
    pad = 120,
    left_pad = 100,
    right_pad = 200,
    Data_url = 'StateLevelInfo.csv';

var lowColor = '#ebf5f9';
var highColor = '#163d50';

var svg_bm = d3.select("#bubble")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("x",200)
    .attr("y",600);

//add title to svg
svg_bm.append("text")
    .attr("class","maptext")
    .attr("x", (width / 2+110))
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Comparison of Hospital Charges for Insured vs Uninsured Patients (2014)");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        var u =  "<strong style = 'font-size:12px'>Uninsured Charge:</strong> <strong style='color:red;font-size:12px' align='right'>$ " + String(parseInt(d["Avg Uninsured Charge"])) + "</strong>";
        var i =  "<strong style = 'font-size:12px'>Insured Charge:</strong> <strong style='color:red;font-size:12px' align='right'>$ " + String(parseInt(d["Avg Insured Charge"])) + "</strong>";
        return u+"<br><br>"+i;
    });

svg.call(tip);



var x = d3.scaleLinear().domain([0, 16]).range([left_pad, w-right_pad]),
    y = d3.scaleLinear().domain([0, 50]).range([pad, h-pad*2]);




var xAxis = d3.axisTop(x)
            .ticks(17)
            .tickFormat(function (d,i)
            {return ['Alcohol/Drug Issues',
            'Blood & Immunology',
            'Circulatory System',
            'Digestive System',
            'Ear, Nose, Throat',
            'Endocrine & Metabolic System',
            'Female Reproductive System',
            'Infectious Diseases',
            'Kidney & Urinary Tract',
            'Liver & Pancreas',
            'Male Reproductive System',
            'Mental Disorders',
            'Musculoskeletal System',
            'Nervous System',
            'Poisonings',
            'Pregnancy & Childbirth',
            'Respiratory System'][d]}),

    yAxis = d3.axisLeft(y).ticks(51)
        .tickFormat(function (d, i) {
            return ['AL',
                'AK',
                'AZ',
                'AR',
                'CA',
                'CO',
                'CT',
                'DE',
                'DC',
                'FL',
                'GA',
                'HI',
                'ID',
                'IL',
                'IN',
                'IA',
                'KS',
                'KY',
                'LA',
                'ME',
                'MD',
                'MA',
                'MI',
                'MN',
                'MS',
                'MO',
                'MT',
                'NE',
                'NV',
                'NH',
                'NJ',
                'NM',
                'NY',
                'NC',
                'ND',
                'OH',
                'OK',
                'OR',
                'PA',
                'RI',
                'SC',
                'SD',
                'TN',
                'TX',
                'UT',
                'VT',
                'VA',
                'WA',
                'WV',
                'WI',
                'WY'][d];
        });


svg_bm.append("g")
    .attr("transform", "translate(0, "+(pad-20)+")")
    .call(xAxis)
    .selectAll(".tick text")
    .attr("y",function(d){
        if (d%2==0)
            return -35;
        else
            return -10;});



d3.selectAll(".tick line")
    .attr("y2",function(d){
        if (d%2==0)
            return -33;
        else
            return -7;});


svg_bm.append("g")
    .attr("transform", "translate("+(left_pad-70)+", 0)")
    .call(yAxis);



/*

d3.csv(Data_url, function (data) {
    var max_r = d3.max(data.map(
        function (d) {  var input =  d["Avg Uninsured Charge"]
            return parseFloat(input); })),
        r = d3.scaleLinear()
            //.domain([0, d3.max(data, function (d) { return d["Avg Uninsured Charge"]; })])
            .domain([0,max_r])
            .range([2, 16]);
    console.log(max_r);

    var ramp = d3.scaleLinear().domain([0,r(max_r)]).range([lowColor,highColor]);

    svg_bm.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) { return x(d["Procedure"]-1); })
        .attr("cy", function (d) { return y(d["State"]-1); })
        .transition()
        .duration(800)
        //.attr("r", function (d) { return r(8000); });
        .attr("r", function (d) { return r(d["Avg Uninsured Charge"]); })
        .style("fill", function(d) { return ramp(r(d["Avg Uninsured Charge"])) });

    svg_bm.selectAll("circle2")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circle2")
        .attr("cx", function (d) { return x(d["Procedure"]-1)+15; })
        .attr("cy", function (d) { return y(d["State"]-1); })
        .transition()
        .duration(800)
        //.attr("r", function (d) { return r(8000); })
        .attr("r", function (d) { return r(d["Avg Insured Charge"]); })
        .style("fill", function(d) { return ramp(r(d["Avg Insured Charge"])) });

});


*/


d3.csv(Data_url, function (data) {
    var max_r = d3.max(data.map(
        function (d) {  var input =  d["Avg Uninsured Charge"]
            return parseFloat(input); })),
        r = d3.scaleLinear()
        //.domain([0, d3.max(data, function (d) { return d["Avg Uninsured Charge"]; })])
            .domain([0,max_r])
            .range([4, 50]);
    console.log(max_r);

    var ramp = d3.scaleLinear().domain([0,r(max_r)]).range([lowColor,highColor]);

    svg_bm.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "rect")
        .attr("x", function (d) { return x(d["Procedure"]-1); })
        .attr("y", function (d) { return y(d["State"]-1); })
        .attr("height",5)
        //.transition()
        //.duration(800)
        //.attr("r", function (d) { return r(8000); });
        .attr("width", function (d) { return r(d["Avg Uninsured Charge"]); })
        .style("fill", '#163d50')
        .on('mouseover',tip.show)
        .on('mouseout',tip.hide);

    svg_bm.selectAll("rect2")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "rect2")
        .attr("x", function (d) { return x(d["Procedure"]-1); })
        .attr("y", function (d) { return y(d["State"]-1)+7; })
        .attr("height",4)
        .transition()
        .duration(800)
        //.attr("r", function (d) { return r(8000); });
        .attr("width", function (d) { return r(d["Avg Insured Charge"]); })
        .style("fill", "#e60000");

});


