'use strict';

var IndexModel = require('../models/places');
var getDistanceMatrix = require('../lib/getDistanceMatrix');


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
    	
    	console.log("tastes:"+tastes);
    	console.log("destinations:"+destinations);
    	
    	var responseData = getDistanceMatrix.getDistanceMatrix(destinations.split("+"));
    	 //TODO : separate destinations and pass array into functions
    	//var connectivity = connectivity(destinations);
    	
    	var async  = require('async');
    	

    	var model = new IndexModel();
    	res.render('places', model);
    	  
    });

    
    /**
     * store the session variables
     */
    app.post('/places', function (req, res) {    	
    	console.log("in post");
    	var budget=req.param('budget');
  	  	//console.log("budget "+budget);
  	  	var category=req.param('cc');
  	  	console.log("category "+category);
    	res.redirect('/places?test='+12);
    	
    });

};