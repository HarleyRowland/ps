var async = require('async')
var config = require('../config.js');
var emailClient = require('../clients/emailClient.js')
var stripeClient = require('../clients/stripeClient.js')
var databaseClient = require('../clients/databaseClient.js')

module.exports = {
	paymentBuilder: function(req, callback) {
		var shirtsArray = getCookies(req);
		var shirtCost = 0;
		var scorers = [];
		console.log(shirtsArray)
		console.log("__________________________________")
		async.waterfall([
		    function(callback) {
				databaseClient.getScorers(callback)
		    },
		    function(players, callback) {
		    	scorers = players;
				databaseClient.getPrice(callback)
		    }
		], function (err, result) {
			var shirtprice = result[result.length-1].shirtprice
			var cost = 0;
			shirtsArray.forEach(function(shirt) {
				if(shirt.name && shirt.number){
					var sleeveCost = 0;
					if(shirt.sleeve == "Yes") {
						sleeveCost = 7.5;
					}
					var thisShirtCost = 0
					var shirtLength = shirt.name.replace(/ /g,"").length
					if(shirtLength <= 10){
						thisShirtCost = 20;
					} else {
						thisShirtCost = 20 + (shirtLength - 10);
					}
					if(thisShirtCost < shirtprice || shirt.printingType == "hero") {
						thisShirtCost = shirtprice;
					}
					var discount = 0;

					for (var i = scorers.length - 1; i >= 0; i--) {
						if(shirt.name == scorers[i].kitname && shirt.club.toLowerCase().trim() == scorers[i].club.toLowerCase().trim()){
							discount = scorers[i].discount;
						}
					}
					console.log(cost + ", " + thisShirtCost + ", " + sleeveCost + ", " + discount)
					cost = parseFloat(cost) + parseFloat(thisShirtCost) + parseFloat(sleeveCost) - parseFloat(discount);
				}
			});
			var costsForShirts = cost
			var displayShirtCost = buildDisplayCost(costsForShirts+"")
			var deliveryCost = delCost(req.query.deliveryOption);

			var displayDeliveryCost = buildDisplayCost(deliveryCost+"")
			var totalCost = costsForShirts + deliveryCost;

			var displayTotalCost = buildDisplayCost(totalCost+"")
			var jsonArray = JSON.stringify(shirtsArray);
			var postOrDeliver = ""

			shirtsArray.forEach(function(shirt){
				if(shirt.deliveryType == "deliver"){
					postOrDeliver = "deliver"	
				}
			})
			
			var data = { data: {jsonArray: jsonArray, deliveryCost: deliveryCost, shirtCost: costsForShirts, totalCost: totalCost, key: config.database.publishableKey, deliveryType: postOrDeliver, deliveryOption: req.query.deliveryOption, displayTotalCost: displayTotalCost, displayDeliveryCost: displayDeliveryCost, displayShirtCost: displayShirtCost}}

			callback("payment.pug", data);
		});
	},

	makePayment: function(req, res){
		var orNo = -1;
		var name = "";
		var cost = -1;
		var template = ""
		var data = { data: {}}
		var paymentPass;
		async.waterfall([
		    function(callback) {
				var cb = function(err, charge){
					if(err) {
						template = "paymentFailure.pug"
						paymentPass = false;
					} else {
						for ( cookie in req.cookies ) {
							if(cookie.includes("shirt")){
								res.clearCookie(cookie);	
							}
						}
						data = { data: req.query }
						data.data.cost = req.query.cost;
						data.data.shirtArray = JSON.parse(data.data.shirtArray)
						template = "paymentResult.pug"
						paymentPass = true;
					}
					callback();
				}	
				stripeClient.makePayment((parseFloat(req.query.cost)*100).toFixed(0), req.body.stripeEmail, req.body.stripeToken, cb)
		    },
		    function(callback){
		        databaseClient.newOrder(req, paymentPass, callback);
		    },
		    function(callback) {
		    	databaseClient.getIDForOrder(req.body.stripeEmail, callback)
		    }
		], function (err, result) {
	    	data.data.orderNumber = result[0].ordernumber
	    	name = result[0].name
	    	cost = result[0].cost
	    	if(paymentPass){
	        	emailClient.sendEmail("Payment", req.body.stripeEmail, name, cost, data.data.orderNumber)
	    	}
	        res.render(template, data);
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
	var callback = function(cost){
		return cost;
	}
	var scorers = [];
	async.waterfall([
	    function(callback) {
			databaseClient.getScorers(callback)
	    },
	    function(players, callback) {
	    	scorers = players;
			databaseClient.getPrice(callback)
	    }
	], function (err, result) {
		var cost = result[result.length-1].shirtprice
		shirtsArray.forEach(function(shirt) {
			var shirtCost = 0;
			if(shirt.name && shirt.number){
				var sleeveCost = 0;
				if(shirt.sleeve = "Yes") {
					sleeveCost = 7.5;
				}
				var shirtLength = shirt.name.replace(/ /g,"").length
				if(shirtLength <= 10){
					shirtCost = 20;
				} else {
					shirtCost = 20 + (shirtLength - 10);
				}
				var discount = 0;
				for (var i = scorers.length - 1; i >= 0; i--) {
					if(shirt.name == scorers[i].kitname){
						discount = scorers[i].discount;
					}
				}
				cost = parseInt(cost) + parseFloat(shirtCost) + sleeveCost - discount;
				console.log(cost + ", " + shirtCost + ", " + sleeveCost + ", " + discount)
			}
		});
		return cost;
	});
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