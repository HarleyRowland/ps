var config = require('../config.js');
var nodemailer = require("nodemailer")
var databaseClient = require('./databaseClient.js')
var xoauth2 = require('xoauth2');

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
	sendEmail: function(subject, toEmailAddress, name, cost, orderNumber){
		send(subject, toEmailAddress, name, cost, orderNumber)
	},
	queryEmail: function(name, number, email, comments){
		var emails = [config.email.email]
		var subject = "New Quote Request From " + email
		var content = "<p>Query email from: " + name + " (" + email + "/" + number + ")</p><p> The said: " + comments + "</p>"
		sendMail(emails, emailSubject, content)
	},
	quoteEmail: function(name, email, league, club, strip, year, colour, letter, kitName, kitNumber, comments){
		var emails = [config.email.email]
		var subject = "New Quote Request From " + email
		var content = "<p>Quote email from: " + name + " (" + email + ")</p><p> The Quote: " + comments + "</p><ul><li>League: " + league + "</li><li>Club: " + club + "</li><li>Strip: " + strip + "</li><li>Year: " + year + "</li><li>Colour: " + colour + "</li><li>Letter: " + letter + "</li><li>Kit Name: " + kitName + "</li><li>Kit Number: " + kitNumber + "</li><li>Extra Comments: " + comments + "</li></ul>"
		sendMail(emails, emailSubject, content)
	}
}

var send = function(subject, toEmailAddress, name, cost, orderNumber){
	if(subject == "Payment"){
		var emails = [toEmailAddress, config.email.authorEmail]
		var emailSubject =  subject + " - Order Number: " + orderNumber
		var content = "<p>Hello " + name + ",</p><p>Thank you for your order. Please keep make a note of your order number(" + orderNumber + ").</p><p>The total cost for your order is £" + cost + ".</p><p>Please send or bring your shirt to Suite I, 1 Elwick Road, Ashford, Kent, TN23 1PD. We will notify you when we have recieved your shirt.</p><p>If you have requested letters to be sent to you, we will notify you when they are on their way.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		sendMail(emails, emailSubject, content)
	} else if( subject == "Shirt Received") {
		var emails = [toEmailAddress]
		var emailSubject =  subject + " - Order Number: " + orderNumber
		var content = "<p>Hello " + name + ",</p><p>We have recieved your order.</p><p>We will notify you as soon as it is on its way back to you.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		sendMail(emails, emailSubject, content)
	} else if(subject == "Shirt Sent Back") {
		var emails = [toEmailAddress]
		var emailSubject =  subject + " - Order Number: " + orderNumber
		var content = "<p>Hello " + name + ",</p><p>Your order is on its way to you.</p><p>We Hope you are happy with everything!</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		sendMail(emails, emailSubject, content)
	} 
}

var sendMail = function(emails, subject, html) {
	emails.forEach(function(email){
		var mailOptions = {
			from: config.email.email,
			to: email,
			subject: subject,
			html: html
		}
		transporter.sendMail(mailOptions, function(error, response){
	        if(error){
	            console.error(error);
	        }
	    });
	})
}