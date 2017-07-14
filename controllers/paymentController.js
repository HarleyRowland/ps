var config = require('../config.yaml')
var emailClient = require('../clients/emailClient.js')
var keySecret = process.env.SECRET_KEY;
var stripe = require("stripe")(keySecret);

module.exports = {
	paymentBuilder: function(req, key, callback) {
		var shirtsArray = []
		for ( cookie in req.cookies ) {
			if(cookie.includes("shirt")){
				shirtsArray.push(req.cookies[cookie])
			}
		}
		var cost = 0;
		shirtsArray.forEach(function(shirt) {
			var shirtCost = 0;
			if(shirt.name && shirt.number){
				shirtCost = shirt.name.replace(/ /g,"").length + (shirt.number.replace(/ /g,"").length*5)
				cost = cost + parseInt(shirtCost)
			}
		});
		var jsonArray = JSON.stringify(shirtsArray);
		var data = { data: {jsonArray: jsonArray, cost: cost, key: key}}
		callback("payment.pug", data);
	},

	makePayment: function(req, callback){
		payStripe(req.body.stripeEmail, req.body.stripeToken).then(charge => {
			emailClient.sendMail("Payment", req.body.stripeEmail)
			res.render("paymentResult.pug", {finalCost: req.query.cost});
		})
	}
}

var payStripe = function(email, token){
	let amount = 500;
	stripe.customers.create({
	 	email: email,
		source: token
	})
	.then(customer =>
		stripe.charges.create({
	  		amount,
	  		description: "Sample Charge",
	    	currency: "GBP",
	    	customer: customer.id
		})
	)
}