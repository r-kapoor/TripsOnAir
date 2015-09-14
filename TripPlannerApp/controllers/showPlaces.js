'use strict';

module.exports = function(app) {

	app.get('/showPlacesAndHotels/:itineraryID', function(req, res) {

		console.log("TravelData called");
        //console.log(travelData);
 		res.sendfile('./public/templates/layouts/hotelsAndPlacesPage/hotelsAndPlacesIndex.html');
	});

}
