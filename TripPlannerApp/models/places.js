'use strict';


module.exports = function IndexModel(tripOrder,origin, weight,minWeight,cityIDs) {
    return {
        trip: tripOrder,
        origin:origin,
        weight:weight,
        minWeight:minWeight,
        cityIDs:cityIDs
    };
};
