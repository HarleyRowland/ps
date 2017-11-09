$( document ).ready(function() {
	$(".shirtPrice").keyup(function(){
		var price =  $('.shirtPrice').val();
		if(isNaN(price)){
			alert("Please input a number!")
		} else {
  			$(".newShirtPrice").attr("href", "/newPriceForTheShirts?shirtCost=" + price);
		}
	});
	$(".sleevePrice").keyup(function(){
		var price =  $('.sleevePrice').val();
		if(isNaN(price)){
			alert("Please input a number!")
		} else {
  			$(".newSleevePrice").attr("href", "/newPriceForTheShirts?sleeveCost=" + price);
		}
	});

	$(".scorers").keyup(function(){
		var scorersString =  $('.scorers').val();
		$(".submitScorers").attr("href", "/inputScorerDiscounts?scorersString=" + scorersString);
	});
})