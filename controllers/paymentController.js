module.exports = {
	makePayment: function(view, req, callback){
		let amount = 500;
		stripe.customers.create({
		 email: req.body.stripeEmail,
		source: req.body.stripeToken
		})
		.then(customer =>
		stripe.charges.create({
		  amount,
		  description: "Sample Charge",
		     currency: "GBP",
		     customer: customer.id
		}))
		.then(charge => {
		var transporter = nodemailer.createTransport({
		    service: 'Gmail',
		    auth: {
		        user: 'harleyrowland17@gmail.com', // Your email id
		        pass: 'Omg_0923' // Your password
		    }
		});
		var text = 'Payment made from \n\n Harley';
		var mailOptions = {
		  from: 'harleyrowland17@gmail.com', // sender address
		  to: req.body.stripeEmail, // list of receivers
		  subject: 'Email Example',
		  html: fs.readFileSync('emailTemplates/orderProcessed.txt', 'utf8')
		};
		transporter.sendMail(mailOptions, function(error, info){
		  if(error){
		      console.log(error);
		      res.json({yo: 'error'});
		  }else{
		      console.log('Message sent: ' + info.response);
		      res.json({yo: info.response});
		  };
		});
		res.render("paymentResult.pug", {finalCost: req.query.finalCost});
		})
	}
}
