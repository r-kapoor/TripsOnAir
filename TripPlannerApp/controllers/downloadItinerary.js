/**
 * Created by rkapoor on 02/05/15.
 */
'use strict';

var getItineraryPDF = require('../lib/getItineraryPDF');
var fs = require("fs");
var getClient = require('../lib/UtilityFunctions/redisConnection');
module.exports = function(app) {

    app.post('/downloadItinerary/:itineraryID', function(req, res) {
        console.log('downloadItinerary called');
        var itineraryData = req.body;
        var itineraryID = req.params.itineraryID;

        process.on('uncaughtException', function(err) {
            console.log(err.stack);
        });

        var redisClient = getClient.getClient();

        redisClient.get(itineraryID, function(err, itinerary) {
            if (err || itinerary == null) {
                if (err) {
                    console.log('Error in getting itinerary:' + err);
                }
                res.status(400).json({error: 'Itinerary ID Invalid'})
            }
            else {
                var saveObject = JSON.parse(itinerary);
                var travelData = saveObject.routesData;
                itineraryData = itineraryData.data;
                    if(itineraryData != undefined || travelData!=undefined){
                        getItineraryPDF.getItineraryPDF(travelData, itineraryData, function returnPDF(itineraryPDF, fileName){
                            res.setHeader('Content-disposition', 'attachment; filename='+fileName);
                            res.json({success:true, file:itineraryPDF});

                        });
                    }
                    else {
                        console.log("itineraryData or travelData is undefined");
                        res.json({success:false});
                    }
            }
        });
    });//app.get
};
