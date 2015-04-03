'use strict';

module.exports = function(app) {

	app.post('/showPlacesAndHotels', function(req, res) {

		console.log("TravelData called");
		var travelData=req.param('travelData');
        console.log(travelData);
 		req.session.travelData=travelData;
 		res.sendfile('./public/templates/layouts/hotelsAndPlacesPage/hotelsAndPlacesIndex.html');
	});

}
