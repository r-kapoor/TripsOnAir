require('date-utils');

//Get the duration in minutes
function getDuration(dates, times)
{
	var duration =dates[0].getMinutesBetween(dates[1]);
	if(times[0]!=times[1])
	{
		if(times[0]=="Morning")
		{
			duration+=12*60;
		}
		else
		{
			duration-=12*60;
		}
	}
	return duration;
}
module.exports.getDuration = getDuration;

function combineDatesTimes(dates, times)
{
	var combinedTripDate=[];
	var tripStartDate=new Date(dates[0].getTime());
	var tripEndDate=new Date(dates[1].getTime());
	console.log('times:'+times);
	if(times[0]=="Evening")
	{
		tripStartDate.addHours(12);
	}
	if(times[1]=="Morning")
	{
		
		console.log('morning');
		tripEndDate.addHours(12);
	}
	else if(times[1]=="Evening")
	{
		console.log('evening');
		tripEndDate.addHours(24);
	}
	combinedTripDate.push(tripStartDate);
	combinedTripDate.push(tripEndDate);
	return combinedTripDate;
}
module.exports.combineDatesTimes=combineDatesTimes;