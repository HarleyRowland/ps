var config = require('../config.yaml')
module.exports = {
	sendEmail: function(subject, toEmailAddress){
		var transporter = nodemailer.createTransport(config.transporterDetails);
		var mailOptions = {
			from: 'harleyrowland17@gmail.com',
			to: toEmailAddress,
			subject: subject,
			html: fs.readFileSync('emailTemplates/orderProcessed.txt', 'utf8')
		};
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				console.log(error);
				res.json({yo: 'error'});
			} else {
				console.log('Message sent: ' + info.response);
				res.json({yo: info.response});
			};
		});
	}
}
