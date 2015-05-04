/**
 * Created by rkapoor on 07/03/15.
 */
function combineTrainFlightBusData(rome2RioData) {
    for(var legIndex=0; legIndex<rome2RioData.length;legIndex++) {
        var routes = rome2RioData[legIndex].routes;
        for(var routeIndex = 0; routeIndex < routes.length; routeIndex++) {
            var route = routes[routeIndex];
            if(route.isRecommendedRouteTrain != undefined && route.isRecommendedRouteFlight != undefined && route.isRecommendedRouteBus!=undefined) {
                route.isRecommendedRoute = route.isRecommendedRouteTrain * route.isRecommendedRouteFlight * route.isRecommendedRouteBus;
            }
            else {
                route.isRecommendedRoute = 1;
            }
            delete route.isRecommendedRouteTrain;
            delete route.isRecommendedRouteFlight;
            delete route.isRecommendedRouteBus;
        }
    }
    return rome2RioData;
}

module.exports.combineTrainFlightBusData = combineTrainFlightBusData;
