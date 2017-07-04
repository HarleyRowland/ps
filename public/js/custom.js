$(document).on('change','.clubOption',function(){
	console.log(local_data)
	var club = $('.clubOption').find(":selected").text();
	if(club == "Please Select"){
		$(".club .content").css("display", "none");
	} else {
		$(".btnDiv a").attr("href", "/strip?club=" + nameConverter(club) + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style)
		$(".crest img").attr("src","/public/images/crests/" + nameConverter(club) + ".png");
		$(".club .content").css("display", "block");
	}
});

$(document).on('change','.playerOption',function(){
	var player = $('.playerOption').find(":selected").text();
	if(player == "Please Select"){
		$(".hero .btn").css("display", "none");
	} else {
		$(".hero .btn").css("display", "block");
		$(".hero .btn").attr("href", "/flow?club=" + local_data.club + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style + "&strip=" + strip)
	}
});

$(document).on('change','.colourOption',function(){
	var colour = $('.colourOption').find(":selected").text();
	if(colour == "Please Select"){
		$(".colour .btn").css("display", "none");
	} else {
		$(".colour .btn").css("display", "block");
		$(".colour .btn").attr("href", "/letter?colour=" + colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style + "&premOrDifferent=different")
	}
});

$(document).on('change','.letterOption',function(){
	var letter = $('.letterOption').find(":selected").text();
	if(letter == "Please Select"){
		$(".letter .btn").css("display", "none");
	} else {
		$(".letter .btn").css("display", "block");
		$(".letter .btn").attr("href", "/nameNumber?letter=" + letter + "&colour=" + local_data.colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style  + "&premOrDifferent=different")
	}
});

$(document).on('change','.shirtName',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	$(".nameNumber .btn").attr("href", "/sleeves?letter=" + local_data.letter + "&colour=" + local_data.colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style  + "&premOrDifferent=different" + "&name=" + name + "&number=" + number)
});

$(document).on('change','.shirtNumber',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	$(".nameNumber .btn").attr("href", "/sleeves?letter=" + local_data.letter + "&colour=" + local_data.colour + "&printingType=" + local_data.printingType + "&deliveryType=" + local_data.deliveryType +"&style=" + local_data.style  + "&premOrDifferent=different" + "&name=" + name + "&number=" + number)
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