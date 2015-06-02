/**
 * Created by rajat on 5/16/2015.
 */
routesModule.controller('shabariController',  function($scope,$rootScope) {

    $scope.isLoaderShown = true;
    $rootScope.$on("dataLoaded",function onShowTravelPanel(event, data){
        $scope.isLoaderShown = false;
    });
    $rootScope.$on("gettingData",function onShowTravelPanel(event, data){
        $scope.isLoaderShown = true;
    });

});
