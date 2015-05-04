/**
 * Created by rkapoor on 02/05/15.
 */
'use strict';

var getItineraryPDF = require('../lib/getItineraryPDF');
module.exports = function(app) {

    app.post('/downloadItinerary', function(req, res) {
        console.log('downloadItinerary called');

        process.on('uncaughtException', function(err) {
            console.log(err.stack);
        });

        var travelData;
        if(req.session == undefined){
            console.log("req.session is undefined");
        }
        if(req.session.travelData != undefined){
            if(typeof req.session.travelData === 'object'){
                travelData = req.session.travelData;
            }
            else {
                travelData=JSON.parse(req.session.travelData);
            }
            var itineraryData = req.param('data');
            if(itineraryData != undefined){
                var itineraryPDF = getItineraryPDF.getItineraryPDF(travelData, itineraryData);
                req.session.travelData=travelData;
                res.json({success:true});
            }
            else {
                console.log("itineraryData is undefined");
                res.json({success:false});
            }
        }
        else{
            console.log("travelData is undefined");
            res.json({success:false});
        }

    });//app.get
};
