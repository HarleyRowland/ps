 module.exports = {
	buildBasket: function(req, res, template, callback){
		var shirtObject;
		if(req.query.shirtObject) {
			shirtObject = JSON.parse(req.query.shirtObject);
		}
		var add = true;
		var shirtsArray = []
		var highestNumber = 0;
		var shirtCount = 0;
		for ( cookie in req.cookies ) {
			if(cookie.includes("shirt")){
				shirtCount++;
				if(highestNumber < parseInt(cookie.split("shirt")[1])){
					highestNumber = parseInt(cookie.split("shirt")[1])
				}

				if(!shirtObject || shirtObject.timestamp.toString() === req.cookies[cookie].timestamp.toString()){
					add = false;
				}

			}
		}
		if(shirtObject && (add || shirtCount == 0)){
			shirtCount++;
			highestNumber++;
	  		res.cookie("shirt"+highestNumber, shirtObject)
	  		shirtsArray.push(shirtObject)
		}

		if(shirtCount > 0) {
			for ( cookie in req.cookies ) {
				if(cookie.includes("shirt")){
					shirtsArray.push(req.cookies[cookie]);
				}
			}
			var cost = 0;
			shirtsArray.forEach(function(shirt){
				shirt.displayCost = buildDisplayCost(shirt.fullCost+"")
				cost = cost + parseFloat(shirt.fullCost)
				shirt.fullClub = nameConverter(shirt.club)
			})			
		}
		
		var deliveryCosts = choicesOfDelivery(shirtCount)	

		var data = { shirtsArray: shirtsArray, cost: cost, deliveryCosts: deliveryCosts}

		callback(null, res, "basket.pug", data)
	},

	deleteCookie: function(res, req, template, callback){
		if(!req.query.timestamp) return callback("Invalid Params");
		var shirtsArray = [];
		var shirtCount = 0;
		for (cookie in req.cookies) {
			console.log("HERE", req.cookies[cookie])
			if(!cookie.includes("ermission")){
				if(req.query.timestamp == "all"){
					res.clearCookie(cookie);
				} else if(cookie.includes("shirt") && req.cookies[cookie].timestamp.toString() != req.query.timestamp){
					shirtCount++;
					shirtsArray.push(req.cookies[cookie]);
				} else if(req.cookies[cookie].timestamp && req.cookies[cookie].timestamp.toString() === req.query.timestamp){
					res.clearCookie(cookie);
				}
			}
		};
		var cost = 0;
		shirtsArray.forEach(function(shirt){
			cost = cost + parseFloat(shirt.shirtCost)
			shirt.fullClub = nameConverter(shirt.club)
		});
		var deliveryCosts = choicesOfDelivery(shirtCount);

		var data = { shirtsArray: shirtsArray, cost: cost, deliveryCosts: deliveryCosts};

		callback(null, res, template, data);
	}
}


var choicesOfDelivery = function(shirtCount){
	var deliveryTypes = ["2nd Class, Not Signed - £3.48", "1st Class, Not Signed - £4.08", "2nd Class, Signed - £4.68", "1st Class, Signed - £5.28"]
	if(shirtCount < 2){
		deliveryTypes.push("Guarenteed Before 1pm, Signed - £8.70")
	} else if(shirtCount > 1 && shirtCount < 4){
		deliveryTypes.push("Guarenteed Before 1pm, Signed - £10.26")
	} else if(shirtCount > 3){
		deliveryTypes.push("Guarenteed Before 1pm, Signed - £13.20")
	}
	
	return deliveryTypes;
}

var buildDisplayCost = function(cost){
	if(cost.includes(".")){
		var splitCost = cost.split(".")[1];
		if(splitCost.length < 2){
			return cost + "0";
		} else {
			return cost;
		}
	} else {
		return cost;
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
	} else if(name == "crystalpalace"){
		return "Crystal Palace"
	} else if(name == "everton"){
		return "Everton"
	} else if(name == "huddersfield"){
		return "Huddersfield"
	} else if(name == "leicestercity"){
		return "Leicester City"
	} else if(name == "liverpool"){
		return "Liverpool"
	} else if(name == "manchestercity"){
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
		return "West Brom"
	} else if(name == "westham"){
		return "West Ham"
	} 
}