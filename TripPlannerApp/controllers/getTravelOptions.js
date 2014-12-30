'use strict';

module.exports = function (app) {

    /**
     * Render the second page
     */
    app.get('/getTravelOptions', function (req, res) {
    	
    	console.log("in get travel options");
    	
    	//var model = new getTravelOptionsModel();
    	//res.render('getTravelOptions', model);
    	res.sendfile('./public/templates/layouts/travelPage/getTravelOptions.html');
    	/*var origin=req.param("o");
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
    					tsp.getOrderUsingTsp(err, results, function(tripOrder, originName, originID){
    				    	var model = new IndexModel(tripOrder, originName, originID);
    				    	res.render('places', model);
    						});
    				});
    	*/
    	  
    });

    
    /**
     * store the session variables
     */
    app.post('/getOptimizeOrder', function (req, res) {
    	res.redirect('/getOptimizeOrder');
    });

};