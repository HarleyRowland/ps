$(document).on('change','.clubOption',function(){
	var club = $('.clubOption').find(":selected").text();
	if(club == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		if(local_data.premOrDifferent){
			$(".btnDiv a").attr("href", "/strip?&deliveryType=" + local_data.deliveryType +
				"&printingType=" + local_data.printingType +
				"&style=" + local_data.style +
				"&premOrDifferent=" + local_data.premOrDifferent +
				"&club=" + nameConverter(club)
			)
		} else {
			$(".btnDiv a").attr("href", "/strip?deliveryType=" + local_data.deliveryType +
				"&printingType=" + local_data.printingType + 
				"&style=" + local_data.style +
				"&club=" + nameConverter(club)
			)
		}
		$(".crest img").attr("src","/public/images/crests/" + nameConverter(club) + ".png");
		$(".hiddenFirst").css("display", "block");
	}
});

$(document).on('change','.playerOption',function(){
	var player = $('.playerOption').find(":selected").text();
	if(player == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		var playerNumberArray = player.split("-");
		var name = playerNumberArray[0].trim();
		var number = playerNumberArray[1].trim();
		var shirtCost = name.length + number.length*5
		$(".hero .btn").attr("href", "/sleeves?deliveryType=" + local_data.deliveryType +
			"&printingType=" + local_data.printingType +
			"&style=" + local_data.style +
			"&club=" + local_data.club +
			"&strip=" + local_data.strip +
			"&name=" + name +
			"&number=" + number +
			"&shirtCost=" + shirtCost
		)
	}
});

$(document).on('change','.colourOption',function(){
	var colour = $('.colourOption').find(":selected").text();
	if(colour == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		$(".colour .btn").attr("href", "/letter?deliveryType=" + local_data.deliveryType +
			"&printingType=" + local_data.printingType +
			"&style=" + local_data.style +
			"&premOrDifferent=" + local_data.premOrDifferent +
			"&colour=" + colour
		)
	}
});

$(document).on('change','.letterOption',function(){
	var letter = $('.letterOption').find(":selected").text();
	if(letter == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		$(".letter .btn").attr("href", "/nameNumber?deliveryType=" + local_data.deliveryType +
			"&printingType=" + local_data.printingType +
			"&style=" + local_data.style  +
			"&premOrDifferent=" + local_data.premOrDifferent +
			"&colour=" + local_data.colour +
			"&letter=" + letter
		)
	}
});

$(document).on('change','.sleeveOption',function(){
	local_data.sleeve = $('.sleeveOption').find(":selected").text();
	if(local_data.sleeve == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		var shirtObject = JSON.stringify(buildShirtObject(local_data))
		$(".sleeves .btn").attr("href", "/basket?shirtObject=" + shirtObject)
	}
});

$(document).on('change','.shirtName',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	if(name.trim() == "" || number.trim() == ""){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		$(".nameNumber .btn").attr("href", "/sleeves?deliveryType=" + local_data.deliveryType +
			"&printingType=" + local_data.printingType +
			"&style=" + local_data.style  +
			"&premOrDifferent=" + local_data.premOrDifferent +
			"&colour=" + local_data.colour +
			"&letter=" + local_data.letter +
			"&club=" + local_data.club +
			"&strip=" + local_data.strip  +
			"&name=" + name +
			"&number=" + number +
			"&shirtCost=" + local_data.shirtCost
		)
	}
});

$(document).on('change','.shirtNumber',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	if(name.trim() == "" || number.trim() == ""){
		$(".hiddenFirst").css("display", "none");
		$(".basket").css("display", "none");
	} else {
		var shirtCost = name.replace(/ /g,"").length + (number.replace(/ /g,"").length*5)
		$(".hiddenFirst").css("display", "block");
		$(".basket").css("display", "block");
		$(".price").text("£" + shirtCost);
		$(".nameNumber .btn").attr("href", "/sleeves?deliveryType=" + local_data.deliveryType +
			"&printingType=" + local_data.printingType +
			"&style=" + local_data.style  +
			"&premOrDifferent=" + local_data.premOrDifferent +
			"&colour=" + local_data.colour +
			"&letter=" + local_data.letter +
			"&club=" + local_data.club +
			"&strip=" + local_data.strip +
			"&name=" + name +
			"&number=" + number +
			"&shirtCost=" + shirtCost
		)
	}
});

var buildShirtObject = function(data){
	if(data.deliveryType && data.style && data.printingType && data.shirtCost){
	    if(data.printingType == "hero" && data.club && data.strip && data.name && data.number){
			return {
				printingType: data.printingType,
				deliveryType: data.deliveryType,
				style: data.style,
				club: data.club,
				strip: data.strip,
				sleeve: data.sleeve,
				name: data.name,
				number: data.number,
				shirtCost: data.shirtCost
			}
	    } else if(data.printingType == "custom" && data.premOrDifferent == "prem" && data.club && data.strip && data.name && data.number) {
	      	return {
				printingType: data.printingType,
				deliveryType: data.deliveryType,
				style: data.style,
				club: data.club,
				strip: data.strip,
				sleeve: data.sleeve,
				name: data.name,
				number: data.number,
				shirtCost: data.shirtCost
			}
	    } else if(data.printingType == "custom" && data.premOrDifferent == "different" && data.letter && data.colour && data.name && data.number){
	    	return {
				printingType: data.printingType,
				deliveryType: data.deliveryType,
				style: data.style,
				club: data.colour,
				strip: data.letter,
				sleeve: data.sleeve,
				name: data.name,
				number: data.number,
				shirtCost: data.shirtCost
			}
	    } else {
	      return {};
	    }
	  } else {
	    return {};
	  }
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