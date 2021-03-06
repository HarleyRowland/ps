var async = require('async')
var config = require('../config.js');
var emailClient = require('../clients/emailClient.js')
var stripeClient = require('../clients/stripeClient.js')
var databaseClient = require('../clients/databaseClient.js')

module.exports = {
	paymentBuilder: function(req, res, template, callback) {
		var shirtsArray = getCookies(req);
		var shirtCost = 0;
		var scorers = [];
		async.waterfall([
		    function(asyncCallback) {
				databaseClient.getScorers(asyncCallback)
		    },
		    function(players, asyncCallback) {
		    	scorers = players;
				databaseClient.getPrice(asyncCallback)
		    }
		], function (error, result) {
			if(error){
				return callback(error)
			}
			var shirtPrice = result[result.length-1].shirtprice
			var calculateCostsCallback = function(error, totalCostOfAllShirts){
				var displayShirtCost = buildDisplayCost(totalCostOfAllShirts+"")
				var deliveryCost = parseFloat(req.query.deliveryCost);
				var displayDeliveryCost = buildDisplayCost(deliveryCost+"")
				var totalCost = totalCostOfAllShirts + deliveryCost;
				var displayTotalCost = buildDisplayCost(totalCost+"")
				var jsonArray = JSON.stringify(shirtsArray);
				var data = { jsonArray: jsonArray, deliveryCost: deliveryCost, shirtCost: totalCostOfAllShirts, totalCost: totalCost, key: config.database.publishableKey, deliveryMethod: req.query.deliveryMethod , deliveryOption: req.query.deliveryOption, displayTotalCost: displayTotalCost, displayDeliveryCost: displayDeliveryCost, displayShirtCost: displayShirtCost}

				callback(null, res, template, data);
			}
			var totalCostOfAllShirts = calculateCost(shirtsArray, scorers, shirtPrice, calculateCostsCallback)
		});
	},
	makePayment: function(req, res, template, callback){
		if(!req.body.stripeEmail && !req.query.cost && !req.query.shirtArray) return callback("Invalid Params")
		var orNo = -1;
		var name = "";
		var cost = -1;
		var data = req.query;
		var paymentPass;
		async.waterfall([
		    function(asyncCallback) {
				var paymentCallback = function(error){
					if(error) {
						template = "paymentFailure.pug"
						paymentPass = false;
						asyncCallback(error);
					} else {
						for ( cookie in req.cookies ) {
							if(cookie.includes("shirt")){
								res.clearCookie(cookie);	
							}
						}
						data.shirtArray = JSON.parse(data.shirtArray)
						paymentPass = true;
						asyncCallback();
					}
				}	
				stripeClient.makePayment((parseFloat(data.cost)*100).toFixed(0), req.body.stripeEmail, req.body.stripeToken, paymentCallback)
		    },
		    function(asyncCallback){
		        databaseClient.newOrder(req, paymentPass, asyncCallback);
		    },
		    function(asyncCallback) {
		    	databaseClient.getIDForOrder(req.body.stripeEmail, asyncCallback)
		    }
		], function (err, result) {
			if(err) callback(err);
	    	data.orderNumber = result[0].ordernumber
	    	data.deliverydate = result[0].deliverydate
	    	data.deliveryoption = result[0].deliveryoption
	    	name = result[0].name
	    	cost = result[0].cost
	    	if(paymentPass){
	    		var emailCallback = function(error){
					if(error){
						return callback(error)
					}
					callback(null, res, template, data);
				}
				req.query.description = "Payment";
				req.query.orderNumber = data.orderNumber;
	        	emailClient.sendEmail(req, req.body.stripeEmail, name, cost, data.deliveryoption, data.deliverydate, emailCallback)
	    	} else {
		        callback(null, res, template, data);    		
	    	}
		});
	}
}

var calculateCost = function(shirtsArray, scorers, shirtPrice, callback){
	async.waterfall([
		    function(asyncCallback) {
				databaseClient.getPrice(asyncCallback)
		    },
		    function(result, asyncCallback){
				var totalCostOfAllShirts = 0;
				var shirtPrice = parseFloat(result[result.length-1].shirtprice)
				var sleevePrice = parseFloat(result[result.length-1].sleeveprice)
				shirtsArray.forEach(function(shirt) {
					var sleeveCost = 0;
					if(shirt.sleeve == "Yes") {
						sleeveCost = sleevePrice ;
					}
					var currentShirtCost = 0;
					var shirtLength = shirt.name.replace(/ /g,"").length
					if(shirtLength <= 10){
						currentShirtCost = shirtPrice;
					} else {
						currentShirtCost = shirtPrice + (shirtLength - 10);
					}
					if(currentShirtCost < shirtPrice || shirt.printingType == "hero") {
						currentShirtCost = shirtPrice;
					}
					var discount = 0;

					for (var i = scorers.length - 1; i >= 0; i--) {
						if(shirt.name.trim() == scorers[i].kitname && shirt.club.toLowerCase().trim() == scorers[i].club.toLowerCase().trim()){
							discount = scorers[i].discount;
						}
					}
					totalCostOfAllShirts = parseFloat(totalCostOfAllShirts) + parseFloat(currentShirtCost) + parseFloat(sleeveCost) - parseFloat(discount);
				});
				asyncCallback(null, totalCostOfAllShirts)
		    }
		], function (err, result) {
			callback(null, result)
		});
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
