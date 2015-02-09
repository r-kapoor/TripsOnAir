routesModule.controller('sarthiController', function($scope, $rootScope, $http, $q, $location, orderedCities) {

    $scope.checked1=true;
     $scope.checked2=true;
    $scope.cities = [{name: "AA"}];
    var defaultRouteData = null;
    var alternateRouteData = null;
    var pathArray = [];

    $scope.pageSlide = function(){
        $scope.checked1=!$scope.checked1;
        $scope.checked2=!$scope.checked2;
    }

    $scope.showModes = function(){
        console.log("in show modes");
         $scope.checked1=true;
    }
    $scope.test = function(){
        console.log("in test function");
        if($scope.checked1)
        {
            $scope.checked1=false;
        }
    }
    angular.element(document).ready(function () {
        console.log('Calling getOptimizedOrder');
        var currentURL = $location.absUrl();
        console.log('url:'+currentURL);
        pathArray = currentURL.split('?');
        if(pathArray.length>1){
            $http.get('/getOptimizeOrder?'+pathArray[1]).success(function(data,status){
                    console.log("getOptimizeOrder response:"+JSON.stringify(data));
                    orderedCities.setOrderedDestinationCities(data.trip);
                    orderedCities.setOriginCity({
                        CityName: data.OriginName,
                        CityID: data.OriginID
                    });
                    orderedCities.setWeightArray(data.weight);
                    orderedCities.setMinimumWeight(data.minWeight);
                }
            );
        }
        else {
            console.log('Page NOT FOUND');
        }
    });


	console.log("in sarthiController");
	$scope.isRouteCollapsed=true;
	$scope.submitOrderCollapsed=false;
	$scope.showRoutes=function(){
		$scope.isRouteCollapsed=false;
		$scope.submitOrderCollapsed=true;
        //Call showRoutes
        var orderedDestinationCities = orderedCities.getOrderedDestinationCities();
        var originCity = orderedCities.getOriginCity();
        var citiesString = "cities=";
        var cityIDsString = "cityIDs=";
        citiesString += originCity.CityName + ",";
        cityIDsString += originCity.CityID + ",";
        for(var i = 0; i < orderedDestinationCities.length; i++) {
            citiesString += orderedDestinationCities[i].CityName + ",";
            cityIDsString += orderedDestinationCities[i].CityID + ",";
        }
        citiesString += originCity.CityName;
        cityIDsString += originCity.CityID;
        var queryString = "/showRoutes?"+citiesString+"&"+cityIDsString+"&"+pathArray[1];
        $http.get(queryString).success(function(data,status){
                console.log("showRoutes response:"+JSON.stringify(data));
                if(data.tripNotPossible != undefined && data.tripNotPossible == 1) {
                    console.log('Page NOT FOUND');
                }
                else {
                    if(data.withoutTaxiRome2rioData.isMajorDefault == 1) {
                        defaultRouteData = data.withoutTaxiRome2rioData;
                        alternateRouteData = data.withTaxiRome2rioData;
                    }
                    else {
                        defaultRouteData = data.withoutTaxiRome2rioData;
                        alternateRouteData = data.withTaxiRome2rioData;
                    }
                    getAttributesFromRouteData(defaultRouteData);
                }
            }
        );
	};

    function getAttributesFromRouteData(routeData) {
        var rome2rioData = routeData.rome2RioData;
        var cities = [];
        var leg = null;
        for(var legIndex = 0; legIndex < rome2rioData.length; legIndex++) {
            leg = rome2rioData[legIndex];
            cities.push(leg.places[0]);
        }
        cities.push(leg.places[1]);
        $scope.cities = cities;
    }
});
