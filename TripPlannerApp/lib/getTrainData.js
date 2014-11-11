function getTrainData(conn, rome2RioData, dateSet) {
	var connection=conn.conn();
	connection.connect();
	var queryString = '';
	var parsingQuery = 'origin.TrainNo as TrainNo, origin.StationCode as OriginStationCode, dest.StationCode as DestStationCode, origin.DepartureTime as OriginDepartureTime, dest.ArrivalTime as DestArrivalTime, (dest.DistanceCovered - origin.DistanceCovered) as Distance, origin.Day as OriginDay, dest.Day as DestDay';
	var numOfTravels = rome2RioData.length;
	var trainDateSetObjectArray=[];
	//Duration of origin city to train station has to be added in the dateSet for that train 

	for(var i = 0; i < numOfTravels; i++)
	{
		var allRoutes = rome2RioData[i].routes;
		console.log("PLaces:"+rome2RioData[i].places[0].name+":"+rome2RioData[i].places[1].name);
		console.log(dateSet.dateStart[i]+":"+dateSet.dateEnd[i]);
		for(var j = 0; j < allRoutes.length; j++)
		{
			console.log("Route Name:",allRoutes[j].name);
			var allSegments = allRoutes[j].segments;
			var durBeforeTrain=0;
			for(var k = 0; k < allSegments.length; k++)
			{
				if(allSegments[k].vehicle)
				{
					//console.log("allSegments[k].vehicle:"+allSegments[k].vehicle);
					if(allSegments[k].vehicle == "train")//A part of this route is a train
					{
						var dateSetAccToTrain={
								dateStart:new Date(dateSet.dateStart[i].getTime() + durBeforeTrain*60000),
								dateEnd:new Date(dateSet.dateEnd[i].getTime() + durBeforeTrain*60000),
						}
						var sourceStation = allSegments[k].sName;
						var destinationStation = allSegments[k].tName;
						console.log("Source Dest:"+sourceStation+":"+destinationStation);
						var sourceStationCode = extractStationCode(sourceStation);
						var destinationStationCode = extractStationCode(destinationStation);
						trainDateSetObjectArray.push(getTrainDateSetObject(sourceStationCode,destinationStationCode,dateSetAccToTrain));
						if(queryString != '')
						{
							queryString += ' UNION ALL';
						}
						queryString += ' SELECT '+parsingQuery+' FROM'
										+' (SELECT * FROM Railway_Timetable WHERE StationCode='+connection.escape(sourceStationCode)+') origin'
										+' JOIN'
										+' (SELECT * FROM Railway_Timetable WHERE StationCode='+connection.escape(destinationStationCode)+') dest'
										+' ON (origin.TrainNo = dest.TrainNo) AND (origin.DistanceCovered < dest.DistanceCovered) AND (origin.Route = dest.Route OR origin.Route = 1)';
					}
				}
				durBeforeTrain+=allSegments[k].duration;
			}
		}
	}
	var fullQueryString = 'SELECT train.TrainNo, TrainName, DaysOfTravel, Pantry, Type, OriginStationCode, DestStationCode, OriginDepartureTime, DestArrivalTime, Distance, OriginDay, DestDay FROM'
		+' (SELECT * FROM Trains) train'
		+' JOIN'
		+' ('+queryString+') trip'
		+' ON (train.TrainNo = trip.TrainNo);';
	//console.log('QUERY for trains:'+fullQueryString);
	
	connection.query(fullQueryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
			for (var i in rows) {
				console.log(rows[i]);
				if((rows[i].OriginDay!=1)&&(rows[i].DaysOfTravel!="0")){
					var daysofTravelArray=rows[i].DaysOfTravel.split("");
					console.log("oldDaysofTravel:"+rows[i].DaysOfTravel);
					var updatedDaysOfTravel="";
					for(var j=0;j<daysofTravelArray.length;j++)
					{
						console.log()
						updatedDaysOfTravel+=parseInt(daysofTravelArray[j])+(rows[i].OriginDay-1);
					}
					console.log("updatedDaysOfTravel:"+updatedDaysOfTravel);
					rows[i].DaysOfTravel=updatedDaysOfTravel;
				}
	    	}
			var countOfVehicleTrain=0;
			//Iterating the array of rome2rio objects
			for(var i = 0; i < numOfTravels; i++)
			{
				var allRoutes = rome2RioData[i].routes;
				for(var j = 0; j < allRoutes.length; j++)
				{
					var allSegments = allRoutes[j].segments;
					for(var k = 0; k < allSegments.length; k++)
					{
						if(allSegments[k].vehicle)
						{
							if(allSegments[k].vehicle == "train")//A part of this route is a train
							{
								var sourceStation = allSegments[k].sName;
								var destinationStation = allSegments[k].tName;
								var sourceStationCode = extractStationCode(sourceStation);
								var destinationStationCode = extractStationCode(destinationStation);
								var startDate=trainDateSetObjectArray[countOfVehicleTrain].dateSet.dateStart;
								var endDate=trainDateSetObjectArray[countOfVehicleTrain].dateSet.dateEnd;
								var startTime=startDate.getHours()+":"+startDate.getMinutes();
								var endTime=endDate.getHours()+":"+endDate.getMinutes();
								var atLeastATrain=0;
								var trainData=[];
								//Iterate the train rows from the database to check whether there are trains on the possible days:times
								for (var i in rows) {
									if((sourceStationCode==rows[i].OriginStationCode)&&(destinationStationCode==rows[i].DestStationCode))
									{
										var daysofTravelArray=rows[i].DaysOfTravel.split("");
										var OriginDepartureTime=rows[i].OriginDepartureTime;
										if(isTrainInDateLimits(startDate,endDate,startTime,endTime,daysofTravelArray,OriginDepartureTime))
										{
											atLeastATrain=1;
											console.log("Train found:"+rows[i].TrainName+":"+rows[i].TrainNo);
											rows[i].isRecommendedTrain=1;
										}
										else
										{
											rows[i].isRecommendedTrain=0;
										}	
										trainData.push(rows[i]);
							    	}
								}
								if(atLeastATrain==1)
								{
									allSegments[k].isRecommendedRoute=1;
								}
								else
								{
									allSegments[k].isRecommendedRoute=0;
								}
								allSegments[k].trainData=trainData;
								countOfVehicleTrain++;
								
							}
						}
					}
				}
			}
			
	    }
		var fs = require('fs');
		fs.writeFile("text.txt",JSON.stringify(rome2RioData), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		});
		//callback(rows);
	});
	connection.end();

}
module.exports.getTrainData = getTrainData;


function getTrainDateSetObject(originStationCode,destStationCode,dateSet)
{
	return {			
		destStationCode:destStationCode,
		originStationCode:originStationCode,
		dateSet:dateSet
	}; 
}

function extractStationCode(stationString)
{
	return stationString.substring(stationString.indexOf('(')+1,stationString.indexOf(')'));
}



function isTrainInDateLimits(startDate,endDate,startTime,endTime,daysofTravelArray,OriginDepartureTime)
{
	console.log("Checking for limits");
	console.log("startDate,enddate:,startTime,endTime,OriginDeptTime"+startDate+","+endDate+","+startTime+","+endTime+","+OriginDepartureTime);
	console.log("daysofTravelArray:"+daysofTravelArray);
	
	if(daysofTravelArray[0]==0)
	{
		return true;
	}
	
	for(var i=0;i<daysofTravelArray.length;i++)
	{
		var stDate=new Date(startDate.getTime());
		var enDate=new Date(endDate.getTime());
		while(true)
		{
			if(stDate.getDate()>enDate.getDate())
			{
				break;
			}
			
			if((stDate.getDay()+1)==daysofTravelArray[i])//+1 as getDay returns 0-6 days;train run on the current date
			{
				if(stDate.getDate()==startDate.getDate())//current date is start date
				{
					if(startTime<OriginDepartureTime)//train is departing after start time
					{
						if(stDate.getDate()==enDate.getDate())//current date is also end date
						{
							if(OriginDepartureTime<endTime)//train is departing before end time
							{
								return true;
							}
						}
						else
						{
							return true;
						}	
						
					}					
				}
				else if(stDate.getDate()==enDate.getDate())//if current date is end date
				{
					if(OriginDepartureTime<endTime)//train is departing before end time
					{
						return true;
					}				
				}	
				else//current date is between start date and end date
				{
					return true;
				}	
				
			}
		//train doesn't run on the current date	
			stDate.setDate(stDate.getDate()+1);
		}
	}
	// train doesn't run between date set
	return false;
}