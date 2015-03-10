/**
 * Created by rkapoor on 07/03/15.
 */
var getDefaultModeOfTravel=require('../lib/getDefaultModeOfTravel');
function planAllModesTrip(rome2RioData,dateSet,budget,dates, times, ratingRatio,lengthOfRoutesArray,indexOfDrive,numPeople,callback) {
    getDefaultModeOfTravel.getDefaultModeOfTravel(rome2RioData,dateSet,budget,dates, times, ratingRatio,lengthOfRoutesArray,indexOfDrive,numPeople,callback);
}

module.exports.planAllModesTrip = planAllModesTrip;
