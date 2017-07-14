var fs = require('fs')

module.exports = {
	selectTemplate: function(view, req, callback){
		var viewFields = {
			data: req.query
		} 
		if(view == "club.pug"){
			viewFields.data.clubsFull = buildClubsArray()
			viewFields.data.clubs = []
			viewFields.data.clubsFull.forEach(function(club){
				viewFields.data.clubs.push(nameConverter(club))
			});
		} else if(view == "strip.pug"){
			viewFields.data.clubs = howManyStrips(req.query.club)
		} else if(view == "hero.pug"){
			var nameNumberTuple = getPlayersAndNumbers(req.query.club)
			viewFields.data.players = nameNumberTuple[0]
			viewFields.data.numbers = nameNumberTuple[1]
		}
		callback(view, viewFields)
	}
}

var howManyStrips = function(club){
	var stripCount = 0;
	var imageList = fs.readdirSync("public/images/kits");
	imageList.forEach(function(imageList){
		if(imageList.includes(club)){
			stripCount = stripCount + 1;
		}
	})
	return stripCount;
}

var buildClubsArray = function() {
	var clubs = fs.readFileSync('./public/teamList.txt', 'utf8');
	var clubsArray = clubs.split(",");
	return clubsArray;
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
	} else if(club == "Leicester City"){
		return "leicesterCity"
	} else if(club == "Liverpool"){
		return "liverpool"
	} else if(club == "Manchester City"){
		return "manchesterCity"
	} else if(club == "Manchester United"){
		return "manu"
	} else if(club == "Newcastle United"){
		return "newcastle"
	} else if(club == "Southampton"){
		return "southampton"
	} else if(club == "Stoke City"){
		return "stoke"
	} else if(club == "Swansea City"){
		return "swansea"
	} else if(club == "Tottenham Hotspur"){
		return "tottenham"
	} else if(club == "Watford"){
		return "watford"
	} else if(club == "West Bromich Albion"){
		return "westbrom"
	} else if(club == "West Ham"){
		return "westham"
	} else {
		return club;
	}
}