$(document).on('change','.orderOption',function(){
	var myClass = $(this).attr("id");
	var res = thisOrAll()
	var description = $("#" + myClass).find(":selected").text();
	var split = myClass.split("_");
	var orderNo = split[0]
	var shirtNo = split[1]
	$("." + myClass).attr("href", "/updateStatus?orderNumber=" + orderNo + "&shirtNo=" + shirtNo + "&description=" + description + "&thisOrAll=" + res)
});

var thisOrAll = function(){
	var res = prompt("Update for just this shirt or all on order?", "this or all");
	if(res != "this" && res != "all"){
		return thisOrAll();
	} else {
		return res;
	}
}