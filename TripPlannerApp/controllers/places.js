'use strict';

var IndexModel = require('../models/places');

module.exports = function (app) {

    /**
     * Display the places
     */
    app.get('/places', function (req, res) {
    	
    	console.log("in get");
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