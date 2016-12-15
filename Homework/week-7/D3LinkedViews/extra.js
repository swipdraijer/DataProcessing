// // Set d3-tip
// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     // return "test"
//     return "<strong>Year:</strong> <span style='color:orangered'>" + d.ages + "</span>" +
//     "<br><strong>Gender:</strong> <span style='color:orangered'>" + d.name + "</br></span>" +
//     "<br><strong>Life expectancy at birth:</strong> <span style='color:orangered'>" + formatNumber(d.value) + "</br></span>";
//   })    


// Reads data from csv
function chart(country) {

// Add title 
svg.append("text")
  .attr("class", "title")
  .attr("x", width_inner / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "20px") 
      .style("text-decoration", "underline")  
      .text("Life expectancy in " + country);

  svg.call(tip);

  d3.csv("life_expectancy_China.csv", function(error, data) {
  if (error) throw error;

  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "year"; });

  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.year; }));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height_inner + ")")
    .call(xAxis)
   .append("text")
      .attr("transform", "rotate(0)")
      .attr("x", width_inner)
      .attr("dy", "2em")
      .style("text-anchor", "end")
      .text("years");

 svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Life expectancy (years)");

   var period = svg.selectAll(".period")
      .data(data)
    .enter().append("g")
      .attr("class", "countries")
      .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; });

  period.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height_inner - y(d.value); })
      .style("fill", function(d) { return color(d.name); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    var legend = svg.selectAll(".legend")
      .data(ageNames.slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width_outer - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width_outer - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
        
}); 

}

// var margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;