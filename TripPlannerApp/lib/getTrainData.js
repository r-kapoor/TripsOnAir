/*
 * Gets the schedules of the trains
 */

var extractStationCode=require('../lib/extractStationCode');
var cloneJSON=require('../lib/UtilityFunctions/cloneJSON');
var getValidDateLimits = require('../lib/UtilityFunctions/getValidDateLimits');
var trainFareDetails = require('../config/trainFareDetails.json');
var async  = require('async');

function getTrainData(conn, rome2RioData, dateSet,budget, dates, times, ratingRatio,numPeople, callback) {
	console.log('TRAIN times:'+times);
    var connection = null;
	var queryString = '';
	var parsingQuery = 'origin.TrainNo as TrainNo, origin.StationCode as OriginStationCode, dest.StationCode as DestStationCode, origin.DepartureTime as OriginDepartureTime, dest.ArrivalTime as DestArrivalTime, (dest.DistanceCovered - origin.DistanceCovered) as Distance, origin.Day as OriginDay, dest.Day as DestDay';
	var numOfTravels = rome2RioData.length;
	var trainDateSetObjectArray=[];
	var lengthOfRoutesArray=[];
	//Duration of origin city to train station has to be added in the dateSet for that train

	//maintain index of drive,if any, for the routes
	var indexOfDrive=[];
	for(var i = 0; i < numOfTravels; i++)
	{
		var allRoutes = rome2RioData[i].routes;
		//Needed by getDefaultModeOfTravel.js
		lengthOfRoutesArray[i]=allRoutes.length;
		indexOfDrive[i]=-1;
		console.log("PLaces:"+rome2RioData[i].places[0].name+":"+rome2RioData[i].places[1].name);
		console.log(dateSet.dateStart[i]+":"+dateSet.dateEnd[i]);
		for(var j = 0; j < allRoutes.length; j++)
		{
			console.log("Route Name:",allRoutes[j].name);
			if(allRoutes[j].name=="Drive")
			{
				indexOfDrive[i]=j;
			}
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
								dateEnd:new Date(dateSet.dateEnd[i].getTime() + durBeforeTrain*60000)
						};
						var sourceStation = allSegments[k].sName;
						var destinationStation = allSegments[k].tName;
						console.log("Source Dest:"+sourceStation+":"+destinationStation);
						var sourceStationCode = extractStationCode.extractStationCode(sourceStation);
						var destinationStationCode = extractStationCode.extractStationCode(destinationStation);
						trainDateSetObjectArray.push(getTrainDateSetObject(sourceStationCode,destinationStationCode,dateSetAccToTrain));
						if(queryString != '')
						{
							queryString += ' UNION ALL';
						}
                        if(connection == null){
                            connection=conn.conn();
                            connection.connect();
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
    if(queryString != ''){
        var fullQueryString = 'SELECT train.TrainNo, TrainName, DaysOfTravel, Pantry, Type, OriginStationCode, DestStationCode, OriginDepartureTime, DestArrivalTime, Distance, OriginDay, DestDay FROM'
            +' (SELECT * FROM Trains) train'
            +' JOIN'
            +' ('+queryString+') trip'
            +' ON (train.TrainNo = trip.TrainNo);';
        console.log('QUERY for trains:'+fullQueryString);

        connection.query(fullQueryString, function(err, rows, fields) {
            if (err)
            {
                throw err;
            }
            else{
                for (var i in rows) {
                    //console.log(rows[i]);
                    if((rows[i].OriginDay!=1)&&(rows[i].DaysOfTravel!="0")){
                        var daysofTravelArray=rows[i].DaysOfTravel.split("");
                        console.log("oldDaysofTravel:"+rows[i].DaysOfTravel);
                        var updatedDaysOfTravel="";
                        for(var j=0;j<daysofTravelArray.length;j++)
                        {
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
                    //console.log("i:"+i);
                    var allRoutes = rome2RioData[i].routes;
                    for(var j = 0; j < allRoutes.length; j++)
                    {
                        var allSegments = allRoutes[j].segments;
                        var isRecommendedRoute = 1;
                        for(var k = 0; k < allSegments.length; k++)
                        {
                            if(allSegments[k].isMajor == 1 && allSegments[k].vehicle)
                            {
                                if(allSegments[k].vehicle == "train")//A part of this route is a train
                                {
                                    var sourceStation = allSegments[k].sName;
                                    var destinationStation = allSegments[k].tName;
                                    var sourceStationCode = extractStationCode.extractStationCode(sourceStation);
                                    var destinationStationCode = extractStationCode.extractStationCode(destinationStation);
                                    var startDate=trainDateSetObjectArray[countOfVehicleTrain].dateSet.dateStart;
                                    var endDate=trainDateSetObjectArray[countOfVehicleTrain].dateSet.dateEnd;
                                    var startTime=startDate.toFormat("HH24")+":"+startDate.toFormat("MI")+":00";
                                    var endTime=endDate.toFormat("HH24")+":"+endDate.toFormat("MI")+":00";
                                    var atLeastATrain=0;
                                    var trainData=[];
                                    //Iterate the train rows from the database to check whether there are trains on the possible days:times
                                    for (var t in rows) {
                                        if((sourceStationCode==rows[t].OriginStationCode)&&(destinationStationCode==rows[t].DestStationCode))
                                        {
                                            var daysofTravelArray=rows[t].DaysOfTravel.split("");
                                            var OriginDepartureTime=rows[t].OriginDepartureTime;
                                            var trainDateLimits = getValidDateLimits.getValidDateLimits(startDate,endDate,startTime,endTime,daysofTravelArray,OriginDepartureTime);
                                            if(trainDateLimits.length > 0)
                                            {
                                                atLeastATrain=1;
                                                console.log("Train found:"+rows[t].TrainName+":"+rows[t].TrainNo);
                                                rows[t].isRecommended=1;
                                            }
                                            else
                                            {
                                                rows[t].isRecommended=0;
                                            }
                                            rows[t].fare=getTrainFare(rows[t].Distance,rows[t].Type,rows[t].OriginDepartureTime, rows[t].DestArrivalTime, rows[t].OriginDay, rows[t].DestDay );
                                            rows[t].dateLimits = trainDateLimits;
                                            trainData.push(rows[t]);
                                        }
                                    }
                                    if(atLeastATrain==1)
                                    {
                                        allSegments[k].isRecommendedSegment=1;
                                        isRecommendedRoute = 1;

                                    }
                                    else
                                    {
                                        allSegments[k].isRecommendedSegment=0;
                                        isRecommendedRoute = 0;
                                        break;
                                    }
                                    allSegments[k].trainData=trainData;
                                    countOfVehicleTrain++;

                                }
                            }
                        }
                        if(isRecommendedRoute==1)
                        {
                            allRoutes[j].isRecommendedRouteTrain=1;
                        }
                        else
                        {
                            allRoutes[j].isRecommendedRouteTrain=0;
                        }
                    }
                }

            }
            var result = {
                rome2RioData:rome2RioData,
                lengthOfRoutesArray:lengthOfRoutesArray,
                indexOfDrive:indexOfDrive
            };
            callback(null, result);

        });
        connection.end();
    }
    else {
        //No trains in the data
        var result = {
            rome2RioData:rome2RioData,
            lengthOfRoutesArray:lengthOfRoutesArray,
            indexOfDrive:indexOfDrive
        };
        callback(null, result);
    }

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

function getTrainFare(distance,type,originDepartureTime, destinationArrivalTime, originDay, destinationDay){
    //console.log("Type of train:"+type+","+"distance:"+distance);
    var distanceIndex;
    var fare;
    distance = distance -1;
    if(distance<=300){
        distanceIndex=parseInt(parseInt(distance)/5);
    }
    else if(distance<=1000){
        distanceIndex=60 + parseInt(parseInt(distance-300)/10);
    }
    else if(distance<=2500){
        distanceIndex = 130 + parseInt(parseInt(distance-1000)/25);
    }
    else{
        distanceIndex = 190 + parseInt(parseInt(distance-2500)/50);
    }

    if(type==null){
        type="EXPRESS";
    }


    if(type=="GARIB RATH"){
        fare = trainFareDetails["GARIB RATH"]["3A"][distanceIndex];
    }
    else if((type=="RAJDHANI")||(type=="DURONTO")){
        fare = trainFareDetails["RAJDHANI"]["3A"][distanceIndex];
    }
    else if(type == "SHATABDI"){
        fare = trainFareDetails["SHATABDI"]["CC"][distanceIndex];
    }
    else if(type=="JAN SHATABDI"){
        fare = trainFareDetails["JAN SHATABDI"]["CC"][distanceIndex];
    }
    else if(type=="SUPERFAST"){
        fare = trainFareDetails.EXPRESS["3A"][distanceIndex];
    }
    else
    {
        fare=trainFareDetails.EXPRESS["3A"][distanceIndex];
    }
    //add reservation charges and service tax
    fare+=(fare*trainFareDetails.SERVICETAXPERCENT["3A"])/100;
    if(type!="EXPRESS"){
        fare+=trainFareDetails.SUPERFASTCHARGES["3A"];
    }
    fare+=trainFareDetails.RESERVATIONCHARGES["3A"];

    var cateringCharges = 0;
    //adding the catering charges
    if((type == "RAJDHANI") || (type == "DURONTO") || (type == "SHATABDI")) {
        if(destinationDay==originDay){
            for(var i in trainFareDetails.CATERINGTIMINGS) {
                if((trainFareDetails.CATERINGTIMINGS[i] > originDepartureTime)&&(trainFareDetails.CATERINGTIMINGS[i] < destinationArrivalTime)) {
                    cateringCharges+=trainFareDetails.CATERINGCHARGES["3A"][i];
                }
            }
        }
        else {
            var numberOfFullDays = destinationDay - originDay - 1;
            cateringCharges += numberOfFullDays * trainFareDetails.CATERINGCHARGES["3A"].Total;
            for (var i in trainFareDetails.CATERINGTIMINGS) {
                if (trainFareDetails.CATERINGTIMINGS[i] > originDepartureTime) {
                    cateringCharges += trainFareDetails.CATERINGCHARGES["3A"][i];
                }
                if (trainFareDetails.CATERINGTIMINGS[i] < destinationArrivalTime) {
                    cateringCharges += trainFareDetails.CATERINGCHARGES["3A"][i];
                }
            }
        }
    }
    fare+=cateringCharges;
    fare=parseInt(fare);
    //fare in multiple of 5
    if(fare%5!=0){
        fare=parseInt(fare/5)*5+5;
    }

    //console.log("train Fare:"+fare);
    return fare;
}
