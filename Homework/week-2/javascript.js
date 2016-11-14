// Data Processing
// Swip Draijer
// 10192239
// Creates graph of KNMI data

const START_MS = 1446332400000
const MS_DAY = 86400000

// sets canvas bounds
const MAX_WIDTH = 1500
const MAX_HEIGHT = 1000
const MARGIN = 100
const GRID = 20
const TEXT = 40

// sets data bounds
const DATES = 365
const MIN_TEMP = -50
const MAX_TEMP = 300
const INCR = 50

// loads data and splits by line
var data = document.getElementById("rawdata")
var content = data.value
var lines = content.split("\n")

// creates arrays for dates, temperatures and days
var dates = []
var temperatures = []
var days = []

// splits data in dates and temperatures
for (i = 0; i < lines.length - 1; i++) 
{ 
    temp = lines[i].split(",")
    
	// formats date in JavaScript numbers
    year = temp[0].substring(0, 4) + '/';
	month = temp[0].substring(4, 6) + '/';
	day = temp[0].substring(6, 8)
	temp[0] = year.concat(month,day)

    dates[i] = new Date(temp[0])
   	temperatures[i] = temp[1]

   	// computes date in milliseconds since 1 Jan 1970
   	days[i] = dates[i].getTime()
   	days[i] = Math.ceil((days[i] - START_MS) / MS_DAY)
}

// check if data is loaded
console.log(dates)
console.log(temperatures)

// transforms data to screen
function createTransform(domain, range)
{
	var alpha = (range[1] - range[0]) / (domain[1] - domain[0]);
 	var beta = range[0] - alpha * domain[0];
	
	return function(x){
		return alpha * x + beta;
	};
}

var transform_date = createTransform([0, DATES], [MARGIN, MAX_WIDTH]);
var transform_temp = createTransform([MIN_TEMP, MAX_TEMP], [MAX_HEIGHT - MARGIN, MARGIN]);

// renders canvas
var canvas = document.getElementById('graph'); 
var context = canvas.getContext('2d');

// prints title on canvas
context.font= 'italic 40px Helvetica'; 
context.fillText("Gemiddelde temperatuur 2015 - 2016 in De Bilt (NL) in 0.1 °C", MAX_WIDTH / 6, MARGIN); 

// sets label size
context.font= 'italic bold 20px Helvetica'; 

// prints y-axis and labels on canvas
context.beginPath()
context.moveTo(MARGIN - GRID, MAX_HEIGHT - MARGIN)
context.lineTo(MARGIN - GRID, MARGIN)
context.stroke()

context.moveTo(MARGIN - GRID, MARGIN)
context.lineTo(MARGIN - TEXT, MARGIN)
context.stroke()

for (i = MIN_TEMP; i <= MAX_TEMP; i = i + INCR)
{
	context.moveTo(MARGIN - GRID, transform_temp(i))
	context.lineTo(MARGIN - TEXT, transform_temp(i))
	context.stroke()
	context.textAlign = 'center'
	context.fillText(i, GRID,transform_temp(i)); 
}

// prints x-axis
context.beginPath()
context.moveTo(MARGIN, transform_temp(MIN_TEMP))
context.lineTo(MAX_WIDTH, transform_temp(MIN_TEMP))
context.stroke()

context.moveTo(MAX_WIDTH, transform_temp(MIN_TEMP))
context.lineTo(MAX_WIDTH, transform_temp(MIN_TEMP) + GRID)
context.stroke()

// prints labels on x-axis using an array of months
var month_new = dates[0].getMonth()
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

context.moveTo(MARGIN, MAX_HEIGHT - MARGIN)
context.lineTo(MARGIN, MAX_HEIGHT - MARGIN + GRID)
context.textAlign = 'left';

// prints first month
context.fillText(months[month_new], MARGIN, MAX_HEIGHT - MARGIN + TEXT); 
context.fillText(dates[0].getFullYear(), MARGIN, MAX_HEIGHT); 

// prints every other month
for (i = 0; i < dates.length; i++)
{
	month_cur = dates[i].getMonth()
	
	if (month_new != month_cur)
	{
		month_new = month_cur
		context.moveTo(transform_date(days[i]), transform_temp(MIN_TEMP))
		context.lineTo(transform_date(days[i]), transform_temp(MIN_TEMP) + GRID)
		context.stroke()	
		context.fillText(months[month_new],transform_date(days[i]), MAX_HEIGHT - MARGIN + TEXT)
		
		if (month_cur == 0)
		{
			context.fillText(dates[i].getFullYear(), transform_date(days[i]), MAX_HEIGHT);
		}
	}
}

// draws line graph of dates and temperatures
context.strokeStyle="blue";
context.beginPath()
context.moveTo(transform_date(days[0]), transform_temp(temperatures[0]))

for (i = 1; i < days.length; i++) 
{  
	context.lineTo(transform_date(days[i]), transform_temp(temperatures[i]))
	context.stroke();
}

// sets dashed line to show 0 degrees
context.setLineDash([10, 5])
context.strokeStyle="red";
context.beginPath()
context.moveTo(MARGIN, transform_temp(0))
context.lineTo(MAX_WIDTH, transform_temp(0))
context.stroke();