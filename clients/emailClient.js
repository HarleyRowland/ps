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
	sendEmail: function(subject, toEmailAddress, orderNumber, callback){
		var transporter = nodemailer.createTransport(transporterDetails);
		var mailOptions = {
			from: 'harleyrowland17@gmail.com',
			to: toEmailAddress,
			subject: subject + " - " + orderNumber,
			html: fs.readFileSync('emailTemplates/' + subject + '.txt', 'utf8')
		};
		transporter.sendMail(mailOptions, function(err, info){
			if(err){
				console.log(err);
				callback(err);
			} else {
				console.log(info);
				callback()
			};
		});
	}
}
