'use strict';

var conn = require('../lib/database');
var IndexModel = require('../models/index');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/range',function(req,res)
	{
		var origin=req.param('origin');
		var destination = req.param('destination');
		console.log("origin "+origin);
		console.log("destination "+destination);

		
		/**
		 * write algo 1 that set the budget ranges according to origin and destination
		 */

		model.layout = 'layouts/master/input2';
		res.render('index', model);
		//console.log("testing"+test);

	});
}