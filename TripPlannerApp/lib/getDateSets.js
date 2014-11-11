function getDateSets(rome2RioData, dates, times) {
	var numOfTravels = rome2RioData.length;
	var minDurations = [];
	var maxDurations = [];
	//console.log(JSON.parse(rome2RioData[0]));
	for(var i =0 ; i < numOfTravels; i++)
	{
		var allRoutes = rome2RioData[i].routes;
		console.log("rome2RioData["+i+"].routes:%j",rome2RioData[i].routes[0]);
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
	for(var i = 0; i < minDurations.length; i++)
	{
		console.log("MinDurations:"+minDurations[i]);
	}
	var dateTimes = [];
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
		console.log("Date Input:"+dateTimes[i]);
	}
	
	var dateStart = [], dateEnd = [];
	dateStart[0]=dateTimes[0];
	dateEnd[0]=new Date(dateTimes[0].getTime() + 24*60*60000);
	dateStart[numOfTravels-1] = new Date(dateTimes[1].getTime() - 24*60*60000 - maxDurations[numOfTravels - 1]*60000);
	for(var i = 1; i < numOfTravels-1; i++)
	{
		dateStart[i] = new Date(dateStart[i-1].getTime() + 2*minDurations[i-1]*60000);
		//2 times as calculating the duration + time spent in that place(assuming time spent = time in reaching destination)
	}
	dateEnd[numOfTravels-1] = new Date(dateTimes[1].getTime()-minDurations[numOfTravels-1]*60000);
	for(var i = numOfTravels-2; i > 0 ; i--)
	{
		dateEnd[i] = new Date(dateEnd[i+1].getTime() - 2*minDurations[i]*60000);
	}
	var dateSet = {
			dateStart:dateStart,
			dateEnd:dateEnd
	};
	for(var i = 0; i < dateStart.length; i++)
	{
		console.log("Earliest Journey possible Date:"+dateStart[i]);
		console.log("Latest Journey possible Date:"+dateEnd[i]);
	}
	return dateSet;
}
module.exports.getDateSets = getDateSets;