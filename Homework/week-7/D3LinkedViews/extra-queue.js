// // Queue data for quick loading
// queue()
//   .defer(d3.csv, 'life_expectancy_GDP_2013.csv')
//   .defer(d3.csv, 'life_expectancy_GDP_2014.csv')
//   .await(test);

// function test () {
//   console.log("ready when you are!")
// }

// function prepare(data) {

//   // change string (from CSV) into number format
//   data.forEach(function(d) {
//     d.life = +d.life;
//     d.GDP = +d.GDP;
//   });

//   return d;

// };

// // function load(error, life_expectancy_GDP_2013, life_expectancy_GDP_2014) {
  
//   if(error) { console.log(error); }

//   prepare(life_expectancy_GDP_2013)
//   prepare(life_expectancy_GDP_2014)
  
//   var year = "2014"

// }


// function makeScatter (data) {

//   // // Remove graph
//   // d3.selectAll("svg").remove();

//   xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
//   yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

//   // x-axis
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height_inner + ")")
//       .call(xAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("x", width_inner)
//       .attr("y", margin.bottom)
//       .style("text-anchor", "end")
//       .text("Life expectancy at birth (years)");

//   // y-axis
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -margin.left)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("GDP per capita ($)");
    
//   // draw dots
//   svg.selectAll(".dot")
//       .data(data)
//     .enter().append("circle")
//       .attr("class", "dot")
//       .attr("r", 5)
//       .attr("cx", xMap)
//       .attr("cy", yMap)
//       .style("fill", "steelblue") 
//       .style("fill", function(d) { return cValue("CHN", d.country);}) 
    
//   svg.selectAll(".dot")
//       .on("mouseover", function(d) {
//           tooltip.transition()
//                .duration(100)
//                .style("opacity", .9);
//           tooltip.html(d.country + "<br/>" + "Life expectancy (years): " + formatNumber(xValue(d)) 
//           + ", " + "GDP per capita: " + "$" + formatNumber(yValue(d)))
//                .style("left", (d3.event.pageX + 5) + "px")
//                .style("top", (d3.event.pageY - 28) + "px");
//       })
//       .on("mouseout", function(d) {
//           tooltip.transition()
//                .duration(500)
//                .style("opacity", 0);

          
//       });
 
// d3.select('#range')
//   .on("change", function () {

//   var selection = document.getElementById("range");
//   year = selection.options[selection.selectedIndex].value;
  
//   console.log("test");

    // if (year == 2014) {
    //   drawGraph(knmi2014)
    // }
    // else if (year == 2015) {
    //   drawGraph(knmi2015);
    // }
    // else if (year == 2016) {
    //   drawGraph(knmi2016);
    // }

  // });

// };

// // setup fill color
// var cValue = function(selection, country) {
//       if (selection == country) {
//         return "orangered";    
//       }
//       else {
//         return "steelblue";
//       }

//     }