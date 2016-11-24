window.onload = function() {

    // Set margins
    var margin = {top: 20, right: 30, bottom: 150, left: 60},
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
	    .style("font-weight", "bold");

    // Set y-axis
    var y = d3.scale.linear()
    	.range([height, 0]);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "kg");

	// Set y-axis title
	chart.append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0 - margin.left)
	    .attr("x", 0 - (height / 2))
	    .attr("dy", "1em")
	    .style("text-anchor", "middle")
	    .text("Weight (kg)")
	    .style("font-weight", "bold");

  	// Set d3-tip
	var tip = d3.tip()
  	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<strong>Weight (kg):</strong> <span style='color:red'>" + d.brain + "</span>";
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
		y.domain([0, d3.max(data, function(d) { return d.brain; })]);
		
		// Set x of bars and labels
		chart.append("g")
      		.attr("class", "x axis")
      		.attr("transform", "translate(0," + height + ")")
      		.call(xAxis)
	 	  .selectAll("text")
		    .attr("y", 0)
		    .attr("x", 9)
		    .attr("dy", ".35em")
		    .attr("transform", "rotate(90)")
		    .style("text-anchor", "start")
		  	
		// Set y of bars and labels
	    chart.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	      .append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 0 - margin.left)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
		
		// Set bars
	    chart.selectAll(".bar")
	      .data(data)
	      .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.animal); })
		      .attr("y", function(d) { return y(d.brain); })
		      .attr("height", function(d) { return height - y(d.brain); })
		      .attr("width", x.rangeBand())
		      .on('mouseover', tip.show)
	    	  .on('mouseout', tip.hide);

         });

}

    //     	d3.selectAll(".rectangle")
    //        		.transition()
	   //          .attr("height", function(d){
				// 	return height - y(+d[selection.value]);
				// })
				// .attr("x", function(d, i){
				// 	return (width / data.length) * i ;
				// })
				// .attr("y", function(d){
				// 	return y(+d[selection.value]);
				// })
    //        		.ease("linear")
    //        		.select("title")
    //        		.text(function(d){
    //        			return d.State + " : " + d[selection.value];
    //        		});
      
    //        	d3.selectAll("g.y.axis")
    //        		.transition()
    //        		.call(yAxis);	

	   //  var selector = d3.select("#drop")
    // 	.append("select")
    // 	.attr("id","dropdown")
    // 	.on("change", function(d){
    //     	selection = document.getElementById("dropdown");

    //     	y.domain([0, d3.max(data, function(d){
				// return +d[selection.value];})]);

    //     	yAxis.scale(y);

    // selector.selectAll("option")
    //   .data(elements)
    //   .enter().append("option")
    //   .attr("value", function(d){
    //     return d;
    //   })
    //   .text(function(d){
    //     return d;
    //   })


	// });

