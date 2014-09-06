/**
 * 
 * @author rajat
 * Gelocation finds the lat/long of the inputs & subsequently finds the distance followed by approximate budget
 */	

function geolocation()
{		
	var origin=document.getElementById("origin").value;
	//var destination=document.getElementById("textbox1").value;
	var startDate=document.getElementById("startdate").value;
	var endDate=document.getElementById("enddate").value;
	var bool=document.getElementById("textbox1").disabled;
	var destElements=document.getElementsByClassName('destination');
	var len=destElements.length;

	if((origin!="")&&(startDate!="")&&(endDate!="")&&(destElements[0]!="")&&(!bool)&&(origin!="Enter a city")&&(destElements[0]!="Enter a city"))
	{
		var originLocation = "http://maps.googleapis.com/maps/api/geocode/json?address="+origin+"&sensor=true"; 
		var diff = Math.abs(new Date(endDate)-new Date(startDate));
		var numofDays=diff/(1000*60*60*24);
		var destLocations=[];var city=[];
		var arg=[];
		arg[0]=$.getJSON(originLocation);
		console.log("length "+len);
		for(var i=0;i<len;i++)
		{
			city[i]=destElements[i].value;
			destLocations[i]="http://maps.googleapis.com/maps/api/geocode/json?address="+destElements[i].value+"&sensor=true";
			arg[i+1]=$.getJSON(destLocations[i]);
		}
		
		/*$.getJSON(originLocation, function(data){
			var orgLat = data.results[0].geometry.location.lat;
			var orgLong =data.results[0].geometry.location.lng;
			//console.log(orgLat,orgLong);
			console.log("diff "+diff);
			
			$.getJSON(destinationLocation, function(data){
				var destLat= data.results[0].geometry.location.lat;
				var destLong=data.results[0].geometry.location.lng;
				var dist=distance(orgLat,orgLong,destLat,destLong,"K");
				
				console.log("dist "+dist);
				//alert(dist);*/
		//var arg=[$.getJSON(originLocation),$.getJSON(destinationLocation)];
		
		$.when.apply(this,arg).done(function(){
			console.log("data1 "+arguments[0]);
			console.log("data2 "+arguments[1]);	
			i=0;
			var lat=[];var long=[];var dist=0;
			while(i<len+1)
			{	
				lat[i]=arguments[i][0].results[0].geometry.location.lat;
				long[i]=arguments[i][0].results[0].geometry.location.lng;
				console.log(lat[i]+","+long[i]);
				if(i>0)
				{
					dist+=parseInt(distance(lat[i-1],long[i-1],lat[i],long[i],"K"));
				}
				i++;
			}

			dist+=parseInt(distance(lat[0],long[0],lat[len],long[len],"K"));
			/*var orgLat = arguments[0][0].results[0].geometry.location.lat;
			//console.log("test "+orgLat);
			var orgLong =arguments[0][0].results[0].geometry.location.lng;
			var destLat= arguments[1][0].results[0].geometry.location.lat;
			var destLong=arguments[1][0].results[0].geometry.location.lng;
			
			console.log(orgLat+","+orgLong+","+destLat+","+destLong);
			*/
			//var dist=distance(orgLat,orgLong,destLat,destLong,"K");
			
			console.log("dist "+dist);
			
			
				budgetCalc(origin,city,dist,numofDays,function(budget){
				console.log("budget "+budget);
				//var budget = 7000;

				//first make all enable
				document.getElementById("range").options[1].disabled=false;
				document.getElementById("range").options[2].disabled=false;
				document.getElementById("range").options[3].disabled=false;


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

				if(bool)
				{
					
				}
				//display the other inputs
				document.getElementById("input2").removeAttribute("style");
				});//end budgetCalc*/
			//});
		});
	}
	else if((origin!="")&&(startDate!="")&&(endDate!="")&&(bool)&&(origin!="Enter a city"))
	{
		document.getElementById("input2").removeAttribute("style");
	}
	
	else
	{
		document.getElementById("invalid").innerHTML ="Please enter valid inputs";
	}
}

function distance(orgLat, orgLong, destLat, destLong, unit) {

	var R = 6371;  
	var dLat = (destLat-orgLat)*Math.PI/180;  
	var dLon = (destLong-orgLong)*Math.PI/180;   
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +  
	Math.cos(orgLat*Math.PI/180) * Math.cos(destLat*Math.PI/180) *   
	Math.sin(dLon/2) * Math.sin(dLon/2);   
	var c = 2 * Math.asin(Math.sqrt(a));   
	var d = R * c; 
	return d;
}

function budgetCalc(origin,destination,dist,numofDays,display)
{
	
	var fare=0;
	var avgSpeed = 60;//kmph
	//calculate average non-flight travel time round trip
	var nFlgtTime = (dist/avgSpeed);
	var totalTime = 24*numofDays;
	//if avg non-flight travel time is 50% more than non-travel time then go with flight else train or bus or cab

	if((nFlgtTime*100)/totalTime>=50)
	{//travel by flight
		if(dist<1500)
		{
			fare+=7000;
		}
		else if(dist<2000)
		{
			fare+=10000;
		}
		else if(dist<2500)
		{
			fare+=13000;
		}
		else if(dist<3000)
		{
			fare+=18000;
		}
		else
		{
			fare+=25000;
		}
	}
	else
	{		
		if(dist<1500)
		{
			fare+=1000;//round trip min fare
		}
		else if(dist<2000)
		{
			fare+=3000;
		}
		else if(dist<2500)
		{
			fare+=4000;
		}
		else if(dist<3000)
		{
			fare+=5000;
		}
		else
		{
			fare+=8000;
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
	var count=0;var isInCityTier=false;
	var citytier = $.getJSON( "citytier.json");
	citytier.done(function(data) {
		$.each(data.cities, function(key,value) {
			for(i in city){
				if(value.city==city[i]) {
					isInCityTier=true;
				fare = calculateFare(value.tier, fare);
				count++;
				break;
				}
			}			
			if(count==city.length){
				return false;
			}
		});
		while(count<city.length)
		{
			fare = calculateFare("3", fare);
			console.log("fareTEst "+fare);
			count++;
		}
			display(fare);
	});
}