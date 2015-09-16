/**
 * Created by rkapoor on 17/09/15.
 */
var generatePermalink = require('../lib/generatePermalink');

function updateItinerary(connection,data,permalinkID,callback)
{
    var query = 'UPDATE Itinerary_JSON SET JSON = '+connection.escape(JSON.stringify(data))+' WHERE ItineraryID = '+permalinkID+';';

    connection.query(query, function(err, result) {
        if (err) {
            console.log('ERROR inserting data:'+err);
        }
        console.log('Updates Itinerary');

        generatePermalink.generatePermalink(permalinkID, callback);
    });
}

module.exports.updateItinerary = updateItinerary;
