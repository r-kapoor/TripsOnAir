'use strict';


module.exports = function IndexModel(tripOrder, originName, originID, weight, cities, cityIDs, minWeight) {
    return {
        trip: tripOrder,
        OriginName:originName,
        OriginID:originID,
        weight:weight,
        cities:cities, 
        cityIDs:cityIDs,
        minWeight:minWeight
    };
};