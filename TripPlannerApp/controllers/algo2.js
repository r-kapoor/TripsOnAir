'use strict';

/**
 * @author rajat Backend functions for Algo2
 */

var conn = require('../lib/database');
var IndexModel = require('../models/index');
var getCity = require('../lib/getCities');
var getGroup = require('../lib/getGroups');
var getRange = require('../lib/getRange');
var getNearbyCity = require('../lib/getNearbyCities');
var tasteObjectToInteger = require('../lib/UtilityFunctions/tasteObjectToInteger');

module.exports = function(app) {

	var model = new IndexModel();

	app.get('/suggestDest', function(req, res) {
		var orgLat = req.param('orgLat');
		var orgLong = req.param('orgLong');
		var startDate=req.param('startDate');
        var endDate=req.param('endDate');
        var endTime=req.param('endTime');
        var startTime=req.param('startTime');
		var tastes = req.param('tastes');
		var budget = req.param('budget');
        var batchsize = parseInt(req.param('batchsize'));
		var start = parseInt(req.param('next'));
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        startTime = JSON.parse(startTime);
        endTime = JSON.parse(endTime);
        tastes = JSON.parse(tastes);
        var  tastes=tasteObjectToInteger.tasteObjectToInteger(tastes);

        console.log(startDate.getDay()+","+endDate+","+"stTime:"+startTime.morning+","+tastes);
		// Get the range of travel according to user budget and number of days
		getRange.getRange(budget, startDate, startTime, endDate, endTime, function(range) {
			console.log('range ' + range);
			getCity.getCityList(conn, orgLat, orgLong, tastes, range, start, batchsize, function(City) {
				var model = {
					CityList: City,
					orgLat: orgLat,
					orgLong: orgLong,
					range: range
				};
				// res.render('city', model);
				res.json(model);
			});
		});
	});

	app.get('/suggestGroups', function(req, res) {
		var orgLat = req.param('orgLat');
		var orgLong = req.param('orgLong');
        var startDate=req.param('startDate');
        var endDate=req.param('endDate');
        var endTime=req.param('endTime');
        var startTime=req.param('startTime');
        var tastes = req.param('tastes');
		var budget = req.param('budget');
		var batchsize = parseInt(req.param('batchsize'));
		var start = parseInt(req.param('next'));
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        startTime = JSON.parse(startTime);
        endTime = JSON.parse(endTime);
        tastes = JSON.parse(tastes);
        var  tastes=tasteObjectToInteger.tasteObjectToInteger(tastes);

		getRange.getRange(budget, startDate, startTime, endDate, endTime, function(range) {
			getGroup.getGroupList(conn, orgLat, orgLong, tastes, range, start, batchsize, function(groupRows) {
				var model = {
					GroupList: groupRows,
                    orgLat: orgLat,
                    orgLong: orgLong,
                    range: range
				};
				// res.render('group', model);
				res.json(model);
			});
		});
	});

	app.get('/suggestNearbyDest', function(req, res) {
        var destinations = req.param('destinations');
		var orgLat = req.param('orgLat');
		var orgLong = req.param('orgLong');
		var tastes = req.param('tastes');
		var batchsize = 4;
		var start = parseInt(req.param('next'));
		var distRemaining = req.param('distRemaining');
        var requestId = req.param('requestId');
        console.log("Dest:"+destinations);
        //var destinationsArray = destinations.split(',');
        //destinations = [];
        /*for(var i = 0; i < destinationsArray.length; i++) {
            destinations[i] = JSON.parse(destinationsArray[i]);
        }*/
        if(Array.isArray(destinations)) {
            destinations = destinations.map(JSON.parse);
        }
        else {
            var destination = JSON.parse(destinations);
            destinations = [];
            destinations.push(destination);
        }

        if(tastes != undefined){
            tastes = JSON.parse(tastes);
            tastes=tasteObjectToInteger.tasteObjectToInteger(tastes);
        }
        else {
            tastes=tasteObjectToInteger.tasteObjectToInteger({});
        }

		getNearbyCity.getNearbyCityList(conn, destinations, orgLat, orgLong, tastes,
				distRemaining, start, batchsize, function(nearbyCityRows) {
					var model = {
						NearbyCityList: nearbyCityRows,
                        requestId: requestId
					};
					// res.render('group', model);
					res.json(model);
				});
	});
};
