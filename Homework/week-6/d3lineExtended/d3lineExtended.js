// Swip Draijer
// 10192239
// Data Processing
// Creates D3 line

// Define margins
var width_outer = 1200
var height_outer = 600

var margin = {
        top: 50,
        right: 180,
        bottom: 100,
        left: 100
      },
  width_inner = width_outer - margin.left - margin.right,
  height_inner = height_outer - margin.top - margin.bottom;

// Format date function
var formatDate = d3.time.format("%Y%m%d").parse,
  bisectDate = d3.bisector(function(d) { return d.date; }).left,
  formatTime = d3.time.format("%d %B");

// Define scales
var x = d3.time.scale.utc().range([0, width_inner]),
  y = d3.scale.linear().range([height_inner, 0]), 
  color = d3.scale.category10();

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

// Create line functions
var line_avg = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.avg); })
  .interpolate("cardinal");

var line_min = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.min); })
  .interpolate("cardinal");
  
var line_max = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.max); })
  .interpolate("cardinal");

function test() { console.log("test") }

// Define datasets
var knmi2014,
  knmi2015,
  knmi2016;

// Queue data for quick loading
queue()
  .defer(d3.json, 'knmi2014.json')
  .defer(d3.json, 'knmi2015.json')
  .defer(d3.json, 'knmi2016.json')
  .await(load);

function prepare(data) {

  data.forEach(function(d) {

    d.date = formatDate(d.date);
    d.avg = +d.avg / 10;
    d.min = +d.min / 10;
    d.max = +d.max / 10;
    return d;

  });

}

function load(error, knmi2014, knmi2015, knmi2016) {
  
  if(error) { console.log(error); }

  prepare(knmi2014)
  prepare(knmi2015)
  prepare(knmi2016)

  var year = "2014"
  drawGraph(knmi2014)

function drawGraph (data) {

  // Remove graph
  d3.selectAll("svg").remove();

  // Create svg
  var svg = d3.select("body").append("svg")
      .attr("width", width_outer)
      .attr("height", height_outer)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // Add title
	svg.append("text")
		.attr("x", width_inner / 2)
		.attr("y", 0 - margin.top / 2)
		.attr("text-anchor", "middle")
		.attr("class", "title")
      .text("Daily temperatures during the summer at Schiphol (NL)");

  // Define domains
  x.domain(d3.extent(data, function(d) { return d.date; }))
  y.domain([0, d3.max(data, function(d) { return Math.max(d.max) + 5 })])
 
 	// Create x axis
	svg.append("g")
	  .attr("class", "x_axis")
	  .attr("transform", "translate(0," + height_inner + ")")
	  .call(xAxis)
	.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(0)")
		.attr("x", width_inner)
		.attr("dy", "3.5em")
		.style("text-anchor", "end")
		.text("Date (month)")
    .style("font-weight", "bold");

	// Create y axis
	svg.append("g")
      .attr("class", "y_axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
  	  .attr("y", margin.left / 5)
      .attr("dy", "-3.5em")
      .style("text-anchor", "end")
      .text("Temperature (°C)")
      .style("font-weight", "bold")
  
  // Draw average temperature line 
  svg.append("path")
      .attr("class", "line_avg")
    .attr("d", line_avg(data));
  
  // Draw minimum temperature line 
  svg.append("path")
      .attr("class", "line_min")
    .attr("d", line_min(data));
  
  // Draw maximum temperature line  
  svg.append("path")
      .attr("class", "line_max")
    .attr("d", line_max(data));

  // Create focus points
  function makeFocus(){
    
    var focus = svg.append("g")
    .attr("class", "focus dynobj")
    .style("display","none");
    
    return focus;

  }

  var focus1 = makeFocus(),
    focus2 = makeFocus(),
    focus3 = makeFocus();

  // Define date holder and add text
  var dateHolder = svg.append("g")
    .attr("class", "dateholder dynobj")
    .style("display", "none");    

  d3.select(".dateholder").append("text")
    .attr("x", innerWidth / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")

  // Append text to focus
  d3.selectAll(".focus").append("text")
    .attr("class", "info")
    .attr("x", 10)
    .attr("dy", ".4em");

   // Append circle to focus
  d3.selectAll(".focus").append("circle")
    .attr("id", "focusCircles")
    .attr("class", "circle")
    .attr("r", 3.5);

  // Define mouse listener events
  svg.append("rect")
    .attr("width", width_inner)
    .attr("height", height_inner)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function() { d3.selectAll(".dynobj").style("display", null); })
    .on("mouseout", function() { d3.selectAll(".dynobj").style("display", "none"); })
    .on("mousemove", mousemove);

  // Add text info to focus
  function mousemove() {
  var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      focus1.attr("transform","translate(" + (x(d.date)) + "," + y(d.avg) + ")");
      focus1.select("text").text("Average: " + d.avg + "°C");

      focus2.attr("transform","translate(" + (x(d.date)) + "," + y(d.min) + ")");
      focus2.select("text").text("Min: " + d.min + "°C");

      focus3.attr("transform","translate(" + (x(d.date)) + "," + y(d.max) + ")");
      focus3.select("text").text("Max: " + d.max + "°C");

      dateHolder.select("text").text("Temperature on " + formatTime(new Date(d.date)) + " " + year + ":");
  } 

  };

     
d3.select('#inds')
  .on("change", function () {

  var selection = document.getElementById("inds");
  year = selection.options[selection.selectedIndex].value;
  
    if (year == 2014) {
      drawGraph(knmi2014)
    }
    else if (year == 2015) {
      drawGraph(knmi2015);
    }
    else if (year == 2016) {
      drawGraph(knmi2016);
    }

  });

};