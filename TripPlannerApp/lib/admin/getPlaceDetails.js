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
        'Website,Latitude,Longitude,Time2Cover,UnescoHeritage,Timing_ID, TimeStart, TimeEnd, CreditName, CreditURL, ImageURL, ' +
        'Days, ChildCharge, AdultCharge, ForeignerCharge, NumberOfImages,DateID,PlaceStartDate,PlaceEndDate,IsYearRelevant FROM ' +
        '(SELECT * FROM Places WHERE PlaceID = '+connection.escape(placeID)+') a ' +
        'LEFT JOIN ' +
        '(SELECT * FROM PlaceTimings) b ' +
        'ON (a.PlaceID = b.PlaceID) ' +
        'LEFT JOIN ' +
        '(SELECT * FROM Place_Charges) c ' +
        'ON (b.PlaceID = c.PlaceID) ' +
        'LEFT JOIN ' +
        '(SELECT * FROM Place_Images) d ' +
        'ON (c.PlaceID = d.PlaceID) '+
        'LEFT JOIN ' +
        '(SELECT * FROM Place_Dates) e ' +
        'ON (a.PlaceID = e.PlaceID);';

    console.log("getPlaceDetails query:"+queryString);
    connection.query(queryString, function(err, rows, fields) {
        if (err)
        {
            throw err;
        }
        else{
            var placeTimings = [];
            var placeImages = [];
            var placeDates = [];
            var timingIDs = [];
            var imgIDs = [];
            var dateIDs = [];
            for(var i in rows){
                if(timingIDs.indexOf(rows[i].TimingID) == -1){
                    placeTimings.push({
                        TimingID:rows[i].Timing_ID,
                        TimeStart:rows[i].TimeStart,
                        TimeEnd:rows[i].TimeEnd,
                        Days:rows[i].Days
                    });
                    timingIDs.push(rows[i].TimingID);
                }
                if(imgIDs.indexOf(rows[i].ImgID) == -1){
                    placeImages.push({
                        ImgID:rows[i].ImgID,
                        CreditName:rows[i].CreditName,
                        CreditURL:rows[i].CreditURL,
                        ImageURL:rows[i].ImageURL
                    });
                    imgIDs.push(rows[i].ImgID);
                }
                if(dateIDs.indexOf(rows[i].DateID) == -1 && rows[i].DateID!=null){
                    placeDates.push({
                        DateID:rows[i].DateID,
                        PlaceStartDate:rows[i].PlaceStartDate,
                        PlaceEndDate:rows[i].PlaceEndDate,
                        IsYearRelevant:rows[i].IsYearRelevant
                    });
                    dateIDs.push(rows[i].DateID);
                }
            }
            if(rows[0] != undefined){
                rows[0].PlaceTimings = placeTimings;
                rows[0].PlaceImages = placeImages;
                rows[0].PlaceDates = placeDates;
            }
            callback(rows[0]);
        }
    });
    connection.end();
}

module.exports.getPlaceDetails=getPlaceDetails;
