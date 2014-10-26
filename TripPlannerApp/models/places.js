'use strict';


module.exports = function IndexModel(tripOrder, originName, originID) {
    return {
        trip: tripOrder,
        OriginName:originName,
        OriginID:originID
    };
};