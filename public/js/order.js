$(document).on('input','.orderOption',function(){
	var myClass = $(this).attr("id");
	var description = $("#" + myClass).find(":selected").text();
	var split = myClass.split("_");
	var orderNo = split[0]
	var shirtNo = split[1]
	$("." + myClass).attr("href", "/updateStatus?orderNumber=" + orderNo + "&shirtNo=" + shirtNo + "&description=" + description)
});

$( ".orderNumberInput" ).keyup(function() {
	$(".getOrder").attr("href", "/updateStatus?orderNumber=" + orderNo + "&shirtNo=" + shirtNo + "&description=" + description)
});
