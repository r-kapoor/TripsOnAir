/**
 * Created by rkapoor on 14/09/15.
 */
var getClient = require('../lib/UtilityFunctions/redisConnection');
var clone = require('../lib/UtilityFunctions/cloneJSON');

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

                console.log('ROUTES DATA COMING:'+JSON.stringify(routesData));
                console.log('ROUTES DATA PRESENT:'+JSON.stringify(saveObject.routesData));

                //Updating the changes done by user in routes data and maintaining the other route
                saveObject.routesData = checkAndFixRouteData(saveObject.routesData, routesData);

                console.log('ROUTES DATA SAVING NOW:'+JSON.stringify(saveObject.routesData));

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

function checkAndFixRouteData(presentRouteData, incomingRouteData){
    if((presentRouteData.withTaxiRome2rioData == null || presentRouteData.withTaxiRome2rioData == undefined) || (presentRouteData.withoutTaxiRome2rioData == null || presentRouteData.withoutTaxiRome2rioData == undefined)){
        //Only one route is valid. Nothing to be done
        console.log('1');
        return incomingRouteData;
    }
    else {
        console.log('2');
        var presentRouteDataClone = clone.clone(presentRouteData);
        if(incomingRouteData.withTaxiRome2rioData == undefined){
            console.log('3');
            incomingRouteData.withTaxiRome2rioData = presentRouteDataClone.withTaxiRome2rioData;
            incomingRouteData.withTaxiRome2rioData.isMajorDefault = 0;
            incomingRouteData.withoutTaxiRome2rioData.isMajorDefault = 1;
        }
        else if(incomingRouteData.withoutTaxiRome2rioData == undefined){
            console.log('4');
            incomingRouteData.withoutTaxiRome2rioData = presentRouteDataClone.withoutTaxiRome2rioData;
            incomingRouteData.withoutTaxiRome2rioData.isMajorDefault = 0;
            incomingRouteData.withTaxiRome2rioData.isMajorDefault = 1;
        }
        return clone.clone(incomingRouteData);
    }
}
