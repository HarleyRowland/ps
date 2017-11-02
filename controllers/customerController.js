var fs = require('fs')
var async = require('async')
var tidyClient = require('../clients/tidyClient.js')
var databaseClient = require('../clients/databaseClient.js')

module.exports = {
	selectTemplate: function(req, res, template, callback) {
	  	callback(null, res, template, req.query)		
	},
	printingType: function(req, res, template, callback){
		if(req.query.printingType && req.query.printingType == "hero"){
	    	template = "strip.pug";
	  	};
	  	callback(null, res, template, req.query)
	},
	club: function(req, res, template, callback){
		var data = req.query;
		if(req.query.club && req.query.club != "undefined"){
	    	template = "strip.pug";
	  	};
	  	if(req.query.name && req.query.number && req.query.name != "undefined" && req.query.number != "undefined"){
	    	template = "sleeves.pug";
	    }
	    if(template == "club.pug"){
	    	var clubStats = buildClubsArray(req.query.style)
			data.clubsFull = clubStats[0]
			data.clubs = []
			data.clubsFull.forEach(function(club){
				data.clubs.push(nameConverter(club))
			});
	    }
	  	callback(null, res, template, data)
	},
	strip: function(req, res, template, callback){
		var strips = howManyStrips(req.query.club, req.query.style);
		req.query.strips = strips
		callback(null, res, template, req.query);
	},
	heroOrCustom: function(req, res, template, callback){
		var data = req.query;
		if(req.query.printingType == "custom" && req.query.premOrDifferent) {
		    template = "nameNumber.pug";
		   	return callback(null, res, template, data)
		}
		if(req.query.name && req.query.number && req.query.name != "undefined" && req.query.number != "undefined"){
	    	template = "sleeves.pug";
	    	return callback(null, res, template, data)
	    }
		var scorers = [];
		async.waterfall([
		    function(callback) {
				databaseClient.getScorers(callback)
		    },
		    function(players, callback) {
		    	scorers = players;
				databaseClient.getPrice(callback)
		    }
		], function (err, result) {
			var nameNumberTuple = getPlayersAndNumbers(req.query.club, req.query.style)
			var playersBeforeDiscounts = nameNumberTuple[0]
			data.players = addDiscounts(playersBeforeDiscounts, nameNumberTuple[1], scorers, req.query.club)
			data.price = result[result.length-1].shirtprice
		  	callback(null, res, template, data)
		});
	},
	confirmation: function(req, res, template, callback){
		if(!req.query.shirtObject) return callback("Invalid Fields");
		
		var data =  JSON.parse(req.query.shirtObject);
		
		var sleeveCost = 0;
		if(data.sleeve == "Yes"){
			sleeveCost = 7.5;
		}
		data.fullCost = parseFloat(data.shirtCost) + sleeveCost;
		data.displayCost = buildDisplayCost(data.fullCost+"")
		data.fullClubName = tidyClient.clubName(data.club);
		data.fullStrip = tidyClient.strip(data.strip);
		data.fullStyle = tidyClient.style(data.style);
		data.shirtObject = JSON.stringify(data);

		callback(null, res, template, data);
	},
	getThreeScorers: function(res, template, callback){
		var databaseCallback = function(error, players){
			if(error){
				return callback(error);
			}
			var playersToShow = 3;
			if(players.length < playersToShow) {
				playersToShow = players.length;
			}
			var resultPlayers = getRandomPlayers(players, playersToShow);
			resultPlayers.forEach(function(resultPlayer){
				resultPlayer = tidyClient.formatPlayerFromDatabase(resultPlayer)
			})
			callback(null, res, template, resultPlayers);
		}
		databaseClient.getScorers(databaseCallback)
	},
	getScorerDiscounts: function(req, res, template, callback){
		var price;
		async.waterfall([
		    function(asyncCallback) {
		        databaseClient.getPrice(asyncCallback)
		    },
		    function(cost, asyncCallback) {
		        price = parseFloat(cost[cost.length-1].shirtprice);
		        databaseClient.getScorers(asyncCallback)
		    }
		], function (error, players) {
			if(error) {
				return callback(error)
			}
			var data = { clubList: [], players: players}
			players.forEach(function(player){
				player.shirtCost = price-player.discount;
				player.club = player.club.trim();
				player.kitname = player.kitname.trim();
				player.kitnumber = player.kitnumber.trim();
				if(!data.clubList.includes(player.club.trim())){
				  	data.clubList.push(player.club.trim());
				}
			})
			callback(null, res, template, data);
		});
	}
}

function getRandomPlayers(playersArray, playersToShow) {
    var result = new Array(playersToShow),
        playersArrayLength = playersArray.length,
        taken = new Array(playersArrayLength);
    if (playersToShow > playersArrayLength)
        throw new RangeError("getRandom: more elements taken than available");
    while (playersToShow--) {
        var randomIndex = Math.floor(Math.random() * playersArrayLength);
        result[playersToShow] = playersArray[randomIndex in taken ? taken[randomIndex] : randomIndex];
        taken[randomIndex] = --playersArrayLength;
    }
    return result;
}

var howManyStrips = function(club, style){
	var stripCount = 0;
	var imageList = fs.readdirSync("public/images/kits/" + style);
	imageList.forEach(function(imageList){
		if(imageList.includes(club)){
			stripCount = stripCount + 1;
		}
	})
	return stripCount;
}

var buildClubsArray = function(style) {
	var teamStats = ""
	if(style == "current") {
		teamStats = fs.readFileSync('./public/teamListCurrent.txt', 'utf8');
	} else {
		teamStats = fs.readFileSync('./public/teamListPrevious.txt', 'utf8');	
	}
	var teamStatsArray = teamStats.split("\n");
	var names = teamStatsArray[0].split(",")
	var locations = teamStatsArray[1].split(",")
	var stadium = teamStatsArray[2].split(",")
	var capacity = teamStatsArray[3].split(",")
	
	return [names,locations,stadium,capacity];
}

var getPlayersAndNumbers = function(club, style){
	var club = fs.readFileSync('./public/teams/' + style + "/" + club + '.txt', 'utf8');
	var playersAndNumbers = club.split("\n");
	var players = playersAndNumbers[0].split(",")
	var numbers = playersAndNumbers[1].split(",")

	return [players, numbers]
}

var buildDisplayCost = function(cost){
	if(cost.includes(".")){
		var splitCost = cost.split(".")[1];
		if(splitCost.length < 2){
			return cost + "0";
		} else {
			return cost;
		}
	} else {
		return cost;
	}
}

var addDiscounts = function(players, numbers, scorers, club){
	for (var i = players.length - 1; i >= 0; i--) {
		var name = players[i]
		players[i] = name + " - " + numbers[i]
		scorers.forEach(function(scorer){
			if(scorer.kitname == name && scorer.club == club){
				players[i] = players[i] + " (£" + scorer.discount + " off!)"
			}
		});
	}
	return players;
}

var nameConverter = function(club) {
	if(club == "Arsenal") {
		return "arsenal"
	} else if(club == "Bournemouth"){
		return "bournemouth"
	} else if(club == "Brighton and Hove Albion"){
		return "brighton"
	} else if(club == "Burnley"){
		return "burnley"
	} else if(club == "Chelsea"){
		return "chelsea"
	} else if(club == "Crystal Palace"){
		return "crystalpalace"
	} else if(club == "Everton"){
		return "everton"
	} else if(club == "Huddersfield"){
		return "huddersfield"
	} else if(club == "Hull City") {
		return"hull"
	} else if(club == "Leicester City"){
		return "leicestercity"
	} else if(club == "Liverpool"){
		return "liverpool"
	} else if(club == "Manchester City"){
		return "manchestercity"
	} else if(club == "Manchester United"){
		return "manu"
	} else if(club == "Middlesborough") {
		return"middlesborough"
	} else if(club == "Newcastle United"){
		return "newcastle"
	} else if(club == "Southampton"){
		return "southampton"
	} else if(club == "Stoke City"){
		return "stoke"
	} else if(club == "Sunderland"){
		return "sunderland"
	} else if(club == "Swansea City"){
		return "swansea"
	} else if(club == "Tottenham Hotspur"){
		return "tottenham"
	} else if(club == "Watford"){
		return "watford"
	} else if(club == "West Brom"){
		return "westbrom"
	} else if(club == "West Ham"){
		return "westham"
	} else {
		return club;
	}
}