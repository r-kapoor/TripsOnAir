'use strict';

var IndexModel = require('../models/places');
var getDistanceMatrix = require('../lib/getDistanceMatrix');
var getConnectivity = require('../lib/getConnectivity');
var getCityID = require('../lib/getCityID');
var tsp = require('../lib/tsp');

module.exports = function (app) {

    /**
     * Display the places
     */
    app.get('/getOptimizeOrder', function (req, res) {
    	
    	console.log("in get");
    
    	var origin=req.param("o");
    	var startDate=req.param("startDate");
    	var endDate=req.param("endDate");
    	var destinations=req.param("dsts");
    	var budget=req.param("budget");
    	
        origin= JSON.parse(origin).name.toUpperCase();
        var destinationsArray=[];
        
        destinations=destinations.split(";");
        for(var i=0;i<destinations.length;i++)
        {
            destinationsArray.push(JSON.parse(destinations[i]).name.toUpperCase());
        }
    	console.log("destinations:"+destinations);
    	console.log("startDate:"+startDate);
    	
        var cities = [];
    	cities.push(origin);
    	cities = cities.concat(destinationsArray);
    	console.log('cities:'+cities);
    	var async  = require('async');
    	async.parallel([
    	                function (callback){
    	                	getDistanceMatrix.getDistanceMatrix(cities, callback);
    	                }
    	                ,
    	                function(callback){
    	                	getCityID.getCityID(cities, function(err, cityIDs) {
        	                	if(err)
        	                	{
        	                		throw err;
        	                	}
        	                	getConnectivity.getConnectivity(cities, cityIDs, callback);
        	                });
    	                }
    	            ],
    	            //callback
    	            function(err, results) {
    					tsp.getOrderUsingTsp(err, results, function(tripOrder, originName, originID, weight, cities, cityIDs, minWeight){
    				    	var model = new IndexModel(tripOrder, originName, originID, weight, cities, cityIDs, minWeight);
    				    	//res.render('places', model);
    				    	res.json(model);
    						});
    				});    	  
    });

    
    /**
     * store the session variables
     */
    app.post('/places', function (req, res) {
    	res.redirect('/places');
    });

};