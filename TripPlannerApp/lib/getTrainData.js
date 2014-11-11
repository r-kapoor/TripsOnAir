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
		for(var j = 0; j < allRoutes.length; j++)
		{
			console.log("Route Name:",allRoutes[j].name);
			var allSegments = allRoutes[j].segments;
			var durBeforeTrain=0;
			for(var k = 0; k < allSegments.length; k++)
			{
				durBeforeTrain+=allSegments[k].duration;
				if(allSegments[k].vehicle)
				{
					console.log("allSegments[k].vehicle:"+allSegments[k].vehicle);
					if(allSegments[k].vehicle == "train")//A part of this route is a train
					{
						var dateSetAccToTrain={
								dateStart:new Date(dateSet.dateStart[i].getTime() + durBeforeTrain*60000),
								dateEnd:new Date(dateSet.dateEnd[i].getTime() + durBeforeTrain*60000),
						}		
						var sourceStation = allSegments[k].sName;
						var destinationStation = allSegments[k].tName;
						var sourceStationCode = sourceStation.substring(sourceStation.indexOf('(')+1,sourceStation.indexOf(')'));
						var destinationStationCode = destinationStation.substring(destinationStation.indexOf('(')+1,destinationStation.indexOf(')'));
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
				if((rows[i].OriginDay!=1)||(rows[i].DaysOfTravel!="0")){
					var daysofTravelArray=rows[i].DaysOfTravel.split("");
					console.log("oldDaysofTravel"+rows[i].DaysOfTravel.split(""));
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
			
	    }
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
		dateSet:dataSet
	}; 
}