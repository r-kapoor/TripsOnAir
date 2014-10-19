/**
 * Travelling Salesman Problem
 * TODO : All
 */

var positions = [];
var minWeight = 10000;

function getOrderUsingTsp(error, distanceAndConnectivity, cities) {
	
	//Inputs
	var origin = {name: 'Pilani'};
	var dest1 = {name: 'Delhi'};
	var dest2 = {name: 'Jaipur'};
	var dest3 = {name: 'Agra'};
	var distances = [[0,250,300,400],[250,0,125,150],[300,125,0,200],[400,150,200,0]];
	var connectivities = [[-1,0.5,0.4,0.1],[0.5,-1,0.9,0.8],[0.4,0.9,-1,0.7],[0.1,0.8,0.7,-1]];
	
	var weight = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	var cities = [];
	cities.push(origin);
	cities.push(dest1);
	cities.push(dest2);
	cities.push(dest3);
	
	for(var i=0; i < cities.length; i++)
	{
		for(var j=0; j < cities.length; j++)
		{
			//console.log('Distance from '+cities[i].name+' to '+cities[j].name+'='+distances[i][j]);
			//console.log('Connectivity from '+cities[i].name+' to '+cities[j].name+'='+connectivities[i][j]);
			weight[i][j] = distances[i][j]/connectivities[i][j];
			console.log('Weight from '+cities[i].name+' to '+cities[j].name+'='+weight[i][j]);
		}
	}	
	
	var permArr = [];
	var usedChars = [];
	var weightOfTrip = 0;
	var minWeight = 100000;
	var minTrip = [];
	function permute(input) {
	    var i, ch;
	    for (i = 0; i < input.length; i++) {
	        ch = input.splice(i, 1)[0];
	        usedChars.push(ch);
	        if (input.length == 0) {
	        	trip = usedChars.slice();
	        	weightOfTrip = getWeight(trip, weight);
	        	if(weightOfTrip < minWeight)
	        	{
	        		minWeight = weightOfTrip;
	        		minTrip = trip
	        	}
	            permArr.push(trip);
	        }
	        permute(input);
	        input.splice(i, 0, ch);
	        usedChars.pop();
	    }
	    return permArr
	};

	var permuted = permute([1,2,3]);
	console.log(permuted);
	console.log(permuted.length);
	
	console.log("Best Trip:"+minTrip);
	console.log(cities[0].name);
	for(var i = 0; i < minTrip.length; i++)
	{
		console.log(cities[minTrip[i]].name);
	}
	console.log(cities[0].name);
	console.log("Min Weight:"+minWeight);
}

function getWeight(trip, weight)
{
	var weightOfTrip = 0;
	for(var i = 1; i < trip.length; i++)
	{
		weightOfTrip += weight[trip[i-1]][trip[i]];
	}
	weightOfTrip += weight[0][trip[0]] + weight[trip[trip.length-1]][0];
	return weightOfTrip;
}

module.exports.getOrderUsingTsp = getOrderUsingTsp;