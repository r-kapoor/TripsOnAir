/**
 * @author rajat
 * return range of travel
 * Algo: 	1. Find whether user can travel by flight or not by comparing user budget with total possible budget if he travels by flight
 * 			2. If user can travel by flight then return the possible range of travel acco. to the type of flight 
 * 			3. Otherwise, calculate range with other mode of travels
 */

function getRange(budget, numDays,callback){
	
	var fgt1Fare= 12000;range1=1800;
	var fgt2Fare= 8000;range2=1200;
	var otherFgtFare=2500;//per day acco and food fare if travel by flight
	var otherModeFare=1000;//per day acco and food fare if travel by train or bus
	var totalBgt;//represents the possible total budget with different mode of travels
	var avgSpeed=55; // average speed of travel in kmph by train/bus
	var trainFare=1000;//min round trip fare for train
	var flightDist=0,otherDist=0,timeAvailableDist=0;
	
	var flightBudget=budget-(otherFgtFare*numDays);
	var otherBudget=budget-(otherModeFare*numDays);
	console.log("flightBudget "+flightBudget);
	if((5000<flightBudget)&&(flightBudget<=8000))
	{
		flightDist=flightBudget-4400;
	}
	
	else if(flightBudget>8000)
	{
		flightDist=((flightBudget/8000)*(8000-4400))+((flightBudget%8000)-4400);		
	}

	otherDist=((0.75)*otherBudget)-320;
	
	var totalTravelTime=(numDays/2)*24;//round trip travel time should be less then 50% of the total time for trip
	timeAvailableDist=((totalTravelTime/2)*avgSpeed);

	console.log(flightDist+","+otherDist+","+timeAvailableDist);
	
	callback(Math.max(Math.min(otherDist,timeAvailableDist),flightDist));
	
	
	
	
	/*if((fgt1Fare+(otherFgtFare*numDays))<budget)
		{
			callback(range1);
		}
	else if((fgt2Fare+(otherFgtFare*numDays))<budget)
		{
			callback(range2);
		}
	else if((trainFare+(otherModeFare*numDays))<budget)
		{
			var totalTravelTime=(numDays/2)*24;//round trip travel time should be less then 50% of the total time for trip
			callback ((totalTravelTime/2)*avgSpeed);
		}
	else
		{
			console.log("Trip not possible");
			callback(0);
		}*/
}
module.exports.getRange = getRange;