/**
 * Created by rkapoor on 21/09/15.
 */
var conn = require('../../lib/database');
function getCrawledPlaceDetails(placeID, callback)
{
    console.log("getCrawledPlaceDetails called");
    var connection=conn.conn('Holiday', 'openshift');
    connection.connect();

    var queryString = 'SELECT Type,Taste,Name,a.PlaceID,Address,PinCode,PhoneNo,CityID,Description,Score,ScoreSources,' +
        'Website,Latitude,Longitude,Time2Cover,UnescoHeritage,Timing_ID, TimeStart, TimeEnd, ' +
        'Days, ChildCharge, AdultCharge, ForeignerCharge FROM ' +
        '(SELECT * FROM Places_Crawl WHERE PlaceID = '+connection.escape(placeID)+') a ' +
        'LEFT JOIN ' +
        '(SELECT * FROM PlaceTimings_Crawl) b ' +
        'ON (a.PlaceID = b.PlaceID)' +
        'LEFT JOIN ' +
        '(SELECT * FROM Place_Charges_Crawl) c ' +
        'ON (b.PlaceID = c.PlaceID)';

    console.log("getCrawledPlaceDetails query:"+queryString);
    connection.query(queryString, function(err, rows, fields) {
        if (err)
        {
            throw err;
        }
        else{
            var placeTimings = [];
            for(var i in rows){
                placeTimings.push({
                    TimingID:rows[i].Timing_ID,
                    TimeStart:rows[i].TimeStart,
                    TimeEnd:rows[i].TimeEnd,
                    Days:rows[i].Days
                });
            }
            if(rows[0] != undefined){
                rows[0].PlaceTimings = placeTimings;
                rows[0].NumberOfImages = 1;
            }
            callback(rows[0]);
        }
    });
    connection.end();
}

module.exports.getCrawledPlaceDetails=getCrawledPlaceDetails;
