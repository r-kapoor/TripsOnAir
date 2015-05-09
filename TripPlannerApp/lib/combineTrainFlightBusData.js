/**
 * Created by rkapoor on 07/03/15.
 */
function combineTrainFlightBusData(rome2RioData) {
    for(var legIndex=0; legIndex<rome2RioData.length;legIndex++) {
        var routes = rome2RioData[legIndex].routes;
        for(var routeIndex = 0; routeIndex < routes.length; routeIndex++) {
            var route = routes[routeIndex];
            var isRecommendedRouteTrain = 1, isRecommendedRouteFlight = 1, isRecommendedRouteBus = 1;
            if(route.isRecommendedRouteTrain != undefined) {
                isRecommendedRouteTrain = route.isRecommendedRouteTrain;
            }
            if(route.isRecommendedRouteFlight != undefined) {
                isRecommendedRouteFlight = route.isRecommendedRouteFlight;
            }
            if(route.isRecommendedRouteBus != undefined){
                isRecommendedRouteBus = route.isRecommendedRouteBus;
            }

            route.isRecommendedRoute = route.isRecommendedRouteTrain * route.isRecommendedRouteFlight * route.isRecommendedRouteBus;

            delete route.isRecommendedRouteTrain;
            delete route.isRecommendedRouteFlight;
            delete route.isRecommendedRouteBus;
        }
    }
    return rome2RioData;
}

module.exports.combineTrainFlightBusData = combineTrainFlightBusData;
