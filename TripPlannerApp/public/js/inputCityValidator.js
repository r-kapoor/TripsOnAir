/**
 * Validate if user input cities are redundant or not
 */

$(document).on("blur",".destination",function () {

	var dests=document.getElementsByClassName('destination')
	var destArray=jQuery.makeArray(dests);
	destArray.unshift(origin);
	var len=destArray.length;
	for(var i=0;i<len-1;i++)
	{
			if(destArray[i].value==destArray[len-1].value)
			{
				$(this).css("color","red");	
			}
	}
});