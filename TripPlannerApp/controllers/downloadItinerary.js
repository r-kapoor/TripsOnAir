/**
 * Created by rkapoor on 02/05/15.
 */
'use strict';

var getItineraryPDF = require('../lib/getItineraryPDF');
module.exports = function(app) {

    app.post('/downloadItinerary', function(req, res) {
        console.log('downloadItinerary called');

        var travelData=JSON.parse(req.session.travelData);

        var itineraryData = req.param('data');
        //console.log(travelData);

        getItineraryPDF.getItineraryPDF(travelData, itineraryData);


        //console.log("-----------Got data from session-------------\n"+JSON.stringify(JSON.parse(travelData).withTaxiRome2rioData));
        res.json({success:true});
    });//app.get
};
