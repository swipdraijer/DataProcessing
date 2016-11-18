window.onload = function() {

	var all_countries = country_codes.length

	var country_code
	var country_id

	var data = document.getElementById("data")
	var dataset = JSON.parse(data.value)
	var length = dataset["points"].length

	for (i = 0; i < all_countries; i++)
	{
	    country_id = country_codes[i][0] 

	    for (j = 0; j < length; j++)
	    {
	    	if (country_codes[i][1] == dataset["points"][j]["country"])
	    	{
	    		articles = dataset["points"][j]["articles"]

	    		if (articles < 1) 
				{
					changeColor(country_id, 'fff7ec')   
				} 
	    	
	    		if (articles < 10) 
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

function changeColor(id, color) {
	if (document.getElementById(id) != null)
	{
		document.getElementById(id).style.fill = color
	}
	else 
	{
		// console.log(id)
	}

}
