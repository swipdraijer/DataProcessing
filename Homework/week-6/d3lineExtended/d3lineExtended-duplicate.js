// Swip Draijer
// 10192239
// Data Processing
// Creates D3 line

// Define margins
var width_outer = 1400
var height_outer = 700

var margin = {
        top: 50,
        right: 80,
        bottom: 50,
        left: 80
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

// Draw line function
var line = d3.svg.line()
  .interpolate("cardinal")
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.temperature);
  });

// Read data from json
d3.json("knmi2016.json", function(data) {

queue()
  .defer(d3.json, 'knmi2014.json')
  .defer(d3.json, 'knmi2015.json')
  .defer(d3.json, 'knmi2016.json')
  .await(test);

  function test () { console.log ("test")}

  prepare(data)

function load(error, knmi2014, knmi2015, knmi2016) {
  data2014 = knmi2014;
  data2015 = knmi2015;
  data2016 = knmi2015;

  prepare(data2014);
  prepare(data2015);
  prepare(data2016);
  
  draw(data2016)

}

// Select year 
d3.select('#inds')
    .on("change", function () {
      console.log("select!");

    var selection = document.getElementById("inds");
    var year = selection.options[selection.selectedIndex].value;
    
    console.log(year);

    if (year == 2014) {
      draw(data2014)
    }
//   if (selfData == 2015) {
//     makeGraph(data15);
//   }
//   else {
//     makeGraph(data16);
//   }
// };

}); 


function prepare(data) {

  color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "date";
  }));

	data.forEach(function(d) {

  	d.date = formatDate(d.date);
  	d.avg = +d.avg / 10;
    d.min = +d.min / 10;
    d.max = +d.max / 10;
    return d;

 	});

}

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

draw(data)

function draw(data) {

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
  x.domain(d3.extent(data, function(d) {
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

  var legend = svg.selectAll('g')
    .data(weather)
    .enter()
    .append('g')
    .attr('class', 'legend');

  legend.append('rect')
    .attr('x', width_inner - 20)
    .attr('y', function(d, i) {
      return i * 20;
    })
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function(d) {
      return color(d.name);
    });

  legend.append('text')
    .attr('x', width_inner - 8)
    .attr('y', function(d, i) {
      return (i * 20) + 9;
    })
    .text(function(d) {
      return d.name;
    });

   	// Create x axis
  	svg.append("g")
  	  .attr("class", "x_axis")
  	  .attr("transform", "translate(0," + height_inner + ")")
  	  .call(xAxis)
  	.append("text")
  		.attr("fill", "#000")
  		.attr("transform", "rotate(0)")
  		.attr("x", width_inner / 2)
  		.attr("dy", "2.5em")
  		.style("text-anchor", "end")
  		.text("Date (month)");

  	// Create y axis
  	svg.append("g")
        .attr("class", "y_axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
    	  .attr("y", margin.left / 4)
        .attr("dy", "-3.5em")
        .style("text-anchor", "end")
        .text("Temperature (°C)");

    var temp = svg.selectAll(".temp")
      .data(weather)
      .enter().append("g")
      .attr("class", "temp");

  // Draw line
   temp.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.values);
    })
    .style("stroke", function(d) {
      return color(d.name);
    });

    temp.append("text")
    .datum(function(d) {
      return {
        name: d.name,
        value: d.values[d.values.length - 1]
      };
    })
    .attr("transform", function(d) {
      return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
    })

    // .attr("x", 3)
    // .attr("dy", ".35em")
    // .text(function(d) {
    //   return d.name;
    // });

    // Create mouse over values
    var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

    // Create vertical line
    mouseG.append("path") 
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
    
     mouseG.append('svg:rect') 
      .attr('width', width_inner) 
      .attr('height', height_inner)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { 
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { 
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { 
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
            else break; 
          }
          
          d3.select(this).select('text')
            .text(y.invert(pos.y).toFixed(2));
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
    });
     
  };

});

  // var temp = svg.selectAll(".temp")
    //   .data(weather)
    //   .enter().append("g")
    //   .attr("class", "temp");



  // // Draw line
  //  temp.append("path")
  //   .attr("class", "line")
  //   .attr("d", function(d) {
  //     return line(d.values);
  //   })
  //   .style("stroke", function(d) {
  //     return color(d.name);
  //   });

    // temp.append("text")
    // .datum(function(d) {
    //   return {
    //     name: d.name,
    //     value: d.values[d.values.length - 1]
    //   };
    // })
    // .attr("transform", function(d) {
    //   return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
    // })

    // .attr("x", 3)
    // .attr("dy", ".35em")
    // .text(function(d) {
    //   return d.name;
    // });

//     // Create mouse over values
//     var mouseG = svg.append("g")
//     .attr("class", "mouse-over-effects");

//     // Create vertical line
//     mouseG.append("path") 
//       .attr("class", "mouse-line")
//       .style("stroke", "black")
//       .style("stroke-width", "1px")
//       .style("opacity", "0");

//     var lines = document.getElementsByClassName('line');

//     var mousePerLine = mouseG.selectAll('.mouse-per-line')
//       .data(weather)
//       .enter()
//       .append("g")
//       .attr("class", "mouse-per-line");

//     mousePerLine.append("circle")
//       .attr("r", 7)
//       .style("stroke", function(d) {
//         return color(d.name);
//       })
//       .style("fill", "none")
//       .style("stroke-width", "1px")
//       .style("opacity", "0");

//     mousePerLine.append("text")
//       .attr("transform", "translate(10,3)");
    
//      mouseG.append('svg:rect') 
//       .attr('width', width_inner) 
//       .attr('height', height_inner)
//       .attr('fill', 'none')
//       .attr('pointer-events', 'all')
//       .on('mouseout', function() { 
//         d3.select(".mouse-line")
//           .style("opacity", "0");
//         d3.selectAll(".mouse-per-line circle")
//           .style("opacity", "0");
//         d3.selectAll(".mouse-per-line text")
//           .style("opacity", "0");
//       })
//       .on('mouseover', function() { 
//         d3.select(".mouse-line")
//           .style("opacity", "1");
//         d3.selectAll(".mouse-per-line circle")
//           .style("opacity", "1");
//         d3.selectAll(".mouse-per-line text")
//           .style("opacity", "1");
//       })
//       .on('mousemove', function() { 
//           var mouse = d3.mouse(this);
//           d3.select(".mouse-line")
//             .attr("d", function() {
//               var d = "M" + mouse[0] + "," + height_inner;
//               d += " " + mouse[0] + "," + 0;
//               return d;
//             });

//       d3.selectAll(".mouse-per-line")
//         .attr("transform", function(d, i) {
//           var xDate = x.invert(mouse[0]),
//               bisect = d3.bisector(function(d) { return d.date; }).right;
//               idx = bisect(d.values, xDate);
          
//           var beginning = 0,
//               end = lines[i].getTotalLength(),
//               target = null;

//           while (true){
//             target = Math.floor((beginning + end) / 2);
//             pos = lines[i].getPointAtLength(target);
//             if ((target === end || target === beginning) && pos.x !== mouse[0]) {
//                 break;
//             }
//             if (pos.x > mouse[0])      end = target;
//             else if (pos.x < mouse[0]) beginning = target;
//             else break; 
//           }
          
//           d3.select(this).select('text')
//             .text(y.invert(pos.y).toFixed(2));
//             return "translate(" + mouse[0] + "," + pos.y +")";
//           });
//     });
     
//   };

// });

  // color.domain(d3.keys(data[0]).filter(function(key) {
  //     return key !== "date";
  // }));

  // x.domain(d3.extent(data, function(d) {
  //   return d.date;
  // }));
  // y.domain([
  //   d3.min(weather, function(c) {
  //     return d3.min(c.values, function(v) {
  //       return v.temperature;
  //     });
  //   }),
  //   d3.max(weather, function(c) {
  //     return d3.max(c.values, function(v) {
  //       return v.temperature;
  //     });
  //   })
  //   ]);

  // var legend = svg.selectAll('g')
  //   .data(weather)
  //   .enter()
  //   .append('g')
  //   .attr('class', 'legend');

  // legend.append('rect')
  //   .attr('x', width_inner - 20)
  //   .attr('y', function(d, i) {
  //     return i * 20;
  //   })
  //   .attr('width', 10)
  //   .attr('height', 10)
  //   .style('fill', function(d) {
  //     return color(d.name);
  //   });

  // legend.append('text')
  //   .attr('x', width_inner - 8)
  //   .attr('y', function(d, i) {
  //     return (i * 20) + 9;
  //   })
  //   .text(function(d) {
  //     return d.name;
  //   });

  // var weather = color.domain().map(function(name) {
//       return {
//         name: name,
//         values: data.map(function(d) {
//           return {
//             date: d.date,
//             temperature: +d[name]
//           };
//         })
//       };
// });

// Draw line function
// var line = d3.svg.line()
//   .interpolate("cardinal")
//   .x(function(d) {
//     return x(d.date);
//   })
//   .y(function(d) {
//     return y(d.temperature);
//   });