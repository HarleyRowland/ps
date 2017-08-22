var fs = require('fs')
var async = require('async')
var tidyClient = require('../clients/tidyClient.js')
var databaseClient = require('../clients/databaseClient.js')

module.exports = {
	selectTemplate: function(view, req, callback){
		var viewFields = {
			data: req.query
		} 
		if(view == "club.pug"){
			var clubStats = buildClubsArray(req.query.style)
			viewFields.data.clubsFull = clubStats[0]
			viewFields.data.locations = clubStats[1]
			viewFields.data.stadiums = clubStats[2]
			viewFields.data.capacity = clubStats[3]
			viewFields.data.clubs = []
			viewFields.data.clubsFull.forEach(function(club){
				viewFields.data.clubs.push(nameConverter(club))
			});
			callback(view, viewFields)
		} else if(view == "strip.pug"){
			viewFields.data.clubs = howManyStrips(req.query.club, req.query.style)
			callback(view, viewFields)
		} else if(view == "hero.pug"){
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
				viewFields.data.players = addDiscounts(playersBeforeDiscounts, nameNumberTuple[1], scorers)
				viewFields.data.price = result[result.length-1].shirtprice
				callback(view, viewFields)
			});
		} else {
			callback(view, viewFields)
		}
	},
	confirmation: function(req, callback){
		var viewFields = {
			data: JSON.parse(req.query.shirtObject)
		}
		var sleeveCost = 0;
		if(viewFields.data.sleeve == "Yes"){
			sleeveCost = 7.5;
		}
		viewFields.data.fullCost = parseFloat(viewFields.data.shirtCost) + sleeveCost;
		viewFields.data.displayCost = buildDisplayCost(viewFields.data.fullCost+"")
		viewFields.data.fullClubName = tidyClient.clubName(viewFields.data.club)
		viewFields.data.fullStrip = tidyClient.strip(viewFields.data.strip)
		viewFields.data.fullStyle = tidyClient.style(viewFields.data.style)
		viewFields.data.shirtObject = JSON.stringify(viewFields.data)
		callback(viewFields)
	},
	getThreeScorers: function(callback){
		var cb = function(err, players){
			console.log("∆∆∆", err, players)
			var amount = 3
			if(players.length < 3) amount = players.length;
			var resultPlayers = getRandom(players, amount)
			callback(resultPlayers);
		}
		databaseClient.getScorers(cb)
	}
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
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

var addDiscounts = function(players, numbers, scorers){
	for (var i = players.length - 1; i >= 0; i--) {
		var name = players[i]
		players[i] = name + " - " + numbers[i]
		scorers.forEach(function(scorer){
			if(scorer.kitname == name){
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
		return "crystalPalace"
	} else if(club == "Everton"){
		return "everton"
	} else if(club == "Huddersfield"){
		return "huddersfield"
	} else if(club == "Hull City") {
		return"hull"
	} else if(club == "Leicester City"){
		return "leicesterCity"
	} else if(club == "Liverpool"){
		return "liverpool"
	} else if(club == "Manchester City"){
		return "manchesterCity"
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