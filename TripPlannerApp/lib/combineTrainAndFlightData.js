/**
 * Created by rkapoor on 07/03/15.
 */
function combineTrainAndFlightData(rome2RioData) {
    for(var legIndex=0; legIndex<rome2RioData.length;legIndex++) {
        var routes = rome2RioData[legIndex].routes;
        for(var routeIndex = 0; routeIndex < routes.length; routeIndex++) {
            var route = routes[routeIndex];
            if(route.isRecommendedRouteTrain != undefined && route.isRecommendedRouteFlight != undefined) {
                route.isRecommendedRoute = route.isRecommendedRouteTrain * route.isRecommendedRouteFlight;
            }
            else {
                route.isRecommendedRoute = 1;
            }
            delete route.isRecommendedRouteTrain;
            delete route.isRecommendedRouteFlight;
        }
    }
    return rome2RioData;
}

module.exports.combineTrainAndFlightData = combineTrainAndFlightData;
