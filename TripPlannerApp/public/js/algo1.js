/**
 * 
 * @author rajat
 * Gelocation finds the lat/long of the inputs & subsequently finds the distance followed by approximate budget
 */	

function geolocation()
{		
	var origin=document.getElementById("origin").value;
	var destination=document.getElementById("textbox1").value;
	var startDate=document.getElementById("startdate").value;
	var endDate=document.getElementById("enddate").value;

	if((origin!="")&&(destination!="")&&(startDate!="")&&(endDate!=""))
	{
		var originLocation = "http://maps.googleapis.com/maps/api/geocode/json?address="+origin+"&sensor=true";
		var destinationLocation ="http://maps.googleapis.com/maps/api/geocode/json?address="+destination+"&sensor=true"; 
		var diff = Math.abs(new Date(endDate)-new Date(startDate));
		var numofDays=diff/(1000*60*60*24)+1;//+1 for including end date

		$.getJSON(originLocation, function(data){
			var orgLat = data.results[0].geometry.location.lat;
			var orgLong =data.results[0].geometry.location.lng;

			$.getJSON(destinationLocation, function(data){
				var destLat= data.results[0].geometry.location.lat;
				var destLong=data.results[0].geometry.location.lng;
				var dist=distance(orgLat,orgLong,destLat,destLong,"K");
				//alert(dist);
				budgetCalc(origin,destination,dist,numofDays,function(budget){
				console.log("budget "+budget);
				//var budget = 7000;

				//first make all enable
				document.getElementById("range").options[1].enabled=true;
				document.getElementById("range").options[2].enabled=true;
				document.getElementById("range").options[3].enabled=true;


				if(budget<5000)
				{
					//do nothing
				}
				else if(budget<10000)
				{
					document.getElementById("range").options[1].disabled=true;
				}
				else if(budget<30000)
				{
					document.getElementById("range").options[1].disabled=true;
					document.getElementById("range").options[2].disabled=true;
				}	
				else
				{
					document.getElementById("range").options[1].disabled=true;
					document.getElementById("range").options[2].disabled=true;
					document.getElementById("range").options[3].disabled=true;
				}

				//display the other inputs
				document.getElementById("input2").removeAttribute("style");
				});//end budgetCalc
			});

		});
	}
	else
	{
		document.getElementById("invalid").innerHTML ="Please enter valid inputs";
	}
}

function distance(orgLat, orgLong, destLat, destLong, unit) {

	//alert("test"+orgLat);
	/*var radlat1 = Math.PI * orgLat/180;
		var radlat2 = Math.PI * destLat/180;
		var radlon1 = Math.PI * orgLong/180;
		var radlon2 = Math.PI * destLong/180;
		var theta = orgLong-destLong;
		var radtheta = Math.PI * theta/180;
		//alert("test"+radtheta);
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		    dist = Math.acos(dist);
		    dist = dist * 180/Math.PI;
		    dist = dist * 60 * 1.1515;
		    if (unit=="K") { dist = dist * 1.609344
		    	alert("dist "+dist)};
		    if (unit=="N") { dist = dist * 0.8684 };
		    return dist;*/

	var R = 6371;  
	var dLat = (destLat-orgLat)*Math.PI/180;  
	var dLon = (destLong-orgLong)*Math.PI/180;   
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +  
	Math.cos(orgLat*Math.PI/180) * Math.cos(destLat*Math.PI/180) *   
	Math.sin(dLon/2) * Math.sin(dLon/2);   
	var c = 2 * Math.asin(Math.sqrt(a));   
	var d = R * c; 
	return d;
	//alert(d);
}

function budgetCalc(origin,destination,dist,numofDays,display)
{
	var fare=0;
	var avgSpeed = 60;//kmph
	//calculate average non-flight travel time round trip
	var nFlgtTime = 2*(dist/avgSpeed);
	var totalTime = 24*numofDays;
	//if avg non-flight travel time is 50% more than non-travel time then go with flight else train or bus or cab

	if((nFlgtTime*100)/totalTime>=50)
	{
		if(dist<1500)
		{
			fare+=7000;
		}
		else
		{
			fare+=10000;
		}
	}
	else
	{		
		if(dist<2000)
		{
			fare+=1000;//round trip min fare
		}
		else
		{
			fare+=3000;
		}
	}

	//Now calculate approx. acco and food fare according to the destination city

	updateFare(destination, fare,display, function(tier, fare){

		switch(tier){
		case "1":
			fare+=numofDays*1500;
			break;
		case "2":
			fare+=numofDays*1000;
			break;
		case "3":	
			fare+=numofDays*750;
			break;
		}
		console.log("fare1 "+fare);
		return fare;
	});
	//console.log("fare2 "+fare);
	//return fare;
}

function updateFare(city, fare,display, calculateFare)
{
	var citytier = $.getJSON( "citytier.json");
	citytier.done(function(data) {
		console.log( "second success" );
		console.log(data);
		console.log(city);
		//fare = calculateFare(3, fare);
		$.each(data.cities, function(key,value) {
			if(value.city==city) {
				//console.log("tier"+value.tier);
				fare = calculateFare(value.tier, fare);
				display(fare);
				//return(fare);
			}
		});
	});
}