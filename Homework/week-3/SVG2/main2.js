// Swip Draijer
// 10192239
// Assigns color to each country based on number of articles.

window.onload = function() {

	// Extracts length of country_codes and declares variables.
	var all_countries = country_codes.length
	var country_code
	var country_id

	// Loads articles from JSON data and parses to JavaScript object.
	var data = document.getElementById("data")
	var dataset = JSON.parse(data.value)
	var all_data = dataset["points"].length

	// Iterates through all countries to assign articles and country id based on country code.
	for (i = 0; i < all_countries; i++)
	{
	    country_id = country_codes[i][0] 

	    for (j = 0; j < all_data; j++)
	    {
	    	// Gets articles from dataset and uses that to assign color to each country. 
	    	if (country_codes[i][1] == dataset["points"][j]["country"])
	    	{
	    		articles = dataset["points"][j]["articles"]
					    		
	    		if (articles == "")
	    		{
	    			changeColor(country_id, 'D0D0D0')   
	    		}   	
	    		
	    		else if (articles < 10) 
				{
					changeColor(country_id, 'fff7ec')   
				} 
				else if (articles < 50)
				{
					changeColor(country_id, 'fdd49e')     
				}
				else if (articles < 100)
				{
					changeColor(country_id, 'fee8c8')     
				}
				else if (articles < 500)
				{
					changeColor(country_id, 'fdbb84')     
				}
				else if (articles < 1000)
				{
					changeColor(country_id, 'fc8d59')     
				}
				else if (articles < 10000)
				{
					changeColor(country_id, 'ef6548')     
				}
				else if (articles < 60000)
				{
					changeColor(country_id, 'd7301f')     
				}
				else if (articles < 120000)
				{
					changeColor(country_id, 'b30000')     
				}
				else if (articles >= 120000)
				{
					changeColor(country_id, '7f0000')     
				}
	    	}
	    }
	}
}

// Fills country with color if id is present in SVG. 
function changeColor(id, color) {
	if (document.getElementById(id) != null)
	{
		document.getElementById(id).style.fill = color
	}
}
