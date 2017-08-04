var config = require('../config.yaml')
var nodemailer = require("nodemailer")
var databaseClient = require('./databaseClient.js')
var fs = require("fs")

var transporterDetails = {
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "harleyrowland17@gmail.com",
        pass: "Omg_0923"
    }
}

module.exports = {
	sendEmail: function(subject, toEmailAddress, name, cost, orderNumber){
		var transporter = nodemailer.createTransport(transporterDetails);
		var html = "";
		if(subject = "Payment"){
			html = getPaymentHTML(name, cost, orderNumber);
		}
		var mailOptions = {
			from: 'harleyrowland17@gmail.com',
			to: toEmailAddress,
			subject: subject + " - " + orderNumber,
			html: html
		};
		transporter.sendMail(mailOptions);
	}
}

var getPaymentHTML = function(name, cost, orderNumber){
	return "<p>Hello " + name + ",</p><p>Thank you for your order. Please keep make a note of the order number " + orderNumber + ".</p><p>The total cost for your order is £" + cost + ".</p><p>Please send or bring your shirt to 123 Test Lane, Test. We will notify you when we have recieved your shirt.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
}