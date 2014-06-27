'use strict';

var conn = require('../lib/database');
var IndexModel = require('../models/index');
var getCity = require('../lib/getCities');
var getRange= require('../lib/getRange');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/suggestDest',function(req,res)
	{
		var origin=req.param('origin');
		var numDays = req.param('numDays');
		var taste = req.param('taste');
		var budget = req.param('budget');
		var next=req.param('next');
		req.session.start = req.session.start || 0;
		if(next==1)
		{
			req.session.start+=5;
		}
		else
		{
			req.session.start=0;
		}

		getRange.getRange(budget,numDays,function(range){
		//console.log("range "+range);
		var start = req.session.start;
		var batchsize = 5;
		getCity.getCityList(conn,origin,taste,range, start, batchsize,function(city){

		 var model =
          {
              cityList: city
          };

		res.render('city', model);
			});
		});
	});
}