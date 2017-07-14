 module.exports = {
	buildBasket: function(res, req, shirtObject, callback){
		var shirtCount = 0;
		var add = true;
		var shirtsArray = []
		for ( cookie in req.cookies ) {
			if(cookie.includes("shirt")){
				if(!shirtObject || shirtObject.timestamp.toString() === req.cookies[cookie].timestamp.toString()){
					add = false;
				}
				shirtCount++;
			}
		}
		if(add){
	  		res.cookie("shirt"+shirtCount, shirtObject)
	  		shirtsArray.push(shirtObject)
		}
		for ( cookie in req.cookies ) {
			if(cookie.includes("shirt")){
				shirtsArray.push(req.cookies[cookie]);
			}
		}
		var cost = 0;
		shirtsArray.forEach(function(shirt){
			cost = cost + parseInt(shirt.shirtCost)
			shirt.fullClub = nameConverter(shirt.club)
		})

		var data = { data: { shirtsArray: shirtsArray, cost: cost } }

		callback("basket.pug", data)
	},

	deleteCookie: function(res, req, timestamp, callback){
		var shirtsArray = []
		for ( cookie in req.cookies ) {
			if(timestamp == "all"){
				res.clearCookie(cookie);
			} else if(cookie.includes("shirt") && req.cookies[cookie].timestamp.toString() != timestamp){
				shirtsArray.push(req.cookies[cookie]);
			} else if(req.cookies[cookie].timestamp.toString() === timestamp){
				res.clearCookie(cookie);
			}
		}
		var cost = 0;
		shirtsArray.forEach(function(shirt){
			cost = cost + parseInt(shirt.shirtCost)
			shirt.fullClub = nameConverter(shirt.club)
		})

		var data = { data: { shirtsArray: shirtsArray, cost: cost } }

		callback("basket.pug", data)
	}
}

var nameConverter = function(name){
	if(name == "arsenal"){
		return "Arsenal"
	} else if(name == "bournemouth"){
		return "Bournemouth"
	} else if(name == "brighton"){
		return "Brighton and Hove Albion"
	} else if(name == "burnley"){
		return "Burnley"
	} else if(name == "chelsea"){
		return "Chelsea"
	} else if(name == "crystalPalace"){
		return "Crystal Palace"
	} else if(name == "everton"){
		return "Everton"
	} else if(name == "huddersfield"){
		return "Huddersfield"
	} else if(name == "leicesterCity"){
		return "Leicester City"
	} else if(name == "liverpool"){
		return "Liverpool"
	} else if(name == "manchesterCity"){
		return "Manchester City"
	} else if(name == "manu"){
		return "Manchester United"
	} else if(name == "newcastle"){
		return "Newcastle United"
	} else if(name == "southampton"){
		return "Southampton"
	} else if(name == "stoke"){
		return "Stoke City"
	} else if(name == "swansea"){
		return "Swansea City"
	} else if(name == "tottenham"){
		return "Tottenham Hotspur"
	} else if(name == "watford"){
		return "Watford"
	} else if(name == "westbrom"){
		return "West Bromich Albion"
	} else if(name == "westham"){
		return "West Ham"
	} 
}