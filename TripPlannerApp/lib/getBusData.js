/**
 * Created by rajat on 5/4/2015.
 */


/*
 * Gets the schedules of the Buses
 */

require('date-utils');
var getValidDateLimits = require('../lib/UtilityFunctions/getValidDateLimits');

function getBusData(conn, rome2RioData, dateSet,budget, dates, times, callback) {
    var connection=conn.conn();
    connection.connect();
    var queryString = '';
    var numOfTravels = rome2RioData.length;
    var busDateSetObjectArray=[];
    var lengthOfRoutesArray=[];
    //Duration of origin city to airport has to be added in the dateSet for that flight

    //maintain index of drive,if any, for the routes
    var indexOfDrive=[];
    var sourceCityNameArray = [];
    var destinationCityNameArray = [];

    console.log("-------------Getting Bus Data---------------");
    for(var i = 0; i < numOfTravels; i++)
    {
        var allRoutes = rome2RioData[i].routes;
        //Needed by getDefaultModeOfTravel.js
        lengthOfRoutesArray[i]=allRoutes.length;
        //console.log("Places:"+rome2RioData[i].places[0].name+":"+rome2RioData[i].places[1].name);
        //console.log(dateSet.dateStart[i]+":"+dateSet.dateEnd[i]);
        for(var j = 0; j < allRoutes.length; j++)
        {
            console.log("Route Name:",allRoutes[j].name);
            if(allRoutes[j].name.toUpperCase() == 'BUS REDBUS'||allRoutes[j].name.toUpperCase() == 'BUS'){
                var allSegments = allRoutes[j].segments;
                var durBeforeBus=0;
                for(var k = 0; k < allSegments.length; k++)
                {
                    //console.log("allSegments[k].vehicle:"+allSegments[k].vehicle);
                    if(allSegments[k].kind != undefined && allSegments[k].isMajor == 1 && allSegments[k].kind == "bus")//A part of this route is a bus
                    {
                        var dateSetAccToBus={
                            dateStart:new Date(dateSet.dateStart[i].getTime() + durBeforeBus*60000),
                            dateEnd:new Date(dateSet.dateEnd[i].getTime() + durBeforeBus*60000)
                        };
                        var sourceCityName = allSegments[k].sName.toUpperCase();
                        var destinationCityName = allSegments[k].tName.toUpperCase();
                        console.log("Source Dest:"+sourceCityName+":"+destinationCityName);
                        busDateSetObjectArray.push(getBusDateSetObject(sourceCityName,destinationCityName,dateSetAccToBus));
                        sourceCityNameArray.push(sourceCityName);
                        destinationCityNameArray.push(destinationCityName);
                    }
                    durBeforeBus+=allSegments[k].duration;
                }
            }
        }
    }

    var fullQueryString = 'select BusID, Operator, Type, OriginCityID, DestinationID, DepartureTime as OriginDepartureTime, ArrivalTime as DestArrivalTime, Duration, DaysOfTravel,OriginName, DestinationName, Rating, Price, DestDay, OriginDay from(select * from(((select * from Bus) a '
        +' Join '
        +' (select CityID, AlternateName as OriginName from CityAlternateName where AlternateName IN ( '+connection.escape(sourceCityNameArray)+' )) b '
        +' ON a.OriginCityID = b.CityID))) c '
        +' Join '
        +' (select CityID, AlternateName as DestinationName from CityAlternateName where AlternateName IN ( '+connection.escape(destinationCityNameArray)+' )) d '
        +' ON '
        +' c.DestinationID = d.CityID;';
    console.log('QUERY for Bus:'+fullQueryString);
    connection.query(fullQueryString, function(err, rows, fields) {
        if (err)
        {
            throw err;
        }
        else{
            for (var i in rows) {
                console.log(rows[i]);
            }
            var countOfVehicleBus=0;
            //Iterating the array of rome2rio objects
            for(var i = 0; i < numOfTravels; i++)
            {
                console.log("i:"+i);
                var allRoutes = rome2RioData[i].routes;
                for(var j = 0; j < allRoutes.length; j++)
                {
                    var allSegments = allRoutes[j].segments;
                    var isRecommendedRoute = 1;
                    if(allRoutes[j].name.toUpperCase() == 'BUS REDBUS'||allRoutes[j].name.toUpperCase() == 'BUS')
                    {
                        for(var k = 0; k < allSegments.length; k++)
                        {
                            if(allSegments[k].isMajor == 1 && allSegments[k].kind != undefined && allSegments[k].kind == "bus")//A part of this route is a flight
                            {
                                var sourceCityName = allSegments[k].sName.toUpperCase();
                                var destinationCityName = allSegments[k].tName.toUpperCase();
                                var startDate=busDateSetObjectArray[countOfVehicleBus].dateSet.dateStart;
                                var endDate=busDateSetObjectArray[countOfVehicleBus].dateSet.dateEnd;
                                var startTime=startDate.toFormat("HH24")+":"+startDate.toFormat("MI")+":00";
                                var endTime=endDate.toFormat("HH24")+":"+endDate.toFormat("MI")+":00";
                                var atLeastABus=0;
                                var busData=[];
                                //Iterate the flight rows from the database to check whether there are flights on the possible days:times
                                for (var t in rows) {
                                    if((sourceCityName==rows[t].OriginName)&&(destinationCityName==rows[t].DestinationName))
                                    {
                                        console.log("*******in BUS FOR LOOP------------------");
                                        var daysOfTravelArray= rows[t].DaysOfTravel;
                                        var OriginDepartureTime=rows[t].OriginDepartureTime;
                                        console.log(startDate+","+endDate+","+startTime+","+endTime+","+daysOfTravelArray+","+OriginDepartureTime);
                                        var busDateLimits = getValidDateLimits.getValidDateLimits(startDate,endDate,startTime,endTime,daysOfTravelArray,OriginDepartureTime);
                                        console.log("BusDateLimits: "+busDateLimits);
                                        if(busDateLimits.length > 0)
                                        {
                                            atLeastABus=1;
                                            rows[t].isRecommended=1;
                                        }
                                        else
                                        {
                                            rows[t].isRecommended=0;
                                        }
                                        rows[t].dateLimits = busDateLimits;
                                        busData.push(rows[t]);
                                    }
                                }
                                if(atLeastABus==1)
                                {
                                    allSegments[k].isRecommendedSegment=1;
                                    isRecommendedRoute = 1;
                                }
                                else
                                {
                                    allSegments[k].isRecommendedSegment=0;
                                    isRecommendedRoute = 0;
                                }
                                allSegments[k].busData=busData;
                                countOfVehicleBus++;
                            }
                        }
                    }
                    if(isRecommendedRoute==1)
                    {
                        allRoutes[j].isRecommendedRouteBus=1;
                    }
                    else
                    {
                        allRoutes[j].isRecommendedRouteBus=0;
                    }
                }
            }
        }
        callback(null, rome2RioData);
    });
    connection.end();
}
module.exports.getBusData = getBusData;


function getBusDateSetObject(originCityName,destinationCityName,dateSet)
{
    return {
        originCityName:originCityName,
        destinationCityName:destinationCityName,
        dateSet:dateSet
    };
}
