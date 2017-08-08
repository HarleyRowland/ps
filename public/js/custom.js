$(document).on('change','.clubOption',function(){
	var club = $('.clubOption').find(":selected").text();
	if(club == "Please Select"){
		$(".hiddenFirst").css("display", "none");
	} else {
		if(local_data.premOrDifferent){
			$(".action a").attr("href", "/strip?&deliveryType=" + local_data.deliveryType +
				"&printingType=" + local_data.printingType +
				"&style=" + local_data.style +
				"&premOrDifferent=" + local_data.premOrDifferent +
				"&club=" + nameConverter(club)
			)
		} else {
			$(".action a").attr("href", "/strip?deliveryType=" + local_data.deliveryType +
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
		var playerNumberArray = player.split(" - ");
		var name = playerNumberArray[0].trim();
		var number = playerNumberArray[1].trim();
		var shirtCost = name.length + number.length*5
		if(shirtCost < 20) {
			shirtCost = 20;
		}
		$(".price").text("£" + shirtCost + " (£20 minimum - 8 letters and 2 numbers, or 12 letters 1 number, with additional letters at £1 and numbers at £4)");
		$(".hero .btn").attr("href", "/sleeves?deliveryType=" + local_data.deliveryType +
			"&printingType=" + local_data.printingType +
			"&style=" + local_data.style +
			"&club=" + local_data.club +
			"&strip=" + local_data.strip +
			"&name=" + name +
			"&number=" + number +
			"&shirtCost=" + shirtCost + 
			"&childOrAdult=" + local_data.childOrAdult
		)
	}
});

$(document).on('change','.proOption',function(){
	var player = $('.proOption').find(":selected").text();
	if(player == "Please Select"){
		$("#field:not(#name):not(#email):not(#pro)").css("display", "none");
	} else {
		$("#field").css("display", "block");
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
			"&colour=" + colour + 
			"&childOrAdult=" + local_data.childOrAdult
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
			"&letter=" + letter + 
			"&childOrAdult=" + local_data.childOrAdult
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
		$(".sleeves .btn").attr("href", "/confirmation?shirtObject=" + shirtObject)
	}
});

$(document).on('change','.deliveryOption',function(){
	var totalCost = parseFloat(local_data.cost);
	var deliveryCost = parseFloat($('.deliveryOption').find(":selected").text().split("£")[1]);
	var deliveryOption = $('.deliveryOption').find(":selected").text();
	$(".totalCost h4").text("Total Cost: £" + (totalCost + deliveryCost))
	$(".basket .payment a").attr("href", "/payment?deliveryOption=" + deliveryOption)
});

$( document ).ready(function() {
	var shirtCount = 0;
	var cookies = document.cookie.toString().split(";")
	var acceptedCookies = document.cookie.toString().includes("cookiePermission=true")
	cookies.forEach(function(cookie) {
		if(!acceptedCookies || acceptedCookies == undefined){
			$(".cookiePermission").show();
		}
		if(cookie.includes("shirt")){
			shirtCount++;
		}
	});

	$(".cookiePermission .fa-times").on("click", function(){
		$(".cookiePermission").hide();	
	});

	$(".emailSent .fa-times").on("click", function(){
		$(".emailSent").hide();	
	});

	$(".top .fa-bars").on("click", function(){
		$(".menuDisplay").show();	
	});

	$(".menuDisplay .fa-times").on("click", function(){
		document.cookie = "cookiePermission=true";
		$(".menuDisplay").hide();	
	});

	if ($(".totalCost").length){
    	var totalCost = parseFloat(local_data.cost);
    	var deliveryCost = parseFloat($('.deliveryOption').find(":selected").text().split("£")[1]);
    	var deliveryOption = $('.deliveryOption').find(":selected").text();
    	$(".totalCost h4").text("Total Cost: £" + (totalCost + deliveryCost))
    	$(".basket .payment a").attr("href", "/payment?deliveryOption=" + deliveryOption)
	}

	if ($("a.confirmShirt").length){
    	var shirtObject = JSON.stringify(buildShirtObject(local_data))
		$("a.confirmShirt").attr("href", "/basket?shirtObject=" + shirtObject + "&timestamp=" + new Date())
	}
	$(".basketSize").text("(  " + shirtCount + "  )");
	if ($("a.confirmShirt").length){
    	var shirtObject = JSON.stringify(buildShirtObject(local_data))
		$("a.confirmShirt").attr("href", "/basket?shirtObject=" + shirtObject + "&timestamp=" + new Date())
	}
	$(".stripe-button-el").on("click", function(){
		var name =  $('.name').val();
		var telephone =  $('.telephone').val();
		var line1 =  $('.line1').val();
		var line2 =  $('.line2').val();
		var town =  $('.town').val();
		var county =  $('.county').val();
		var postcode =  $('.postcode').val();
		var country =  $('.country').val();
		var date =  $('.date').val();
		$(".paymentForm form").attr("action", "/paymentResult?name=" + name + "&telephone=" + telephone + "&line1=" + line1 + "&line2=" + line2 + "&town=" + town + "&county=" + county + "&postcode=" + postcode + "&country=" + country + "&cost=" + local_data.totalCost + "&shirtArray=" + local_data.jsonArray + "&date=" + date + "&deliveryOption=" + local_data.deliveryOption)
	});
	if ($("a.yes").length){
    	local_data.sleeve = "Yes"
    	var shirtObject = JSON.stringify(buildShirtObject(local_data))
		$(".yes").attr("href", "/confirmation?shirtObject=" + shirtObject)
	}
	if ($("a.no").length){
    	local_data.sleeve = "No"
		var shirtObject = JSON.stringify(buildShirtObject(local_data))
		$(".no").attr("href", "/confirmation?shirtObject=" + shirtObject)
	}

});

$(document).on('input','.shirtName',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	if(name.trim() == "" || number.trim() == ""){
		$(".hiddenFirst").css("display", "none");
	} else {
		var shirtCost = name.replace(/ /g,"").length + (number.replace(/ /g,"").length*5)
		if(shirtCost < 20){
			shirtCost = 20;
		}
		$(".hiddenFirst").css("display", "block");
		$(".basket").css("display", "block");
		$(".price").text("£" + shirtCost + " (£20 minimum - 8 letters and 2 numbers, or 12 letters 1 number, with additional letters at £1 and numbers at £4)");
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
			"&shirtCost=" + shirtCost + 
			"&childOrAdult=" + local_data.childOrAdult
		)
	}
});

$(document).on('input','.shirtNumber',function(){
	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	if(name.trim() == "" || number.trim() == ""){
		$(".hiddenFirst").css("display", "none");
		$(".basket").css("display", "none");
	} else {
		var shirtCost = name.replace(/ /g,"").length + (number.replace(/ /g,"").length*5)
		if(shirtCost < 20){
			shirtCost = 20;
		}
		$(".hiddenFirst").css("display", "block");
		$(".basket").css("display", "block");
		$(".price").text("£" + shirtCost + " (£20 minimum - 8 letters and 2 numbers, or 12 letters 1 number, with additional letters at £1 and numbers at £4)");
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
			"&shirtCost=" + shirtCost + 
			"&childOrAdult=" + local_data.childOrAdult
		)
	}
});

var buildShirtObject = function(data){
	if(data.deliveryType && data.style && data.printingType && data.shirtCost){
	    if(data.printingType == "hero" && data.club && data.strip && data.name && data.number){
			return {
				printingType: data.printingType,
				deliveryType: data.deliveryType,
				childOrAdult: data.childOrAdult,
				style: data.style,
				club: data.club,
				strip: data.strip,
				sleeve: data.sleeve,
				name: data.name,
				number: data.number,
				shirtCost: data.shirtCost,
				fullCost: data.fullCost,
				timestamp: new Date()
			}
	    } else if(data.printingType == "custom" && data.club && data.strip && data.name && data.number) {
	      	return {
				printingType: data.printingType,
				deliveryType: data.deliveryType,
				childOrAdult: data.childOrAdult,
				style: data.style,
				club: data.club,
				strip: data.strip,
				sleeve: data.sleeve,
				name: data.name,
				number: data.number,
				shirtCost: data.shirtCost,
				fullCost: data.fullCost,
				timestamp: new Date()
			}
	    } else if(data.printingType == "custom" && data.letter && data.colour && data.name && data.number){
	    	return {
				printingType: data.printingType,
				deliveryType: data.deliveryType,
				childOrAdult: data.childOrAdult,
				style: data.style,
				colour: data.colour,
				letter: data.letter,
				sleeve: data.sleeve,
				name: data.name,
				number: data.number,
				shirtCost: data.shirtCost,
				fullCost: data.fullCost,
				timestamp: new Date()
			}
	    } else {
	      return {};
	    }
	  } else {
	    return {};
	  }
}

