/**
 * Created by rkapoor on 26/02/15.
 */
routesModule.controller('suryaController', function($scope, $rootScope, $http, $q, $location, orderedCities) {

    $scope.reorderPanel=true;
    $scope.loader=false;
    $scope.reorderList=true;
    $scope.draggableObjects = [];

    var pathArray = [];

    $rootScope.$on('orderReceived', function onOrderReceived(event, data) {
        $scope.draggableObjects = orderedCities.getOrderedDestinationCities();
        $scope.originCity=orderedCities.getOriginCity();
        $scope.loader=true;
        $scope.reorderList=false;
        $rootScope.$emit("plotCities");
    });

    $scope.onDropComplete = function (index, obj, evt) {
        var otherObj = $scope.draggableObjects[index];
        var otherIndex = $scope.draggableObjects.indexOf(obj);
        $scope.draggableObjects[index] = obj;
        $scope.draggableObjects[otherIndex] = otherObj;
        $rootScope.$emit('plotCities');
    };

    angular.element(document).ready(function () {
        console.log('Calling getOptimizedOrder');
        var currentURL = $location.absUrl();
        console.log('url:'+currentURL);
        pathArray = currentURL.split('?');
        if(pathArray.length>1){
            $http.get('/getOptimizeOrder?'+pathArray[1]).success(function(data,status){
                    console.log("getOptimizeOrder response:"+JSON.stringify(data));
                    orderedCities.setOrderedDestinationCities(data.trip);
                    orderedCities.setOriginCity(data.origin);
                    orderedCities.setWeightArray(data.weight);
                    orderedCities.setMinimumWeight(data.minWeight);
                    orderedCities.setPathArray(pathArray);
                    $rootScope.$emit('orderReceived');
                }
            );
        }
        else {
            console.log('Page NOT FOUND');
        }
    });

    $scope.showRoutes=function(){
        $scope.reorderPanel = false;
        $rootScope.$emit('showTravelPanel');
    };



});
