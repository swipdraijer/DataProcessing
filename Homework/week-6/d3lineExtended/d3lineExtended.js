// Swip Draijer
// 10192239
// Data Processing
// Creates D3 line

// // Create filter
// function filterJSON(json, key, value) {
//   var result = [];
//   json.forEach(function(val,idx,arr){
//     if(val[key] == value){
    
//       result.push(val)
//     }
//   })
//   return result;
// }

// Format date
var formatDate = d3.time.format("%Y%m%d").parse,
bisectDate = d3.bisector(function(d) { return d.date; }).left,
formatTime = d3.time.format("%d %B");

var station = []
var station_key = "240"
var station_name;

// Define margins
var width_outer = 1200
var height_outer = 600

 var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
      },
width_inner = width_outer - margin.left - margin.right,
  height_inner = height_outer - margin.top - margin.bottom;

// var margin = {top: 10, right: 80, bottom: 60, left: 80},

// Create svg
var svg = d3.select("body").append("svg")
    .attr("width", width_outer)
    .attr("height", height_outer)
    .append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Define scales
var x = d3.time.scale.utc().range([0, width_inner]),
  y = d3.scale.linear().range([height_inner, 0])
  // z = d3.scale.linear().range([height_inner, 0])

var color = d3.scale.category10();

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
    var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.temperature);
      });

// Read data from json
d3.json("knmi.json", function(data) {

	// Create subset of data for selected station
	for (var i = 0; i < data.length; i++) {
	  	
	  // if (data[i]["station"] == station_key) {
	  		
	  	station.push(data[i])
	  	
	  // };

  };

  color.domain(d3.keys(station[0]).filter(function(key) {
      return key !== "date";
    }));

	station.forEach(function(d) {

  	d.date = formatDate(d.date)
  	d.avg = +d.avg / 10
    d.min = +d.min / 10
    d.max = +d.max / 10
  		
	return d;

 	});

var weather = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            date: d.date,
            temperature: +d[name]
          };
        })
      };
    });

// Select station as data source
d3.select('#inds')
  .on("change", function () {
        
    var selection = document.getElementById("inds");
    var key = selection.options[selection.selectedIndex].value;
    station_key = key
    station_name = key

    // draw(data[key].values) 

    // data = filterJSON("knmi.json", 'station', selection);

    // if (station_key = "240") {
    //   station_name = "Schiphol"
    // }
    // else if (station_key = "380") {
    //   station_name = "Maastricht"
    // }

    console.log(typeof(station_key))
    console.log(station_key)

    });

  // function draw(data)
    	svg.append("text")
    		.attr("x", width_inner / 2)
    		.attr("y", margin.top)
    		.attr("text-anchor", "middle")
    		.style("font-size", "20px") 
            .style("text-decoration", "underline")  
            .text("Daily Temperatures 2016");

      x.domain(d3.extent(station, function(d) {
        return d.date;
      }));
      

      y.domain([
        d3.min(weather, function(c) {
          return d3.min(c.values, function(v) {
            return v.temperature;
          });
        }),
        d3.max(weather, function(c) {
          return d3.max(c.values, function(v) {
            return v.temperature;
          });
        })
      ]);

    	// x.domain(d3.extent(station, function(d) { return d.date; }))
    	// y.domain([
     //     d3.min(station, function(d) { return d.min }),
     //     d3.max(station, function(d) { return d.max })
     //  ])
  	 
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

    	// Creates left y axis
    	svg.append("g")
          .attr("class", "left y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
      	  .attr("y", margin.left / 4)
          .attr("dy", "-3.5em")
          .style("text-anchor", "end")
          .text("Temperature (°C)");

      var city = svg.selectAll(".city")
        .data(weather)
        .enter().append("g")
        .attr("class", "city");

    // Creates line
     city.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.name);
      });

      city.append("text")
      .datum(function(d) {
        return {
          name: d.name,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.name;
      });

      var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

      mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");


    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(weather)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

     mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");
      
       mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width_inner) // can't catch mouse events on a g element
      .attr('height', height_inner)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
          var mouse = d3.mouse(this);
          d3.select(".mouse-line")
            .attr("d", function() {
              var d = "M" + mouse[0] + "," + height_inner;
              d += " " + mouse[0] + "," + 0;
              return d;
            });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
     
});



 // svg.append("rect")
      //   .attr("width", width_inner)
      //   .attr("height", height_inner)
      //   .style("fill", "none")
      //   .style("pointer-events", "all")
      //   .on("mouseover", function() { focus.style("display", null); })
      //   .on("mouseout", function() { focus.style("display", "none"); })
      //   .on("mousemove", mousemove);
           
      // var focus = svg.append("g")
      //   .attr("class", "focus")
      //   .style("display", "none");

      // focus.append("circle")
      //   .attr("r", 4.5);

      // focus.append("text")
      //   .attr("class", "info")
      //   .attr("x", 9)
      //   .attr("dy", ".35em");
 
      // function mousemove() {
      //   var x0 = x.invert(d3.mouse(this)[0]),
      //       i = bisectDate(station, x0, 1),
      //       d0 = station[i - 1],
      //       d1 = station[i],
      //       d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      //   focus.attr("transform", "translate(" + x(d.date) + "," + y(d.min) + ")");
      //   focus.select("text")
      //    .text(formatTime(new Date(d.date)) + ": " + d.min + "°C");
      // }
    