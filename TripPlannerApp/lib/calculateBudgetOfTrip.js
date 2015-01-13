/**
 * New node file
 */


require('date-utils');
var nconf=require('nconf');
require('nconf-redis');

function calculateBudgetOfTrip(rome2RioData,numPeople,callback)
{
	//console.log("calling calculateBudgetOfTrip:%j",rome2RioData);
	var firstCabTime, cabEndTime ,totalBudgetofCabs = 0,isLastTripWithCab = 0, totalBudgetOfTrip = 0, totalBudgetOfMinor = 0,distanceByCab=0, startSegment;
	var startTimeOfTrip, endTimeOfTrip;
	for(var i=0;i<rome2RioData.length;i++)
	{
		//console.log("i:"+i);
		var allRoutes=rome2RioData[i].routes;
		for(var j=0;j<allRoutes.length;j++)
		{
			if(allRoutes[j].isDefault && allRoutes[j].isDefault == 1)
			{
				//console.log("j:"+j);
				var allSegments=allRoutes[j].segments;
				for(var k=0;k<allSegments.length;k++)
				{
					//console.log("k:"+k);
					if(!startTimeOfTrip)
					{
						startTimeOfTrip = allSegments[k].startTime;
					}
					endTimeOfTrip = allSegments[k].endTime;
					if(allSegments[k].isMajor == 1)
					{
						console.log("isMajor");
						if(allSegments[k].subkind=="cab")
						{
							//cab is coming for first Time
							if(isLastTripWithCab==0)
							{
								console.log('cab is coming for first Time');
								firstCabTime=new Date(allSegments[k].startTime.getTime());
								isLastTripWithCab=1;
								startSegment = allSegments[k];
							}
							console.log('cab is coming');
							cabEndTime=new Date(allSegments[k].endTime.getTime());
							distanceByCab+=allSegments[k].distance;
						}
						else
						{
							//Not a cab
							console.log('Not a cab');
							if(isLastTripWithCab==1)
							{
								calculateCabBudgetOfLastTrip();
							}
							totalBudgetOfTrip += allSegments[k].indicativePrice.price;
						}
					}
				}
			}
		}	
		
	}
	if(isLastTripWithCab == 1) {
		calculateCabBudgetOfLastTrip();
	}
	totalBudgetOfTrip += totalBudgetofCabs;

	function calculateCabBudgetOfLastTrip() {
		console.log("isLastTripWithCab==1");
		//Last part of travel was in cab
		isLastTripWithCab=0;
		
		//TODO: Get Distance from Google / MapQuest API\
		//if source and destination of taxi are not same then add the direct distance of source and destination to distanceByCab 
		console.log('firstCabTime:'+firstCabTime);
		console.log('cabEndTime:'+cabEndTime);
		firstCabTime.clearTime(); 
		cabEndTime.clearTime(); 
		var numOfDaysOfCab=firstCabTime.getDaysBetween(cabEndTime)+1;
		console.log('numOfDaysOfCab:'+numOfDaysOfCab);
		var totalBudgetOfThisCab = calculateCabBudget(numOfDaysOfCab, numPeople, distanceByCab,startSegment);
		console.log('totalBudgetOfThisCab:'+totalBudgetOfThisCab);
		totalBudgetofCabs += totalBudgetOfThisCab;
	}
	
	console.log('TOTAL BUDGET OF TRIP:'+totalBudgetOfTrip);
	var completeTrip = {
			TravelBudget : totalBudgetOfTrip,
			startTimeOfTrip : new Date(startTimeOfTrip.getTime()),
			endTimeOfTrip : new Date(endTimeOfTrip.getTime()),
			rome2RioData : rome2RioData
	}
	if(totalBudgetofCabs == 0)
	{
		completeTrip.isCabTrip = 0;
	}
	else
	{
		completeTrip.isCabTrip = 1;
	}
	var fs = require('fs');
	fs.writeFile("totalbudget.txt",JSON.stringify(completeTrip), function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	});
	callback(null, completeTrip);
}

function calculateCabBudget(numOfDaysOfCab, numPeople, distanceByCab, segment)
{
	console.log("inside calculateCabBudget");
	var carOfPreferenceDetails=getFarePerKmPerIndividual(numPeople);
	//Estimated local travel km per day
	var localTravelKm=100;
	//var distance = Math.max(numOfDaysOfCab*perDayNumberOfKilometers, distanceByCab+localTravelKm*numOfDaysOfCab);
	
	var cabOperatorsArray = [];
	for(var i = 0; i < carOfPreferenceDetails.MinimumKmPerDay.length; i++)
	{
		var operatorFound = 0;
		var cabOperator = carOfPreferenceDetails.MinimumKmPerDay[i];
		//console.log("cabOperator %j",cabOperator);
		cabOperator.DistanceForPriceComputation = Math.max(numOfDaysOfCab*cabOperator.Distance, distanceByCab + localTravelKm*numOfDaysOfCab);
		for(var j = 0; j < carOfPreferenceDetails.FareDetails.OperatorPrices.length; j++)
		{
			if(cabOperator.Operator == carOfPreferenceDetails.FareDetails.OperatorPrices[j].Operator)
			{
				cabOperator.ActualCabPrice = carOfPreferenceDetails.FareDetails.OperatorPrices[j].Price * cabOperator.DistanceForPriceComputation;
				cabOperator.PricePerKm = carOfPreferenceDetails.FareDetails.OperatorPrices[j].Price;
				operatorFound = 1;
				break;
			}
		}
		if(operatorFound == 1)
		{
			for(var j = 0; j < carOfPreferenceDetails.Driver.length; j++)
			{
				if(cabOperator.Operator == carOfPreferenceDetails.Driver[j].Operator)
				{
					cabOperator.ActualCabPrice += carOfPreferenceDetails.Driver[j].Price * numOfDaysOfCab;
					cabOperator.ActualCabPrice /= numPeople;
					cabOperator.Driver = carOfPreferenceDetails.Driver[j].Price;
					break;
				}
			}
			cabOperatorsArray.push(cabOperator);
		}
	}
	
	var minimumCabPrice = -1;
	var minIndex = 0;
	for(var i = 0; i < cabOperatorsArray.length; i++)
	{
		if(minimumCabPrice == -1 || minimumCabPrice > cabOperatorsArray[i].ActualCabPrice)
		{
			minimumCabPrice = cabOperatorsArray[i].ActualCabPrice;
			minIndex = i;
		}
	}
	cabOperatorsArray[minIndex].isDefault = 1;
	var cabDetails = {
			CarSegment:carOfPreferenceDetails.CarSegment,
			Cars:carOfPreferenceDetails.FareDetails.Cars,
			Seats:carOfPreferenceDetails.FareDetails.Seats,
			CabOperators:cabOperatorsArray
	}
	segment.CabDetails = cabDetails;
	return minimumCabPrice;
}


function getFarePerKmPerIndividual(numPeople)
{
	console.log("Inside farePerKm fn");
	//nconf.use('file',{file:'../config/cabFareDetails.json'});
	//nconf.load();
	//nconf.use('file', { file: './config/cabFareDetails.json' });
	nconf.file({ file: './config/cabFareDetails.json' });
	nconf.load();
	//nconf.set('name', 'Avian');
	//nconf.set('dessert:name', 'Ice Cream');
	//nconf.set('dessert:flavor', 'chocolate');

	//console.log(nconf.get('dessert'));
	/*nconf.save(function (err) {
		   if (err) {
		     console.error(err.message);
		     return;
		   }
		   console.log('Configuration saved successfully.');
		 });*/
	
	var fareDetails = nconf.get('FareDetails');
	//TODO : Choose a car depending on the budget of the user
	var carOfPreference = "Bus";
	if(numPeople <= 2)
	{
		carOfPreference = "Mini";
	}
	if(numPeople <= 4)
	{
		carOfPreference = "Sedan";
	}
	else if(numPeople <= 6)
	{
		carOfPreference = "SmallSUV";
	}
	else if(numPeople <= 7)
	{
		carOfPreference = "LargeSUV";
	}
	else if(numPeople <= 14)
	{
		carOfPreference = "TempoTraveller";
	}
	else if(numPeople <= 25)
	{
		carOfPreference = "MiniBus";
	}
	
	var carOfPreferenceDetails = fareDetails[carOfPreference];
	
	return {
		CarSegment:carOfPreference,
		FareDetails:carOfPreferenceDetails,
		Driver:nconf.get('Driver'),
		MinimumKmPerDay:nconf.get('MinimumKmPerDay')
	}
}
module.exports.calculateBudgetOfTrip=calculateBudgetOfTrip;