'use strict';

/**
 *@author rajat
 * Backend functions for Algo2
 */

var conn = require('../lib/database');
var IndexModel = require('../models/index');
var getCity = require('../lib/getCities');
var getGroup = require('../lib/getGroups');
var getRange= require('../lib/getRange');
var getNearbyCity = require('../lib/getNearbyCities');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/suggestDest',function(req,res)
	{
		var orgLat=req.param('orgLat');
		var orgLong=req.param('orgLong');
		var numDays = req.param('numDays');
		var taste = req.param('taste');
		var budget = req.param('budget');
		var batchsize = 5;
		var start=parseInt(req.param('next'));
		//Get the range of travel according to user budget and number of days
		getRange.getRange(budget,numDays,function(range){
			console.log("range "+range);
			getCity.getCityList(conn,orgLat,orgLong,taste,range, start, batchsize,function(City){
			var model =
	          {
	              CityList: City,
	              orgLat: orgLat,
	              orgLong:orgLong,
	              range:range
	          };
		//res.render('city', model);
			res.json(model);
			});
		});
	});
	
	app.get('/suggestGroups',function(req,res)
	{
		var orgLat=req.param('orgLat');
		var orgLong=req.param('orgLong');
		var numDays = req.param('numDays');
		var taste = req.param('taste');
		var budget = req.param('budget');
		var batchsize = 5;
		var start=parseInt(req.param('next'));
		getRange.getRange(budget,numDays,function(range){
			getGroup.getGroupList(conn,orgLat,orgLong,taste,range,start,batchsize,function(groupRows){
			var model =
		      {
				 GroupList: groupRows
		      };
			//res.render('group', model);
			res.json(model);
				});
		});
	});
	
	app.get('/suggestNearbyDest',function(req,res)
	{
		var selectedIDs=req.param('selectedIDs');
		var selectedLats=req.param('selectedLats');
		var selectedLongs = req.param('selectedLongs');
		var orgLat = req.param('orgLat');
		var orgLong = req.param('orgLong');
		var taste = req.param('taste');
		var batchsize = 5;
		var start=parseInt(req.param('next'));
		var distRemaining = req.param('distRemaining');
		getNearbyCity.getNearbyCityList(conn,selectedIDs,selectedLats,selectedLongs,orgLat,orgLong,taste,distRemaining,start,batchsize,function(nearbyCityRows){
		var model =
	      {
			 NearbyCityList: nearbyCityRows
	      };
		//res.render('group', model);
		res.json(model);
		});
	});
}