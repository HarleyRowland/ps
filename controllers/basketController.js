// res.cookie('cookiename', 'cookievalue', { maxAge: 900000, httpOnly: true });
module.exports = {
	buildBasket: function(view, res, req, shirtObject, callback){
			var shirtCount = 0;
			var add = true;
			for ( cookie in req.cookies ) {
				if(cookie.includes("shirt")){
					if(shirtObject == req.cookies[cookie]){
						add == false;
					} else {
						shirtCount++
					}
				}
			}
			console.log(shirtCount);
			console.log(shirtObject)
		  	res.cookie("shirt"+shirtCount, shirtObject)
  			console.log(req.cookies)
		callback("index.pug")
	}
}