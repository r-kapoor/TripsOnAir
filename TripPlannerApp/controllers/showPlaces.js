'use strict';

module.exports = function(app) {

	app.post('/showPlaces', function(req, res) {

		console.log("TravelData called");
		var travelData=req.param('travelData');
 		req.session.travelData=travelData;
 		res.sendfile('./public/templates/layouts/hotelsAndPlacesPage/hotelsAndPlacesIndex.html');
	});

}