var config = require('../config.yaml')
var pg = require('pg');
var async = require('async');
var conString = 'postgres://wjjqnjduyhktca:8ef3e929ad76924d6892432179d558d24dfb798a48f57223f75eef58c66dc2ac@ec2-23-21-96-159.compute-1.amazonaws.com/wjjqnjduyhktca&ssl=true'

module.exports = {
	newOrder: function(req, callback){
		var shirtsQueries = [];
		var address = buildAddress(req.query);
		var orderQuery = 'INSERT INTO orders(name, email, address, cost) VALUES (\'' + req.query.name + '\', \'' + req.body.stripeEmail + '\', \'' + address + '\', ' + req.query.cost + ');'
		shirtsQueries.push(orderQuery);

		var getID = '(SELECT ordernumber FROM orders WHERE ordernumber = (select max(orderNumber) from orders WHERE email=\'' + req.body.stripeEmail + '\'))'
		var statusQuery = 'INSERT INTO statuses(orderNumber, dateChanged, description) VALUES (' + getID + ', now(), \'Waiting for shirt\');'
		shirtsQueries.push(statusQuery);

		var shirts = JSON.parse(req.query.shirtArray)
		shirts.forEach(function(shirt) {
			if(shirt.club && shirt.strip){
				var query = 'INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) VALUES (' + getID + ', \'' + shirt.sleeve + '\', \'' + shirt.name + '\', \'' + shirt.number + '\', \'' + shirt.deliveryType + '\', \'' + shirt.printingType + '\', \'' + shirt.style + '\', \'' + shirt.club + '\', \'' + shirt.strip + '\')'
				shirtsQueries.push(query)
			} else if(shirt.colour && shirt.letter){
				var query = 'INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, colour, letter, strip) VALUES (' + getID + ', \'' + shirt.sleeve + '\', \'' + shirt.name + '\', \'' + shirt.number + '\', \'' + shirt.deliveryType + '\', \'' + shirt.printingType + '\', \'' + shirt.style + '\', \'' + shirt.colour + '\', \'' + shirt.letter + '\')'
				shirtsQueries.push(query)
			}
		})

		async.eachSeries(shirtsQueries, function(sql, cb) {
		    query("INSERT", sql, cb)
		}, function(err) {
		    if( err ) {
		    	callback(err)
		    } else {
		    	callback(null, getID)
		    }
		});
	},
	getAllOrders: function(callback){
		var sql = 'SELECT  o.*, sh.*, s.description, s.dateChanged FROM ( SELECT  s.ordernumber, MAX(s.dateChanged) AS maxDate FROM statuses s GROUP BY s.ordernumber) d JOIN statuses s ON s.ordernumber = d.ordernumber AND s.dateChanged = d.maxDate JOIN orders o ON o.ordernumber = s.ordernumber JOIN shirts sh ON o.ordernumber = sh.ordernumber;'
		query("SELECT", sql, callback);
	},
	updateOrder: function(orderNumber, shirtid, description, callback){
		var statusQuery = 'INSERT INTO statuses(orderNumber, dateChanged, description) VALUES (\'' + orderNumber + '\', now(), \'' + description + '\');'
		query("INSERT", statusQuery, callback);
	},
	getEmail: function(orderNumber, callback){
		var statusQuery = 'SELECT email FROM orders WHERE ordernumber=' + orderNumber + ';'
		query("INSERT", statusQuery, callback);
	},
	statusesForOrderNo: function(ordernumber, callback){
		var orderNoQuery = 'SELECT * FROM orders WHERE ordernumber=' + ordernumber;
		query('SELECT', orderNoQuery, callback)
	}
}

var query = function(type, sqlQuery, callback) {
	var client = new pg.Client({
	    user: "wjjqnjduyhktca",
	    password: "8ef3e929ad76924d6892432179d558d24dfb798a48f57223f75eef58c66dc2ac",
	    database: "ddgf1kja4g6fpg",
	    port: 5432,
	    host: "ec2-23-21-96-159.compute-1.amazonaws.com",
	    ssl: true
  	});

  	client.connect()
  	var result = client.query(sqlQuery);

  	var rows = []
	result.on('error', function(err) {
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
	address = address + ", " + query.town.trim() + ", " + query.county.trim() + ", " + query.postcode.trim(); 

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