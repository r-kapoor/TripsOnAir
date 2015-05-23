/**
 * Created by rkapoor on 21/05/15.
 */
var conn = require('../../lib/database');
//An array of CityNames can be passed. The corresponding cityids will be passed to the callback. -1 Indicates not found
function insertPlaceDetails(placeDetails, callback)
{
    console.log("insertPlaceDetails called");

    //Validating the placeDetails object
    //if(placeDetails.Type == undefined){
    //    placeDetails.Type = null;
    //}
    //if(placeDetails.Name == undefined){
    //    placeDetails.Address
    //}
    var connection=conn.conn();
    connection.connect();

    var placesQueryString = "INSERT INTO Places (Type, Taste, Name, Address, PinCode, PhoneNo, CityID, Description, Score, ScoreSources, Website" +
        ", Latitude, Longitude, Time2Cover, UnescoHeritage)" +
        " VALUES " +
        "("+connection.escape(placeDetails.Type)+
        ","+connection.escape(placeDetails.Taste)+
        ","+connection.escape(placeDetails.Name)+
        ","+connection.escape(placeDetails.Address)+
        ","+connection.escape(placeDetails.PinCode)+
        ","+connection.escape(placeDetails.PhoneNo)+
        ","+connection.escape(placeDetails.CityID)+
        ","+connection.escape(placeDetails.Description)+
        ","+connection.escape(placeDetails.Score)+
        ","+connection.escape(placeDetails.ScoreSources)+
        ","+connection.escape(placeDetails.Website)+
        ","+connection.escape(placeDetails.Latitude)+
        ","+connection.escape(placeDetails.Longitude)+
        ","+connection.escape(placeDetails.Time2Cover)+
        ","+connection.escape(placeDetails.UnescoHeritage)+
        ");";

    console.log("InsertPlaceDetails query:"+placesQueryString);

    connection.beginTransaction(
        function(err) {
            if (err) {
                throw err;
            }
            connection.query(placesQueryString, function(err, placeResult) {
                if (err) {
                    connection.rollback(function() {
                        throw err;
                    });
                }

                console.log('Inserted with Place ID:' + placeResult.insertId);

                var chargesQueryString = 'INSERT INTO Place_Charges (PlaceID, ChildCharge, AdultCharge, ForeignerCharge) VALUES ('+
                    placeResult.insertId+
                    ','+connection.escape(placeDetails.ChildCharge)+
                    ','+connection.escape(placeDetails.AdultCharge)+
                    ','+connection.escape(placeDetails.ForeignerCharge)+
                    ');';

                console.log("InsertCharges query:"+chargesQueryString);

                connection.query(chargesQueryString, function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }

                    console.log('Inserted in Place Charges for Place ID:' + placeResult.insertId);

                    var timingsQueryStringArray = [];
                    for(var i in placeDetails.PlaceTimings) {
                        timingsQueryStringArray.push('INSERT INTO PlaceTimings (PlaceID, TimeStart,TimeEnd, Days) VALUES('+
                        placeResult.insertId+
                        ','+connection.escape(placeDetails.PlaceTimings[i].TimeStart)+
                        ','+connection.escape(placeDetails.PlaceTimings[i].TimeEnd)+
                        ','+connection.escape(placeDetails.PlaceTimings[i].Days)+
                        ');')
                    }

                    console.log("Insert Timings query:"+timingsQueryStringArray);

                    if(timingsQueryStringArray.length > 0) {
                        executeNextTimingsQuery();
                    }
                    else {
                        commitTransaction();
                    }

                    function executeNextTimingsQuery() {
                        connection.query(timingsQueryStringArray[0], function(err, result){
                            if(err) {
                                connection.rollback(function() {
                                    throw err;
                                });
                            }

                            console.log('Inserted in Place Timings with Timing ID:' + result.insertId);
                            timingsQueryStringArray.splice(0,1);
                            if(timingsQueryStringArray.length > 0) {
                                executeNextTimingsQuery();
                            }
                            else {
                                commitTransaction();
                            }

                        })
                    }

                    function commitTransaction() {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    throw err;
                                });
                            }
                            console.log('success!');
                            callback({Status: "SUCCESS"});

                            connection.end();
                        });
                    }
                });
            });
        }
    );
}

module.exports.insertPlaceDetails=insertPlaceDetails;
