var randomstring = require('randomstring');
var async = require('async')
var sha256 = require('sha256')
var databaseClient = require('../clients/databaseClient.js')
var emailClient = require('../clients/emailClient.js')
var config = require('../config.js');

var authenticationSha = ""

module.exports = {
	authenticate: function(req, res, template, callback){
		var username = sha256(config.adminUsername)
		var password = sha256(config.adminPassword)
		if(username == req.query.username && password == req.query.password){
			authenticationSha = sha256(randomstring.generate())
			res.cookie("authenticated", authenticationSha)
		}
		callback(null, res, template, req.query)		
	},
	verify: function(req, res){
		var authenticated = false;
		if(authenticationSha == req.cookies["authenticated"]){
			authenticated = true;
		}
		return authenticated;	
	},
	selectTemplate: function(req, res, template, callback){
		callback(null, res, template, req.query)		
	},
	getAllUserOrders: function(res, template, callback){
		var databaseCallback = function(error, data){
			if(error){
				return callback(error)
			}
			callback(null, res, template, data);
		}
		databaseClient.getAllOrders(databaseCallback)
	},
	updateOrder: function(req, res, redirectRoute, callback){
		var email, name;
		async.waterfall([
		    function(callback) {
		        databaseClient.getEmail(req, callback);
		    },
		    function(order, callback) {
		    	email = order[0].email;
		    	name = order[0].name;
		        databaseClient.updateOrder(req, callback);
		    },
		    function(callback) {
		        emailClient.sendEmail(req, email, name, null, null, null, callback)
		    }
		], function (error, result) {
			if(error){ 
				return callback(error);
			}
			callback(null, res, redirectRoute)
		});
	},
	statusesForOrderNo: function(req, res, template, callback){
		var databaseCallback = function(error, data){
			if(error){
				return callback(error)
			}
			callback(null, res, template, data);
		}
		databaseClient.statusesForOrderNo(req, databaseCallback);
	},
	queryEmail: function(req, res, template, callback){
		var emailCallback = function(error){
			if(error){
				return callback(error)
			}
			callback(null, res, template, {emailSent: true});
		}
		emailClient.queryEmail(req, emailCallback)
	},
	quoteEmail: function(req, res, template, callback){
		var emailCallback = function(error){
			if(error){
				return callback(error)
			}
			callback(null, res, template, {emailSent: true});
		}
		emailClient.quoteEmail(req, emailCallback)
	},
	updatePrice(req, res, redirectRoute, callback){
		var databaseCallback = function(error){
			if(error){
				return callback(error)
			}
			callback(null, res, redirectRoute);
		}
		databaseClient.updatePrice(req, databaseCallback);
	},
	inputScorers(req, res, redirectRoute, callback){
		var databaseCallback = function(error){
			if(error){
				return callback(error)
			}
			callback(null, res, redirectRoute);
		}
		databaseClient.updatePlayers(req, databaseCallback);
	},
	clearScorers(res, template, callback){
		var databaseCallback = function(error){
			if(error){
				return callback(error)
			}
			callback(null, res, template, {});
		}
		databaseClient.clearScorers(databaseCallback);
	},
	getScorers(res, template, callback){
		var databaseCallback = function(error, data){
			if(error){
				return callback(error)
			}
			callback(null, res, template, data);
		}
		databaseClient.getScorersAdmin(databaseCallback)
	},
	sendToWebmail(res){
		res.writeHead(301, {Location: 'http://greg-thompson.com/webmail'});
		res.end();
	}
}

