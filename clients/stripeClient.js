var keySecret = process.env.SECRET_KEY;
var stripe = require("stripe")(keySecret);

module.exports = {
	makePayment: function(subject, toEmailAddress){
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
}
