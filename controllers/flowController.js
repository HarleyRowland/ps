var fs = require('fs')
var lineReader = require('readline')



module.exports = {
	flow: function(view, dirname, req, callback){
		var viewObject = buildObject(dirname, view, req.query)	
		callback(view, viewObject)
	}
}

var buildObject = function(dirname, view, query){
	if(view == "index.pug"){
		return {data:{}}
	} else if(view == "year.pug"){
		return {data: {deliveryType: query.deliveryType}}
	} else if(view == "printingType.pug"){
		return {data: {deliveryType: query.deliveryType, style: query.style}}
	} else if(view == "club.pug"){ 
		var clubs = fs.readFileSync(dirname + '/public/teamList.txt', 'utf8');
		var clubsArray = clubs.split(",");
		if(query.premOrDifferent){
			return {data : {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, clubs: clubsArray, premOrDifferent: query.premOrDifferent}}
		} else {
			return {data : {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, clubs: clubsArray}}
		}
	} else if(view == "strip.pug"){
		var stripCount = howManyStrips(query.club)
		return {data: {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, club: query.club, stripCount: stripCount, premOrDifferent: query.premOrDifferent}}
	} else if(view == "nameNumber.pug"){
		if(query.premOrDifferent == "different"){
			return {data: {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, premOrDifferent: query.premOrDifferent, colour: query.colour, letter: query.letter}}
		} else {
			return {data: {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, premOrDifferent: query.premOrDifferent, colour: query.colour, letter: query.letter, club: query.club, strip: query.strip}}
		}
	} else if(view == "hero.pug"){
		var club = fs.readFileSync(dirname + '/public/teams/' + query.club + '.txt', 'utf8');
		var playersAndNumbers = club.split("\n");
		var players = playersAndNumbers[0].split(",")
		var numbers = playersAndNumbers[1].split(",")

		for (var i = players.length - 1; i >= 0; i--) {
			playersAndNumbers[i] = players[i] + " - " + numbers[i]
		}
		return {data: {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, club: query.club, strip: query.strip, players: players, numbers: numbers, playersAndNumbers: playersAndNumbers}}
	} else if(view == "premOrDifferent.pug"){
		return {data: {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType}}
	} else if(view == "colour.pug") {
		return {data: {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, premOrDifferent: query.premOrDifferent}}
	} else if(view == "letter.pug") {
		return {data: {deliveryType: query.deliveryType, style: query.style, printingType: query.printingType, premOrDifferent: query.premOrDifferent, colour: query.colour}}
	} else if(view == "sleeves.pug") {
		console.log(query)
		return {data: {letter: query.letter, colour: query.colour, printingType: query.printingType, deliveryType: query.deliveryType, style: query.style, premOrDifferent: query.premOrDifferent, name: query.name, number: query.number, club: query.club, strip: query.strip, strip: query.strip, playerNumber: query.playerNumber, cost: query.cost}}
	} else if(view == "payment.pug"){
		console.log(query)
		if(query.printingType == "hero"){
			return {data: {printingType: query.printingType, deliveryType: query.deliveryType, style: query.style, club: query.club, strip: query.strip, playerNumber: query.playerNumber, cost: query.cost}}
		} else if(query.printingType == "custom" && query.premOrDifferent == "prem"){
			return {data: {printingType: query.printingType, deliveryType: query.deliveryType, style: query.style, club: query.club, strip: query.strip, name: query.name, number: query.number, cost: query.cost}}
		} else if(query.premOrDifferent == "different") {
			return {data: {printingType: query.printingType, deliveryType: query.deliveryType, style: query.style, letter: query.letter, colour: query.colour, name: query.name, number: query.number, premOrDifferent: query.premOrDifferent, cost: query.cost}}
		}
	} else{
		return {}
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

var nameConverter = function(name){
	if(name == "Arsenal"){
		return "arsenal"
	} else if(name == "Bournemouth"){
		return "bournemouth"
	} else if(name == "Brighton and Hove Albion"){
		return "brighton"
	} else if(name == "Burnley"){
		return "burnley"
	} else if(name == "Chelsea"){
		return "chelsea"
	} else if(name == "Crystal Palace"){
		return "crystalPalace"
	} else if(name == "Everton"){
		return "everton"
	} else if(name == "Huddersfield"){
		return "huddersfield"
	} else if(name == "Leicester City"){
		return "leicesterCity"
	} else if(name == "Liverpool"){
		return "liverpool"
	} else if(name == "Manchester City"){
		return "manchesterCity"
	} else if(name == "Manchester United"){
		return "manu"
	} else if(name == "Newcastle United"){
		return "newcastle"
	} else if(name == "Southampton"){
		return "southampton"
	} else if(name == "Stoke City"){
		return "stoke"
	} else if(name == "Swansea City"){
		return "swansea"
	} else if(name == "Tottenham Hotspur"){
		return "tottenham"
	} else if(name == "Watford"){
		return "watford"
	} else if(name == "West Bromich Albion"){
		return "westbrom"
	} else if(name == "West Ham"){
		return "westham"
	} 
}