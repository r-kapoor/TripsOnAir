'use strict';


var IndexModel = require('../models/index');
var tsp = require('../lib/tsp');


module.exports = function (app) {

    var model = new IndexModel();


    app.get('/', function (req, res) {
        res.render('index', model);
        
    });

    app.get('/test',function(req,res){
    	res.render('test',model);
    	console.log("testing");
    });
    
    app.get('/tsp',function(req,res){
    	res.render('test',model);
    	console.log("testing TSP");
    	
    	tsp.getOrderUsingTsp();
    });
    

    app.get('/poptest',function(req,res){
    	res.render('popTest',model);
    	console.log("UI code");
    });
};