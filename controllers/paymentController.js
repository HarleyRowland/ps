var config = require('../config.yaml')
var emailClient = require('../clients/emailClient.js')

module.exports = {
	makePayment: function(req, callback){
		payStripe(req.body.stripeEmail, req.body.stripeToken).then(charge => {
			emailClient.sendMail("Payment", req.body.stripeEmail)
			res.render("paymentResult.pug", {finalCost: req.query.finalCost});
		})
	}
}

var payStripe = function(email, token){
	let amount = 500;
	stripe.customers.create({
	 	email: email,
		source: token
	}).then(customer =>
		stripe.charges.create({
	  		amount,
	  		description: "Sample Charge",
	    	currency: "GBP",
	    	customer: customer.id
		}))
}