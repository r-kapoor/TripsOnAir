require('date-utils');
var getDuration = require('../lib/UtilityFunctions/getDuration');

var getTravelPlan = require('../lib/getTravelPlan');
function getDefaultModeOfTravel(rome2RioData,dateSet,budget,dates, times, ratingRatio,lengthOfRoutesArray,indexOfDrive,numPeople,callback) {
	var durationFactor = 0.5;//People spend max half time on travelling
	var budgetFactor = 0.5;// People spend half the budget oon travel
	console.log('date:'+Date.today());
	var duration = getDuration.getDuration(dates, times);
	console.log("total duration:"+duration);
	var durationInTravel = duration * durationFactor;
	console.log("budget between:"+budget);
	var budgetInTravel = budget * budgetFactor;

	console.log('durationInTravel:'+durationInTravel);
	console.log('budgetInTravel:'+budgetInTravel);

	var allPossibleCombinations=getAllPossibleCombinations(lengthOfRoutesArray,indexOfDrive);
	var minPriority1 = -1, minPriority2 = -1, minPriority3 = -1, minPriority4 = -1;
	var minPriorityCombinations1 = [], minPriorityCombinations2 = [], minPriorityCombinations3 = [], minPriorityCombinations4 = [];
	var finalPriorityCombination=[];
	outer:
	for(var i=0;i<allPossibleCombinations.length;i++)
	{
		var totalDurationOfTrip = 0;
		var totalBudgetOfTrip = 0;
		var allCombinationsArray=allPossibleCombinations[i].split("");
		for(var j=0;j<allCombinationsArray.length;j++)
		{
			var routeObject=rome2RioData[j].routes[parseInt(allCombinationsArray[j])];
			if(routeObject.isRecommendedRoute == 0)
			{
				//console.log('continues loop for route:'+routeObject.name);
				continue outer;
			}
			totalDurationOfTrip += routeObject.duration;
			totalBudgetOfTrip += routeObject.indicativePrice.price;
		}
		if(totalDurationOfTrip < durationInTravel && totalBudgetOfTrip < budgetInTravel)
		{
			//This is a good option!!
			console.log('totalDurationOfTrip:'+totalDurationOfTrip);
			console.log('totalBudgetOfTrip:'+totalBudgetOfTrip);
			console.log('allCombinationsArray:'+allCombinationsArray);
			var sumOfPriority = allCombinationsArray.reduce(function(a, b) { return a + b });
			if(minPriority1 == -1 || sumOfPriority < minPriority1)
			{
				minPriority1 = sumOfPriority;
				minPriorityCombinations1 = allCombinationsArray;
			}
		}
		else if(totalDurationOfTrip < durationInTravel)
		{
			var sumOfPriority = allCombinationsArray.reduce(function(a, b) { return a + b });
			if(minPriority2 == -1 || sumOfPriority < minPriority2)
			{
				minPriority2 = sumOfPriority;
				minPriorityCombinations2 = allCombinationsArray;
			}
		}
		else if(totalBudgetOfTrip < budgetInTravel)
		{
			var sumOfPriority = allCombinationsArray.reduce(function(a, b) { return a + b });
			if(minPriority3 == -1 || sumOfPriority < minPriority3)
			{
				minPriority3 = sumOfPriority;
				minPriorityCombinations3 = allCombinationsArray;
			}
		}
		else
		{
			var sumOfPriority = allCombinationsArray.reduce(function(a, b) { return a + b });
			if(minPriority4 == -1 || sumOfPriority < minPriority4)
			{
				minPriority4 = sumOfPriority;
				minPriorityCombinations4 = allCombinationsArray;
			}
		}
	}
	if(minPriorityCombinations1.length > 0)
	{
		finalPriorityCombination=minPriorityCombinations1;
		console.log('Combination 1:'+minPriorityCombinations1);
	}
	else if(minPriorityCombinations2.length > 0)
	{
		finalPriorityCombination=minPriorityCombinations2;
		console.log('Combination 2:'+minPriorityCombinations2);
	}
	else if(minPriorityCombinations3.length > 0)
	{
		finalPriorityCombination=minPriorityCombinations3;
		console.log('Combination 3:'+minPriorityCombinations3);
	}
	else if(minPriorityCombinations4.length > 0)
	{
		finalPriorityCombination=minPriorityCombinations4;
		console.log('Combination 4:'+minPriorityCombinations4);
	}


	for(var t=0;t<rome2RioData.length;t++)
	{
		rome2RioData[t].routes[finalPriorityCombination[t]].isDefault=1;
	}

	var fs = require('fs');
	fs.writeFile("text.txt",JSON.stringify(rome2RioData), function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	});
	//callbackDefaultMode(rome2RioData);
	getTravelPlan.getTravelPlan(rome2RioData,dateSet,dates,times,ratingRatio,duration,numPeople,callback);

}
module.exports.getDefaultModeOfTravel = getDefaultModeOfTravel;




function getAllPossibleCombinations(lengthOfSegmentsArray,indexOfDrive)
{

	var tempStringArray=[];
	for(var i=0;i<lengthOfSegmentsArray.length;i++)
	{
		tempStringArray[i]=[];
		for(var j=0;j<lengthOfSegmentsArray[i];j++)
		{
			if(indexOfDrive[i]!=j)
			{
				tempStringArray[i].push(j+"");
			}
		}
	}

	console.log("tempStringArray:"+tempStringArray);
	console.log("allPossibleCases:"+allPossibleCases(tempStringArray));
	return (allPossibleCases(tempStringArray));
}


function allPossibleCases(arr) {
	  if (arr.length === 0) {
	    return [];
	  }
	else if (arr.length ===1){
	return arr[0];
	}
	else {
	    var result = [];
	    var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
	    for (var c in allCasesOfRest) {
	      for (var i = 0; i < arr[0].length; i++) {
	        result.push(arr[0][i] + allCasesOfRest[c]);
	      }
	    }
	    return result;
	  }

	}
