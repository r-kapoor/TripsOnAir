/**
 * Created by rajat on 5/18/2015.
 */
itineraryModule.controller('shabariController',  ['$scope','$rootScope','$timeout', function($scope,$rootScope,$timeout) {

    $scope.isLoaderShown = true;
    $rootScope.$on("dataLoaded",function onItineraryPlanned(event, data){
        $scope.isLoaderShown = false;
    });
    $rootScope.$on("gettingData",function onItineraryQuery(event, data){
        $scope.isLoaderShown = true;
    });

    function checkIfDataLoaded(){

        if($scope.isLoaderShown)
        {
            $rootScope.$emit("checkIfDataLoaded");
            $timeout(checkIfDataLoaded,2000);
        }
    }

    checkIfDataLoaded();
}]);
