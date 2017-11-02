$(document).on('input','.orderOption',function(e){
	var myClass = $(this).attr("id");
	var description = e.target.value;
	var split = myClass.split("_");
	var orderNo = split[0]
	var shirtNo = split[1]

	$("." + myClass).attr("href", "/updateStatus?orderNumber=" + orderNo + "&shirtNo=" + shirtNo + "&description=" + description)
});

$(document).on('input','.orderNumberInput',function(){
	var orderNo =  $('.orderNumberInput').val();
	$(".getOrder").attr("href", "/statusesForOrderNo?orderNumber=" + orderNo)
});