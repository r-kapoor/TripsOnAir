'use strict';

var conn = require('../lib/database');
var IndexModel = require('../models/index');
var getCity = require('../lib/getCities');
var getGroup = require('../lib/getGroups');
var getRange= require('../lib/getRange');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/suggestDest',function(req,res)
	{console.log("dest");
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
		getCity.getCityList(conn,origin,taste,range, start, batchsize,function(City){
		 var model =
          {
              CityList: City
          };

		res.render('city', model);
			});
		});
	});
	
	app.get('/suggestGroups',function(req,res)
	{
		console.log("groups");
		getGroup.getGroupList(conn,function(Group){
		var model =
	      {
			 GroupList: Group
	      };

			res.render('group', model);
				});
	});
}