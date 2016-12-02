// Swip Draijer
// 10192239
// Data Processing
// Creates D3 map of life expectancy data

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
    if (key > 8) {
      key = 8
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
  
  // Creats D3 map
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
        
        fills: legend,  
        data: life
    
    });

  // Lists average life expectancy in HTML
  var info = document.getElementById('info')
  info.innerHTML = 'Average global life expectancy: ' + '<strong>' + formatNumber(avg) + ' years' + '</strong>' + '<br>'
  
  // Creates legend (no time to implement looping through list items)
  var labels = document.getElementById('labels')
  labels.innerHTML = 
      '<li><span style=' + 'background:' + 'black' + '></span>' + 'No data available' + '</li>' +
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