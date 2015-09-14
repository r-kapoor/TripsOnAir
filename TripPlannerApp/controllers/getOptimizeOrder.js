'use strict';

var IndexModel = require('../models/places');
var getDistanceMatrix = require('../lib/getDistanceMatrix');
var getConnectivity = require('../lib/getConnectivity');
var getCityID = require('../lib/getCityID');
var tsp = require('../lib/tsp');
var getClient = require('../lib/UtilityFunctions/redisConnection');

module.exports = function (app) {

    /**
     * Display the places
     */
    app.get('/getOptimizeOrder/:itineraryID', function (req, res) {

        var itineraryID = req.params.itineraryID;

        console.log(itineraryID);

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
                if(state > 1){
                    //The Altered order has already been submitted by user
                    //No need to optimize the order, the same order to be returned
                    console.log('State:'+state);
                    var model = new IndexModel(saveObject.inputs.destinationCities, saveObject.inputs.originCity, saveObject.orderData.weight, saveObject.orderData.minWeight);
                    res.json(model);

                    //Updating the save object
                    if(saveObject.state != 2){
                        saveObject.state = 2;
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
                else {
                    //The order needs to be optimized
                    console.log('State:'+state);
                    var origin=itinerary.originCity;
                    var startDate=itinerary.startDate;
                    var endDate=itinerary.endDate;
                    var destinationsArray=itinerary.destinationCities;
                    var budget=itinerary.budget;


                    origin.CityName=origin.CityName.toUpperCase();
                    for(var i=0;i<destinationsArray.length;i++)
                    {
                        destinationsArray[i].CityName=destinationsArray[i].CityName.toUpperCase();
                    }

                    var cities = [];
                    cities.push(origin);
                    cities = cities.concat(destinationsArray);

                    var async  = require('async');
                    async.parallel([
                            function (callback){
                                getDistanceMatrix.getDistanceMatrix(cities, callback);
                            }
                            ,
                            function(callback){
                                //getCityID.getCityID(cities, function(err, cityIDs) {
                                //if(err)
                                //{
                                //	throw err;
                                //}
                                getConnectivity.getConnectivity(cities, callback);
                                //});
                            }
                        ],
                        //callback
                        function(err, results) {
                            tsp.getOrderUsingTsp(err, results, function(tripOrder,origin,weight,minWeight,cityIDs){
                                console.log("cityIDs:"+cityIDs);
                                var model = new IndexModel(tripOrder, origin,weight, minWeight,cityIDs);
                                //res.render('places', model);
                                res.json(model);

                                //Updating the save object in redis
                                saveObject.inputs.destinationCities = tripOrder;
                                saveObject.state = 2;
                                saveObject.orderData = {
                                    minWeight: minWeight,
                                    weight: weight
                                };
                                redisClient.set(itineraryID, JSON.stringify(saveObject), function(err){
                                    if (err){
                                        console.log('Error in setting itinerary:'+err);
                                    }
                                    else {
                                        console.log('Successfully set');
                                    }
                                });
                            });
                        });
                }
            }
        });

        //var origin=req.param("o");
        //var startDate=req.param("startDate");
        //var endDate=req.param("endDate");
        //var destinations=req.param("dsts");
        //var budget=req.param("budget");

        //origin= JSON.parse(origin);
        //origin.CityName=origin.CityName.toUpperCase();
        //var destinationsArray=[];

        //destinations=destinations.split(";");
        //for(var i=0;i<destinations.length;i++)
        //{
        //    destinations[i] = JSON.parse(destinations[i]);
        //    destinations[i].CityName=destinations[i].CityName.toUpperCase();
        //    destinationsArray.push(destinations[i]);
        //}
        //console.log("destinations:"+destinations);
        //console.log("startDate:"+startDate);

        //var cities = [];
        //cities.push(origin);
        //cities = cities.concat(destinationsArray);
        //console.log('cities:'+cities);
        //var async  = require('async');
        //async.parallel([
        //                function (callback){
        //                	getDistanceMatrix.getDistanceMatrix(cities, callback);
        //                }
        //                ,
        //                function(callback){
        //                	//getCityID.getCityID(cities, function(err, cityIDs) {
        //                	//if(err)
        //                	//{
        //                	//	throw err;
        //                	//}
        //                	getConnectivity.getConnectivity(cities, callback);
        //                //});
        //                }
        //            ],
        //            //callback
        //            function(err, results) {
        //				tsp.getOrderUsingTsp(err, results, function(tripOrder,origin,weight,minWeight,cityIDs){
        //                   console.log("cityIDs:"+cityIDs);
        //			    	var model = new IndexModel(tripOrder, origin,weight, minWeight,cityIDs);
        //			    	//res.render('places', model);
        //			    	res.json(model);
        //					});
        //			});
    });


    /**
     * store the session variables
     */
    app.post('/places', function (req, res) {
        res.redirect('/places');
    });

};
