window.onload = function() {


     var margin = {top: 20, right: 30, bottom: 30, left: 40},
    	width = 960 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;


    var x = d3.scale.ordinal()
    	.rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
    	.range([height, 0]);

   
    // console.log(margin.left)

    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");


    var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	d3.json("mammals.json", function(data) {
	x.domain(data.map(function(d) { return d.animal; }));
	y.domain([0, d3.max(data, function(d) { return d.body; })]);
		
	

	  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

      chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

      chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.animal); })
      .attr("y", function(d) { return y(d.body); })
      .attr("height", function(d) { return height - y(d.body); })
      .attr("width", x.rangeBand());


	});

	function type(d) {
	  d.body = +d.body; // coerce to number
	  return d;
	}

}