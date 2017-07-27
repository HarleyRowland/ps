var async = require('async')
var config = require('../config.yaml')
var emailClient = require('../clients/emailClient.js')
var stripeClient = require('../clients/stripeClient.js')
var databaseClient = require('../clients/databaseClient.js')

module.exports = {
	paymentBuilder: function(req, key, callback) {
		var shirtsArray = getCookies(req);
		var cost = calculateCost(shirtsArray);
		var jsonArray = JSON.stringify(shirtsArray);

		var data = { data: {jsonArray: jsonArray, cost: cost, key: key}}
		
		callback("payment.pug", data);
	},

	makePayment: function(req, res){
		async.waterfall([
		    function(callback) {
		        databaseClient.newOrder(req, callback);
		    },
		    function(orderNumber, callback) {
		        emailClient.sendEmail("payment", req.body.stripeEmail, orderNumber, callback)
		    }
		], function (err, result) {
			console.log("hello")
			var callback = function(err, charge){
				if(err) {
					res.render("paymentFailure.pug")
				} else {
					res.render("paymentResult.pug")
				}
			}	
			stripeClient.makePayment(req.query.cost*100, req.body.stripeEmail, req.body.stripeToken, callback)
		});
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
			var sleeveCost = 0;
			if(shirt.sleeve = "Yes") {
				sleeveCost = 10;
			}
			shirtCost = shirt.name.replace(/ /g,"").length + (shirt.number.replace(/ /g,"").length*5)
			cost = cost + parseInt(shirtCost) + sleeveCost;
		}
	});
	return cost;
}