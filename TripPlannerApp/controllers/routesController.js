/*
 * This file defines the handling logic when showRoutes is called 
 */

'use strict';

var IndexModel = require('../models/index');
var getDataRome2rio=require('../lib/getDataRome2rio');
var mergeJson=require('../lib/mergeJson');
var getRatingRatio=require('../lib/getRatingRatio');
var conn = require('../lib/database');
var getDateSets = require('../lib/getDateSets');
var getTrainData=require('../lib/getTrainData');
var getDefaultModeOfTravel=require('../lib/getDefaultModeOfTravel');
var planTaxiTrip=require('../lib/planTaxiTrip');

var async  = require('async');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/showRoutes',function(req,res)
	{
		//Getting the paramters passed
		var cities=req.param('cities').split(',');
		var startDate=req.param("stD");
    	var endDate=req.param("enD");
    	var dates=[new Date(startDate),new Date(endDate)];
    	var startTime=req.param("stT");
    	var endTime=req.param("enT");
    	var times=[startTime,endTime];
    	var  numPeople=req.param("numP");
    	var budget = req.param("bdg");
    	
    	//Temporary Fix For time
    	//TODO : Change Time to Integer
		if(times[0]=="morning")
		{
			times[0] = "Morning";
		}
		else if(times[0]=="evening")
		{
			times[0] = "Evening";
		}
		if(times[1]=="morning")
		{
			times[1] = "Morning";
		}
		else if(times[1]=="evening")
		{
			times[1] = "Evening";
		}
		
		
		//Array of functions to be called in parallel
		var fns=[];
		
		//Array of flags which enable each function in the array to be called with different values
		var semaphore=Array.apply(null, new Array(cities.length-1)).map(Number.prototype.valueOf, 0);
		
		//Individual function to get rome2RioData for each pair of cities in the trip
		var funct = function (callback){
			for(var i=0;i<semaphore.length;i++)
			{
				if(semaphore[i]==0)
				{
					semaphore[i]=1;
		        	getDataRome2rio.getDataRome2rio(cities[i],cities[i+1],callback);
		        	break;
				}	
			}			
        };
        
        //Pushing the functions in an array
		for(var i=0;i<cities.length-1;i++)
		{	
            fns.push(funct);
		}
		
		//Pushing the getRatingRatio function so that it gets the ratings of the destinations in parallel
		fns.push(function (callback){
			getRatingRatio.getRatingRatio(conn,cities.slice(1,cities.length-1),callback);
			});
    	
		
		//Calling the functions in parallel followed by the callback
    	async.parallel(
			fns,
	        //callback
            function(err, results) {
				//Extracting the rating ratios from the results array, as async returns all the parameters in the results array
				var ratio=results[results.length-1];
				
				//Getting the lower and upper limits of the date-times when each leg of the trip can be taken
				var dateSet = getDateSets.getDateSets(results.slice(0,results.length-1), dates, times);

				//Getting the schedules of the trains from db. All the travel planning logic is called in the callbacks of this function
				getTrainData.getTrainData(conn, results.slice(0,results.length-1), dateSet, budget, dates, times, ratio, numPeople, 
						getDefaultModeOfTravel.getDefaultModeOfTravel,planTaxiTrip.planTaxiTrip, 
						function(model){
					res.json(model);
			});
    	});
	});
}