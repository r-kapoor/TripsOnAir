/**
 * New node file
 */

require('date-utils');
function getTravelPlan(rome2RioData,dateSet,dates,times,ratingRatio,totalDurationOfTrip,callbackDefaultMode)
{
	var travelDuration=0;var cityTourDuration=[];
	for(vari=0;i<rome2RioData.length;i++)
	{
		var allRoutes=rome2RioData[i].routes;
		for(var j=0;j<allRoutes.length;j++)
		{	
			if(allRoutes[j].isDefault==1)
			{
				travelDuration+=parseInt(allRoutes[j].duration);
			}	
		}
	}

	for(var k=0;k<ratingRatio.length;k++)
	{
		cityTourDuration.push(ratingRatio[k]*(totalDurationOfTrip-travelDuration));
	}
	
	//Planing the whole travel
	
	//ideal StartTime for trip
	var idealStartTime;
	var idealStartMorningTimeHours=6;
	var idealStartEveningTimeHours=18;
	
	if(times[0]=="Morning")
	{	
		idealStartTime=new Date(dates[0].getTime()+idealStartTimeHours*60000);	
	}
	else
	{
		idealStartTime=new Date(dates[0].getTime()+idealStartEveningTimeHours*60000);
	}
	
	for(var i=0;i<rome2RioData.length;i++)
	{
		var allRoutes=rome2RioData[i].routes;
		for(var j=0;j<allRoutes.length;j++)
		{	
			if(allRoutes[j].isDefault==1)
			{
				var allSegments=allRoutes[j].segments;
				for(var k=0;k<allSegments.length;k++)
				{
					if(allSegments[k].isMajor==0)
					{
						idealStartTime.addMinutes(allSegments[k].duration);
					}	
					if(allSegments[k].isMajor==1)
					{
						if((allSegments[k].kind)&&(allSegments[k].kind=="train"))
						{
							var trainDat=allSegments[k].trainData;
							var minTrainTimeDifference=-1;
							var minTrain;
							var minTrainDateOfTravel;
							var minTrainIndex;
							for(var l=0;l<trainData.length;l++)
							{
								if(trainData[l].isRecommendedTrain==1)
								{
									/*for(var m=0;m<dateSet.length;m++)
									{
										dateSet.dateStart
										dateSet.dateEnd
										
									}*/
									var currrenStartDate=new Date(dateSet.dateStart[i].getTime());
									var minDateSetTrainTimeDifference=-1;
									var minTrainTime;
									while(currenStartDate.isBefore(dateSet.dateEnd[i]))
									{
										if(runsOnSameDay(currentDate,trainData[l].DaysOfTravel))
										{
											if(currenStartDate.equals(dateSet.dateStart[i]))
											{
												if((currentStartDate.getHours()+":"+currentStartDate.getMinutes())<trainData[l].OriginDepartureTime)
												{
													var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime(":")[0]),parseInt(trainData[l].OriginDepartureTime(":")[1]));
													if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
													{
														minTrainTime = currentTrainTime;
														minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));														
													}
												}
											}
											else if(currenStartDate.equals(dateSet.dateEnd[i]))
											{
												//This is the end date
												if((currentStartDate.getHours()+":"+currentStartDate.getMinutes())>trainData[l].OriginDepartureTime)
												{
													var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime(":")[0]),parseInt(trainData[l].OriginDepartureTime(":")[1]));
													if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
													{
														minTrainTime = currentTrainTime;
														minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));														
													}
												}
											}
											else
											{
												var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime(":")[0]),parseInt(trainData[l].OriginDepartureTime(":")[1]));
												if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
												{
													minTrainTime = currentTrainTime;
													minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));														
												}
											}
										}
										currrenStartDate.addDays(1);
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
						}
					}	
					
				}	
				
			}
		}	
		
	}	
	

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
