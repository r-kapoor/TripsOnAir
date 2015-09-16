/**
 * Created by rkapoor on 16/09/15.
 */
var getClient = require('../lib/UtilityFunctions/redisConnection');
var conn = require('../lib/database');
var insertItinerary = require('../lib/insertItinerary');
var updateItinerary = require('../lib/updateItinerary');

module.exports=function (app){
    app.put('/saveItinerary/:itineraryID',function(req,res)
    {
        var itineraryData = req.body;
        var itineraryID = req.params.itineraryID;

        console.log(itineraryID);

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
                saveObject.state = 5;
                saveObject.itineraryData = itineraryData;

                var connection=conn.conn('UserInteraction');
                connection.connect();

                if(saveObject.permalinkID != undefined){
                    //Permalink has already been generated
                    updateItinerary.updateItinerary(connection, saveObject, saveObject.permalinkID, onInsert);
                }
                else {
                    //Permalink has not been generated
                    insertItinerary.insertItinerary(connection, saveObject, onInsert);
                }

                function onInsert(permalink, permalinkID){
                    saveObject.permalinkID = permalinkID;
                    redisClient.set(itineraryID, JSON.stringify(saveObject), function(err){
                        if (err){
                            console.log('Error in setting itinerary:'+err);
                        }
                        else {
                            console.log('Successfully set');
                        }
                    });
                    res.json({
                        itineraryID: itineraryID,
                        permalink: permalink
                    });
                }
            }
        });
    });
};
