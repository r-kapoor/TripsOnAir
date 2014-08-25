    var countofselections = 0;
    //$(".destination").click(function () {
	$("#suggestedDest").on("click",".destination",function () {
    var city = $(this).attr('id');
	console.log(city);
	console.log(countofselections);
	document.getElementById(city).className="destination-selected";
	document.getElementById(city).style.cursor="initial";
	document.getElementById(city).style.color="red";
	if(countofselections==0)
	{
		var div = document.createElement('div');
		div.innerHTML='YOUR SELECTED DESTINATIONS:';
		div.id="selected-top";
		document.getElementById("selectedDest").appendChild(div);
	}
	if(countofselections>=10){
            alert("Only 10 destinations are allowed");
            return false;
	}
	else{
		if(document.getElementById("selects-"+city)==null)
		{
			var tableDes= document.createElement('tr');
			tableDes.id="selects-"+city;
			document.getElementById("selectedDest").appendChild(tableDes);
			var cityselected = document.createElement('td');
			cityselected.innerHTML=city;
			cityselected.id="selected-"+city;
			cityselected.className='clect';//change
			document.getElementById(tableDes.id).appendChild(cityselected);
			var canceldiv = document.createElement('td');
			canceldiv.innerHTML='Cancel';
			canceldiv.id='Cancel-'+city;
			canceldiv.className='cancel';
			canceldiv.style.cursor="pointer";
			document.getElementById(tableDes.id).appendChild(canceldiv);
			countofselections++;
			//update(mark);
			
		}
	}
     });
 
	$("#selectedDest").on("click",".cancel",function () {
		var city = cityIn($(this).attr('id'));
		console.log('cancel:'+city);
		document.getElementById("selects-"+city).remove();
		document.getElementById(city).className="destination";
		document.getElementById(city).style.cursor="pointer";
		document.getElementById(city).style.color="black";
		countofselections--;
		if(countofselections==0)
		{
			document.getElementById("selected-top").remove();
		}
     });

	 function cityIn(id){
		return id.substring(id.indexOf('-')+1);
	}
	 function cityIngroup(id){
		return id.substring(id.lastIndexOf(':')+1);
	}
	function citygroupIn(id){
		return id.substring(id.indexOf(':')+1,id.lastIndexOf(':'));
	}
	
	$("#suggestedDest").on("click",".groupDestination",function () {
    var citygroup = $(this).attr('id');
	console.log(citygroup);
	console.log(countofselections);
	citygroupcopy=citygroup;
	var cities=[];
	while(citygroup.indexOf('-')!=-1)
	{
		i=citygroup.indexOf('-');
		cities[cities.length]=citygroup.substring(0,i).trim();
		citygroup=citygroup.substring(i+1);
	}
	cities[cities.length]=citygroup.trim();
	if(countofselections+cities.length>=10){
            alert("Select fewer city group");
            return false;
	}
	citygroup=citygroupcopy;
	document.getElementById(citygroup).className="destination-selected";
	document.getElementById(citygroup).style.cursor="initial";
	document.getElementById(citygroup).style.color="red";
	if(countofselections==0)
	{
		var div = document.createElement('div');
		div.innerHTML='YOUR SELECTED DESTINATIONS:';
		div.id="selected-top";
		document.getElementById("selectedDest").appendChild(div);
	}
	
	for(i=0;i<cities.length;i++)
	{
		city=cities[i];
		console.log(city);
		var singlecity=document.getElementById(city);
		if(singlecity!=null)
		{
			singlecity.className="destination-selected";
			singlecity.style.cursor="initial";
			singlecity.style.color="red";
		}
		if(document.getElementById("selects-"+city)==null)
		{
			var tableDes= document.createElement('tr');
			tableDes.id="selects-"+city;
			document.getElementById("selectedDest").appendChild(tableDes);
			var cityselected = document.createElement('td');
			cityselected.innerHTML=city;
			cityselected.id="selected-"+citygroup;
			cityselected.className='clect';//change
			document.getElementById(tableDes.id).appendChild(cityselected);
			var canceldiv = document.createElement('td');
			canceldiv.innerHTML='Cancel';
			canceldiv.id='Cancel:'+citygroup+':'+city;
			canceldiv.className='cancelGroup';
			canceldiv.style.cursor="pointer";
			document.getElementById(tableDes.id).appendChild(canceldiv);
			countofselections++;
		}
	}
     });
	 
	 $("#selectedDest").on("click",".cancelGroup",function () {
		var city = cityIngroup($(this).attr('id'));
		var citygroup = citygroupIn($(this).attr('id'));
		console.log('cancel:'+city);
		document.getElementById("selects-"+city).remove();
		document.getElementById(citygroup).className="groupDestination";
		document.getElementById(citygroup).style.cursor="pointer";
		document.getElementById(citygroup).style.color="black";
		singlecity=document.getElementById(city);
		if(singlecity!=null){
			singlecity.className="destination";
			singlecity.style.cursor="pointer";
			singlecity.style.color="black";
		}
		countofselections--;
		if(countofselections==0)
		{
			document.getElementById("selected-top").remove();
		}
     });