var config = require('../config.js');
var keySecret = config.database.secretKey;
var stripe = require("stripe")(keySecret);

module.exports = {
	makePayment: function(cost, email, token, callback){
		stripe.customers.create({
		 	email: email,
			source: token
		})
		.then(function(customer){
			stripe.charges.create({
	    	amount: cost,
	    	currency: 'gbp',
	    	customer: customer.id
		}, function(err, charge) {
		    if (err) {
		    	callback(err)
		    } else {
		    	callback(null, charge)
		    }
		});

		})
	}
}