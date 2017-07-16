var databaseClient = require('../clients/databaseClient.js')
var eamilClient = require('../clients/emailClient.js')

module.exports = {
	getAll: function(callback){
		databaseClient.getAllOrders(callback)
	},
	updateOrder: function(req, callback){
		databaseClient.update(req, callback)
		emailClient.update(req, callback)
	}
}

