/**
 * Created by rkapoor on 06/03/15.
 */
var trainFareDetails = require('../config/trainFareDetails.json');
function readJsonFile() {
    console.log(trainFareDetails.Distance);
}

function getTrainFare(distance){
    var distanceIndex;
    distance = distance -1;
    if(distance<=300){
        distanceIndex=parseInt(parseInt(distance)/5);
    }
    else if(distance<=1000){
        distanceIndex=60 + parseInt(parseInt(distance-300)/10);
    }
    else if(distance<=2500){
        distanceIndex = 130 + parseInt(parseInt(distance-1000)/25);
    }
    else{
        distanceIndex = 190 + parseInt(parseInt(distance-2500)/50);
    }
    console.log("index:"+trainFareDetails.Distance[distanceIndex]);

}
getTrainFare(250);
getTrainFare(1200);
getTrainFare(2700);
getTrainFare(304);
getTrainFare(4334);
getTrainFare(3389);
