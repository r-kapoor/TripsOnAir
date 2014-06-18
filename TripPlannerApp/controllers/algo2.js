'use strict';

var conn = require('../lib/database');
var IndexModel = require('../models/index');
var getCity = require('../lib/getCities');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/suggestDest',function(req,res)
	{
		var origin=req.param('origin');
		var numDays = req.param('numDays');
		var taste = req.param('taste');
		var budget = req.param('budget');

		/**
		 * write algo 2
		 */
		var start = 0;
		var batchsize = 30;
		getCity.getCityList(conn, taste, start, batchsize);		
		
		model.layout = 'test';
		res.render('index', model);
		//console.log("testing"+test);

	});
}