/**
 * Created by rkapoor on 16/09/15.
 */

var hashidEncoder =  require('../lib/hashEncoderDecoder');


function generatePermalink(permalinkID, callback) {

    var encodedItineraryID = hashidEncoder.encodePermalink(permalinkID);
    var permalink = '/showPlacesAndHotels/I-'+encodedItineraryID;
    callback(permalink, permalinkID);

}

module.exports.generatePermalink=generatePermalink;
