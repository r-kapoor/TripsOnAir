routesModule.controller('sarthiController', function($scope, $rootScope, $http, $q, $location, orderedCities, $timeout) {

    $scope.isTravelPanelOpen=false;
    $scope.isTravelModesPanelOpen=false;

    $scope.isTripPanelSetCollapsed = false;
    $scope.isModeDetailsPanelOpen = true;

    $scope.loader = false;
    $scope.isTravelPanelDataHidden = true;
    $scope.cities = [];

    $scope.legs = [];
    $scope.currentLeg = null;

    $scope.routes = [];

    var defaultRouteData = null;
    var alternateRouteData = null;

    $scope.pageSlide = function(){
        $scope.checked1=!$scope.checked1;
        $scope.checked2=!$scope.checked2;
    };

    $scope.showModes = function(){
        console.log("in show modes");
         $scope.checked1=true;
    };
    $scope.test = function(){
        console.log("in test function");
        if($scope.checked1)
        {
            $scope.checked1=false;
        }
    };

    function openPanel() {
        $timeout(function openTravelPanel() {
            $scope.isTravelPanelOpen = true;
            console.log('function timedout:'+$scope.isTravelPanelOpen);
        }, 400);
    }

    $scope.openTravelModesPanel = function(leg, clickEvent) {
        $scope.isTravelModesPanelOpen = !$scope.isTravelModesPanelOpen;
        $scope.currentLeg = leg;
        $scope.routes = leg.routes;
        clickEvent.stopPropagation();
        //var travelPanel=angular.element(document.querySelector(".travel-panel"));
        //travelPanel.removeAttr('ng-click');
        //var travelPageSlide=angular.element(document.querySelector(".travel-pageslide"));
        //travelPageSlide.attr('ng-click','closeOtherPanels(1)');
    };

    $scope.getSourceCityFromLeg = function(){
        if($scope.currentLeg == null) {
            return null;
        }
        return $scope.currentLeg.places[0].name;
    };

    $scope.getDestinationCityFromLeg = function() {
        if($scope.currentLeg == null) {
            return null;
        }
        return $scope.currentLeg.places[1].name;
    };

    $rootScope.$on('showTravelPanel', function onShowTravelPanel(event, data) {
        console.log('function called');

        openPanel();
        //Call showRoutes
        var orderedDestinationCities = orderedCities.getOrderedDestinationCities();
        var originCity = orderedCities.getOriginCity();
        var pathArray= orderedCities.getPathArray();
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
                $scope.loader = true;
                $scope.isTravelPanelDataHidden = false;
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
                        /*
                            hack
                         */
                        //defaultRouteData = data.withoutTaxiRome2rioData;
                        //alternateRouteData = data.withTaxiRome2rioData;
                        defaultRouteData = data.withTaxiRome2rioData;
                        alternateRouteData = data.withoutTaxiRome2rioData;
                    }
                    getAttributesFromRouteData(defaultRouteData);
                }
            }
        );
    });

    function getAttributesFromRouteData(routeData) {
        var rome2rioData = routeData.rome2RioData;
        var leg = null;
        for(var legIndex = 0; legIndex < rome2rioData.length; legIndex++) {
            leg = rome2rioData[legIndex];
            for(var routeIndex = 0; routeIndex < leg.routes.length; routeIndex++) {
                var route = leg.routes[routeIndex];
                var majorIndex = 0;
                for(var segmentIndex = 0; segmentIndex < route.segments.length; segmentIndex++) {
                    var segment = route.segments[segmentIndex];
                    if(segment.isMajor == 1) {
                        segment.majorIndex = majorIndex;
                        majorIndex++;
                    }
                }
                route.majorCount = majorIndex - 1;
                if(route.isDefault != undefined && route.isDefault == 1) {
                    leg.defaultRoute = route;
                }
            }
        }
        $scope.legs = routeData.rome2RioData;
    }

    $scope.getSourceCityName = function(index) {
        var leg = $scope.legs[index];
        return leg.places[0].name;
    };

    $scope.getDestinationCityName = function(index) {
        var leg = $scope.legs[index];
        return leg.places[1].name;
    };

    $scope.getDefaultRoute = function(index) {
        var leg = $scope.legs[index];
        for(var i = 0; i < leg.routes.length; i++) {
            if(leg.routes[i].isDefault != undefined && leg.routes[i].isDefault == 1) {
                return leg.routes[i];
            }
        }
    };

    $scope.getModeIcon = function(segment) {
        if(segment.kind == "flight") {
            return "glyphicon-plane";
        }
        else if(segment.kind == "car") {
            return "glyphicon-eye-open";
        }
        else if(segment.kind == "train") {
            return "glyphicon-plus";
        }
        else if(segment.kind == "bus") {
            return "glyphicon-minus";
        }
        else {
            return "glyphicon-asterisk";
        }
    };

    $scope.getStopName = function(index, route) {
        return route.stops[index + 1].name;
    };

    $scope.getDateFormatted = function(segment) {
        return segment.startTime;
    };

    $scope.getDuration = function(segment) {
        var duration = segment.duration;
        var hours = parseInt(parseInt(duration)/60);
        var minutes = duration%60;
        var returnString = "";
        if(hours > 0) {
            returnString += hours + " hrs ";
        }
        if(minutes > 0) {
            returnString +=  minutes + " min";
        }
        return returnString;
    };

    $scope.getPrice = function(segment) {
        return segment.indicativePrice.price;
    };

    $scope.closeOtherPanels =function(panelNo){
        if(panelNo==1){
            //travel panel clicked
            console.log('travel panel clicked');
            if($scope.isTravelModesPanelOpen){
                $scope.isTravelModesPanelOpen=false;
            }
        }
        else if(panelNo==2){
            //travel modes panel clicked
        }
        console.log("in close other panels");
    };

    $scope.showOtherTrip = function() {
        $scope.isTripPanelSetCollapsed = true;
        console.log('Panel Collapsed');
        $timeout(function openCollapsedPanelSet(){
            var swapRouteData = alternateRouteData;
            alternateRouteData = defaultRouteData;
            defaultRouteData = swapRouteData;
            getAttributesFromRouteData(defaultRouteData);
            console.log('Panel Opened');
            $scope.isTripPanelSetCollapsed = false;
        },1000);
    };

    function simpleKeys (original) {
        return Object.keys(original).reduce(function (obj, key) {
            obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
            return obj;
        }, {});
    }
});
