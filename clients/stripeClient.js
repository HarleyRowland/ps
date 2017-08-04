var keySecret = process.env.SECRET_KEY;
var stripe = require("stripe")(keySecret);

module.exports = {
	makePayment: function(cost, email, token, callback){
		console.log("in payment")
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
			console.log("ERROR", err)
			console.log("chare", charge)
		    if (err) {
		    	callback(err)
		    } else {
		    	callback(null, charge)
		    }
		});

		})
	}
}