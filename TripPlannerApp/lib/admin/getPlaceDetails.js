/**
 * Created by rkapoor on 27/03/15.
 */
var conn = require('../../lib/database');
//An array of CityNames can be passed. The corresponding cityids will be passed to the callback. -1 Indicates not found
function getPlaceDetails(placeID, callback)
{
    console.log("getPlaceDetails called");
    var connection=conn.conn();
    connection.connect();

    var queryString = 'SELECT Type,Taste,Name,a.PlaceID,Address,PinCode,PhoneNo,CityID,Description,Score,ScoreSources,' +
        'Broad_Category,Website,Latitude,Longitude,Time2Cover,UnescoHeritage,Ixigo,TripAdvisor,Timing_ID, TimeStart, TimeEnd, ' +
        'Days, ChildCharge, AdultCharge, ForeignerCharge FROM ' +
        '(SELECT * FROM Places WHERE PlaceID = '+connection.escape(placeID)+') a ' +
        'LEFT JOIN ' +
        '(SELECT * FROM PlaceTimings) b ' +
        'ON (a.PlaceID = b.PlaceID)' +
        'LEFT JOIN ' +
        '(SELECT * FROM Place_Charges) c ' +
        'ON (b.PlaceID = c.PlaceID)';

    console.log("getPlaceDetails query:"+queryString);
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
            rows[0].PlaceTimings = placeTimings;
            callback(rows[0]);
        }
    });
    connection.end();
}

module.exports.getPlaceDetails=getPlaceDetails;
