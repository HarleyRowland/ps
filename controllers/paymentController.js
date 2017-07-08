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
