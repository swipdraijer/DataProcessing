window.onload = function() {
	
    // Set margins
    var margin = {top: 20, right: 40, bottom: 200, left: 80},
    	width = 960 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

	// Set chart 
	var chart = d3.select(".chart")
	    .attr("width", width + margin.left + margin.right)
	   	 .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	   	 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set x-axis
    var x = d3.scale.ordinal()
    	.rangeRoundBands([0, width], .1);

    var xAxis = d3.svg.axis()
		.scale(x)
	    .orient("bottom");
	
	// Set x-axis title
	chart.append("text")
	    .attr("x", width / 2 )
	    .attr("y",  height + margin.bottom)
	    .style("text-anchor", "right")
	    .text("Animals")
	    .style("font-weight", "bold")
	    .style("font-size","20px");

    // Set y-axis
    var y = d3.scale.linear()
    	.range([height, 0]);
 
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "");

	// Set y-axis title
	chart.append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0 - margin.left)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "30px")
	    .style("text-anchor", "middle")
	    .text("brain/body (%)")
	    .style("font-weight", "bold")
	    .style("font-size","20px");

  	// Set d3-tip
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<strong>Animal:</strong> <span style='color:steelblue'>" + d.animal + "</span>" +
	    "<br><strong>Ratio brain/body:</strong> <span style='color:red'>" + d.percbrain + "%</br></span>";
   	  })

	chart.call(tip);

	// Get data
	d3.json("mammals.json", function(data) {
		
		data.forEach(function(d) {
      	  d.body = +d.body;
      	  d.brain = +d.brain;
        });

		// Scale the range of the data
		x.domain(data.map(function(d) { return d.animal; }));
		y.domain([0, d3.max(data, function(d) { return d.percbrain; })]);
		
		// Set x of bars and labels
		chart.append("g")
      		.attr("class", "x axis")
      		.attr("transform", "translate(0," + height + ")")
      		.call(xAxis)
	 	  .selectAll("text")
		    .attr("y", 0)
		    .attr("x", 9)
		    .attr("dy", ".50em")
		    .attr("transform", "rotate(70)")
		    .style("text-anchor", "start")
	
		// Set y of bars and labels
	    chart.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	      .append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 0 - margin.left)
			  // .attr("dy", ".91em")
			  .style("text-anchor", "end")
		
		// Set bars
	    chart.selectAll(".bar")
	      .data(data)
	      .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.animal); })
		      .attr("y", function(d) { return y(d.percbrain); })
		      .attr("height", function(d) { return height - y(d.percbrain); })
		      .attr("width", x.rangeBand())
		      .on('mouseover', tip.show)
	    	  .on('mouseout', tip.hide);

         });
}

  