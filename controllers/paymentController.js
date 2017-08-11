var async = require('async')
var config = require('../config.js');
var emailClient = require('../clients/emailClient.js')
var stripeClient = require('../clients/stripeClient.js')
var databaseClient = require('../clients/databaseClient.js')

module.exports = {
	paymentBuilder: function(req, callback) {
		var shirtsArray = getCookies(req);
		var shirtCost = calculateCost(shirtsArray);
		var deliveryCost = delCost(req.query.deliveryOption);
		var totalCost = shirtCost + deliveryCost;
		var jsonArray = JSON.stringify(shirtsArray);
		var postOrDeliver = ""
		shirtsArray.forEach(function(shirt){
			if(shirt.deliveryType == "deliver"){
				postOrDeliver = "deliver"	
			}
		})
		var data = { data: {jsonArray: jsonArray, deliveryCost: deliveryCost, shirtCost: shirtCost, totalCost: totalCost, key: config.database.publishableKey, deliveryType: postOrDeliver, deliveryOption: req.query.deliveryOption}}
		
		callback("payment.pug", data);
	},

	makePayment: function(req, res){
		var orNo = -1;
		var name = "";
		var cost = -1;
		async.waterfall([
		    function(callback) {
		        databaseClient.newOrder(req, callback);
		    },
		    function(callback){
		    	databaseClient.getIDForOrder(req.body.stripeEmail, callback)
		    },
		    function(orderNumber, callback) {
		    	orNo = orderNumber[0].ordernumber
		    	name = orderNumber[0].name
		    	cost = orderNumber[0].cost
		        emailClient.sendEmail("Payment", req.body.stripeEmail, name, cost, orNo)
		        callback(null, 'done')
		    }
		], function (err, result) {
			var callback = function(err, charge){
				if(err) {
					console.log(err)
					res.render("paymentFailure.pug")
				} else {
					for ( cookie in req.cookies ) {
						if(cookie.includes("shirt")){
							res.clearCookie(cookie);	
						}
					}
					var data = { data: req.query }
					data.data.cost = req.query.cost;
					data.data.orderNumber = orNo;
					data.data.shirtArray = JSON.parse(data.data.shirtArray)
					res.render("paymentResult.pug", data )
				}
			}	
			stripeClient.makePayment(parseFloat(req.query.cost)*100, req.body.stripeEmail, req.body.stripeToken, callback)
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
				sleeveCost = 7.5;
			}
			shirtCost = shirt.name.replace(/ /g,"").length + (shirt.number.replace(/ /g,"").length*5)
			if(shirtCost < 20) {
				shirtCost = 20;
			}
			cost = cost + parseFloat(shirtCost) + sleeveCost;
		}
	});
	return cost;
}

var deliveryMethods = function(shirtCount){
	var deliveryTypes = ["1st Class, Not Signed - £4.08", "1st Class, Signed - £5.28", "2nd Class, Not Signed - £3.48", "2nd Class, Signed - £4.68"]

	if(shirtCount == 1){
		deliveryTypes.push("Guarenteed Before 1pm, Signed - £8.70")
	} else if(shirtCount > 1 && shirtCount < 4){
		deliveryTypes.push("Guarenteed Before 1pm, Signed - £10.26")
	} else if(shirtCount > 3){
		deliveryTypes.push("Guarenteed Before 1pm, Signed - £13.20")
	}

	return deliveryMethods;
}

var delCost = function(deliverOption) {
	return parseFloat(deliverOption.split("£")[1].trim());
}