var config = require('../config.yaml')
module.exports = {
	insertOrder: function(){
		
	}
}

var query = function(sqlQuery) {
	var client = new pg.Client({
	    user: "wjjqnjduyhktca",
	    password: "8ef3e929ad76924d6892432179d558d24dfb798a48f57223f75eef58c66dc2ac",
	    database: "ddgf1kja4g6fpg",
	    port: 5432,
	    host: "ec2-23-21-96-159.compute-1.amazonaws.com",
	    ssl: true
  	});
  	client.connect();
}