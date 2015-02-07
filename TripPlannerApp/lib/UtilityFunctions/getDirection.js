/**
 * Created by rkapoor on 26/01/15.
 */
function getDirection(originLat, originLong, destinationLat, destinationLong) {
    console.log('originLat:'+originLat+",originLong:"+originLong+',destinationLat:'+destinationLat+',destinationLong:'+destinationLong);

    var dLon = (destinationLong - originLong) * Math.PI / 180;
    var y = Math.sin(dLon) * Math.cos(destinationLat * Math.PI / 180);
    var x = Math.cos(originLat * Math.PI / 180)*Math.sin(destinationLat * Math.PI / 180) -
        Math.sin(originLat * Math.PI / 180)*Math.cos(destinationLat * Math.PI / 180)*Math.cos(dLon);
    var bearing = Math.atan2(y, x) * 180 / Math.PI;
    console.log("bearing:"+bearing);
    return bearing;
}
//getDirection(13.0039122, 77.6129365, 12.77012, 77.56777);
module.exports.getDirection = getDirection;
