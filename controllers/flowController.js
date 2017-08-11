var fs = require('fs')
var tidyClient = require('../clients/tidyClient.js')

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
		} else if(view == "strip.pug"){
			viewFields.data.clubs = howManyStrips(req.query.club, req.query.style)
		} else if(view == "hero.pug"){
			var nameNumberTuple = getPlayersAndNumbers(req.query.club)
			viewFields.data.players = nameNumberTuple[0]
			viewFields.data.numbers = nameNumberTuple[1]
		}
		callback(view, viewFields)
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
		viewFields.data.fullClubName = tidyClient.clubName(viewFields.data.club)
		viewFields.data.fullStrip = tidyClient.strip(viewFields.data.strip)
		viewFields.data.fullStyle = tidyClient.style(viewFields.data.style)
		viewFields.data.shirtObject = JSON.stringify(viewFields.data)
		callback(viewFields)
	}
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
	console.log(style)
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

var getPlayersAndNumbers = function(club){
	var club = fs.readFileSync('./public/teams/' + club + '.txt', 'utf8');
	var playersAndNumbers = club.split("\n");
	var players = playersAndNumbers[0].split(",")
	var numbers = playersAndNumbers[1].split(",")

	return [players, numbers]
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