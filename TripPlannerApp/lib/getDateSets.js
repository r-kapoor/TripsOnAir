/*
 * Calculates the minimum and maximum possible date-time when each leg of the trip can be made.
 * For the 1st leg (from origin) - a person can start earliest at the start date-time given and latest 24hrs after this.
 * For the last leg a person can reach earliest 24hrs before end date-time and thus start from the last destination earliest by that time - max duration for that trip
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
function getDateSets(rome2RioData, dates, times) {
	
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
	
	//For each start and end date of trip getting the date array which has the time according to morning and evening as well
	for(var i = 0; i < 2; i++)
	{
		if(times[i] == "Morning")
		{
			dateTimes.push(new Date(dates[i].getFullYear(), dates[i].getMonth(), dates[i].getDate(), 0,0));
		}
		else
		{
			dateTimes.push(new Date(dates[i].getFullYear(), dates[i].getMonth(), dates[i].getDate(), 12,0));
		}
	}
	
	var dateStart = [], dateEnd = [];
	
	//Contains the lower limit for when the leg of the trip can be made (for the 1st leg = start time of trip)
	dateStart[0]=dateTimes[0];
	
	//Contains the upper limit for when the leg of the trip can be made
	dateEnd[0]=new Date(dateTimes[0].getTime() + 24*60*60000);//The trip from origin can start till 24 hrs from start time. ie. for 12th evening -> till 13th 12:00
	
	//The last leg of the trip can start at earliest this time
	dateStart[numOfTravels-1] = new Date(dateTimes[1].getTime() - 24*60*60000 - maxDurations[numOfTravels - 1]*60000);//Time to return to origin - 24hrs - max duration of last leg of trip
	
	//Calculating the lower limit of each leg of trip except 1st and last
	for(var i = 1; i < numOfTravels-1; i++)
	{
		dateStart[i] = new Date(dateStart[i-1].getTime() + 2*minDurations[i-1]*60000);
		//2 times as calculating the duration + time spent in that place(assuming time spent = time in reaching destination)
	}
	
	//The latest by which the last leg of trip can be started
	dateEnd[numOfTravels-1] = new Date(dateTimes[1].getTime()-minDurations[numOfTravels-1]*60000);//Time to return to origin - minimum duration in last leg of trip
	
	//Calculating the upper limit at which each leg of trip can start
	for(var i = numOfTravels-2; i > 0 ; i--)
	{
		dateEnd[i] = new Date(dateEnd[i+1].getTime() - 2*minDurations[i]*60000);
	}
	
	var dateSet = {
			dateStart:dateStart,
			dateEnd:dateEnd
	};
	
	return dateSet;
}
module.exports.getDateSets = getDateSets;