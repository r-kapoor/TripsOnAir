/**
 * Created by rkapoor on 26/02/15.
 */
routesModule.controller('suryaController', function($scope, $rootScope, $http, $q, $location, orderedCities, $window) {

    $scope.reorderPanel=true;
    $scope.loader=false;
    $scope.reorderList=true;
    $scope.draggableObjects = [];

    var pathArray = [];
    var orderComparisonFactor = 1.4;
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

        var currentOrderWeight = 0;
        var originCityID=$scope.originCity.CityID;
       // console.log("")
        var weightArray=orderedCities.getWeightArray();
        var cityIDs = orderedCities.getCityIDs();
        var destinationsLength=$scope.draggableObjects.length;
console.log("weightArray:"+weightArray);
        currentOrderWeight+=weightArray[cityIDs.indexOf(originCityID)][cityIDs.indexOf($scope.draggableObjects[0].CityID)];
        console.log("currentOrderWeight from origin to first city:"+currentOrderWeight);
        for(var i=1;i<destinationsLength;i++)
        {
            var cityIDStart=$scope.draggableObjects[i-1].CityID;
            var cityIDEnd=$scope.draggableObjects[i].CityID;

            var startIndex=cityIDs.indexOf(cityIDStart);
            var endIndex=cityIDs.indexOf(cityIDEnd);
            currentOrderWeight+=weightArray[startIndex][endIndex];
           console.log("currentOrderWeight:" +currentOrderWeight);
        }
         currentOrderWeight+=weightArray[cityIDs.indexOf($scope.draggableObjects[destinationsLength-1].CityID)][cityIDs.indexOf(originCityID)];
        console.log("total currentOrderWeight:"+currentOrderWeight);
        console.log("orderedCities.getMinimumWeight:"+orderedCities.getMinimumWeight());
         if(orderedCities.getMinimumWeight()*orderComparisonFactor<currentOrderWeight)
         {
            $rootScope.$emit('showRecommendation','inEfficientOrder');
         }
         else
         {
            $rootScope.$emit('hideRecommendation','order');
         }

        $rootScope.$emit('plotCities');
    };

    $scope.showRoutes=function(){
        console.log('show routes');
        $scope.reorderPanel = false;
        $rootScope.$emit('showTravelPanel');
    };

        angular.element(window).ready(function () {
        console.log('Calling getOptimizedOrder');
        var currentURL = $location.absUrl();
        console.log('url:'+currentURL);
        pathArray = currentURL.split('?');
        var destinations = getParameterByName('dsts').split(";");

        console.log("pathArray:"+JSON.stringify(pathArray[1]));
        if((pathArray.length>1) && (destinations.length>1)){
            $http.get('/getOptimizeOrder?'+pathArray[1]).success(function(data,status){
                    console.log("getOptimizeOrder response:"+JSON.stringify(data));
                    orderedCities.setOrderedDestinationCities(data.trip);
                    orderedCities.setOriginCity(data.origin);
                    orderedCities.setWeightArray(data.weight);
                    orderedCities.setMinimumWeight(data.minWeight);
                    orderedCities.setPathArray(pathArray);
                    orderedCities.setCityIDs(data.cityIDs);
                    console.log("data.cityIDs:"+data.cityIDs);
                    $rootScope.$emit('orderReceived');
                }
            );
        }
        else if((pathArray.length>1) && (destinations.length==1))
        {
            ////$scope.$broadcast('showTravelPanel');
            ////only one destination
            //console.log("only one destination");
            //$scope.showRoutes();
            //$scope.reorderPanel = false;
            //$rootScope.$emit('showTravelPanel');
        }
        else {
            console.log('Page NOT FOUND');
        }
    });



    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


});
