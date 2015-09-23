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
        else {
            //This is a new timing, needs to be inserted
            timingsQueryStringArray.push('INSERT INTO PlaceTimings (PlaceID, TimeStart,TimeEnd, Days) VALUES('+
            placeDetails.PlaceID+
            ','+connection.escape(placeDetails.PlaceTimings[i].TimeStart)+
            ','+connection.escape(placeDetails.PlaceTimings[i].TimeEnd)+
            ','+connection.escape(placeDetails.PlaceTimings[i].Days)+
            ');');
        }
    }

    console.log("SetTimings query:"+timingsQueryStringArray);

    var chargesQueryString = 'UPDATE Place_Charges SET ChildCharge='+connection.escape(placeDetails.ChildCharge)+',AdultCharge='+connection.escape(placeDetails.AdultCharge)+',ForeignerCharge='+connection.escape(placeDetails.ForeignerCharge)+' WHERE PlaceID='+connection.escape(placeDetails.PlaceID)+';';

    console.log("SetCharges query:"+chargesQueryString);

    var imagesQueryStringArray = [];
    for(i in placeDetails.PlaceImages) {
        if(placeDetails.PlaceImages[i].ImgID != null){
            //This is an existing image. Needs to be updated
            imagesQueryStringArray.push('UPDATE Place_Images SET CreditName='+connection.escape(placeDetails.PlaceImages[i].CreditName)+',' +
            'CreditURL='+connection.escape(placeDetails.PlaceImages[i].CreditURL)+',ImageURL='+placeDetails.PlaceImages[i].ImageURL+' WHERE' +
            ' ImgID='+connection.escape(placeDetails.PlaceImages[i].ImgID)+';');
        }
        else {
            //This is a new image. Needs to be inserted
            imagesQueryStringArray.push('INSERT INTO Place_Images (PlaceID, CreditName,CreditURL, ImageURL) VALUES('+
            placeDetails.PlaceID+
            ','+connection.escape(placeDetails.PlaceImages[i].CreditName)+
            ','+connection.escape(placeDetails.PlaceImages[i].CreditURL)+
            ','+connection.escape(placeDetails.PlaceImages[i].ImageURL)+
            ');');
        }
    }

    console.log("SetImages query:"+imagesQueryStringArray);

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
                        insertPlaceImages();
                    }

                    function executeNextTimingsQuery() {
                        connection.query(timingsQueryStringArray[0], function(err, result){
                            if(err) {
                                connection.rollback(function() {
                                    throw err;
                                });
                            }

                            if(result != undefined && result.changedRows != undefined){
                                console.log('changed ' + result.changedRows + ' rows in PlaceTimings');
                            }
                            timingsQueryStringArray.splice(0,1);
                            if(timingsQueryStringArray.length > 0) {
                                executeNextTimingsQuery();
                            }
                            else {
                                insertPlaceImages();
                            }

                        })
                    }

                    function executeNextImagesQuery() {
                        connection.query(imagesQueryStringArray[0], function(err, result){
                            if(err) {
                                connection.rollback(function() {
                                    throw err;
                                });
                            }

                            if(result != undefined && result.changedRows != undefined){
                                console.log('changed ' + result.changedRows + ' rows in Place_Images');
                            }
                            else {
                                console.log('Inserted in Place_Images');
                            }

                            imagesQueryStringArray.splice(0,1);
                            if(imagesQueryStringArray.length > 0) {
                                executeNextImagesQuery();
                            }
                            else {
                                commitTransaction();
                            }
                        })
                    }

                    function insertPlaceImages(){
                        if(imagesQueryStringArray.length > 0) {
                            executeNextImagesQuery();
                        }
                        else {
                            commitTransaction();
                        }
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
