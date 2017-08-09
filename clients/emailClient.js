var config = require('../config.js');
var nodemailer = require("nodemailer")
var smtpTransport = require("nodemailer-smtp-transport")
var databaseClient = require('./databaseClient.js')
var fs = require("fs")

// var transporterDetails = {
//     service: config.email.service,
//     host: config.email.host,
//     auth: {
//         user: config.email.email,
//         pass: config.email.password
//     }
// }

// var transporterDetails = {
//     host: "aventador.websitewelcome.com",
//     port: 465,
//     auth: {
//         user: "sales@premiershirts.co.uk",
//         pass: "Gregiscool!"
//     }
// }

var transporterDetails = smtpTransport({
    host: 'aventador.websitewelcome.com',
    port: 465,
    secure: true,
    auth: {
        user: "sales@premiershirts.co.uk",
        pass: "Gregiscool!"
    },
    maxConnections: 5,
    maxMessages: 10
})

module.exports = {
	sendEmail: function(subject, toEmailAddress, name, cost, orderNumber){
		var transporter = nodemailer.createTransport(transporterDetails);
		send(transporter, subject, toEmailAddress, name, cost, orderNumber)
	},
	queryEmail: function(name, number, email, comments){
		// var transporter = nodemailer.createTransport(transporterDetails);
		var transporter = nodemailer.createTransport(smtpTransport('SMTP',{
		        host: 'aventador.websitewelcome.com',
		        port: 465,
		        auth: {
			        user: "sales@premiershirts.co.uk",
			        pass: "Gregiscool!"
			    },          
		        authMethod:'NTLM',
		        secure:false
		    })
		);
		console.log("gello")
		var mailOptions = {
			from: 'sales@premiershirts.co.uk',
			to: 'harleyrowland17@gmail.com',
			subject: "New Query From " + email,
			html: "<p>Query email from: " + name + " (" + email + "/" + number + ")</p><p> The said: " + comments + "</p>"
		};
		transporter.sendMail(mailOptions);
	},
	quoteEmail: function(name, email, league, club, strip, year, colour, letter, kitName, kitNumber, comments){
		var transporter = nodemailer.createTransport(transporterDetails);
		var mailOptions = {
			from: 'harleyrowland17@gmail.com',
			to: 'harleyrowland17@gmail.com',
			subject: "New Quote Request From " + email,
			html: "<p>Quote email from: " + name + " (" + email + ")</p><p> The Quote: " + comments + "</p><ul><li>League: " + league + "</li><li>Club: " + club + "</li><li>Strip: " + strip + "</li><li>Year: " + year + "</li><li>Colour: " + colour + "</li><li>Letter: " + letter + "</li><li>Kit Name: " + kitName + "</li><li>Kit Number: " + kitNumber + "</li><li>Extra Comments: " + comments + "</li></ul>"
		};
		transporter.sendMail(mailOptions);
	}
}

var send = function(transporter, subject, toEmailAddress, name, cost, orderNumber){
	if(subject == "Payment"){
		var mailOptions = {
			from: 'harleyrowland17@gmail.com',
			to: 'harleyrowland17@gmail.com',
			subject: subject + " - Order Number: " + orderNumber,
			html: "<p>Hello " + name + ",</p><p>Thank you for your order. Please keep make a note of the order number " + orderNumber + ".</p><p>The total cost for your order is £" + cost + ".</p><p>Please send or bring your shirt to Suite I, 1 Elwick Road, Ashford, Kent, TN23 1PD, Test. We will notify you when we have recieved your shirt.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		};
		transporter.sendMail(mailOptions);
	} else if( subject == "Shirt Received") {
		var mailOptions = {
			from: 'harleyrowland17@gmail.com',
			to: 'harleyrowland17@gmail.com',
			subject: subject + " - Order Number: " + orderNumber,
			html: "<p>Hello " + name + ",</p><p>We have recieved your order.</p><p>We will notify you as soon as your order is being sent back to you.</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		};
		transporter.sendMail(mailOptions);
	} else if( subject == "Shirt Sent Back") {
		var mailOptions = {
			from: 'harleyrowland17@gmail.com',
			to: 'harleyrowland17@gmail.com',
			subject: subject + " - Order Number: " + orderNumber,
			html: "<p>Hello " + name + ",</p><p>Your order is on its way to you.</p><p>We hope you are happy with your customised shirt(s)!</p><p>Kind Regards,</p><p>The Premier Shirts Team</p>"
		};
		transporter.sendMail(mailOptions);
	} 
}