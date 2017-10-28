$(document).on('change','.clubOption',function(){
	setClub();
});

$(document).on('change','.playerOption',function(){
	setHeroString();
});

$(document).on('change','.deliveryMethodOption',function(){
	setDeliveryMethod()
});

$(document).on('change','.colourOption',function(){
	setColour();
});

$(document).on('change','.letterOption',function(){
	setLetter();
});

$(document).on('input','.shirtNumber',function(){
	setCustomNameAndNumber();
  	kitNumberInput();
});

$(document).on('input','.shirtName',function(){
	setCustomNameAndNumber();	
  	kitNameInput();   
});

$(document).on('change','.deliveryCostOption',function(){
	setDeliveryCost();
});

$(document).on('click','.cookiePermission .fa-times',function(){
	$(".cookiePermission").hide();	
});

$(document).on('click','.emailSent .fa-times',function(){
	$(".emailSent").hide();	
});

$(document).on('click','.top .fa-bars',function(){
	$(".mobileMenu").show();	
});

$(document).on('click','.mobileMenu',function(){
	$(".mobileMenu").hide();	
});

$(document).on('click','a.confirmShirt',function(){
	setConfirmShirt();
});

$(document).on('click','heroButton a',function(){
	setHero();
});

$(document).on('click','.payment a',function(){
	var service = $('.serviceOption').find(":selected").text();
	if(service == "pleaseselect"){
		$(".hiddenFirst").css("visibility", "hidden");
	} else {
		$(".hiddenFirst").css("visibility", "visible");
		var deliveryMethod = $('.deliveryMethod').find(":selected").val();
		var deliveryCost = 0;
		if(deliveryMethod != "bring"){
			deliveryCost = $('.deliveryCostOption').find(":selected").text().split("£")[1];
		}
		var dataForQuery = {
			deliveryCost: deliveryCost,
			deliveryMethod: deliveryMethod
		}
		$(".payment a").attr("href", buildQueryString("payment", dataForQuery))
	}
});

$(document).on("click", ".sleeveChoice", function(e){
	local_data.sleeve = $(this).text();
	var shirtObject = JSON.stringify(buildShirtObject(local_data))
	var dataForQuery = {
		shirtObject: shirtObject
	}
	$(this).find("a").attr("href", buildQueryString("confirmation", dataForQuery))
});

$(document).on("click", "a.confirmShirt", function(e){
	var shirtObject = JSON.stringify(buildShirtObject(local_data))
	var dataForQuery = {
		shirtObject: shirtObject,
		timestamp: new Date()
	}
	$("a.confirmShirt").attr("href", buildQueryString("basket", dataForQuery))
});

$(document).on("click", ".paymentButton", function(e){
	e.preventDefault();
	var name =  $('.name').val();
	var telephone =  $('.telephone').val();
	var line1 =  $('.line1').val();
	var line2 =  $('.line2').val();
	var town =  $('.town').val();
	var county =  $('.county').val();
	var postcode =  $('.postcode').val();
	var country =  $('.country').val();
	var date =  $('.date').val();
	var canSend = validatePaymentForm(name, telephone, line1, town, county, postcode, county);
	if(canSend){
		var dataForQuery = {
			name: name,
			telephone: telephone,
			line1: line1,
			line2: line2,
			town: town,
			county: county,
			postcode: postcode,
			country: country,
			cost: local_data.totalCost,
			shirtArray: local_data.jsonArray,
			date: date,
			deliveryCost: local_data.deliveryCost,
			deliveryMethod: local_data.deliveryMethod
		}
		$(".paymentForm form").attr("action", buildQueryString("paymentResult", dataForQuery))
		$(".stripe-button-el").click();
	}
});

$(document).on("click", ".quoteEmail", function(e){
	if(!$(".quote").length) return;

	var name =  $('.name').val();
	var email =  $('.email').val();
	var league =  $('.league').val();
	var club =  $('.club').val();
	var strip =  $('.strip').val();
	var year =  $('.year').val();
	var colour =  $('.colour').val();
	var letter =  $('.letterSelect').val();
	var shirtName =  $('.shirtName').val();
	var shirtNumber =  $('.shirtNumber').val();
	var comments =  $('.comments').val();
	var canSend = validateQuoteForm(name, email, league, club, strip, year, colour, letter, shirtName, shirtNumber);
	if(canSend){
		var dataForQuery = {
			name: name,
			email: email,
			league: league,
			club: club,
			strip: strip,
			year: year,
			colour: colour,
			letter: letter,
			kitName: shirtName,
			kitNumber: shirtNumber,
			comments: comments
		}
		$(".quoteEmail").attr("href", buildQueryString("sendQuoteEmail", dataForQuery))
		$('.paymentForm *').removeAttr('disabled');
	} else {
		e.preventDefault();
	}
});

$(document).on("click", ".contactEmail", function(e){
	if(!$(".query").length) return e.preventDefault();

	var name =  $('.name').val();
	var email =  $('.email').val();
	var number =  $('.number').val();
	var comments =  $('.comments').val();
	var canSend = validateContactForm(name, number, email, comments);

	if(canSend){
		var dataForQuery = {
			name: name,
			email: email,
			number: number,
			comments: comments
		}
		$(".contactEmail").attr("href", buildQueryString("sendQueryEmail", dataForQuery))
	} else {
		e.preventDefault()
	}
});

var setClub = function() {
	if(!$(".clubOption").length) return;

  	var clubFullName = $('.clubOption').find(":selected").text();
	var club = $('.clubOption').find(":selected").val();
	$(".mobile.club .optionTitle").text(clubFullName);
	$(".mobile.club .image img").attr("src", "/public/images/shirts/" + local_data.style + "/" + club + ".gif");
	var dataForQuery = {
		printingType: local_data.printingType,
		style: local_data.style,
		premOrDifferent: local_data.premOrDifferent,
		club: club,
		childOrAdult: local_data.childOrAdult,
		name: local_data.name,
		number: local_data.number
	}
	$(".mobile a").attr("href", buildQueryString("strip", dataForQuery));
}

var setHeroString = function(){
	if(!$(".playerOption").length) return;

	var player = $('.playerOption').find(":selected").text();
	if(player == "Please Select"){
		$(".hiddenFirst").css("visibility", "hidden");
	}
	$(".hiddenFirst").css("visibility", "visible");
	var playerNumberArray = player.split(" - ");
	var name = playerNumberArray[0].trim();
	var number = playerNumberArray[1].trim();
	var discount = 0;
	if(number.includes("off")){
		discount = parseInt(number.split("£")[1].split("off")[0].trim())
		number = number.split("(£")[0].trim()
		$(".printStatement").text("This shirt has a £" + discount + " discount. It is priced at £" + (local_data.price - discount) + ".")
	}
	var shirtCost = local_data.price - discount;
	var dataForQuery = {
		printingType: local_data.printingType,
		style: local_data.style,
		club: local_data.club,
		strip: local_data.strip,
		name: name,
		number: number,
		shirtCost: shirtCost,
		childOrAdult: local_data.childOrAdult
	}
	$(".hero .btn").attr("href", buildQueryString("sleeves", dataForQuery))
}

var setDeliveryMethod = function(){
	var deliveryCost = 0;
	var totalCost = parseFloat(local_data.cost);
	var service = $('.deliveryMethodOption').find(":selected").val()
	if(service == "bring"){
		$('.deliveryCost').hide();
	} else {
		$('.deliveryCost').show();
		deliveryCost = parseFloat($('.deliveryCostOption').find(":selected").text().split("£")[1]);
	}
	$(".totalCost h4").text("Total Cost: £" + (totalCost + deliveryCost))
}

var setColour = function(){
	var colour = $('.colourOption').find(":selected").val();
	if(colour == ""){
		$(".hiddenFirst").css("visibility", "hidden");
	} else {
		$(".hiddenFirst").css("visibility", "visible");
		var dataForQuery = {
			printingType: local_data.printingType,
			style: local_data.style,
			premOrDifferent: local_data.premOrDifferent,
			colour: colour,
			childOrAdult: local_data.childOrAdult
		}
		$(".colour .btn").attr("href", buildQueryString("letter", dataForQuery))
	}
}

var setLetter = function(){
	var letter = $('.letterOption').find(":selected").val();
	if(letter == ""){
		$(".hiddenFirst").css("visibility", "hidden");
	} else {
		$(".hiddenFirst").css("visibility", "visible");
		var dataForQuery = {
			printingType: local_data.printingType,
			style: local_data.style,
			premOrDifferent: local_data.premOrDifferent,
			colour: local_data.colour,
			letter: letter,
			childOrAdult: local_data.childOrAdult
		}
		$(".letter .btn").attr("href", buildQueryString("nameNumber", dataForQuery))
	}
}

var setDeliveryCost = function(){
	var deliveryCost = parseFloat($('.deliveryCostOption').find(":selected").text().split("£")[1]);
	var totalCost = parseFloat(local_data.cost);
	$(".totalCost h4").text("Total Cost: £" + (totalCost + deliveryCost))
} 

var setCustomNameAndNumber = function(){
	if(!($(".shirtName").length && $(".shirtNumber").length)) return;

	var name =  $('.shirtName').val();
	var number =  $('.shirtNumber').val();
	if(name.trim() == "" || number.trim() == ""){
		$(".hiddenFirst").css("visibility", "hidden");
		$(".basket").css("visibility", "hidden");
	} else {
		var shirtLength = name.replace(/ /g,"").length
		var shirtCost = 0;
		if(shirtLength <= 10){
			shirtCost = 20;
		} else {
			shirtCost = 20 + (shirtLength - 10);
		}
		$(".hiddenFirst").css("visibility", "visible");
		$(".basket").css("visibility", "visible");
		$(".price").text("£" + shirtCost + " (Up to 10 letters and 2 numbers for £20 with additional letters at £1)");
		
		var dataForQuery = {
			printingType: local_data.printingType,
			style: local_data.style,
			premOrDifferent: local_data.premOrDifferent,
			colour: local_data.colour,
			letter: local_data.letter,
			club: local_data.club,
			strip: local_data.strip,
			name: name,
			number: number,
			shirtCost: shirtCost,
			childOrAdult: local_data.childOrAdult
		};
		$(".nameNumber .btn").attr("href", buildQueryString("sleeves", dataForQuery))
	}
}

var buildQueryString = function(route, dataSet){
	var query = "/" + route + "?";
	for(key in dataSet){
		query = query + key + "=" + dataSet[key] + "&"
	}
	//Slice to get rid of trailing &
	return query.slice(0, -1);
}

var kitNameInput = function(){
	if($(".shirtName").length){
		var charsLeft = 20 - $(".shirtName").val().length
  		if(charsLeft == 0){
  			$('.nameCharsLeft').text("0 Characters Left");      
  		} else {
  			$('.nameCharsLeft').text("Up to " + charsLeft + " Characters Left");      
  		}
		
	}
}

var kitNumberInput = function(){
	if($(".shirtNumber").length){
		var numbersLeft = 2 - $(".shirtNumber").val().length
	  	if(numbersLeft == 0){
	  		$('.numberCharsLeft').text("0 Characters Left");      
	  	} else {
	  		$('.numberCharsLeft').text("Up to " + numbersLeft + " Characters Left");      
	  	}
	}
}

var setCookieWarning = function(cookies) {
	var cookieWarningShown = cookies.toString().includes("cookiePermission");
	if(!cookieWarningShown) {
		$(".cookiePermission").show();
		document.cookie = "cookiePermission=true;".trim();
	}
}

var setBasketCount = function(cookies) {
	var shirtCount = 0;
	cookies.forEach(function(cookie) {
		if(cookie.includes("shirt")){
			shirtCount++;
		}
	});
	$(".basketSize").text("(  " + shirtCount + "  )");
}

var setConfirmShirt = function(e){	
	if ($("a.confirmShirt").length){
    	var shirtObject = JSON.stringify(buildShirtObject(local_data))
    	var dataForQuery = {
    		shirtObject: shirtCost,
    		timestamp: new Date()
    	}
		$("a.confirmShirt").attr("href", buildQueryString("basket", dataForQuery))
	}
}

$( document ).ready(function() {
	var cookies = document.cookie.toString().split(";");
	setClub();
	setHeroString();
	setDeliveryMethod();
	setColour();
	setLetter();
	setDeliveryCost();
  	kitNameInput();   
	kitNumberInput();   
	setCustomNameAndNumber();
	setCookieWarning(cookies);
	setBasketCount(cookies);
	setConfirmShirt();
});

var buildShirtObject = function(data){
	if(data.style && data.printingType && data.shirtCost){
	    if(data.printingType == "hero" && data.club && data.strip && data.name && data.number){
			return {
				printingType: data.printingType,
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
	    } else if(data.printingType == "custom" && data.club && data.strip && data.name && data.number && data.colour && data.colour != "undefined") {
	    	return {
				printingType: data.printingType,
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
	    } else if(data.printingType == "custom" && data.letter && data.colour && data.name && data.number){
	      	return {
				printingType: data.printingType,
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
	    } else {
	      return {};
	    }
	  } else {
	    return {};
	  }
}

var validateContactForm = function(name, phone, email, comments){
  	var canSend = true;
  	var resultArray = [];
  	resultArray.push(animateField(name+"" == "", ".field .name"));
	resultArray.push(animateField(phone.length > 12 || phone.length < 9, ".field .number"));
    resultArray.push(animateField(email+"" == "" || !validateEmail(email), ".field .email"));
    resultArray.push(animateField(comments+"" == "", ".field .comments"));
    if(resultArray.includes(false)){
    	canSend = false;
    }
  	return canSend;
}

var validateQuoteForm = function(name, email, league, club, strip, year, colour, letter, shirtName, shirtNumber){
	var canSend = true;
	console.log(letter)
    canSend = animateField(name+"" == "", ".field .name");
    canSend = animateField(email+"" == "" || !validateEmail(email), ".field .email");
    canSend = animateField(league+"" == "", ".field .league");
    canSend = animateField(club+"" == "", ".field .club");
    canSend = animateField(strip+"" == "", ".field .strip");
    canSend = animateField(year+"" == "", ".field .year");
    canSend = animateField(colour+"" == "", ".field .colour");
    canSend = animateField(letter+"" == "Please Select", ".field .letterSelect");
    canSend = animateField(shirtName+"" == "", ".field .shirtName");
    canSend = animateField(shirtNumber+"" == "", ".field .shirtNumber");

	return canSend;
}

var validatePaymentForm = function(name, phone, line1, town, county, postcode, country){
	var canSend = true;

	canSend = animateField(name == "", ".field .name");
	canSend = animateField(phone.length > 11 || phone.length < 9, ".field .telephone");
	canSend = animateField(line1 == "", ".field .line1");
	canSend = animateField(town == "", ".field .town");
	canSend = animateField(county == "", ".field .county");
	canSend = animateField(postcode+"" == "" || !validatePostcode(postcode), ".field .postcode");
	canSend = animateField(country == "", ".field .country");

	return canSend;
}

var animateField = function(animateTest, fieldToAnimate){
	console.log(animateTest, fieldToAnimate)
	var canSend = true;
	if(animateTest){
	    $(fieldToAnimate).addClass('animated shake');
	    canSend = false;
	    $(fieldToAnimate).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
	      	$(fieldToAnimate).removeClass('shake');
	    });
	}
	return canSend;
}

var validateEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


var validatePostcode = function(postcode) {
	postcode = postcode.toUpperCase();
	var re = /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/;
	return re.test(postcode);
}
