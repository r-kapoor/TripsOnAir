	require('date-utils');
	var getCityID = require('../lib/getCityID');
	var hashidEncoder =  require('../lib/hashEncoderDecoder');

	function getHotelData (destinationsAndStops,hotelBudget, numOfPeople,connection) {
		
		var CityIDsWhereHotelIsRequired=[];
		var HotelsInStops=[];
		var numOfDaysInHotel = 0;
		console.log("hotelBudget:"+hotelBudget);
		for(var i=0;i<destinationsAndStops.destinations.length;i++)
		{	
			//console.log("TESTING");
			if(destinationsAndStops.destinations[i].isHotelRequired==1)
			{
				//console.log("for:"+destinationsAndStops.destinations[i].name);
				//console.log("for:"+destinationsAndStops.destinations[i].cityID);
				CityIDsWhereHotelIsRequired.push(destinationsAndStops.destinations[i].cityID);
				var numOfHoursInHotel = destinationsAndStops.destinations[i].arrivalTime.getHoursBetween(destinationsAndStops.destinations[i].departureTime);
				numOfDaysInHotel+=Math.ceil(numOfHoursInHotel/24);
			}
		}
		for(var k=0;k<destinationsAndStops.destinationsWiseStops.length;k++){
			console.log('In for loop');
			var stopsArray = destinationsAndStops.destinationsWiseStops[k];
			for(var d=0;d<stopsArray.length; d++) {
				if(stopsArray[d].isHotelRequired==1)
				{
					console.log('in if:'+stopsArray[d].name);
					HotelsInStops.push(stopsArray[d].name.toUpperCase());
					var numOfHoursInHotel = stopsArray[d].arrivalTime.getHoursBetween(stopsArray[d].departureTime);
					numOfDaysInHotel+=Math.ceil(numOfHoursInHotel/24);
				}
			}
		}
		if(HotelsInStops.length>0){
			console.log('length > 0');
			getCityID.getCityID(HotelsInStops,function onGettingStopsCityIDs(err,stopsCityIDs){
				if(err)
				{
					throw err;
				}
				console.log("got Stops cityID:"+stopsCityIDs);
				sendQueryForHotelData(stopsCityIDs);
			});
		}
		else
		{
			sendQueryForHotelData();
		}

		function sendQueryForHotelData(stopsCityIDs)
		{
			var perDayHotelBudget=hotelBudget/numOfDaysInHotel;
			console.log("perDayHotelBudget:"+perDayHotelBudget);
			var decodedCityIDsWhereHotelIsRequired=hashidEncoder.decodeCityID(CityIDsWhereHotelIsRequired);

			var k=0;
			if(stopsCityIDs!=undefined)
			{
				decodedCityIDsWhereHotelIsRequired=decodedCityIDsWhereHotelIsRequired.concat(stopsCityIDs);
				if(HotelsInStops.length>0){
					for(var i=0;i<destinationsAndStops.destinationsWiseStops.length;i++)
					{
						var stopsArray = destinationsAndStops.destinationsWiseStops[i];
						for(var d=0;d<stopsArray.length; d++) {
							if(stopsArray[d].name.toUpperCase()==HotelsInStops[k])
							{
								console.log("StopID:"+ stopsCityIDs[k]+" added for stop:"+stopsArray[d].name);
								stopsArray[d].cityID=stopsCityIDs[k];
								k++;
							}
						}
					}
				}
			}	

		var queryString="";
		var hotelData=[];
		if(numOfPeople==1){
			queryString+=" SELECT * FROM Hotels_Details WHERE CityID IN ("+connection.escape(decodedCityIDsWhereHotelIsRequired) +") AND MaxPersons <= 2 AND MaxPersons > 0 ORDER BY Price";
		}
		else
		{
			queryString+=" SELECT * FROM Hotels_Details WHERE CityID IN ("+connection.escape(decodedCityIDsWhereHotelIsRequired) +") AND MaxPersons <= "+connection.escape(numOfPeople)+" AND MaxPersons > 0 ORDER BY Price";
		}
		queryString+=";";
		console.log("HotelQuery:"+queryString);

		connection.query(queryString, function(err, rows, fields) {
				if (err)
				{
					throw err;
				}
			    else{
			    	for (var i in rows) {
						//var id = hashidscity.encode(rows[i].CityID);
			    		var id = hashidEncoder.encodeHotelID(rows[i].HotelID);
						rows[i].HotelID = id;
						//console.log("decodedCityIDsWhereHotelIsRequired:"+decodedCityIDsWhereHotelIsRequired+",rows[i].CityID:"+rows[i].CityID);
						var cityIDIndex=decodedCityIDsWhereHotelIsRequired.indexOf(rows[i].CityID);
						//console.log(rows[i]);
						//console.log("1cityIDIndex:"+cityIDIndex);
						if(hotelData[cityIDIndex]==undefined)
						{
							console.log("Curent Hotel is not present for cityID"+rows[i].CityID);
							hotelData[cityIDIndex]=rows[i];
							console.log("HotelData added!!");
						}
						else
						{
							if(isHotelInBudget(rows[i].Price,rows[i].MaxPersons,perDayHotelBudget,numOfPeople))
							{
								console.log("Hotel Is already there and is in budget");
									if(rows[i].Rating>hotelData[cityIDIndex].Rating)
									{
										hotelData[cityIDIndex]=rows[i];
									}
							}
							else
							{
								console.log("Hotel Is already there and is NOT in budget")
								if(rows[i].Price<hotelData[cityIDIndex].Price)
								{
										hotelData[cityIDIndex]=rows[i];
								}
							}	
						}
			    	}
			    	var k=0;
			    	for(var i=0;i<destinationsAndStops.destinations.length;i++)
					{	
						//console.log("CityIDsWhereHotelIsRequired:"+CityIDsWhereHotelIsRequired);
						console.log("destinationsAndStops.destinations[i].cityID:"+destinationsAndStops.destinations[i].cityID);
						var cityIDIndex=CityIDsWhereHotelIsRequired.indexOf(destinationsAndStops.destinations[i].cityID);
						//console.log("cityIDIndex:"+cityIDIndex);
						if(cityIDIndex!=-1){
							console.log("in hotelDetails:"+JSON.stringify(hotelData[cityIDIndex]));
							destinationsAndStops.destinations[i].hotelDetails=hotelData[cityIDIndex];
						}
					}
					if(HotelsInStops.length>0){
						for(var i=0;i<destinationsAndStops.destinationsWiseStops.length;i++)
						{
							var stopsArray = destinationsAndStops.destinationsWiseStops[i];
							for(var d=0;d<stopsArray.length; d++) {
								//console.log("decodedCityIDsWhereHotelIsRequired:"+decodedCityIDsWhereHotelIsRequired);
								console.log("destinationsAndStops.destinationsWiseStops[i].cityID:"+stopsArray[d].cityID);	
								var cityIDIndex=decodedCityIDsWhereHotelIsRequired.indexOf(stopsArray[d].cityID);
								if(cityIDIndex!=-1){
									stopsArray[d].hotelDetails=hotelData[cityIDIndex];
								}
							}
						}
					}
					//Testing
					console.log("--------------------------");
					for(var i=0;i<destinationsAndStops.destinations.length;i++)
					{
						console.log("destinations with Hotels:"+JSON.stringify(destinationsAndStops.destinations[i]));
						console.log("stops with hotel:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[i]));
					}
					console.log("LastStop with hotel:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[destinationsAndStops.destinationsWiseStops.length-1]));	
			  }
				//callback(rows);
		});
			connection.end();


			}
		}

	function isHotelInBudget(price,maxPersons,perDayHotelBudget,numOfPeople)
	{
		if(numOfPeople==1)
		{
			if(price<=perDayHotelBudget)
			{
				return true;
			}
			else
			{
				return false;
			}		
		}
		else
		{
			if((price/maxPersons)<=perDayHotelBudget)
			{
				return true;
			}
			else
			{
				return false;
			}	
		}	

	}

	module.exports.getHotelData=getHotelData;