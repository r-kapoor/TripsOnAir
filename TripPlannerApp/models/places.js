'use strict';


module.exports = function IndexModel(tripOrder,origin, weight,minWeight,cityIDs) {
    if(cityIDs == undefined){
        cityIDs = [origin.CityID];
        for(var i = 0; i < tripOrder.length; i++){
            cityIDs.push(tripOrder[i].CityID);
        }
    }
    return {
        trip: tripOrder,
        origin:origin,
        weight:weight,
        minWeight:minWeight,
        cityIDs:cityIDs
    };
};
