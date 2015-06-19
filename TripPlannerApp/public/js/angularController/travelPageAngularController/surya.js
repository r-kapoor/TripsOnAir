/**
 * Created by rkapoor on 26/02/15.
 */
routesModule.controller('suryaController', ['$scope', '$rootScope', '$http', '$q', '$location', 'orderedCities', function($scope, $rootScope, $http, $q, $location, orderedCities) {

    $scope.reorderPanel=false;
    $scope.reorderList=true;
    $scope.draggableObjects = [];

    $scope.IntroOptions = {
        steps: [
            {
                element:  '#reorderPanelIntro',
                intro: "Drag and Drop To Reorder Destinations",
                position: "right"
            },
            {
                element: '#saveButton',
                intro: "Continue when done"
            }
        ],
        scrollToElement: false,
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };

    var isTravelPanelOpened = false;

    var pathArray = [];
    var orderComparisonFactor = 1.4;
    $rootScope.$on('orderReceived', function onOrderReceived(event, data) {
        $scope.draggableObjects = orderedCities.getOrderedDestinationCities();
        $scope.originCity=orderedCities.getOriginCity();
        $scope.reorderList=false;
        $rootScope.$emit("plotCities");
        $rootScope.$emit('dataLoaded');
    });

    $scope.onDropComplete = function (index, obj, evt) {
        var otherObj = $scope.draggableObjects[index];
        var otherIndex = $scope.draggableObjects.indexOf(obj);
        $scope.draggableObjects[index] = obj;
        $scope.draggableObjects[otherIndex] = otherObj;

        var currentOrderWeight = 0;
        var originCityID=$scope.originCity.CityID;
        var weightArray=orderedCities.getWeightArray();
        var cityIDs = orderedCities.getCityIDs();
        var destinationsLength=$scope.draggableObjects.length;
        currentOrderWeight+=weightArray[cityIDs.indexOf(originCityID)][cityIDs.indexOf($scope.draggableObjects[0].CityID)];
        for(var i=1;i<destinationsLength;i++)
        {
            var cityIDStart=$scope.draggableObjects[i-1].CityID;
            var cityIDEnd=$scope.draggableObjects[i].CityID;
            var startIndex=cityIDs.indexOf(cityIDStart);
            var endIndex=cityIDs.indexOf(cityIDEnd);
            currentOrderWeight+=weightArray[startIndex][endIndex];
        }
         currentOrderWeight+=weightArray[cityIDs.indexOf($scope.draggableObjects[destinationsLength-1].CityID)][cityIDs.indexOf(originCityID)];
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

    $rootScope.$on('showRoutes',function onShowRoutes(event,data){
        $scope.reorderPanel = false;
        isTravelPanelOpened = true;
        $rootScope.$emit('showTravelPanel');
    });

    $rootScope.$on('guide',function onGuide(){
        if(!isTravelPanelOpened){
            $scope.multiCityIntroFunction();
        }
    });

    angular.element(window).ready(function () {
        var currentURL = $location.absUrl();
        //console.log('url:'+currentURL);
        pathArray = currentURL.split('?');
        var destinations = getParameterByName('dsts').split(";");
        if((pathArray.length>1) && (destinations.length>1)){
            $scope.reorderPanel = true;
            $http.get('/getOptimizeOrder?'+pathArray[1]).success(function(data,status){
                    orderedCities.setOrderedDestinationCities(data.trip);
                    orderedCities.setOriginCity(data.origin);
                    orderedCities.setWeightArray(data.weight);
                    orderedCities.setMinimumWeight(data.minWeight);
                    orderedCities.setPathArray(pathArray);
                    orderedCities.setCityIDs(data.cityIDs);
                    $rootScope.$emit('orderReceived');
                    $scope.multiCityIntroFunction();
                }
            );
        }
        else if((pathArray.length>1) && (destinations.length==1))
        {
            isTravelPanelOpened = true;
            //will be taken care by sarathi
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
}]);
