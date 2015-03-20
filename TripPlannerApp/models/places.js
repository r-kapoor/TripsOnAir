'use strict';


module.exports = function IndexModel(tripOrder,origin, weight,minWeight) {
    return {
        trip: tripOrder,
        origin:origin,
        weight:weight,
        minWeight:minWeight
    };
};
