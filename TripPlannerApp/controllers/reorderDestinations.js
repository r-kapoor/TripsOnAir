/**
 * Created by rkapoor on 05/09/15.
 */

var getClient = require('../lib/UtilityFunctions/redisConnection');

module.exports=function (app) {

    app.put('/reorderDestinations/:itineraryID', function (req, res) {

        var fromIndex = req.body.fromIndex;
        var toIndex = req.body.toIndex;

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
                console.log(itinerary);
                itinerary = JSON.parse(itinerary);

                //Updating the information in save object
                var destinationCities = itinerary.inputs.destinationCities;

                var temp = destinationCities[toIndex];
                destinationCities[toIndex] = destinationCities[fromIndex];
                destinationCities[fromIndex] = temp;

                var weight = itinerary.orderData.weight;
                temp = weight[toIndex];
                weight[toIndex] = weight[fromIndex];
                weight[fromIndex] = temp;

                for(var i = 0; i < weight.length; i++){
                    temp = weight[i][toIndex];
                    weight[i][toIndex] = weight[i][fromIndex];
                    weight[i][fromIndex] = temp;
                }

                redisClient.set(itineraryID, JSON.stringify(itinerary), function (err) {
                    if (err) {
                        console.log('Error in setting itinerary:' + err);
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
