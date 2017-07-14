var config = require('../config.yaml')
var emailClient = require('../clients/emailClient.js')
var stripeClient = require('../clients/stripeClient.js')

module.exports = {
	paymentBuilder: function(req, key, callback) {
		var shirtsArray = getCookies(req);
		var cost = calculateCost(shirtsArray);
		var jsonArray = JSON.stringify(shirtsArray);

		var data = { data: {jsonArray: jsonArray, cost: cost, key: key}}
		
		callback("payment.pug", data);
	},

	makePayment: function(req, callback){
		stripeClient.payStripe(req.body.stripeEmail, req.body.stripeToken).then(charge => {
			emailClient.sendMail("Payment", req.body.stripeEmail)
			res.render("paymentResult.pug", {finalCost: req.query.cost});
		})
	}
}

var getCookies = function(req) {
	var shirtsArray = []
	for ( cookie in req.cookies ) {
		if(cookie.includes("shirt")){
			shirtsArray.push(req.cookies[cookie])
		}
	}
	return shirtsArray;
}

var calculateCost = function(shirtsArray) {
	var cost = 0;
	shirtsArray.forEach(function(shirt) {
		var shirtCost = 0;
		if(shirt.name && shirt.number){
			shirtCost = shirt.name.replace(/ /g,"").length + (shirt.number.replace(/ /g,"").length*5)
			cost = cost + parseInt(shirtCost)
		}
	});
	return cost;
}