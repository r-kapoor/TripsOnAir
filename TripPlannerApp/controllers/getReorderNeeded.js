/**
 * Created by rkapoor on 25/08/15.
 */

var getClient = require('../lib/UtilityFunctions/redisConnection');

module.exports=function (app) {

    app.get('/getReorderNeeded/:itineraryID', function (req, res) {

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
                var destinationList = itinerary.inputs.destinationCities;
                if(destinationList != undefined){
                    if(destinationList.length > 1){
                        res.json({
                            reorderNeeded: true
                        });
                    }
                    else {
                        res.json({
                            reorderNeeded: false
                        });
                    }
                }
                else {
                    res.status(400).json({ error: 'Invalid Itinerary Set' })
                }
            }
        });
    });
};
