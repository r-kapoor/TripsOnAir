'use strict';


var IndexModel = require('../models/index');
var tsp = require('../lib/tsp');


module.exports = function (app) {

    var model = new IndexModel();


    app.get('/', function (req, res) {
        //res.render('index', model);
        res.sendfile('./public/templates/index.html');

    });

    app.get('/old',function(req,res){
    	res.render('index',model);
    	console.log("testing");
    });

    app.get('/test',function(req,res){
    	res.render('angularTest',model);
    	console.log("testing");
    });

    app.get('/map', function(req, res) {
        res.sendfile('./public/templates/layouts/travelPage/map.html');
    });

    app.get('/ang',function(req,res){
        res.render('normalApp',model);
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

    app.get('/rome2rio', function (req, res) {
        res.render('rome2rio', model);

    });

};
