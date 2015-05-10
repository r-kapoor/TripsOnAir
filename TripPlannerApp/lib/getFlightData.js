/*
 * Gets the schedules of the flights
 */

require('date-utils');
var getValidDateLimits = require('../lib/UtilityFunctions/getValidDateLimits');
var getAirportCities = require('../lib/getAirportCities');
var async  = require('async');

function getFlightData(conn, rome2RioData, dateSet,budget, dates, times, ratingRatio,numPeople, callback) {
    console.log('FLIGHT times:'+times);
    var queryString = '';
    var numOfTravels = rome2RioData.length;
    var flightDateSetObjectArray=[];
    var lengthOfRoutesArray=[];
    //Duration of origin city to airport has to be added in the dateSet for that flight

    //maintain index of drive,if any, for the routes
    var indexOfDrive=[];
    var sourceAirportCodeArray = [];
    var destinationAirportCodeArray = [];
    for(var i = 0; i < numOfTravels; i++)
    {
        var allRoutes = rome2RioData[i].routes;
        //Needed by getDefaultModeOfTravel.js
        lengthOfRoutesArray[i]=allRoutes.length;
        indexOfDrive[i]=-1;
        console.log("Places:"+rome2RioData[i].places[0].name+":"+rome2RioData[i].places[1].name);
        console.log(dateSet.dateStart[i]+":"+dateSet.dateEnd[i]);
        for(var j = 0; j < allRoutes.length; j++)
        {
            console.log("Route Name:",allRoutes[j].name);
            if(allRoutes[j].name=="Drive")
            {
                indexOfDrive[i]=j;
            }
            var allSegments = allRoutes[j].segments;
            var durBeforeFlight=0;
            for(var k = 0; k < allSegments.length; k++)
            {
                //console.log("allSegments[k].vehicle:"+allSegments[k].vehicle);
                if(allSegments[k].kind != undefined && allSegments[k].kind == "flight")//A part of this route is a flight
                {
                    var dateSetAccToFlight={
                        dateStart:new Date(dateSet.dateStart[i].getTime() + durBeforeFlight*60000),
                        dateEnd:new Date(dateSet.dateEnd[i].getTime() + durBeforeFlight*60000)
                    };
                    var sourceAirportCode = allSegments[k].sCode;
                    var destinationAirportCode = allSegments[k].tCode;
                    console.log("Source Dest:"+sourceAirportCode+":"+destinationAirportCode);
                    flightDateSetObjectArray.push(getFlightDateSetObject(sourceAirportCode,destinationAirportCode,dateSetAccToFlight));
                    sourceAirportCodeArray.push(sourceAirportCode);
                    destinationAirportCodeArray.push(destinationAirportCode);
                }
                durBeforeFlight+=allSegments[k].duration;
            }
        }
    }
    if(sourceAirportCodeArray.length > 0){
        var connection=conn.conn();
        connection.connect();
        var fullQueryString = 'select OriginCityID,DestinationCityID,Operator,FlightNumber,DaysOfTravel,DepartureTime as OriginDepartureTime ,ArrivalTime as DestArrivalTime, OriginDay, DestDay,Hops,CarrierType, OriginAirportCode, OriginAirportName, DestinationAirportCode, DestinationAirportName from '
            +' (select OriginCityID,DestinationCityID,Operator,FlightNumber,DaysOfTravel,DepartureTime,ArrivalTime,OriginDay, DestDay,Hops,CarrierType, OriginAirportCode, OriginAirportName from '
            +' (select * from Flight_Schedule) c '
            +' JOIN '
            +' (select CityID,AirportCode as OriginAirportCode, AirportName as OriginAirportName from Airport_In_City where AirportCode IN ( '+connection.escape(sourceAirportCodeArray)+' )) a '
            +' ON (c.OriginCityID = a.CityID)) d '
            +' JOIN '
            +' (select CityID,AirportCode as DestinationAirportCode ,AirportName as DestinationAirportName from Airport_In_City where AirportCode IN ( '+connection.escape(destinationAirportCodeArray)+' )) b '
            +' ON (d.DestinationCityID = b.CityID);';
        console.log('QUERY for flights:'+fullQueryString);

        connection.query(fullQueryString, function(err, rows, fields) {
            var airportList = [];
            if (err)
            {
                throw err;
            }
            else{
                for (var i in rows) {
                    //console.log(rows[i]);
                }
                var countOfVehicleFlight=0;
                //Iterating the array of rome2rio objects
                for(var i = 0; i < numOfTravels; i++)
                {
                    console.log("i:"+i);
                    var allRoutes = rome2RioData[i].routes;
                    for(var j = 0; j < allRoutes.length; j++)
                    {
                        var allSegments = allRoutes[j].segments;
                        var isRecommendedRoute = 1;
                        for(var k = 0; k < allSegments.length; k++)
                        {
                            if(allSegments[k].isMajor == 1 && allSegments[k].kind != undefined && allSegments[k].kind == "flight")//A part of this route is a flight
                            {
                                var sourceAirportCode = allSegments[k].sCode;
                                var destinationAirportCode = allSegments[k].tCode;
                                var startDate=flightDateSetObjectArray[countOfVehicleFlight].dateSet.dateStart;
                                var endDate=flightDateSetObjectArray[countOfVehicleFlight].dateSet.dateEnd;
                                var startTime=startDate.toFormat("HH24")+":"+startDate.toFormat("MI")+":00";
                                var endTime=endDate.toFormat("HH24")+":"+endDate.toFormat("MI")+":00";
                                var atLeastAFlight=0;
                                var flightData=[];
                                //Iterate the flight rows from the database to check whether there are flights on the possible days:times
                                for (var t in rows) {
                                    if((sourceAirportCode==rows[t].OriginAirportCode)&&(destinationAirportCode==rows[t].DestinationAirportCode))
                                    {
                                        var daysOfTravelArray=rows[t].DaysOfTravel.split("");
                                        var OriginDepartureTime=rows[t].OriginDepartureTime;
                                        var flightDateLimits = getValidDateLimits.getValidDateLimits(startDate,endDate,startTime,endTime,daysOfTravelArray,OriginDepartureTime);
                                        if(flightDateLimits.length > 0)
                                        {
                                            atLeastAFlight=1;
                                            console.log("Flight found:"+rows[t].FlightNumber+":"+rows[t].Operator);
                                            rows[t].isRecommended=1;
                                        }
                                        else
                                        {
                                            rows[t].isRecommended=0;
                                        }
                                        rows[t].dateLimits = flightDateLimits;
                                        flightData.push(rows[t]);
                                    }
                                }
                                if(atLeastAFlight==1)
                                {
                                    allSegments[k].isRecommendedSegment=1;
                                    isRecommendedRoute = 1;

                                }
                                else
                                {
                                    allSegments[k].isRecommendedSegment=0;
                                    isRecommendedRoute = 0;
                                }
                                allSegments[k].flightData=flightData;
                                countOfVehicleFlight++;
                                for(var airportIndex in rome2RioData[i].airports) {
                                    var airport = rome2RioData[i].airports[airportIndex];
                                    if(airport.code == allSegments[k].sCode) {
                                        allSegments[k].sAirport = airport;
                                        airportList.push(airport);
                                        airport.Latitude = airport.pos.split(',')[0];
                                        airport.Longitude = airport.pos.split(',')[1];
                                    }
                                    else if(airport.code == allSegments[k].tCode) {
                                        allSegments[k].tAirport = airport;
                                        airportList.push(airport);
                                        airport.Latitude = airport.pos.split(',')[0];
                                        airport.Longitude = airport.pos.split(',')[1];
                                    }
                                }
                            }
                        }
                        if(isRecommendedRoute==1)
                        {
                            allRoutes[j].isRecommendedRouteFlight=1;
                        }
                        else
                        {
                            allRoutes[j].isRecommendedRouteFlight=0;
                        }
                    }
                }

            }

            getAirportCities.getAirportCities(conn, airportList, function onGetAirportCities(){
                callback(null, rome2RioData);
            });


        });
        connection.end();
    }
    else {
        callback(null, rome2RioData);
    }
}
module.exports.getFlightData = getFlightData;


function getFlightDateSetObject(originAirportCode,destinationAirportCode,dateSet)
{
    return {
        originAirportCode:originAirportCode,
        destinationAirportCode:destinationAirportCode,
        dateSet:dateSet
    };
}
