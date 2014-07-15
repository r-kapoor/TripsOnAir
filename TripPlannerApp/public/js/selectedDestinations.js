    var countofselections = 0;
    //$(".destination").click(function () {
	$("#suggestedDest").on("click",".destination",function () {
    var city = $(this).attr('id');
	console.log(city);
	console.log(countofselections);
	if(countofselections==0)
	{
		var div = document.createElement('div');
		div.innerHTML='YOUR SELECTED DESTINATIONS:';
		div.id="selected-top";
		document.getElementById("selectedDest").appendChild(div);
	}
	if(countofselections>5){
            alert("Only 5 Destination allow");
            return false;
	}
	else{
		var tableDes= document.createElement('tr');
		tableDes.id="selects-"+city;
		document.getElementById("selectedDest").appendChild(tableDes);
		var cityselected = document.createElement('td');
		cityselected.innerHTML=city;
		cityselected.id="selected-"+city;
		document.getElementById(tableDes.id).appendChild(cityselected);
		var canceldiv = document.createElement('td');
		canceldiv.innerHTML='Cancel';
		canceldiv.id='Cancel-'+city;
		canceldiv.className='cancel';
		canceldiv.style.cursor="pointer";
		document.getElementById(tableDes.id).appendChild(canceldiv);
		countofselections++;
	}
     });
 
	$("#selectedDest").on("click",".cancel",function () {
		var city = cityIn($(this).attr('id'));
		console.log('cancel:'+city);
		document.getElementById("selects-"+city).remove();
		countofselections--;
		if(countofselections==0)
		{
			document.getElementById("selected-top").remove();
		}
     });

	 function cityIn(id){
		return id.substring(id.indexOf('-')+1);
	}