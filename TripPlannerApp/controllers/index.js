'use strict';


var IndexModel = require('../models/index');


module.exports = function (app) {

    var model = new IndexModel();


    app.get('/', function (req, res) {
        res.render('index', model);
        
    });

    app.get('/test',function(req,res){
    	res.render('test',model);
    	console.log("testing");
    });
};