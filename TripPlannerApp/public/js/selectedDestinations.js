     var counter = 1;
    //$(".destination").click(function () {
	$("#suggestedDest").on("click",".destination",function () {
    var city = $(this).attr('id');
	console.log(city);
	console.log(counter);
	if(counter==1)
	{
		var div = document.createElement('div');
		div.innerHTML='YOUR SELECTED DESTINATIONS:';
		div.id="selected-top";
		document.getElementById("selectedDest").appendChild(div);
	}
	if(counter>5){
            alert("Only 5 Destination allow");
            return false;
	}
	else{
		var div = document.createElement('div');
		div.innerHTML=city;
		div.id=city;
		document.getElementById("selectedDest").appendChild(div);
	}
	counter++;
     });
 
     $("#destinationRemoved").click(function () {
    	 var att=document.createAttribute("style");
    	 att.value="display: none";
    	 document.getElementById("TextBoxDiv"+counter).setAttributeNode(att);
    	 console.log(counter);
    	 counter--;
     });