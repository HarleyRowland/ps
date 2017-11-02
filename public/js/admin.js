$( document ).ready(function() {
	$(".shirtPrice").keyup(function(){
		var price =  $('.shirtPrice').val();
		if(isNaN(price)){
			alert("Please input a number!")
		} else {
  			$(".newPrice").attr("href", "/newPriceForTheShirts?shirtCost=" + price);
		}
	});

	$(".scorers").keyup(function(){
		var scorersString =  $('.scorers').val();
		$(".submitScorers").attr("href", "/inputScorerDiscounts?scorersString=" + scorersString);
	});
})