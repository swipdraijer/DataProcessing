// Swip Draijer
// 10192239
// Data Processing
// Creates D3 line

// Format date
var formatDate = d3.time.format("%Y%m%d").parse,
bisectDate = d3.bisector(function(d) { return d.date; }).left,
formatTime = d3.time.format("%d %B");

// Select station as data source
var station = []
var station_key = "240"

// Define margins
var width_outer = 1200
var height_outer = 600
var margin = {top: 10, right: 60, bottom: 60, left: 60},
    width_inner = width_outer - margin.left - margin.right,
    height_inner = height_outer - margin.top - margin.bottom;

// Create svg
var svg = d3.select("body").append("svg")
    .attr("width", width_outer)
    .attr("height", height_outer)
    .append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Define scales
var x = d3.time.scale.utc().range([0, width_inner]),
  y = d3.scale.linear().range([height_inner, 0])
  z = d3.scale.linear().range([height_inner, 0])

  // z = d3.scaleOrdinal(d3.schemeCategory10);
   
// Define x axis
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.outerTickSize(1)

// Define y axis
var yAxis = d3.svg.axis()
		.scale(y)
		.ticks(4)
		.orient("left").ticks(5)
		.outerTickSize(1);

// Draw line function
var line1 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.min); })
    .interpolate("basis");

var line2 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.max); })
    .interpolate("basis");

var line3 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rain); })
    .interpolate("basis");

// Read data from json
d3.json("knmi.json", function(data) {

	// Create subset of data for selected station
	for (var i = 0; i < data.length; i++) {
	  	
	  	if (data[i]["station"] == station_key) {
	  		
	  		station.push(data[i])
	  	
	  	};

	};

  	station.forEach(function(d) {

		d.date = formatDate(d.date)
		d.min = +d.min / 10
    d.max = +d.max / 10
		d.rain = +d.rain / 10
		
		return d;
	
   	});

	svg.append("text")
		.attr("x", width_inner / 2)
		.attr("y", margin.top)
		.attr("text-anchor", "middle")
		.style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text("Daily Max Temperatures 2016, Schiphol");

  	x.domain(d3.extent(station, function(d) { return d.date; }))
  	y.domain([
       d3.min(station, function(d) { return d.min }),
       d3.max(station, function(d) { return d.max })
    ])
	 
    // z.domain(cities.map(function(c) { return c.id; }));

 	// Creates x axis
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height_inner + ")")
	  .call(xAxis)
	.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(0)")
		.attr("x", width_inner - margin.right)
		.attr("dy", "3em")
		.style("text-anchor", "end")
		.text("Date (month)");

	// Creates y axis
	svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
  	  .attr("y", margin.left / 4)
      .attr("dy", "-3.5em")
      .style("text-anchor", "end")
      .text("Temperature (°C)");

  // Creates line
  svg.append("path")
	  .attr("class", "line1")
	  .attr("d", line1(station))
    .style("stroke", "red")

  svg.append("path")
    .attr("class", "line2")
    .attr("d", line2(station))
    .style("stroke", "green")
  
      svg.append("path")
    .attr("class", "line3")
    .attr("d", line3(station))
   
     // .style("stroke", function(d) { return z(d.id); });

  var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("circle")
    .attr("r", 4.5);

  focus.append("text")
    .attr("class", "info")
    .attr("x", 9)
    .attr("dy", ".35em");

  svg.append("rect")
    .attr("width", width_inner)
    .attr("height", height_inner)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(station, x0, 1),
        d0 = station[i - 1],
        d1 = station[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.max) + ")");
    focus.select("text")
    	.text(formatTime(new Date(d.date)) + ": " + d.max + "°C");
 	}
    

});