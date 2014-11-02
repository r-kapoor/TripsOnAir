/**
 * Travelling Salesman Problem
 * TODO : All
 */

var hashidEncoder =  require('../lib/hashEncoderDecoder');
var positions = [];
var minWeight = 10000;

function getOrderUsingTsp(err, results, callback) {
	if(err)
	{
		throw err;
	}
	console.log('tsp called');
	
	var TimeFactor = 200000; // 55.56 Hours as time factor. The time is to be divided by this factor to get the road connectivity
	
	
	//Validating the Inputs
	var distanceMatrix = results[0].distance;
	console.log('distance matrix');
	for(var i = 0; i < distanceMatrix.length; i++)
	{
		for(var j = 0; j < distanceMatrix.length; j++)
		{
			console.log("i:"+i+":j:"+j+":"+distanceMatrix[i][j]);
		}
	}
	
	var timeMatrix = results[0].time;
	console.log('time matrix');
	for(var i = 0; i < timeMatrix.length; i++)
	{
		for(var j = 0; j < timeMatrix.length; j++)
		{
			console.log("i:"+i+":j:"+j+":"+timeMatrix[i][j]);
		}
	}
	
	var connectivities = results[1][0];
	/*console.log('connectivities');
	for(var i = 0; i < connectivities.length; i++)
	{
		for(var j = 0; j < connectivities.length; j++)
		{
			console.log("i:"+i+":j:"+j+":"+connectivities[i][j]);
		}
	}*/
	
	var cities = results[1][1];
	/*console.log('cities');
	for(var i = 0; i < cities.length; i++)
	{
		console.log('i:'+i+':'+cities[i]);
	}*/
	
	var cityIDs = results[1][2];
	/*console.log('city ids');
	for(var i = 0; i < cityIDs.length; i++)
	{
		console.log('i:'+i+':'+cityIDs[i]);
	}*/
	
	var numberOfCities = cityIDs.length;
	//Adding the Road Connectivity calculated using Time to get Total connectivity
	for(var i = 0 ; i < numberOfCities ; i++)
	{
		for(var j = 0 ; j < numberOfCities ; j++)
		{
			if(i == j)
			{
				connectivities[i][j] = -1;
			}
			else
			{
				connectivities[i][j] += TimeFactor/timeMatrix[i][j];
			}
		}
	}
	
	console.log('connectivities');
	for(var i = 0; i < connectivities.length; i++)
	{
		for(var j = 0; j < connectivities.length; j++)
		{
			console.log("i:"+i+":j:"+j+":"+connectivities[i][j]);
		}
	}
	
	//Inputs
	//var origin = {name: 'Pilani'};
	//var dest1 = {name: 'Delhi'};
	//var dest2 = {name: 'Jaipur'};
	//var dest3 = {name: 'Agra'};
	//var distances = [[0,250,300,400],[250,0,125,150],[300,125,0,200],[400,150,200,0]];
	//var connectivities = [[-1,0.5,0.4,0.1],[0.5,-1,0.9,0.8],[0.4,0.9,-1,0.7],[0.1,0.8,0.7,-1]];

	//Initializing an 0 filled weight array
	var weight = [];
	for(var i = 0 ; i < numberOfCities ; i++)
	{
		weight[i] = Array.apply(null, new Array(numberOfCities)).map(Number.prototype.valueOf, 0);
	}
	
	//var cities = [];
	//cities.push(origin);
	//cities.push(dest1);
	//cities.push(dest2);
	//cities.push(dest3);
	
	for(var i=0; i < numberOfCities; i++)
	{
		for(var j=0; j < numberOfCities; j++)
		{
			//console.log('Distance from '+cities[i].name+' to '+cities[j].name+'='+distances[i][j]);
			//console.log('Connectivity from '+cities[i].name+' to '+cities[j].name+'='+connectivities[i][j]);
			weight[i][j] = distanceMatrix[i][j]/connectivities[i][j];
			//console.log('Weight from '+cities[i].name+' to '+cities[j].name+'='+weight[i][j]);
		}
	}	
	
	console.log('weight');
	for(var i = 0; i < weight.length; i++)
	{
		for(var j = 0; j < weight.length; j++)
		{
			console.log("i:"+i+":j:"+j+":"+weight[i][j]);
		}
	}
	
	var permArr = [];
	var usedChars = [];
	var weightOfTrip = 0;
	var minWeight = -1;
	var minTrip = [];
	function permute(input) {
	    var i, ch;
	    for (i = 0; i < input.length; i++) {
	        ch = input.splice(i, 1)[0];
	        usedChars.push(ch);
	        if (input.length == 0) {
	        	trip = usedChars.slice();
	        	weightOfTrip = getWeight(trip, weight);
	        	if(weightOfTrip < minWeight || minWeight == -1)
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

	var permutationArray = [];
	for(var i = 1 ; i < numberOfCities; i++)
	{
		permutationArray.push(i);
	}
	var permuted = permute(permutationArray);
	//console.log(permuted);
	//console.log(permuted.length);
	
	var tripOrder = [];
	console.log("Best Trip:"+minTrip);
	console.log(cities[0]);
	var city = {CityName:cities[0], CityID:hashidEncoder.encodeCityID(cityIDs[0])};
	//tripOrder.push(city);
	for(var i = 0; i < minTrip.length; i++)
	{
		console.log(cities[minTrip[i]]);
		city = {CityName:cities[minTrip[i]], CityID:hashidEncoder.encodeCityID(cityIDs[minTrip[i]])};
		tripOrder.push(city);
	}
	console.log(cities[0]);
	city = {CityName:cities[0], CityID:hashidEncoder.encodeCityID(cityIDs[0])};
	//tripOrder.push(city);
	console.log("Min Weight:"+minWeight);
	
	callback(tripOrder, cities[0], hashidEncoder.encodeCityID(cityIDs[0]), weight, cities, hashidEncoder.encodeCityID(cityIDs), minWeight);
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