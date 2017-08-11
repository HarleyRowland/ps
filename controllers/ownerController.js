var async = require('async')
var databaseClient = require('../clients/databaseClient.js')
var emailClient = require('../clients/emailClient.js')

module.exports = {
	getAll: function(callback){
		databaseClient.getAllOrders(callback)
	},
	updateOrder: function(req, res){
		var email = "";
		var name = "";
		async.waterfall([
		    function(callback) {
		        databaseClient.getEmail(req.query.orderNumber, callback);
		    },
		    function(order, callback) {
		    	email = order[0].email;
		    	name = order[0].name;
		        databaseClient.updateOrder(req.query.orderNumber, req.query.shirtid, req.query.description, callback);
		    },
		    function(order, callback) {
		    	callback(null, null)
		        emailClient.sendEmail(req.query.description, email, name, null, req.query.orderNumber)
		    }
		], function (err, result) {
			res.redirect("/userOrders")
		});
	},
	statusesForOrderNo: function(orderNumber, callback){
		databaseClient.statusesForOrderNo(orderNumber, callback);
	},
	queryEmail: function(name, email, number, comments, callback){
		emailClient.queryEmail(name, email, number, comments)
		callback(null);
	},
	quoteEmail: function(name, email, league, club, strip, year, colour, letter, kitName, kitNumber, comments, callback){
		emailClient.quoteEmail(name, email, league, club, strip, year, colour, letter, kitName, kitNumber, comments)
		callback(null);
	}
}

