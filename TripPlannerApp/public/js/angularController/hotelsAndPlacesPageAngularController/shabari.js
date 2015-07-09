/**
 * Created by rajat on 5/18/2015.
 */
itineraryModule.controller('shabariController',  function($scope,$rootScope) {

    $scope.isLoaderShown = true;
    $rootScope.$on("dataLoaded",function onItineraryPlanned(event, data){
        $scope.isLoaderShown = false;
    });
    $rootScope.$on("gettingData",function onItineraryQuery(event, data){
        $scope.isLoaderShown = true;
    });

});
