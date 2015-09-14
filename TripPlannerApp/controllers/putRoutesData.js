/**
 * Created by rkapoor on 14/09/15.
 */
var getClient = require('../lib/UtilityFunctions/redisConnection');

module.exports=function (app) {

    app.put('/putRoutesData/:itineraryID', function (req, res) {

        var routesData = req.body;
        var itineraryID = req.params.itineraryID;

        console.log(itineraryID);

        var redisClient = getClient.getClient();

        redisClient.get(itineraryID, function(err, itinerary) {
            if (err || itinerary == null) {
                if(err){
                    console.log('Error in getting itinerary:' + err);
                }
                res.status(400).json({error: 'Itinerary ID Invalid'})
            }
            else {
                var saveObject = JSON.parse(itinerary);
                saveObject.state = 4;
                saveObject.routesData = routesData; //Updating the changes done by user in routes data

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
            }
        });
    });
};
