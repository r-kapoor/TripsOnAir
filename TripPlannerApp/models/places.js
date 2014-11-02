'use strict';


module.exports = function IndexModel(tripOrder, originName, originID, weight) {
    return {
        trip: tripOrder,
        OriginName:originName,
        OriginID:originID,
        weight:weight
    };
};