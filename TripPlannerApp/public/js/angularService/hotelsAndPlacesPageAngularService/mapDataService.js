/**
 * Created by rkapoor on 26/04/15.
 */

itineraryModule.service('mapData', function () {
    var routeDataUpdated = [];

    return{

        getRouteDataUpdated : function(){
            return routeDataUpdated;
        },
        setRouteDataUpdated: function(updatedData){
            routeDataUpdated = updatedData;
        },
        getRouteNthData : function(N){
            return routeDataUpdated[N];
        },
        setRouteNthData: function(N,updatedData){
            routeDataUpdated[N] = updatedData;
        }
    }
});
