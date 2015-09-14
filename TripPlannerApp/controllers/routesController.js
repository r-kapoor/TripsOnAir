/*
 * This file defines the handling logic when showRoutes is called
 */

'use strict';

var IndexModel = require('../models/index');
var getDataRome2rio=require('../lib/getDataRome2rio');
var getRatingRatio=require('../lib/getRatingRatio');
var conn = require('../lib/database');
var getDateSets = require('../lib/getDateSets');
var getTrainData=require('../lib/getTrainData');
var getFlightData=require('../lib/getFlightData');
var getBusData=require('../lib/getBusData');
var planAllModesTrip = require('../lib/planAllModesTrip');
var planTaxiTrip=require('../lib/planTaxiTrip');
var tasteObjectToInteger=require('../lib/UtilityFunctions/tasteObjectToInteger');
var chooseMajorDefault = require('../lib/chooseMajorDefault');
var cloneJSON=require('../lib/UtilityFunctions/cloneJSON');
var combineTrainFlightBusData = require('../lib/combineTrainFlightBusData');
var getClient = require('../lib/UtilityFunctions/redisConnection');
require('date-utils');
var async  = require('async');

var tripNotPossibleResponse = function (res) {
    //res.redirect('/tripNotPossible');
    var model = {
        tripNotPossible: 1
    };
    res.json(model);
};

module.exports=function (app){

    var model = new IndexModel();

    app.get('/showRoutes/:itineraryID',function(req,res)
    {
        //Getting the paramters passed
        var itineraryID = req.params.itineraryID;

        var redisClient = getClient.getClient();

        redisClient.get(itineraryID, function(err, itinerary) {
            if (err || itinerary == null) {
                if(err){
                    console.log('Error in getting itinerary:' + err);
                }
                res.status(400).json({error: 'Itinerary ID Invalid'})
            }
            else {
                var saveObject = JSON.parse(itinerary);
                itinerary = saveObject.inputs;
                var state = saveObject.state;
                if(state > 2){
                    //The routes have already been submitted generated
                    //No need to generate routes, the same route has to be returned
                    if(saveObject.routesData == null){
                        tripNotPossibleResponse(res);
                    }
                    else {
                        res.json(saveObject.routesData);
                    }
                }
                else{
                    //The routes needs to be found
                    var cities = [itinerary.originCity.CityName];
                    var cityIDs = [itinerary.originCity.CityID];
                    for(var destinationIndex = 0; destinationIndex < itinerary.destinationCities.length; destinationIndex++ ){
                        cities.push(itinerary.destinationCities[destinationIndex].CityName);
                        cityIDs.push(itinerary.destinationCities[destinationIndex].CityID);
                    }
                    cities.push(itinerary.originCity.CityName);
                    cityIDs.push(itinerary.originCity.CityID);

                    var startDate = itinerary.startDate;
                    var endDate = itinerary.endDate;
                    var startTime = itinerary.tripStartTime;
                    var endTime = itinerary.tripEndTime;
                    var numPeople = itinerary.numPersons;
                    var budget = itinerary.budget;
                    var tastes = itinerary.tastes;



                    var dates=[new Date(startDate),new Date(endDate)];

                    var times=[];
                    tastes=tasteObjectToInteger.tasteObjectToInteger(tastes);

                    dates[0].clearTime();
                    dates[1].clearTime();
                    //Temporary Fix For time
                    //TODO : Change Time to Integer
                    if(startTime.morning)
                    {
                        times[0] = "Morning";
                    }
                    else if(startTime.evening)
                    {
                        times[0] = "Evening";
                    }
                    if(endTime.morning)
                    {
                        times[1] = "Morning";
                    }
                    else if(endTime.evening)
                    {
                        times[1] = "Evening";
                    }

                    //console.log("Time[0]:"+times[0]+","+"Time[1]:"+times[1]);
                    //Array of functions to be called in parallel
                    var fns=[];
                    console.log('In show routes');
                    //Array of flags which enable each function in the array to be called with different values
                    var semaphore=Array.apply(null, new Array(cities.length-1)).map(Number.prototype.valueOf, 0);

                    //Individual function to get rome2RioData for each pair of cities in the trip
                    var funct = function (callback){
                        for(var i=0;i<semaphore.length;i++)
                        {
                            if(semaphore[i]==0)
                            {
                                semaphore[i]=1;
                                getDataRome2rio.getDataRome2rio(cities[i],cities[i+1],cityIDs[i],cityIDs[i+1],callback);
                                break;
                            }
                        }
                    };
                    console.log('In show routes');
                    //Pushing the functions in an array
                    for(var i=0;i<cities.length-1;i++)
                    {
                        fns.push(funct);
                    }

                    //Pushing the getRatingRatio function so that it gets the ratings of the destinations in parallel
                    fns.push(function (callback){
                        console.log("rating ratio callback:"+callback);
                        getRatingRatio.getRatingRatio(conn,cities.slice(1,cities.length-1),callback);
                    });


                    //Calling the functions in parallel followed by the callback
                    async.parallel(
                        fns,
                        //callback
                        function(err, results) {
                            console.log('In show routes');
                            //Extracting the rating ratios from the results array, as async returns all the parameters in the results array
                            var ratio=results[results.length-1];

                            //Getting the lower and upper limits of the date-times when each leg of the trip can be taken
                            var dateSet = getDateSets.getDateSets(results.slice(0,results.length-1), dates, times);
                            console.log('dateSet:'+JSON.stringify(dateSet));
                            if(dateSet==null)
                            {
                                tripNotPossibleResponse(res);
                            }
                            else {
                                //Getting the schedules of the trains from db. All the travel planning logic is called in the callbacks of this function
                                async.parallel([
                                        function (callbackData) {
                                            getFlightData.getFlightData(conn, results.slice(0, results.length - 1), dateSet, budget, dates, times, ratio, numPeople,
                                                callbackData);
                                        },
                                        function (callbackData) {
                                            if (callbackData == undefined) {
                                                console.log('UNDEFINED');
                                            }
                                            else {
                                                getTrainData.getTrainData(conn, results.slice(0, results.length - 1), dateSet, budget, dates, times, ratio, numPeople,
                                                    callbackData);
                                            }
                                        },
                                        function (callbackData) {
                                            getBusData.getBusData(conn, results.slice(0, results.length - 1), dateSet, budget, dates, times,
                                                callbackData);
                                        }
                                    ],
                                    function (err, results) {

                                        //Reference for both train and flight data is same. Now Combining the isRecommendedRoute part
                                        var rome2RioData = combineTrainFlightBusData.combineTrainFlightBusData(results[0]);

                                        async.parallel(
                                            [
                                                function (callback) {
                                                    planAllModesTrip.planAllModesTrip(cloneJSON.clone(rome2RioData), dateSet, budget, dates, times, ratio, results[1].lengthOfRoutesArray, results[1].indexOfDrive, numPeople, callback);
                                                },
                                                function (callback) {

                                                    planTaxiTrip.planTaxiTrip(conn, rome2RioData, numPeople, budget, dateSet, dates, times, ratio, callback);
                                                }],
                                            //callback
                                            function (err, results) {

                                                chooseMajorDefault.chooseMajorDefault(results, dates, times, budget, responseFunction);

                                            });


                                        function responseFunction(model) {
                                            if (model == null) {
                                                tripNotPossibleResponse(res);
                                            }
                                            else {
                                                console.log('In show routes');
                                                model.userTotalbudget = budget;
                                                model.numPeople = numPeople;
                                                model.tastes = tastes;
                                                model.dateSet = dateSet;
                                                //console.log("budget: "+budget);
                                                res.json(model);
                                            }

                                            //Updating and saving the saveObject
                                            saveObject.state = 3;
                                            saveObject.routesData = model;
                                            redisClient.set(itineraryID, JSON.stringify(saveObject), function(err){
                                                if (err){
                                                    console.log('Error in setting itinerary:'+err);
                                                }
                                                else {
                                                    console.log('Successfully set');
                                                }
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        });
        //var cities=req.param('cities').split(',');
        //var startDate=req.param("startDate");
        //var endDate=req.param("endDate");

        //var startTime=req.param("startTime");
        //var endTime=req.param("endTime");
        //var numPeople=req.param("numP");
        //var budget = req.param("budget");

        //var cityIDs=req.param("cityIDs").split(',');

        //var tastes =JSON.parse(req.param('tastes'));

        //console.log('In show routes');
        //console.log(startDate.getDay()+","+endDate+","+"stTime:"+startTime.morning);
	});
};


