'use strict';

var conn = require('../lib/database');
var getDestinationsAndStops = require('../lib/getDestinationsAndStops');
var isHotelRequired=require('../lib/isHotelRequired');
var getHotelData=require('../lib/getHotelData');
var getOrderedPlaces= require('../lib/getOrderedPlaces');
var async  = require('async');
var clone= require('../lib/UtilityFunctions/cloneJSON');
module.exports = function(app) {

	app.get('/planItinerary', function(req, res) {

		var connection=conn.conn();
		connection.connect();
		var travelData=JSON.parse(req.session.travelData);
		//console.log("-----------Got data from session-------------\n"+JSON.stringify(JSON.parse(travelData).withTaxiRome2rioData));
		var numOfPeople = travelData.numPeople;
		var totalBudget=travelData.userTotalbudget;
		var tastes  = travelData.tastes;
		if(travelData.withTaxiRome2rioData.isMajorDefault==1)
		{
			travelData=travelData.withTaxiRome2rioData;
		}
		else
		{
			travelData=travelData.withoutTaxiRome2rioData;	
		}	

		var destinationsAndStops=getDestinationsAndStops.getDestinationsAndStops(travelData);
		var destinationsForPlaces=clone.clone(destinationsAndStops);
		isHotelRequired.isHotelRequired(destinationsAndStops);
		
			for(var i=0;i<destinationsAndStops.destinations.length;i++)
			{
				console.log("destinations:"+JSON.stringify(destinationsAndStops.destinations[i]));
				console.log("stops:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[i]));
			}
			console.log("LastStop:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[destinationsAndStops.destinationsWiseStops.length-1]));

			
async.parallel(
			[
				function hotelDataIfHotelRequired(hotelDataCallback){
					if(destinationsAndStops.numOfCitiesWhereHotelRequired>0)
					{
						console.log("TotalUserBudget:"+totalBudget);
						var hotelBudget=(totalBudget-travelData.TravelBudget)/2;
						getHotelData.getHotelData(destinationsAndStops,hotelBudget, numOfPeople,connection,hotelDataCallback);
					}
				},
				function placesData(placesDataCallback){
						getOrderedPlaces.getOrderedPlaces(destinationsForPlaces,tastes,connection,placesDataCallback);

										}
			],
	        //callback
            function(err, results) {

            });

	});//app.get
}