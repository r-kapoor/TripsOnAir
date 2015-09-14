/**
 * Created by rkapoor on 23/08/15.
 */

var getClient = require('../lib/UtilityFunctions/redisConnection');
var hashidEncoder =  require('../lib/hashEncoderDecoder');

module.exports=function (app) {

    app.post('/getItineraryID', function (req, res) {

        var itinerary = req.body;
        console.log(JSON.stringify(itinerary));

        var redisClient = getClient.getClient();

        redisClient.incr('itineraryID', function(err, itineraryIDNum) {

            console.log(itineraryIDNum);

            var itineraryID = hashidEncoder.encodeItineraryID(itineraryIDNum);
            console.log(itineraryID);
            var saveObject = {
                inputs:itinerary,
                state: 0//The ID with 1st form information created
            };
            redisClient.set(itineraryID, JSON.stringify(saveObject), function(err){
                if (err){
                    console.log('Error in setting itinerary:'+err);
                }
                else {
                    //redisClient.get(itineraryID, function(err, object){
                    //    console.log('From redis:'+object);
                    //    console.log('Origin:'+JSON.stringify(JSON.parse(object).origin));
                    //});
                    res.json({
                        itineraryID: itineraryID
                    });
                }
            });
        });
    });
};
