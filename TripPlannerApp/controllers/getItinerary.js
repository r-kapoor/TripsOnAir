'use strict';

var conn = require('../lib/database');
var getDestinationsAndStops = require('../lib/getDestinationsAndStops');
var isHotelRequired=require('../lib/isHotelRequired');

module.exports = function(app) {

	app.get('/planItinerary', function(req, res) {

		var travelData=JSON.parse(req.session.travelData);
		//console.log("-----------Got data from session-------------\n"+JSON.stringify(JSON.parse(travelData).withTaxiRome2rioData));

		if(travelData.withTaxiRome2rioData.isMajorDefault==1)
		{
			travelData=travelData.withTaxiRome2rioData;
		}
		else
		{
			travelData=travelData.withoutTaxiRome2rioData;	
		}	

		var destinationsAndStops=getDestinationsAndStops.getDestinationsAndStops(travelData);			
		isHotelRequired.isHotelRequired(destinationsAndStops);
		
			for(var i=0;i<destinationsAndStops.destinations.length;i++)
			{
				console.log("destinations:"+JSON.stringify(destinationsAndStops.destinations[i]));
				console.log("stops:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[i]));
			}
			console.log("LastStop:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[destinationsAndStops.destinationsWiseStops.length-1]));
	});
}