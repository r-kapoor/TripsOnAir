/**
 * Created by rkapoor on 18/01/15.
 */
function getDistance(originLat, originLong, destinationLat, destinationLong) {
    console.log('originLat:'+originLat+",originLong:"+originLong+',destinationLat:'+destinationLat+',destinationLong:'+destinationLong);
    var R = 6371;
    var dLat = (destinationLat - originLat) * Math.PI / 180;
    var dLon = (destinationLong - originLong) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(originLat * Math.PI / 180) * Math.cos(destinationLat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c;
    return d;
}
module.exports.getDistance = getDistance;
