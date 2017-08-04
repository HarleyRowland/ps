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
		    function(callback) {
		        databaseClient.updateOrder(req.query.orderNumber, req.query.shirtid, req.query.description, callback);
		    },
		    function(callback) {
		        emailClient.sendEmail("payment", req.query.email, req.query.orderNumber, callback)
		    }
		], function (err, result) {
			res.redirect("/userOrders")
		});
	},
	statusesForOrderNo: function(orderNumber, callback){
		databaseClient.statusesForOrderNo(orderNumber, callback);
	}
}

