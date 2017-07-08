var fs = require('fs')

module.exports = {
	flow: function(view, req, callback){
		console.log(view)
		var viewFields = {
			data: req.query
		} 
		if(view == "club.pug"){
			viewFields.data.clubs = buildClubsArray()
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
	return clubs.split(",");
}

var getPlayersAndNumbers = function(club){
	var club = fs.readFileSync('./public/teams/' + club + '.txt', 'utf8');
	var playersAndNumbers = club.split("\n");
	var players = playersAndNumbers[0].split(",")
	var numbers = playersAndNumbers[1].split(",")

	return [players, numbers]
}