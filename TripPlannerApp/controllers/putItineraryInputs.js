/**
 * Created by rkapoor on 24/08/15.
 */

var getClient = require('../lib/UtilityFunctions/redisConnection');

module.exports=function (app) {

    app.put('/putItineraryInputs/:itineraryID', function (req, res) {

        var itinerary = req.body;
        var itineraryID = req.params.itineraryID;

        console.log(JSON.stringify(itinerary));
        console.log(itineraryID);

        var redisClient = getClient.getClient();

        var saveObject = {
            inputs:itinerary,
            state: 1//The 1st and 2nd form information set
        };

        redisClient.set(itineraryID, JSON.stringify(saveObject), function(err){
            if (err){
                console.log('Error in setting itinerary:'+err);
            }
            else {
                res.json({
                    itineraryID: itineraryID
                });
            }
        });
    });
};
