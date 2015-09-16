/**
 * Created by rkapoor on 16/09/15.
 */
var generatePermalink = require('../lib/generatePermalink');

function insertItinerary(connection,data,callback)
{
    var query = 'INSERT INTO Itinerary_JSON(ItineraryID, JSON) values(NULL,'+connection.escape(JSON.stringify(data))+');';

    connection.query(query, function(err, result) {
        if (err) {
            console.log('ERROR inserting data:'+err);
        }
        console.log('Inserted with Itinerary ID:' + result.insertId);

        generatePermalink.generatePermalink(parseInt(result.insertId), callback);
    });
}

module.exports.insertItinerary = insertItinerary;
