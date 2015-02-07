/*
 * Calculates the minimum and maximum possible date-time when each leg of the trip can be made.
 * For the 1st leg (from origin) - a person can start earliest at the start date-time given and latest 24hrs after this.
 * For the last leg a person can reach earliest 24hrs before end date-time and thus start from the last destination earliest by that time - max duration for that leg
 * Similarly he can reach latest by the end time and thus start latest by end time - minimum duration for last leg
 * For the other destinations, it is assumed that he will stay there for a minimum of the same time taken to travel there.
 * Thus he can start earliest by reaching the destination using the fastest transport(min duration) + the same duration to stay.
 * Similar calculations from the end give the upper limit.
 */

/*
 * Params :
 * rome2RioData - The Array of JSON objects returned by rome2rio API for each leg of the trip
 * dates - Array of length 2 containing date objects. dates[0] is the starting date and date[1] is the end date
 * times - Array of length 2 containing strings 'Morning' or 'Evening'. times[0] is the starting time and times[1] is the ending time
 */

require('date-utils');
function getDateSets(rome2RioData, dates, times) {

    console.log('In getDateSets');
    console.log('@param dates[0]:'+dates[0]+', dates[1]:'+dates[1]);
    console.log('@param times[0]:'+times[0]+', times[1]:'+times[1]);

	//The number of legs in the trip
	var numOfTravels = rome2RioData.length;

	//Arrays containing the minimum and maximum duration for each leg
	var minDurations = [];
	var maxDurations = [];

	//Iterating the rome2RioData to get the minimum and maximum duration of all the routes for each leg
	for(var i =0 ; i < numOfTravels; i++)
	{
		var allRoutes = rome2RioData[i].routes;

		var minDuration = -1;
		var maxDuration = 0;

		for(var j = 0; j < allRoutes.length; j++)
		{
			var duration = allRoutes[j].duration;
			if(minDuration == -1 || duration < minDuration)
			{
				minDuration = duration;
			}
			if(duration > maxDuration)
			{
				maxDuration = duration;
			}
		}
		minDurations.push(minDuration);
		maxDurations.push(maxDuration);
	}

	//Array containing start end date-time in index 0 and 1
	var dateTimes = [];

	//For both start and end date of trip, getting the dateTime array which has the date with time(morning/evening)
    if(times[0] == "Morning")
    {
        dateTimes.push(new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate(), 0,0));
    }
    else
    {
        dateTimes.push(new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate(), 12,0));
    }

    if(times[1] == "Morning")
    {
        dateTimes.push(new Date(dates[1].getFullYear(), dates[1].getMonth(), dates[1].getDate(), 12,0));
    }
    else
    {
        var endDateClone=dates[1].clone().addDays(1);
        dateTimes.push(new Date(endDateClone.getFullYear(), endDateClone.getMonth(), endDateClone.getDate(), 0,0));
    }

	var dateStart = [], dateEnd = [];

	//Contains the lower limit for when the leg of the trip can be made (for the 1st leg = start time of trip)
	dateStart[0]=dateTimes[0];

	//Contains the upper limit for when the leg of the trip can be made
	dateEnd[0]=new Date(dateTimes[0].getTime() + 24*60*60000);//The trip from origin can start till 24 hrs from start time. ie. for 12th evening -> till 13th 12:00

	//Calculating the lower limit of each leg of trip except 1st and last
	for(var i = 1; i < numOfTravels-1; i++)
	{
		dateStart[i] = new Date(dateStart[i-1].getTime() + 2*minDurations[i-1]*60000);
		//2 times as calculating the duration + time spent in that place(assuming time spent = time in reaching destination)
	}

    //The last leg of the trip can start at earliest this time
    dateStart[numOfTravels-1] = new Date(dateTimes[1].getTime() - 24*60*60000 - maxDurations[numOfTravels - 1]*60000);//Time to return to origin - 24hrs - max duration of last leg of trip

    var earliestTimeForLastLeg=new Date(dateStart[numOfTravels-2].getTime() + 2*minDurations[numOfTravels-2]*60000);
    if(dateStart[numOfTravels-1].isBefore(earliestTimeForLastLeg))
    {
        dateStart[numOfTravels-1]=earliestTimeForLastLeg;
    }
    //The latest by which the last leg of trip can be started
	dateEnd[numOfTravels-1] = new Date(dateTimes[1].getTime()-minDurations[numOfTravels-1]*60000);//Time to return to origin - minimum duration in last leg of trip

	//Calculating the upper limit at which each leg of trip can start
	for(var i = numOfTravels-2; i > 0 ; i--)
	{
		dateEnd[i] = new Date(dateEnd[i+1].getTime() - 2*minDurations[i]*60000);
	}

    var latestTimeForFirstLeg=new Date(dateEnd[1]-2*minDurations[0]*60000);
    if(latestTimeForFirstLeg.isBefore(dateEnd[0]))
    {
        dateEnd[0]=latestTimeForFirstLeg;
    }

	var dateSet = {
			dateStart:dateStart,
			dateEnd:dateEnd
	};

    //if origin can't be reached before user end time at all then trip is not possible
    if(new Date(dateStart[numOfTravels-1].getTime() + minDurations[numOfTravels-1]*60000).isAfter(dateTimes[1]))
    {
        return null;
    }
    //if latest time by which one can start from origin is before user start time the trip is not possible
    if(dateEnd[0].isBefore(dateTimes[0]))
    {
        return null;
    }

    for(var i = 0; i < dateSet.dateStart.length; i++) {
        console.log('@out dateStart['+i+']:'+dateSet.dateStart[i]);
    }
    for(var i = 0; i < dateSet.dateEnd.length; i++) {
        console.log('@out dateEnd['+i+']:'+dateSet.dateEnd[i]);
    }
	return dateSet;
}
module.exports.getDateSets = getDateSets;
