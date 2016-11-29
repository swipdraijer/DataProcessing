// var basic_choropleth = new Datamap({
//   element: document.getElementById("basic_choropleth"),
//   projection: 'mercator',
//   fills: {
//     defaultFill: "#ABDDA4",
//     life_expectancy: "#fa0fa0"
//   },
//   data: {
//     USA: { fillKey: "authorHasTraveledTo" },
//     JPN: { fillKey: "authorHasTraveledTo" },
//     ITA: { fillKey: "authorHasTraveledTo" },
//     CRI: { fillKey: "authorHasTraveledTo" },
//     KOR: { fillKey: "authorHasTraveledTo" },
//     DEU: { fillKey: "authorHasTraveledTo" },
//   }
// })

$("#map").datamap({
   scope: 'world',
   geography_config: {
     borderColor: 'rgba(255,255,255,0.3)',
     highlightBorderColor: 'rgba(0,0,0,0.5)',
     popupTemplate: _.template([
       '<div class="hoverinfo">',
       '<strong><%= geography.properties.name %></strong><br/>',
       '<% if (data.years) { %>',
       'Life expectancy (years): <%= data.years %><br/> <% } %>',
       ,
       '</div>'
      ].join('') )
   },
   fills: {
     life_75_80: 'blue',
     life_55_60: 'lightblue',
     defaultFill: 'grey' 
   },
   data: {
      'CHN' : { 
       fillKey: 'life_75_80',
       years: '75.78226829',
       },
      'CMR' : {
       fillKey: 'life_55_60',
       years: '55.4927561',
      }
   
//      'LBY': {
//        fillKey: 'conflict',
//        name: '2011–present Libyan factional fighting',
//        startOfConflict: 2011
//       },
//      'IRQ': {
//        fillKey: 'conflict',
//        name: 'Iraqi insurgency (post U.S. withdrawal)',
//        startOfConflict: 2011
//       },
//      'SYR': {
//        fillKey: 'conflict',
//        name: 'Syrian civil war',
//        startOfConflict: 2011
//       },
//      'SDN': {
//        fillKey: 'conflict',
//        name: 'Sudan internal conflict',
//        startOfConflict: 2011
//       },
//      'MEX': {
//        fillKey: 'conflict',
//        name: 'Mexican Drug War',
//        startOfConflict: 2006
//       },
//      'PAK': {
//        fillKey: 'conflict',
//        name: 'War in North-West Pakistan',
//        startOfConflict: 2004
//       },
//      'YEM': {
//        fillKey: 'conflict',
//        name: 'Al-Qaeda insurgency in Yemen',
//        startOfConflict: 2001
//       },
//      'MMR': {
//        fillKey: 'conflict',
//        name: 'Internal conflict in Burma (Myanmar)',
//        startOfConflict: 1948
//       },
//      'COL': {
//        fillKey: 'conflict',
//        name: 'Colombian conflict',
//        startOfConflict: 1964
//       },
//      'AFG': {
//        fillKey: 'conflict',
//        name: 'War in Afghanistan',
//        startOfConflict: 1978
//       }
   }
});