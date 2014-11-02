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
    app.get('/places', function (req, res) {
    	
    	console.log("in get");
    
    	var origin=req.param("o");
    	var startDate=req.param("stD");
    	var endDate=req.param("enD");
    	var tastes=req.param("tst");
    	var destinations=req.param("dsts");
    	var budget=req.param("bdg");
    	var type=req.param("type");
    	
    	origin = origin.toUpperCase();
    	console.log("tastes:"+tastes);
    	console.log("destinations:"+destinations);
    	
    	destinations = destinations.split(",");
    	var cities = [];
    	cities.push(origin);
    	cities = cities.concat(destinations);
    	
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