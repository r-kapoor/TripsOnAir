/**
 * Created by rkapoor on 30/08/15.
 */
var getClient = require('../lib/UtilityFunctions/redisConnection');

module.exports=function (app) {

    app.get('/getItineraryInputs/:itineraryID', function (req, res) {

        var itineraryID = req.params.itineraryID;

        console.log(itineraryID);

        var redisClient = getClient.getClient();

        redisClient.get(itineraryID, function(err, itinerary){
            if (err || itinerary == null) {
                if(err){
                    console.log('Error in getting itinerary:' + err);
                }
                res.status(400).json({error: 'Itinerary ID Invalid'})
            }
            else {
                itinerary = JSON.parse(itinerary);
                var itineraryInputs = itinerary.inputs;
                if(itineraryInputs != undefined){
                    res.json(itineraryInputs);
                }
                else {
                    res.status(400).json({ error: 'Invalid Itinerary Set' })
                }
            }
        });
    });
};
