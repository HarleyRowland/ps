$(document).on('change','.clubOption',function(){
	var club = $('.clubOption').find(":selected").text();
	if(club == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		if(local_data.premOrDifferent){
			$(".btnDiv a").attr("href", "/strip?club=" + nameConverter(club) + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style + "&premOrDifferent=" + local_data.premOrDifferent)
		} else {
			$(".btnDiv a").attr("href", "/strip?club=" + nameConverter(club) + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style)
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
		console.log(playerNumberArray)
		var cost = playerNumberArray[0].trim().length + (playerNumberArray[1].trim().length)*5
		console.log(cost)
		console.log(playerNumberArray[0].replace(/ /g,"").length)
		console.log((playerNumberArray[1].replace(/ /g,"").length)*5)
		$(".hero .btn").attr("href", "/sleeves?club=" + local_data.club + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style + "&strip=" + local_data.strip + "&playerNumber=" + player + "&cost=" + cost)
	}
});

$(document).on('change','.colourOption',function(){
	var colour = $('.colourOption').find(":selected").text();
	if(colour == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		$(".colour .btn").attr("href", "/letter?colour=" + colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style + "&premOrDifferent=" + local_data.premOrDifferent)
	}
});

$(document).on('change','.letterOption',function(){
	var letter = $('.letterOption').find(":selected").text();
	if(letter == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		$(".letter .btn").attr("href", "/nameNumber?letter=" + letter + "&colour=" + local_data.colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style  + "&premOrDifferent=" + local_data.premOrDifferent)
	}
});

$(document).on('change','.sleeveOption',function(){
	var sleeve = $('.sleeveOption').find(":selected").text();
	console.log(local_data.cost)
	if(sleeve == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		$(".sleeves .btn").attr("href", "/payment?letter=" + local_data.letter + "&colour=" + local_data.colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style  + "&premOrDifferent=" + local_data.premOrDifferent + "&name=" + local_data.name + "&number=" + local_data.number + "&club=" + local_data.club + "&strip=" + local_data.strip + "&playerNumber=" + local_data.playerNumber + "&sleeve=" + sleeve + "&cost=" + local_data.cost)
	}
});

$(document).on('change','.shirtName',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	if(name.trim() == "" || number.trim() == ""){
		$(".hiddenFirst").css("display", "none");
	} else {
		$(".hiddenFirst").css("display", "block");
		$(".nameNumber .btn").attr("href", "/sleeves?letter=" + local_data.letter + "&colour=" + local_data.colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style  + "&premOrDifferent=" + local_data.premOrDifferent + "&name=" + name + "&number=" + number + "&club=" + local_data.club + "&strip=" + local_data.strip  + "&cost=" + local_data.cost)
	}
});

$(document).on('change','.shirtNumber',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	if(name.trim() == "" || number.trim() == ""){
		$(".hiddenFirst").css("display", "none");
		$(".basket").css("display", "none");
	} else {
		var cost = name.replace(/ /g,"").length + (number.replace(/ /g,"").length*5)
		$(".hiddenFirst").css("display", "block");
		$(".basket").css("display", "block");
		$(".price").text("£" + cost);
		$(".nameNumber .btn").attr("href", "/sleeves?letter=" + local_data.letter + "&colour=" + local_data.colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style  + "&premOrDifferent=" + local_data.premOrDifferent + "&name=" + name + "&number=" + number + "&club=" + local_data.club + "&strip=" + local_data.strip + "&cost=" + cost)
	}
});

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