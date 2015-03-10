routesModule.controller('sarthiController', function($scope, $rootScope, $http, $q, $location, orderedCities, $timeout) {

    $scope.isTravelPanelOpen=false;
    $scope.isTravelModesPanelOpen=false;

    $scope.isTripPanelSetCollapsed = false;
    $scope.isModeDetailsPanelOpen = false;

    $scope.loader = false;
    $scope.isTravelPanelDataHidden = true;
    $scope.cities = [];

    $scope.legs = [];
    $scope.currentLeg = null;

    $scope.routes = [];
    $scope.trains = [];
    $scope.flights = [];

    $scope.isTrainClicked = false;
    $scope.isFlightClicked = false;
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

    $scope.openModeDetailsPanel = function(segment, clickEvent) {
        $scope.isModeDetailsPanelOpen = !$scope.isModeDetailsPanelOpen;
        if(segment.kind == "train") {
            $scope.isTrainClicked = true;
            initializeTrainDates(segment.trainData);
            $scope.trains = segment.trainData;
        }
        clickEvent.stopPropagation();
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
                        defaultRouteData = data.withoutTaxiRome2rioData;
                        alternateRouteData = data.withTaxiRome2rioData;
                        //defaultRouteData = data.withTaxiRome2rioData;
                        //alternateRouteData = data.withoutTaxiRome2rioData;
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
            return "glyphicons-39-airplane";
        }
        else if(segment.kind == "car") {
            return "glyphicons-6-car";
        }
        else if(segment.kind == "train") {
            return "glyphicons-15-train";
        }
        else if(segment.kind == "bus") {
            return "glyphicons-32-bus";
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
        var duration = parseInt(segment.duration);
        var hours = parseInt(duration/60);
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
            console.log('travel modes panel clicked');
            if($scope.isModeDetailsPanelOpen) {
                $scope.isModeDetailsPanelOpen = false;
            }
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

    $scope.getPanelClass = function(train) {
        if(train.isFinal != undefined && train.isFinal == 1) {
            return "panel-danger";
        }
        return "panel-info";
    };

    $scope.addToTrip = function() {

    };


    /*
    * This is the part dealing with datepicker
     */

    function initializeTrainDates(trainData){
        for(var i = 0; i < trainData.length; i++){
            var trainDate;
            //console.log('trainData[i].dateLimits:'+trainData[i].dateLimits[0]);
            if(trainData[i].dateLimits.length > 1) {
                trainData[i].dateLimits.sort(function(a,b) {
                    a = new Date(a);
                    b = new Date(b);
                    a.getTime() - b.getTime();
                });
                if(trainData.isFinal != undefined && trainData.isFinal == 1){
                    trainDate = {
                        dt:trainData.startTime,
                        opened:false,
                        disabled:false,
                        minDate:trainData[i].dateLimits[0],
                        maxDate:trainData[i].dateLimits[trainData[i].dateLimits.length-1]
                    };
                }
                trainDate = {
                    dt:null,
                    opened:false,
                    disabled:false,
                    minDate:trainData[i].dateLimits[0],
                    maxDate:trainData[i].dateLimits[trainData[i].dateLimits.length-1]
                };
            }
            else if(trainData[i].dateLimits.length == 1) {
                trainDate = {
                    dt:trainData[i].dateLimits[0],
                    opened:false,
                    disabled:true,
                    minDate:trainData[i].dateLimits[0],
                    maxDate:trainData[i].dateLimits[0]
                };
            }
            else {
                trainDate = {
                    dt:null,
                    opened:false,
                    disabled:false,
                    minDate:null,
                    maxDate:null
                }
            }
            $scope.trainDate.push(trainDate);
        }
    }

    $scope.trainDate=[];

    $scope.clear = function () {
        //$scope.dt = 'Select';
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.open = function($event,index) {
        $event.preventDefault();
        $event.stopPropagation();
        for(var i = 0; i < $scope.trainDate.length; i++) {
            console.log("i:"+i+",in:"+index);
            if(i == index) {
                $scope.trainDate[i].opened = true;
            }
            else {
                $scope.trainDate[i].opened = false;
            }
        }
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    /**
     * End of Datepicker
     */
});
