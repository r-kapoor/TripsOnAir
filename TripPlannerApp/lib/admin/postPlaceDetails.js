/**
 * Created by rkapoor on 28/03/15.
 */
var conn = require('../../lib/database');
//An array of CityNames can be passed. The corresponding cityids will be passed to the callback. -1 Indicates not found
function postPlaceDetails(placeDetails, callback)
{
    console.log("postPlaceDetails called");
    var connection=conn.conn();
    connection.connect();

    var placesQueryString = 'UPDATE Places SET Type='+connection.escape(placeDetails.Type)+
        ',Taste='+connection.escape(placeDetails.Taste)+',Name='+connection.escape(placeDetails.Name)+',' +
        'Address='+connection.escape(placeDetails.Address)+',PinCode='+connection.escape(placeDetails.PinCode)+',' +
        'PhoneNo='+connection.escape(placeDetails.PhoneNo)+',CityID='+connection.escape(placeDetails.CityID)+',' +
        'Description='+connection.escape(placeDetails.Description)+',Score='+connection.escape(placeDetails.Score)+',' +
        'ScoreSources='+connection.escape(placeDetails.ScoreSources)+',' +
        'Website='+connection.escape(placeDetails.Website)+',Latitude='+connection.escape(placeDetails.Latitude)+',' +
        'Longitude='+connection.escape(placeDetails.Longitude)+',Time2Cover='+connection.escape(placeDetails.Time2Cover)+',' +
        'UnescoHeritage='+connection.escape(placeDetails.UnescoHeritage)+',NumberOfImages='+connection.escape(placeDetails.NumberOfImages)+
        ' WHERE PlaceID='+connection.escape(placeDetails.PlaceID)+';';

    console.log("SetPlaceDetails query:"+placesQueryString);

    var timingsQueryStringArray = [];
    for(var i in placeDetails.PlaceTimings) {
        if(placeDetails.PlaceTimings[i].TimingID != null){
            timingsQueryStringArray.push('UPDATE PlaceTimings SET TimeStart='+connection.escape(placeDetails.PlaceTimings[i].TimeStart)+',' +
                'TimeEnd='+connection.escape(placeDetails.PlaceTimings[i].TimeEnd)+',Days='+placeDetails.PlaceTimings[i].Days+' WHERE' +
            ' Timing_ID='+connection.escape(placeDetails.PlaceTimings[i].TimingID)+';');
        }
    }

    console.log("SetTimings query:"+timingsQueryStringArray);

    var chargesQueryString = 'UPDATE Place_Charges SET ChildCharge='+connection.escape(placeDetails.ChildCharge)+',AdultCharge='+connection.escape(placeDetails.AdultCharge)+',ForeignerCharge='+connection.escape(placeDetails.ForeignerCharge)+' WHERE PlaceID='+connection.escape(placeDetails.PlaceID)+';';

    console.log("SetCharges query:"+chargesQueryString);

    connection.beginTransaction(
        function(err) {
            if (err) {
                throw err;
            }
            connection.query(placesQueryString, function(err, result) {
                if (err) {
                    connection.rollback(function() {
                        throw err;
                    });
                }

                console.log('changed ' + result.changedRows + ' rows in Places');

                connection.query(chargesQueryString, function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }

                    console.log('changed ' + result.changedRows + ' rows in PlaceCharges');

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

                            console.log('changed ' + result.changedRows + ' rows in PlaceTimings');
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

module.exports.postPlaceDetails=postPlaceDetails;
