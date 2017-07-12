// res.cookie('cookiename', 'cookievalue', { maxAge: 900000, httpOnly: true });
module.exports = {
	buildBasket: function(view, res, req, shirtObject, callback){
		var shirtCount = 0;
		var add = true;
		var shirtsArray = []
		for ( cookie in req.cookies ) {
			if(cookie.includes("shirt")){
				if(shirtObject.timestamp.toString() === req.cookies[cookie].timestamp.toString()){
					add = false;
				}
				shirtCount++;
			}
		}
		console.log(add);
		if(add){
	  		res.cookie("shirt"+shirtCount, shirtObject)
	  		shirtsArray.push(shirtObject)
		}
		console.log("after: ", req.cookies);
		for ( cookie in req.cookies ) {
			if(cookie.includes("shirt")){
				shirtsArray.push(req.cookies[cookie]);
			}
		}
		var cost = 0;
		shirtsArray.forEach(function(shirt){
			cost = cost + parseInt(shirt.shirtCost)
		})

		var data = { data: {
				shirtsArray: shirtsArray,
				cost: cost
			}
		}
		console.log(data);
		callback("index.pug")
	}
}