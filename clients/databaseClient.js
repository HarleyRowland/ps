var config = require('../config.js');
var pg = require('pg');
var async = require('async');

module.exports = {
	newOrder: function(req, callback){
		var shirtsQueries = [];
		var address = buildAddress(req.query);
		var orderQuery = 'INSERT INTO orders(name, email, address, telephone, cost, deliveryOption, deliverydate) VALUES (\'' + req.query.name + '\', \'' + req.body.stripeEmail + '\', \'' + address + '\', \'' + req.query.telephone + '\', ' + req.query.cost + ', \'' + req.query.deliveryOption + '\', \'' + req.query.date + '\');'
		shirtsQueries.push(orderQuery);

		var getID = '(SELECT ordernumber FROM orders WHERE ordernumber = (select max(orderNumber) from orders WHERE email=\'' + req.body.stripeEmail + '\'))'
		var statusQuery = 'INSERT INTO statuses(orderNumber, dateChanged, description) VALUES (' + getID + ', now(), \'Waiting for shirt\');'
		shirtsQueries.push(statusQuery);

		var shirts = JSON.parse(req.query.shirtArray)
		shirts.forEach(function(shirt) {
			if(shirt.club && shirt.strip){
				var query = 'INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, adultorchild, style, club, strip) VALUES (' + getID + ', \'' + shirt.sleeve + '\', \'' + shirt.name + '\', \'' + shirt.number + '\', \'' + shirt.deliveryType + '\', \'' + shirt.printingType + '\', \'' + shirt.childOrAdult + '\', \'' + shirt.style + '\', \'' + shirt.club + '\', \'' + shirt.strip + '\')'
				shirtsQueries.push(query)
			} else if(shirt.colour && shirt.letter){
				var query = 'INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, adultorchild, style colour, letter) VALUES (' + getID + ', \'' + shirt.sleeve + '\', \'' + shirt.name + '\', \'' + shirt.number + '\', \'' + shirt.deliveryType + '\', \'' + shirt.printingType + '\', \'' + shirt.childOrAdult + '\', \'' + shirt.style + '\', \'' + shirt.colour + '\', \'' + shirt.letter + '\')'
				shirtsQueries.push(query)
			}
		})

		async.eachSeries(shirtsQueries, function(sql, cb) {
			console.log(sql);
		    query("INSERT", sql, cb)
		}, function(err) {
		    if( err ) {
		    	callback(err)
		    } else {
		    	callback()
		    }
		});
	},
	getAllOrders: function(callback){
		var sql = 'SELECT  o.*, sh.*, s.description, s.dateChanged FROM ( SELECT  s.ordernumber, MAX(s.dateChanged) AS maxDate FROM statuses s GROUP BY s.ordernumber) d JOIN statuses s ON s.ordernumber = d.ordernumber AND s.dateChanged = d.maxDate JOIN orders o ON o.ordernumber = s.ordernumber JOIN shirts sh ON o.ordernumber = sh.ordernumber;'
		query("SELECT", sql, callback);
	},
	getIDForOrder: function(email, callback){
		var getID = 'SELECT * FROM orders WHERE ordernumber = (select max(orderNumber) from orders WHERE email=\'' + email + '\')';
		query("SELECTID", getID, callback)
	},
	updateOrder: function(orderNumber, shirtid, description, callback){
		var statusQuery = 'INSERT INTO statuses(orderNumber, dateChanged, description) VALUES (\'' + orderNumber + '\', now(), \'' + description + '\');'
		query("INSERT", statusQuery, callback);
	},
	getEmail: function(orderNumber, callback){
		var statusQuery = 'SELECT * FROM orders WHERE ordernumber=' + orderNumber + ';'
		console.log(statusQuery)
		query("SELECTID", statusQuery, callback);
	},
	statusesForOrderNo: function(ordernumber, callback){
		var orderNoQuery = 'SELECT o.*, s.*, sh.* FROM orders o INNER JOIN statuses s ON o.ordernumber = s.ordernumber INNER JOIN shirts sh ON s.ordernumber=sh.ordernumber WHERE o.ordernumber=' + ordernumber + ';'
		query('SELECT', orderNoQuery, callback)
	}
}

var query = function(type, sqlQuery, callback) {
	var client = new pg.Client({
	    user: config.database.user,
	    password: config.database.password,
	    database: config.database.name,
	    port: config.database.port,
	    host: config.database.host,
	    ssl: config.database.ssl
  	});

  	client.connect()
  	var result = client.query(sqlQuery);

  	var rows = []
	result.on('error', function(err) {
		console.log("pg", err)
	    return callback(err)
	});

	result.on('row', function(row, res) {
		if(sqlQuery.includes("SELECT")){
			rows.push(row);
		}
	});

	result.on('end', function() {
	    client.end();
	    if(type == "SELECT"){
	    	callback(null, "userUpdates.pug", rows);
		} else if("SELECTID"){
	    	console.log("THE ROWS: ",rows);
			callback(null, rows);
		} else {
			callback()
		}
	});

}

var buildAddress = function(query){
	var address = query.line1.trim();
	if(query.line2 != ""){
		address = address + ", " + query.line2.trim();
	}
	address = address + ", " + query.town.trim() + ", " + query.county.trim() + ", " + query.postcode.trim() + ", " + query.country.trim();

	return address;
}

var toBoolean = function(string){
	if(string.toLowerCase() == "no"){
		return false;
	} else if(string.toLowerCase() == "yes") {
		return true;
	} else {
		return true;
	}
}