var life = {};
var bins = ['50', '50-55', '55-60', '60-65', '60-65', '65-70', '70-75', '75-80', '80-85', '80']
var formatNumber = d3.format('.2f');

d3.csv("lifeexpectancy.csv", function(data) {
  
  data.forEach(function(d) {

    life[d.code] = { 
         fillKey: bins[Math.floor((d.years - 48) / 5)],
         years: +formatNumber(d.years),
    }

  });

  console.log(life);
  // console.log(Math.min(data.years))       
  // console.log(Math.min.apply(null, data.years))
  // Math.min(...numbers)

// d3.format(",.2f")
  var colorbrewer = ['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b']
  
  var map = new Datamap({
        
        element: document.getElementById('container'),
        geographyConfig: {
            highlightOnHover: true,
            borderColor: 'rgba(255,255,255,0.3)',
            highlightBorderColor: 'rgba(0,0,0,0.5)',
            popupOnHover: true,
            popupTemplate: function(geo, data) {
                if (data.years >= 0)
                {
                        return ['<div class="hoverinfo"><strong>',
                                 '' + geo.properties.name + '\n',
                                 'Life expectancy at birth: ' + data.years + ' years',
                                '</strong></div>'].join('');
                }
              }
           },
        fills: {
            '50': colorbrewer[0],
            '50-55': colorbrewer[1],
            '55-60': colorbrewer[2],
            '60-65': colorbrewer[3],
            '65-70': colorbrewer[4],
            '70-75': colorbrewer[5],
            '75-80': colorbrewer[6],
            '85': colorbrewer[7],
            defaultFill: 'black'
        },
       
        data: life
   
    });

  map.legend();

});

