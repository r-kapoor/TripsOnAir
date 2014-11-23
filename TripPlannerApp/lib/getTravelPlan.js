/**
 * New node file
 */
require('date-utils');
var calculateBudgetOfTrip=require('../lib/calculateBudgetOfTrip');
function getTravelPlan(rome2RioData,dateSet,dates,times,ratingRatio,totalDurationOfTrip,numPeople,callback)
{
	var travelDuration=0;var cityTourDuration=[];
	for(var i=0;i<rome2RioData.length;i++)
	{
		var allRoutes=rome2RioData[i].routes;
		for(var j=0;j<allRoutes.length;j++)
		{	
			if(allRoutes[j].isDefault==1)
			{
				travelDuration+=allRoutes[j].duration;
			}	
		}
	}

	
	//console.log("totalDurationOfTrip:"+totalDurationOfTrip+":"+"travelDuration"+travelDuration);
	
	for(var k=0;k<ratingRatio.length;k++)
	{
		//console.log("RatingRatio:"+ratingRatio[k]);
		cityTourDuration.push((parseFloat(ratingRatio[k])*parseFloat(totalDurationOfTrip-travelDuration)));
	}
	//console.log("citytoue:"+cityTourDuration);
	
	//Planing the whole travel
	
	//ideal StartTime for trip
	var idealStartTime;
	var idealStartMorningTimeHours=6;
	var idealStartEveningTimeHours=18;
	
	if(times[0]=="Morning")
	{	
		idealStartTime=new Date(dates[0].getTime()+idealStartTimeHours*60000*60);	
	}
	else
	{
		idealStartTime=new Date(dates[0].getTime()+idealStartEveningTimeHours*60000*60);
	}
	
	console.log("Trip Starts AT:"+idealStartTime);
	
	for(var i=0;i<rome2RioData.length;i++)
	{
		var allRoutes=rome2RioData[i].routes;
		for(var j=0;j<allRoutes.length;j++)
		{	
			if(allRoutes[j].isDefault==1)
			{
				//console.log("isDefault for route"+j);
				var allSegments=allRoutes[j].segments;
				var isMajorCounter=0;
				for(var k=0;k<allSegments.length;k++)
				{
					//console.log("Segment No:"+k);
					//console.log("isMajor"+allSegments[k].isMajor);
					//console.log("Kind:"+allSegments[k].kind);
					if(allSegments[k].isMajor==0)
					{
						//adding endTime in rome2Rio data
						allSegments[k].startTime=new Date(idealStartTime.getTime());
						console.log("Before Taking Minor Travel:"+idealStartTime);
						idealStartTime.addMinutes(allSegments[k].duration);
						//adding endTime in rome2Rio data
						allSegments[k].endTime=new Date(idealStartTime.getTime());
						console.log("After Taking Minor Travel:"+idealStartTime);
					}	
					if(allSegments[k].isMajor==1)
					{
						isMajorCounter++;
						if((allSegments[k].kind)&&(allSegments[k].kind=="train"))
						{
							//console.log("Kind is train");
							var trainData=allSegments[k].trainData;
							var minTrainTimeDifference=-1;
							var minTrain;
							var minTrainDateOfTravel;
							var minTrainIndex;
							var currentStartDate;
							for(var l=0;l<trainData.length;l++)
							{
								if(trainData[l].isRecommendedTrain==1)
								{
									/*for(var m=0;m<dateSet.length;m++)
									{
										dateSet.dateStart
										dateSet.dateEnd
										
									}*/
									if(isMajorCounter==1)
									{	
										currentStartDate=new Date(dateSet.dateStart[i].getTime());
									}
									else
									{
										currentStartDate=new Date(idealStartTime.getTime());
									}
									var minDateSetTrainTimeDifference=-1;
									var minTrainTime;
									while(currentStartDate.isBefore(dateSet.dateEnd[i]))
									{
										if(runsOnSameDay(currentStartDate,trainData[l].DaysOfTravel))
										{
											if(currentStartDate.equals(dateSet.dateStart[i]))
											{
												if((currentStartDate.getHours()+":"+currentStartDate.getMinutes())<trainData[l].OriginDepartureTime)
												{
													var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
													if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
													{
														minTrainTime = currentTrainTime;
														minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));														
													}
												}
											}
											else if(currentStartDate.equals(dateSet.dateEnd[i]))
											{
												//This is the end date
												if((currentStartDate.getHours()+":"+currentStartDate.getMinutes())>trainData[l].OriginDepartureTime)
												{
													var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
													if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
													{
														minTrainTime = currentTrainTime;
														minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));														
													}
												}
											}
											else
											{
												var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
												if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
												{
													minTrainTime = currentTrainTime;
													minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));														
												}
											}
										}
										currentStartDate.addDays(1);
									}
									//We have got the iteration of the train which is nearest to the ideal time
									//Finding the minimum of all trains
									if(minTrainTimeDifference == -1 || minTrainTimeDifference > minDateSetTrainTimeDifference)
									{
										minTrainTimeDifference = minDateSetTrainTimeDifference;
										minTrain = trainData[l];
										minTrainDateOfTravel = minTrainTime;
										minTrainIndex = l;
									}
									//idealStartTime.getMinutesBetween(date);
								}
												
							}
							
							//Now we have got the train which needs to be taken for travel along with the date and time of it
							//Setting it in the rome2Rio data
							allSegments[k].trainData[minTrainIndex].isFinal = 1;
							allSegments[k].trainData[minTrainIndex].date = minTrainDateOfTravel;
							console.log("Takes Train:\n%j",allSegments[k].trainData[minTrainIndex]);
							if(isMajorCounter==1)
							{
								idealStartTime=new Date(minTrainDateOfTravel.getTime());
							}
							console.log("At time:"+idealStartTime);
							//adding idealStartTime in rome2Rio data
							allSegments[k].startTime=new Date(idealStartTime.getTime());
							
							
							idealStartTime.addDays(allSegments[k].trainData[minTrainIndex].DestDay-allSegments[k].trainData[minTrainIndex].OriginDay);
							idealStartTime.clearTime();
							idealStartTime.addHours(allSegments[k].trainData[minTrainIndex].DestArrivalTime.split(":")[0]);
							idealStartTime.addMinutes(allSegments[k].trainData[minTrainIndex].DestArrivalTime.split(":")[1]);
							
							//adding endTime in rome2Rio data
							allSegments[k].endTime=new Date(idealStartTime.getTime());
							
							console.log("idealStartTime after taking train before buffer:"+idealStartTime);
							//Adding buffer Time
							idealStartTime.addHours(2);
							console.log("idealStartTime after taking train after buffer:"+idealStartTime);
						}					

						//if flight
						else if((allSegments[k].kind)&&(allSegments[k].kind=="flight"))
						{

							//adding idealStartTime in rome2Rio data
							allSegments[k].startTime=new Date(idealStartTime.getTime());
							console.log("Takes Flight at Time:"+idealStartTime);
							idealStartTime.addMinutes(allSegments[k].duration);
							console.log("Reaches at Time:"+idealStartTime);
							//adding endTime in rome2Rio data
							allSegments[k].endTime=new Date(idealStartTime.getTime());
							//Adding buffer Time
							idealStartTime.addHours(2);
							//TODO:getFlightSchedule and apply logic accordingly
						}
						
						//if bus
						else if((allSegments[k].kind)&&(allSegments[k].kind=="bus"))
						{

							//adding idealStartTime in rome2Rio data
							allSegments[k].startTime=new Date(idealStartTime.getTime());
							console.log("Takes Bus at Time:"+idealStartTime);
							idealStartTime.addMinutes(allSegments[k].duration);
							console.log("Reaches at Time:"+idealStartTime);
							//adding endTime in rome2Rio data
							allSegments[k].endTime=new Date(idealStartTime.getTime());
							//Adding buffer Time
							idealStartTime.addHours(2);
							//TODO:getBusSchedule and apply logic accordingly
						}
						
						//if taxi
						else if((allSegments[k].subkind)&&(allSegments[k].subkind=="taxi"))
						{
							if(idealStartTime.getHours()>=21||idealStartTime.getHours()<4)
							{
								if(idealStartTime.getHours()>=21)
								{
									idealStartTime.addDay(1);
								}
								idealStartTime.clearTime();
								idealStartTime.addHours(5);								
							}

							//adding idealStartTime in rome2Rio data
							allSegments[k].startTime=new Date(idealStartTime.getTime());
							console.log("Takes Taxi at Time:"+idealStartTime);
							idealStartTime.addMinutes(allSegments[k].duration);
							//adding endTime in rome2Rio data
							allSegments[k].endTime=new Date(idealStartTime.getTime());
							console.log("Reaches at Time:"+idealStartTime);
							//Adding buffer Time
							idealStartTime.addHours(2);
						}
						
						else if((allSegments[k].subkind)&&(allSegments[k].subkind=="cab"))
						{
							if(idealStartTime.getHours()>=21||idealStartTime.getHours()<4)
							{
								if(idealStartTime.getHours()>=21)
								{
									idealStartTime.addDays(1);
								}
								idealStartTime.clearTime();
								idealStartTime.addHours(5);								
							}

							//adding idealStartTime in rome2Rio data
							allSegments[k].startTime=new Date(idealStartTime.getTime());
							console.log("Takes Cab at Time:"+idealStartTime);
							idealStartTime.addMinutes(allSegments[k].duration);
							//adding endTime in rome2Rio data
							allSegments[k].endTime=new Date(idealStartTime.getTime());
							console.log("Reaches at Time:"+idealStartTime);
							//Adding buffer Time
							idealStartTime.addHours(2);
						}
						else
						{
							//console.log("Other is:%j",allSegments[k]);

							//adding idealStartTime in rome2Rio data
							allSegments[k].startTime=new Date(idealStartTime.getTime());
							console.log("Takes Other at Time:"+idealStartTime);
							idealStartTime.addMinutes(allSegments[k].duration);
							//adding endTime in rome2Rio data
							allSegments[k].endTime=new Date(idealStartTime.getTime());
							console.log("Reaches at Time:"+idealStartTime);
						}	
						
					}
					
				}
				
			}
		}
		if(i!=(rome2RioData.length-1))
		{	
			//Adding tourTime for each city according cityRatings
			console.log("cityTourDuration"+cityTourDuration[i]);
			console.log("duration parsed:"+parseInt(cityTourDuration[i]));
			idealStartTime.addMinutes(parseInt(cityTourDuration[i]));
			console.log("Leaving from city:"+idealStartTime);
		}
	}	
	
	calculateBudgetOfTrip.calculateBudgetOfTrip(rome2RioData,numPeople,callback);
}


module.exports.getTravelPlan=getTravelPlan;


function runsOnSameDay(currentDate,TrainDaysOfTravel)
{
	if(TrainDaysOfTravel=="0")
	{
		return true;
	}
	var TrainDaysOfTravelArray=TrainDaysOfTravel.split("");
	
	if(TrainDaysOfTravelArray.indexOf(currentDate.getDay()+1)!=-1)
	{
		return true;
	}
	return false;
}
