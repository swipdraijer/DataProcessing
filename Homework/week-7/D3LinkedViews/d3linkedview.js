// Swip Draijer
// 10192239
// Data Processing
// Creates Linked View for Life Expectancy Data and GDP per capita

var life = {};
var years = [];
var minimum;
var maximum;
var avg;

// Creates array of colors from ColorBrewer (http://colorbrewer2.org/#type=sequential&scheme=Blues&n=9)
var colorbrewer = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']

// Formats number to two decimals
var formatNumber = d3.format('.2f');

// Reads data from csv
d3.csv("life_expectancy.csv", function(data) {
  
  data.forEach(function(d) {

    // Creates array of life expectancy value
    for (var i = 0; i <= data.length; i++)
    {
      if (d.years > 0) {
        years.push(+d.years)
      }
    }
  
  });  
  
  // Extracts minimum and maximum values from array and computes interval size based on this range
  minimum = Math.min.apply(null, years)
  maximum = Math.max.apply(null, years)
  bins_interval = (maximum - minimum) / colorbrewer.length

  // Creates bins based on minimum and interval and converts to string to use as fillkey
  var bins = []
  for (i = 0; i < colorbrewer.length; i++) {
      bins.push(formatNumber((minimum + bins_interval * i)).toString())
  }

  // Computes average value
  var total = 0;
  for (var i = 0; i < years.length; i++) {
      total += years[i];
  }
  avg = total / years.length;

  // Assigns each country a fillkey and a numerical life expectancy
  data.forEach(function(d) {

    // Computes fillkey and rounds down to bin integers
    var key = Math.floor((d.years - minimum) / bins_interval)
    if (key > (bins.length - 1)) {
      key = bins.length - 1
    }

    life[d.code] = { 
      fillKey: bins[key],
      years: +formatNumber(d.years),
    }

  });

  // Creates key-value pairs for bins and colors
  var legend = {};
  
  for (var i = 0; i <= bins.length; i++)
  {
    legend[bins[i]] = colorbrewer[i];    
  }

  // Creates D3 map
  var map = new Datamap({
        element: document.getElementById('container'),
        geographyConfig: {
            highlightOnHover: true,
            borderColor: 'rgba(255,255,255,0.3)',
            highlightBorderColor: 'rgba(0,0,0,0.5)',
            popupOnHover: true,
            popupTemplate: function(geo, data) {
                if (data) {
                    
                    // Selects countries with data (life expectancy is higher than 0)
                    if (data.years > 0)
                    {
                            // Text in green for countries above average, in red for below average
                            var color = 'green'
                            if (data.years < avg) { 
                              color = "red" 
                            }
                            return ['<div class="hoverinfo"><strong>' + '' + geo.properties.name + '<br>' +
                                     'Life expectancy at birth: ' + '<br>' + '<font color=' + color + '>' + 
                                     data.years + '</font>' + ' years' + '</strong></div>'];
                    }
                }
                return ['<div class="hoverinfo"><strong>' + '' + geo.properties.name + '<br>' 
                          + 'No data available' + '</strong></div>'];
              }
           },
           done: function(map) {
      
               map.svg.selectAll('.datamaps-subunit').on('click', function(geo, data, life) { 
                               
                // Create scatterplot
                svg.selectAll(".title").remove();      
                updateScatterplot(geo.properties.name, geo.id)                
                
              });
            },
        
      fills: legend,  
      data: life
    
  });

  // Lists average life expectancy in HTML
  var info = document.getElementById('info')
  info.innerHTML = 'Average global life expectancy: ' + '<strong>' + formatNumber(avg) + ' years' + '</strong>' + '<br>'
  
  // Creates legend
  var labels = document.getElementById('labels')
  labels.innerHTML = 
      '<li><span style=' + 'background:' + 'black' + '></span>' + 'No data available in 2014' + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[0] + '></span>' + bins[0] + ' - ' + bins[1] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[1] + '></span>' + bins[1] + ' - ' + bins[2] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[2] + '></span>' + bins[2] + ' - ' + bins[3] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[3] + '></span>' + bins[3] + ' - ' + bins[4] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[4] + '></span>' + bins[4] + ' - ' + bins[5] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[5] + '></span>' + bins[5] + ' - ' + bins[6] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[6] + '></span>' + bins[6] + ' - ' + bins[7] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[7] + '></span>' + bins[7] + ' - ' + bins[8] + '</li>' +
      '<li><span style=' + 'background:' + colorbrewer[8] + '></span>' + '>' + bins[8] + '</li>'

});

// Initializes data for scatterplot
var data_year = 2014;
var dataset = "life_expectancy_GDP_2014.csv"; 

// Defines margins
var width_outer = 900
var height_outer = 400
var margin = {top: 60, right: 30, bottom: 30, left: 120},
    width_inner = width_outer - margin.left - margin.right,
    height_inner = height_outer - margin.top - margin.bottom;

// Initializes scales
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width_inner], .1);

var y = d3.scale.linear()
    .range([height_inner, 0]);

// Initializes axes
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

// Initializes svg for scatterplot
var svg = d3.select("body").append("svg")
    .attr("class", "svg")
    .attr("width", width_outer + margin.left + margin.right)
    .attr("height", height_outer + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Defines x values
var xValue = function(d) { return d.life;}, 
    xScale = d3.scale.linear().range([0, width_inner]),
    xMap = function(d) { return xScale(xValue(d));}, 
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// Defines y values
var yValue = function(d) { return d.GDP;},
    yScale = d3.scale.linear().range([height_inner, 0]), 
    yMap = function(d) { return yScale(yValue(d));}, 
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// Adds tooltip
var tooltip = d3.select("#tooltip").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Creates initial scatterplot
makePlot(dataset)

// Selects data for selected year
function updateYear(newYear)
{
  document.getElementById("range").innerHTML=newYear;
  data_year = newYear
  console.log(data_year);

  dataset = "life_expectancy_GDP_" + data_year + ".csv"
  console.log(dataset)

  // Removes previous plot and creates new plot
  svg.selectAll("*").remove();     
  makePlot(dataset)

}

// Sets data as global variable
var data;

// Creates scatterplot using selected dataset
function makePlot (dataset) {

  // Appends title
  svg.append("text")
    .attr("class", "title")
    .attr("x", width_inner / 2)
    .attr("y", margin.top / 4)
    .attr("text-anchor", "middle")
      .text("Life expectancy and GDP per capita by country " + " (" + data_year + ")");

  // Loads data
  d3.csv(dataset, function(error, data) {

    data.forEach(function(d) {
      d.life = +d.life;
      d.GDP = +d.GDP;
    });

    // Defines x and y domains
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // Creates x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_inner + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width_inner)
        .attr("y", margin.bottom + 20)
        .style("text-anchor", "end")
        .text("Life expectancy at birth (years)");

    // Creates y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("GDP per capita ($)");
    
    // Draws dots
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("id", function(d) { return d.code }) 
        .attr("r", 4.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", "steelblue") 
    
    // Adds tooltip to dot 
    svg.selectAll(".dot")
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(100)
                 .style("opacity", .9);
            tooltip.html(d.country + "<br/>" + "Life expectancy (years): " + formatNumber(xValue(d)) 
            + "<br/>" + "GDP per capita: " + "$ " + formatNumber(yValue(d)))
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
    });
 
  });
    
}

// Updates scatterplot for selected country
function updateScatterplot (country, geo, selected_geo) {

  // Updates title 
  svg.append("text")
    .attr("class", "title")
    .attr("x", width_inner / 2)
    .attr("y", margin.top / 4)
    .attr("text-anchor", "middle")
        .text("Life expectancy and GDP per capita " + "(" + country + ", " + data_year + ")");

  // Reverts colour, size back to standard
  d3.selectAll('.dot')
  .style('fill', 'steelblue')
  .attr('r', 4.5) 
  
  // Checks country for valid geo code
  if (geo != -99) {

    // Highlights selected country
    d3.selectAll('.dot')
      .style("opacity", 0.9)

    d3.select('#' + geo)
    .style('fill', 'orange')
    .style("opacity", 1)
    .attr('r', 6);

    selected_geo = d3.select('#' + geo)
    if (selected_geo.empty() == true) { 

      unavailable(country)

    }

  }
  else {
    
    unavailable(country)

  }


}

// Indicates that data is unavailable for selected country 
function unavailable (country) {

  svg.selectAll(".title").remove();    
    svg.append("text")
      .attr("class", "title")
      .attr("x", width_inner / 2)
      .attr("y", margin.top / 4)
      .attr("text-anchor", "middle")
        .text("No data available for " + country);
}