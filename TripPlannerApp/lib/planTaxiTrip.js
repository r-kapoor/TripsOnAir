/**
 * New node file
 */
var getDefaultModeOfTravel = require('../lib/getDefaultModeOfTravel');
var extractStationCode=require('../lib/extractStationCode');
var changeCase=require('change-case');

var getDuration = require('../lib/UtilityFunctions/getDuration');

function planTaxiTrip(conn,rome2RioData,numPeople,userBudget,dateSet,dates, times,ratingRatio,callback)
{
	getCityNameCode(conn,rome2RioData,numPeople,userBudget,dateSet,dates, times, ratingRatio, callback);
}

module.exports.planTaxiTrip=planTaxiTrip;


function getCityNameCode(conn,rome2RioData,numPeople,userBudget,dateSet,dates, times,ratingRatio, callback)
{
	var cityCode=[];
	var numOfTravels = rome2RioData.length;
	for(var i = 0; i < numOfTravels; i++)
	{
		var allRoutes = rome2RioData[i].routes;
		for(var j = 0; j < allRoutes.length; j++)
		{
			//console.log("Route Name:",allRoutes[j].name);
			var allSegments = allRoutes[j].segments;
			for(var k = 0; k < allSegments.length; k++)
			{
				if(allSegments[k].vehicle)
				{
					//console.log("allSegments[k].vehicle:"+allSegments[k].vehicle);
					if(allSegments[k].vehicle == "train")//A part of this route is a train
					{
						var sourceStation = allSegments[k].sName;
						var destinationStation = allSegments[k].tName;
						//console.log("Source Dest:"+sourceStation+":"+destinationStation);
						var sourceStationCode = extractStationCode.extractStationCode(sourceStation);
						var destinationStationCode = extractStationCode.extractStationCode(destinationStation);

						if(cityCode.indexOf(sourceStationCode)==-1)
						{
							cityCode.push(sourceStationCode);
						}
						if((cityCode.indexOf(destinationStationCode)==-1))
						{
							cityCode.push(destinationStationCode);
						}

					}
				}
			}
		}
	}

	//db Query

    if(cityCode.length > 0){
        var connection=conn.conn();
        connection.connect();
        var fullQueryString = 'SELECT a.CityName, b.StationCode FROM'
            +' (SELECT CityName, CityID from City) a'
            +' JOIN'
            +' (SELECT CityID, StationCode from RailwayStations_In_City where StationCode IN('+connection.escape(cityCode)+')) b'
            +' ON (a.CityID = b.CityID);';
        //console.log('QUERY for trains:'+fullQueryString);

        connection.query(fullQueryString, function(err, rows, fields) {
            if (err)
            {
                throw err;
            }
            else{
                for (var i in rows) {
                    console.log(rows[i].CityName+","+rows[i].StationCode);
                }
                getTaxiRoute(conn,rome2RioData,numPeople,userBudget,dateSet,dates, times, ratingRatio, rows, callback);
            }
        });
        connection.end();
    }
    else{
        //No train in data. No need for this query
        getTaxiRoute(conn,rome2RioData,numPeople,userBudget,dateSet,dates, times, ratingRatio, null, callback);
    }
}
function getTaxiRoute(conn,rome2RioData,numPeople,userBudget,dateSet,dates, times, ratingRatio, rows, callback)
{
	var carRouteDetailsArray = [];
	var doneRoutesArray =[];
	var numOfTravels = rome2RioData.length;
	for(var i = 0; i < numOfTravels; i++)
	{
		var allRoutes = rome2RioData[i].routes;
		//Needed by getDefaultModeOfTravel.js
		//lengthOfSegmentsArray[i]=allRoutes.length;
//			console.log("PLaces:"+rome2RioData[i].places[0].name+":"+rome2RioData[i].places[1].name);
	//	console.log(dateSet.dateStart[i]+":"+dateSet.dateEnd[i]);
		for(var j = 0; j < allRoutes.length; j++)
		{
			//console.log("Route Name:",allRoutes[j].name);
			var allSegments = allRoutes[j].segments;
			//console.log("segmentLength:"+allSegments);
			for(var k = 0; k < allSegments.length; k++)
			{
				console.log("j,k:"+j+","+k);
				if((allSegments[k].distance <= 800)&&(allSegments[k].isMajor==1))//A part of this route is a car
				{
					var source = null,destination = null;
					if(allSegments[k].vehicle == "train")
					{
						//dbquery
						var sourceStationCode = extractStationCode.extractStationCode(allSegments[k].sName);
						var destinationStationCode = extractStationCode.extractStationCode(allSegments[k].tName);

						for(var p=0;p<rows.length;p++)
						{
							if(rows[p].StationCode==sourceStationCode)
							{
								source=changeCase.titleCase(rows[p].CityName);
							}
							if(rows[p].StationCode==destinationStationCode)
							{
								destination=changeCase.titleCase(rows[p].CityName);
							}
						}
					}
					else if(allSegments[k].kind == "flight")
					{
						var sCode = allSegments[k].sCode;
						var tCode = allSegments[k].tCode;
                        source = allSegments[k].sAirport.name;
                        destination = allSegments[k].tAirport.name;
					}
					else
					{
						source = allSegments[k].sName;
						destination = allSegments[k].tName;

						if(source=="Ooty S S")
						{
							source="Ooty";
						}
						if(destination=="Ooty S S")
						{
							destination="Ooty";
						}
					}
                    if(source == null || destination == null){
                        //The source and destination could not be ascertained. Leaving this segment.
                        continue;
                    }
					var carRouteDetails=
						{
							indexOfLeg:i,
							routeAndSegments:[{
								route:j,
								segment:k
							}],
							startPlace:rome2RioData[i].places[0].name,
							endPlace:rome2RioData[i].places[1].name,
							source:source,
							destination:destination,
							duration:allSegments[k].duration,
							distance:allSegments[k].distance,
							path:allSegments[k].path,
                            oldKind:allSegments[k].kind
						};
                    if(allSegments[k].kind!=undefined && allSegments[k].kind=="car")
                    {
                        carRouteDetails.ddpDetailsUpdated =1;
                    }
                    else
                    {
                        carRouteDetails.ddpDetailsUpdated =0;
                    }
					console.log("The next route coming is :"+carRouteDetails.source+","+carRouteDetails.destination);
					var routeHasBeenAdded = 0;
					var routeAlreadyAdded = 0;
					for(var a=0; a < doneRoutesArray.length; a++)
					{
						if(doneRoutesArray[a].source == carRouteDetails.source && doneRoutesArray[a].destination == carRouteDetails.destination)
						{
							routeAlreadyAdded = 1;
							for(var p = 0; p < carRouteDetailsArray.length; p++)
							{
								for(var q = 0; q < carRouteDetailsArray[p].length; q++)
								{
									if(carRouteDetailsArray[p][q].source == carRouteDetails.source && carRouteDetailsArray[p][q].destination == carRouteDetails.destination)
									{
										carRouteDetailsArray[p][q].routeAndSegments.push({
											route:j,
											segment:k
										});
										if(allSegments[k].kind!=undefined &&allSegments[k].kind == "car")
										{
											carRouteDetailsArray[p][q].duration = carRouteDetails.duration;
											carRouteDetailsArray[p][q].distance = carRouteDetails.distance;
											carRouteDetailsArray[p][q].path = carRouteDetails.path;
                                            carRouteDetailsArray[p][q].ddpDetailsUpdated=1;
										}
									}
								}
							}
							break;
						}
					}
					if(routeAlreadyAdded == 0)
					{
						doneRoutesArray.push(carRouteDetails);
						var alreadyCopiedRoutes = [];
						outer:for(var y =0;y<carRouteDetailsArray.length;y++)
						{
							for(var u=0;u<carRouteDetailsArray[y].length;u++)
							{
								//console.log("carRouteDetailsArray["+y+"]["+u+"].source:"+carRouteDetailsArray[y][u].source);
								//console.log("carRouteDetailsArray["+y+"]["+u+"].destination:"+carRouteDetailsArray[y][u].destination);

								if((carRouteDetails.source==carRouteDetailsArray[y][u].source)&&(carRouteDetails.destination==carRouteDetailsArray[y][u].destination))
								{
                                    //The current source and destination for the taxi have already been added
                                    if(carRouteDetails.indexOfLeg == carRouteDetailsArray[y][u].indexOfLeg){
                                        //It has been added for the same leg
                                        routeHasBeenAdded = 1;
                                        break outer;
                                    }
                                    //Continue to attempt to add the route to the carRouteDetailsArray
								}
								if((carRouteDetails.source==carRouteDetailsArray[y][u].destination))
								{
									//The source of the new route is continuous to an existing route
									if(carRouteDetailsArray[y][u+1])
									{
										if(carRouteDetailsArray[y][u+1].destination != carRouteDetails.destination)
										{
											if((carRouteDetails.indexOfLeg==carRouteDetailsArray[y][u].indexOfLeg)||(carRouteDetails.indexOfLeg-1==carRouteDetailsArray[y][u].indexOfLeg&&carRouteDetails.source==carRouteDetailsArray[y][u].endPlace))
											{
												//The current route is continuing to another destination
												//Thus the current trip has to be copied to a new index and the current route to be added to it
												var hasAlreadyBeenCopied = 0;
												outerSame:for(var q = 0; q < alreadyCopiedRoutes.length ; q++)
												{
													//console.log('Iterates the alreadyCopiedRoutes');
													if(alreadyCopiedRoutes[q].length == u+1)
													{
														//console.log('The length is the same');
														var isSame = 1;
														for(var r =0; r < alreadyCopiedRoutes[q].length; r++)
														{
															if(!(alreadyCopiedRoutes[q][r].source == carRouteDetailsArray[y][r].source && alreadyCopiedRoutes[q][r].destination == carRouteDetailsArray[y][r].destination))
															{
																isSame = 0;
																break;
															}
														}
														if(isSame == 1)
														{
                                                            routeHasBeenAdded = 1;
															hasAlreadyBeenCopied = 1;
															break outerSame;
														}
													}
												}
												if(hasAlreadyBeenCopied == 0)
												{
													console.log("copied route:"+carRouteDetails.source+","+carRouteDetails.destination);
													carRouteDetailsArray[carRouteDetailsArray.length]  = carRouteDetailsArray[y].slice(0,u+1);
													alreadyCopiedRoutes[alreadyCopiedRoutes.length] = carRouteDetailsArray[y].slice(0,u+1);
													carRouteDetailsArray[carRouteDetailsArray.length-1].push(carRouteDetails);
                                                    routeHasBeenAdded = 1;
												}
												break;
											}
										}
										else
										{
                                            //The destination is also the same
                                            routeHasBeenAdded = 1;
											break outer;
										}
									}
									else
									{
										if((carRouteDetails.indexOfLeg==carRouteDetailsArray[y][u].indexOfLeg)||(carRouteDetails.indexOfLeg-1==carRouteDetailsArray[y][u].indexOfLeg&&carRouteDetails.source==carRouteDetailsArray[y][u].endPlace))
										{	//The current route can be continued
											console.log("added route:"+carRouteDetails.source+","+carRouteDetails.destination);
											carRouteDetailsArray[y][u+1] = carRouteDetails;
                                            routeHasBeenAdded = 1;
											continue outer;
										}
									}
								}
							}
						}
						if(routeHasBeenAdded == 0)
						{
							//No match for the route was found and this route could not be appended to any other route
							console.log("Put new route:"+carRouteDetails.source+","+carRouteDetails.destination);
							carRouteDetailsArray[carRouteDetailsArray.length] = [carRouteDetails];
						}
					}
				}
			}
		}
	}
	var preferenceOfTaxi = [];
	var distanceSumArray = [];
    var carLegDetails = [];

    //Iterating through the selected routes to find what all segments from which routes and legs have been covered
    for(var carRouteArrayIndex = 0; carRouteArrayIndex < carRouteDetailsArray.length; carRouteArrayIndex++){
        var coveredLegRouteSegments = [];
        for(var carRouteIndex = 0; carRouteIndex < carRouteDetailsArray[carRouteArrayIndex].length; carRouteIndex++){
            var carRouteDetails = carRouteDetailsArray[carRouteArrayIndex][carRouteIndex];
            if(coveredLegRouteSegments[carRouteDetails.indexOfLeg] == undefined){
                coveredLegRouteSegments[carRouteDetails.indexOfLeg] = [];
            }
            for(var routeAndSegmentIndex = 0; routeAndSegmentIndex < carRouteDetails.routeAndSegments.length; routeAndSegmentIndex++){
                var routeAndSegment = carRouteDetails.routeAndSegments[routeAndSegmentIndex];
                if(coveredLegRouteSegments[carRouteDetails.indexOfLeg][routeAndSegment.route] == undefined){
                    coveredLegRouteSegments[carRouteDetails.indexOfLeg][routeAndSegment.route] = [];
                }
                coveredLegRouteSegments[carRouteDetails.indexOfLeg][routeAndSegment.route][routeAndSegment.segment] = true;
            }
        }

        for(var legI = 0; legI < coveredLegRouteSegments.length; legI++){
            if(coveredLegRouteSegments[legI] != undefined){
                for(var routeI = 0; routeI < coveredLegRouteSegments[legI].length; routeI++){
                    if(coveredLegRouteSegments[legI][routeI] != undefined){
                        for(var segmentI = 0; segmentI < coveredLegRouteSegments[legI][routeI].length; segmentI++){
                            console.log(legI + "," + routeI + "," + segmentI + "=" + coveredLegRouteSegments[legI][routeI][segmentI]);
                        }
                    }
                }
            }
        }

        //Checking if route is valid
        var routeValid = true;
        outer:
        for(var legIndex = 0; legIndex < rome2RioData.length; legIndex++){
            if(coveredLegRouteSegments[legIndex] != undefined){
                //The car route contains segments of this leg
                for(var routeIndex = 0; routeIndex < rome2RioData[legIndex].routes.length; routeIndex++) {
                    if (coveredLegRouteSegments[legIndex][routeIndex] != undefined) {
                        //The car route contains segments of this route
                        for (var segmentIndex = 0; segmentIndex < rome2RioData[legIndex].routes[routeIndex].segments.length; segmentIndex++) {
                            var segment = rome2RioData[legIndex].routes[routeIndex].segments[segmentIndex];
                            //Now each of these segments if major and not recommended should be there in cab route
                            if(segment.isMajor == 1){
                                //Is a major segment
                                if(segment.isRecommendedSegment == undefined || segment.isRecommendedSegment == 0){
                                    //Not recommended segment
                                    if(coveredLegRouteSegments[legIndex][routeIndex][segmentIndex] == undefined){
                                        //It is not there in cab route
                                        //This is not a valid route. Removing route.
                                        routeValid = false;
                                        break outer;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                //The car route does not contain segments of this leg
                //Need to check whether there is atleast one route of this leg which is recommended
                var hasAtLeastOneRecommendedRoute = false;
                for(routeIndex = 0; routeIndex < rome2RioData[legIndex].routes.length; routeIndex++) {
                    if(rome2RioData[legIndex].routes[routeIndex].isRecommended == 1){
                        hasAtLeastOneRecommendedRoute = true;
                    }
                }
                if(!hasAtLeastOneRecommendedRoute){
                    routeValid = false;
                    break;
                }
            }
        }
        if(!routeValid){
            console.log('Removing route:'+carRouteArrayIndex);
            carRouteDetailsArray.splice(carRouteArrayIndex,1);
            carRouteArrayIndex--;
        }
    }

    if(carRouteDetailsArray.length == 0){
        console.log('No valid routes found');
        getDefaultModeOfTravel.getDefaultModeOfTravel(null,dateSet,userBudget,dates, times, ratingRatio,null,-1,numPeople,callback);
    }
    else {
        for(var i=0; i < carRouteDetailsArray.length; i++)
        {
            preferenceOfTaxi[i] = 0;
            carLegDetails[i] = [];
            var distanceSum = 0;
            console.log('---------------------------Route:'+i);
            for(var j = 0; j < carRouteDetailsArray[i].length; j++)
            {
                distanceSum += carRouteDetailsArray[i][j].distance;
                if(j==0)
                {
                    var sourceOfTaxi = carRouteDetailsArray[i][j].source;
                    if(carRouteDetailsArray[i][j].source == carRouteDetailsArray[i][j].startPlace)
                    {
                        console.log('The taxi start from the previous place. Should be preferred');
                        preferenceOfTaxi[i] += 5;
                    }
                }
                else if(sourceOfTaxi == carRouteDetailsArray[i][j].destination)
                {
                    console.log('The source of taxi is visited again!!');
                    if(j==carRouteDetailsArray[i].length - 1)
                    {
                        console.log('This is also the destination of the taxi. Should be the preferred taxi');
                        preferenceOfTaxi[i] += 10;
                    }
                }
                if(j==carRouteDetailsArray[i].length - 1)
                {
                    if(carRouteDetailsArray[i][j].destination == carRouteDetailsArray[i][j].endPlace)
                    {
                        console.log('The taxi takes to the next place. Should be preferred');
                        preferenceOfTaxi[i] += 5;
                    }
                }
                console.log('SOURCE:'+carRouteDetailsArray[i][j].source);
                console.log('DESTINATION:'+carRouteDetailsArray[i][j].destination);
                console.log('indexOfLeg:'+carRouteDetailsArray[i][j].indexOfLeg);
                console.log('startPlace:'+carRouteDetailsArray[i][j].startPlace);
                console.log('endPlace:'+carRouteDetailsArray[i][j].endPlace);
                console.log('duration:'+carRouteDetailsArray[i][j].duration);
                console.log('distance:'+carRouteDetailsArray[i][j].distance);
                if(j==0){
                    carLegDetails[i].push(carRouteDetailsArray[i][j].source);
                }
                carLegDetails[i].push(carRouteDetailsArray[i][j].destination);
            }
            console.log('Total Distance:'+distanceSum);
            distanceSumArray[i]= distanceSum;
        }
        var maxPreference = 0;
        var minDistanceSum = -1;
        var preferredTaxi = 0;
        for(var i = 0; i< carRouteDetailsArray.length; i++)
        {
            console.log("i:"+i);
            console.log('preferredTaxi:'+preferredTaxi);
            console.log('preferenceOfTaxi:'+preferenceOfTaxi[i]);
            console.log('distanceSum:'+distanceSumArray[i]);
            console.log('maxPreference:'+maxPreference);
            console.log('preferenceOfTaxi['+i+']:'+preferenceOfTaxi[i]);
            if(maxPreference < preferenceOfTaxi[i])
            {
                console.log('Enters');
                maxPreference = preferenceOfTaxi[i];
                minDistanceSum = distanceSumArray[i];
                preferredTaxi = i;
            }
            else if(maxPreference == preferenceOfTaxi[i])
            {
                if(minDistanceSum == -1 || minDistanceSum > distanceSumArray[i])
                {
                    minDistanceSum = distanceSumArray[i];
                    preferredTaxi = i;
                }
            }
        }
        console.log('#################And the winner is:'+preferredTaxi);

        rome2RioData = taxiModifiedRome2RioData(rome2RioData,carRouteDetailsArray[preferredTaxi], carLegDetails[preferredTaxi]);
        var lengthOfRoutesArray = [];
        var duration = getDuration.getDuration(dates, times);
        var durationInDays = duration/(24*60);
        var countOfCabTrips = 0;
        for(var i = 0; i < rome2RioData.length; i++)
        {
            console.log('rome2RioData['+i+']:'+JSON.stringify(rome2RioData[i]));
            lengthOfRoutesArray[i] = rome2RioData[i].routes.length;
            if(rome2RioData[i].hasCab && rome2RioData[i].hasCab == 1)
            {
                countOfCabTrips ++;

            }
        }
        console.log('lengthOfRoutesArray:'+lengthOfRoutesArray);
        var numberOfDaysInCab = durationInDays*countOfCabTrips/rome2RioData.length;
        var distanceInCab = distanceSumArray[preferredTaxi];

        rome2RioData = insertCabBudget(rome2RioData, numberOfDaysInCab, distanceInCab,carRouteDetailsArray[preferredTaxi].length, numPeople);

        var indexOfDrive = Array.apply(null, new Array(rome2RioData.length)).map(Number.prototype.valueOf, -1);

        getDefaultModeOfTravel.getDefaultModeOfTravel(rome2RioData,dateSet,userBudget,dates, times, ratingRatio,lengthOfRoutesArray,indexOfDrive,numPeople,callback);
    }

    /*var fs = require('fs');
	fs.writeFile("aftertaxi.txt",JSON.stringify(rome2RioData), function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	});*/
}

function insertCabBudget(rome2RioData, numberOfDaysInCab, distanceInCab,countOfCabSegments, numPeople)
{
	//Fare Rules
	var perDayNumberOfKilometers = 250;
	//Assuming fare to be Rs 9 per km
	var farePerKm=9;
	if(numPeople == 2)
	{
		farePerKm=4.5;
	}
	else
	{
		farePerKm=3;
	}


	var totalKilometers = perDayNumberOfKilometers * numberOfDaysInCab;
	var distance = Math.max(totalKilometers, distanceInCab);
	var budgetPerTaxiTrip=parseInt((farePerKm*distance)/countOfCabSegments);

	for(var i=0;i<rome2RioData.length;i++)
	{
		var allRoutes = rome2RioData[i].routes;
		for(var j = 0; j < allRoutes.length; j++)
		{
			var totalPrice = 0;
			var allSegments = allRoutes[j].segments;
			for(var k = 0; k < allSegments.length; k++)
			{
				if(allSegments[k].subkind=="cab")
				{
					var indicativePrice = {
						price : budgetPerTaxiTrip,
						currency : "INR"
					}
					allSegments[k].indicativePrice = indicativePrice;
					totalPrice += indicativePrice.price;
				}
				else
				{
					totalPrice += allSegments[k].indicativePrice.price;
				}
			}
			allRoutes[j].indicativePrice.price = totalPrice;
		}
	}
	return rome2RioData;
}

function taxiModifiedRome2RioData(rome2RioData,carRouteDetails, carLegDetails)
{
	var numOfTravels = rome2RioData.length;
    var gotFirstCabSegment = false;
	for(var i = 0; i < numOfTravels; i++)
	{
		var allRoutes = rome2RioData[i].routes;
		for(var j = 0; j < allRoutes.length; j++)
		{
			allRoutes[j].isRecommendedRoute = 1;
            var lastSegmentWasCab = false;
            var lastCabSegment= null;
			var allSegments = allRoutes[j].segments;
			for(var k = 0; k < allSegments.length; k++)
			{
                if(allSegments[k].isMajor==1){
                    var isCabSegment = false;

                    for(var l = 0; l < carRouteDetails.length; l++)
                    {
                        if(carRouteDetails[l].indexOfLeg == i)
                        {
                            rome2RioData[i].hasCab = 1;
                            for(var m = 0; m < carRouteDetails[l].routeAndSegments.length; m++)
                            {
                                if(carRouteDetails[l].routeAndSegments[m].route == j && carRouteDetails[l].routeAndSegments[m].segment == k)
                                {
                                    if(carRouteDetails[l].ddpDetailsUpdated==0)
                                    {
                                        var speed=40;//km per hour
                                        if(carRouteDetails[l].oldKind=="flight")
                                        {
                                            speed= 25;
                                        }
                                        else if(carRouteDetails[l].oldKind=="train")
                                        {
                                            speed=35;
                                        }
                                        carRouteDetails[l].duration = (carRouteDetails[l].distance/speed)*60;//in minutes
                                    }
                                    if(lastSegmentWasCab){
                                        //Need to combine this segment with previous one
                                        lastCabSegment.distance += carRouteDetails[l].distance;
                                        lastCabSegment.duration += carRouteDetails[l].duration;
                                        lastCabSegment.tName = carRouteDetails[l].destination;
                                        lastCabSegment.tPos = rome2RioData[i].routes[j].segments[k].tPos;
                                        //lastCabSegment.path += carRouteDetails[l].path;
                                        rome2RioData[i].routes[j].segments.splice(k,1);
                                        k--;
                                    }
                                    else {
                                        var cabSegment = {
                                            kind:"car",
                                            subkind:"cab",
                                            isMajor:1,
                                            distance:carRouteDetails[l].distance,
                                            duration:carRouteDetails[l].duration,
                                            sName:carRouteDetails[l].source,
                                            tName:carRouteDetails[l].destination,
                                            sPos:rome2RioData[i].routes[j].segments[k].sPos,
                                            tPos:rome2RioData[i].routes[j].segments[k].tPos,
                                            path:carRouteDetails[l].path
                                        };
                                        if(!gotFirstCabSegment){
                                            cabSegment.carLegDetails = carLegDetails;
                                            gotFirstCabSegment = true;
                                        }
                                        //Replacing the other segment with taxi segment
                                        rome2RioData[i].routes[j].segments.splice(k,1,cabSegment);
                                    }
                                    isCabSegment = true;
                                    lastCabSegment = cabSegment;
                                }
                            }
                        }
                    }
                    lastSegmentWasCab = isCabSegment;
                }
			}
		}
	}

	for(var i = 0; i < numOfTravels; i++)
	{
		if(rome2RioData[i].hasCab && rome2RioData[i].hasCab == 1)
		{
			var allRoutes = rome2RioData[i].routes;
			var isCabInRoute;
			for(var j=0;j<allRoutes.length;j++)
			{
				isCabInRoute=0;
				var allSegments=allRoutes[j].segments;
				for(var k=0;k<allSegments.length;k++)
				{
					if(allSegments[k].subkind=="cab")
					{
						isCabInRoute=1;
					}
				}
				if(isCabInRoute==0)
				{
					//delete the array
					rome2RioData[i].routes.splice(j,1);
					j--;
				}
			}
		}
	}

	//Removing duplicate routes,if any

	for(var i=0;i<numOfTravels;i++)
	{
		if(rome2RioData[i].hasCab && rome2RioData[i].hasCab == 1)
		{
			var allRoutes = rome2RioData[i].routes;
			for(var j=0;j<allRoutes.length;j++)
			{
				for(var k=j+1;k<allRoutes.length;k++)
				{
					if(isDuplicateCab(allRoutes[j],allRoutes[k]))
					{
						//removing kth route
						rome2RioData[i].routes.splice(k,1);
						k--;
					}
				}
			}
		}
	}
	return rome2RioData;
}

function isDuplicateCab(route1,route2)
{
	var length1=route1.segments.length;
	var length2=route2.segments.length;
	if((length1==1)&&(length2==1))
	{
		//Since cab will be present in these routes.Hence both will be same
		return true;
	}

	var i=0,j=0;
	console.log("route1.segments:"+route1.segments);

	while((i<length1)&&(j<length2))
	{
		console.log("1i:"+i+":route1.segments:"+JSON.stringify(route1.segments[i]));
		while(i < length1 && route1.segments[i].isMajor==0)
		{
			console.log("2i:"+i+":route1.segments:"+JSON.stringify(route1.segments[i]));
			i++;
		}
		while(j < length2 && route2.segments[j].isMajor==0)
		{
			j++;
		}
		if(i==length1 && j==length2) {
			return true;
		}
		if(i==length1 || j==length2) {
			return false;
		}
		if(isIdenticalSegment(route1.segments[i], route2.segments[j]))
		{
			i++;
			j++;
		}
		else
		{
			return false;
		}
	}
	return true;
}
function isIdenticalSegment(segment1, segment2)
{
	if(segment1.kind == segment2.kind && segment1.sCode == segment2.sCode && segment1.tCode == segment2.tCode)
	{
		return true;
	}
	return false;
}


