var config = require('../config.js');
var nodemailer = require("nodemailer")
var databaseClient = require('./databaseClient.js')
var async = require('async');

var transporter = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config.email.email,
        clientId: config.email.clientID,
        clientSecret: config.email.clientSecret,
        refreshToken: config.email.refreshToken,
        accessToken: config.email.accessToken
    }
}));

module.exports = {
	sendEmail: function(req, email, name, cost, deliveryOption, deliveryDate, callback){
		send(req.query.description, email, name, cost, req.query.orderNumber, deliveryOption, deliveryDate, callback);
	},
	queryEmail: function(req, callback){
		var emails = [config.email.email]
		var subject = "New Query Request From " + req.query.email
		var content = "<p>Query email from: " + req.query.name + " (" + req.query.email + "/" + req.query.number + ")</p><p> They said: " + req.query.comments + "</p>"
		sendMail(emails, subject, content, callback)
	},
	quoteEmail: function(req, callback){
		var emails = [config.email.email];
		var subject = "New Quote Request From " + req.query.email;
		var content = "<p>Quote email from: " + req.query.name + " (" + req.query.email + ")</p><p> The Quote: " + req.query.comments + "</p><ul><li>League: " + req.query.league + "</li><li>Club: " + req.query.club + "</li><li>Strip: " + req.query.strip + "</li><li>Year: " + req.query.year + "</li><li>Colour: " + req.query.colour + "</li><li>Letter: " + req.query.letter + "</li><li>Kit Name: " + req.query.kitName + "</li><li>Kit Number: " + req.query.kitNumber + "</li><li>Extra Comments: " + req.query.comments + "</li></ul>";
		sendMail(emails, subject, content, callback);
	}
}

var send = function(subject, toEmailAddress, name, cost, orderNumber, deliveryOption, deliveryDate, callback){
	var emails, emailSubject, content;
	if(subject == "Payment"){
		emails = [toEmailAddress, config.email.authorEmail, config.email.email]
		emailSubject =  subject + " - Order Number: " + orderNumber
		if(deliveryOption == "post") {
			content = "<p>Hello " + name + ",</p><p>Thank you for your order. Please keep make a note of your order number(" + orderNumber + ").</p><p>The total cost for your order is £" + cost + ".</p><p>Please deliver your shirt to Suite I, 1 Elwick Road, Ashford, Kent, TN23 1PD. We will notify you when we have recieved your shirt.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		} else if(deliveryOption == "bring"){
			content = "<p>Hello " + name + ",</p><p>Thank you for your order. Please keep make a note of your order number(" + orderNumber + ").</p><p>The total cost for your order is £" + cost + ".</p><p>Please bring your shirt to Suite I, 1 Elwick Road, Ashford, Kent, TN23 1PD on " + deliveryDate + " and you can take them away the same day.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		} else {
			content = "<p>Hello " + name + ",</p><p>Thank you for your order. Please keep make a note of your order number(" + orderNumber + ").</p><p>The total cost for your order is £" + cost + ".</p><p>We will notify you when your letters are on their way.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"		
		}
	} else if( subject == "Shirt Received") {
		emails = [toEmailAddress]
		emailSubject =  subject + " - Order Number: " + orderNumber
		content = "<p>Hello " + name + ",</p><p>We have recieved your order.</p><p>We will notify you as soon as it is on its way back to you.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
	} else if(subject == "Shirt Sent Back") {
		emails = [toEmailAddress]
		emailSubject =  subject + " - Order Number: " + orderNumber
		content = "<p>Hello " + name + ",</p><p>Your order is on its way to you.</p><p>We Hope you are happy with everything!</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
	} 
	sendMail(emails, emailSubject, content, callback)
}

var sendMail = function(emails, subject, html, callback) {
	async.eachSeries(emails, function(email, asyncCallback) {
		var mailOptions = {
			from: "Premier Shirts Sales <" + config.email.email + ">",
			to: email,
			subject: subject,
			html: html
		}
	    transporter.sendMail(mailOptions, function(error, response){
			if(error){
				return asyncCallback(error)
			}
	        asyncCallback()
	    });
	}, function(error) {
	    callback(error);
	});
}