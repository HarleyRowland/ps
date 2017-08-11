module.exports = {
	clubName: function(club){
		if(club == "arsenal") {
			return "Arsenal"
		} else if(club == "bournemouth"){
			return "Bournemouth"
		} else if(club == "brighton"){
			return "Brighton and Hove Albion"
		} else if(club == "burnley"){
			return "Burnley"
		} else if(club == "chelsea"){
			return "Chelsea"
		} else if(club == "crystalPalace"){
			return "Crystal Palace"
		} else if(club == "everton"){
			return "Everton"
		} else if(club == "huddersfield"){
			return "Huddersfield"
		} else if(club == "hull"){
			return "Hull City"
		} else if(club == "leicesterCity"){
			return "Leicester City"
		} else if(club == "liverpool"){
			return "Liverpool"
		} else if(club == "manchesterCity"){
			return "Manchester City"
		} else if(club == "manu"){
			return "Manchester United"
		} else if(club == "middlesborough"){
			return "Middlesborough"
		} else if(club == "newcastle"){
			return "Newcastle United"
		} else if(club == "southampton"){
			return "Southampton"
		} else if(club == "stoke"){
			return "Stoke City"
		} else if(club == "sunderland"){
			return "Sunderland"
		} else if(club == "swansea"){
			return "Swansea City"
		} else if(club == "tottenham"){
			return "Tottenham Hotspur"
		} else if(club == "watford"){
			return "Watford"
		} else if(club == "westbrom"){
			return "West Brom"
		} else if(club == "westham"){
			return "West Ham"
		} else {
			return club;
		}
	},
	strip: function(kit){
		if(kit == "home") {
			return "Home"
		} else if(kit == "away"){
			return "Away"
		} else if(kit == "third"){
			return "Alternative"
		}
	},
	style: function(styling){
		if(styling == "current") {
			return "2017-2020 Kit Styling"
		} else if(styling == "previous"){
			return "2014-2017 Kit Styling"
		}
	}
}