var league = undefined;
var year = undefined;
var childOrAdult = undefined;
var heroOrCustom = undefined;
var letterColour = undefined;
var letterStyle = undefined;

var setLetterAndNumberHint = function(){
	year = $('.yearOption').find(":selected").text();
	var lettersAndNumbers = local_data.shirtSizes[year];
	var childLetterHeight = lettersAndNumbers.child.letters;
	var childNumberHeight = lettersAndNumbers.child.numbers;
	var adultLetterHeight = lettersAndNumbers.adult.letters;
	var adultNumberHeight = lettersAndNumbers.adult.numbers;

	var lettersAndNumbersHintString = "Adult's letters are " + adultLetterHeight + "mm high and numbers are " + adultNumberHeight + "mm high. Children's letters are " + childLetterHeight + "mm high and numbers are " + childNumberHeight + "mm high.";
	$('#childOrAdult .hint').text(lettersAndNumbersHintString);
	$('#childOrAdult').css("display", "block");
}

var setQueryString = function(){
    var route = ""
    if(league == "yes"){
        route = "/club"
    } else {
        route = "/nameNumber"
    }
    $(".submitButton").attr("href", route + 
        "league=" + league + 
        "&year=" + year + 
        "&childOrAdult=" + childOrAdult +
        "&heroOrCustom=" + heroOrCustom + 
        "&letterColour=" + letterColour + 
        "&letterStyle=" + letterStyle 
    )    
}
var showSubmitButton = function(){
    if(league == "yes" && year && childOrAdult && heroOrCustom) {
        $(".submitButton").show();
    } else if(league == "no" && year && childOrAdult && letterStyle && letterColour) {
        $(".submitButton").show();
    } else if(league && year && childOrAdult && letterStyle && letterColour){
        $(".submitButton").show();      
    } else {
        $(".submitButton").hide();   
    }
}
var leagueFunctionality = function(){
    league = $("input:radio[name ='league']:checked").val();
    setLetterAndNumberHint();
    if(league == "yes"){
        $('#letterStyle').css("display", "none");
        $('#letterColour').css("display", "none");
        if(childOrAdult){
            $('#heroOrCustom').css("display", "block");                
        }
    } else {
        heroOrCustom = "custom";
        if(childOrAdult){
            $('#letterColour').css("display", "block");
            if(letterColour){
                $('#letterStyle').css("display", "block");
            }
            $('#heroOrCustom').css("display", "none");
        }
        heroOrCustom = "custom"
    }
    setQueryString();
    showSubmitButton();
}
$(document).ready(function(){
    league = $("input:radio[name ='league']:checked").val();
    year = $('.yearOption').find(":selected").text();
    childOrAdult = $("input:radio[name ='childOrAdult']:checked").val();
    heroOrCustom = $("input:radio[name ='heroOrCustom']:checked").val();
    letterColour = $("input:radio[name ='letterColour']:checked").val();
    letterStyle = $("input:radio[name ='letterStyle']:checked").val();
    if(league){
        leagueFunctionality();
    }
    
    $('#league .radioBoxes').change(function(){
    	leagueFunctionality();
    });
    $('#year').change(function(){
		if(league) {
	    	setLetterAndNumberHint();
		}
        setQueryString();
        showSubmitButton();
    });
    $('#childOrAdult .radioBoxes').change(function(){
    	childOrAdult = $("input:radio[name ='childOrAdult']:checked").val();
        if(league == "yes"){
    	    $('#heroOrCustom').css("display", "block");
        } else {
            $('#letterColour').css("display", "block");
        }
        setQueryString();
        showSubmitButton();
    });
    $('#heroOrCustom .radioBoxes').change(function(){
    	heroOrCustom = $("input:radio[name ='heroOrCustom']:checked").val();
    	if(heroOrCustom == "hero"){
            $('#letterStyle').css("display", "none");
            $('#letterColour').css("display", "none");
    	} else {
            if(league == "no"){
                $("#letterColour").css("display", "block");   
                if(letterColour){
                    $('#letterStyle').css("display", "block");
                }
                if(letterColour && letterStyle){
                    $('#letterStyle').css("display", "block");
                }
                 
            }
    	}
    	$('#heroOrCustom').css("display", "block");
        setQueryString();
        showSubmitButton();
    });
    $('#letterColour .radioBoxes').change(function(){
        letterColour = $("input:radio[name ='letterColour']:checked").val();
        $('#letterStyle').css("display", "block");
        setQueryString();
        showSubmitButton();
    });
    $('#letterStyle .radioBoxes').change(function(){
        letterStyle = $("input:radio[name ='letterStyle']:checked").val();
        $(".submitButton").show()
        setQueryString();
        showSubmitButton();
    });
});
