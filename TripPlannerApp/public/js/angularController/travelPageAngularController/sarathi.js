routesModule.directive('postRepeat', function($timeout) {
    return function($scope,$rootScope, element, $attrs) {
        console.log("testing....");
        console.log("element:"+element.class);

        if ($scope.$last){
            $timeout(function (){
                if(element.class=="panel-travel")
                {
                    console.log("in panel-travel");
                    console.log("scrollHeightTravel:"+$("#transcludeTravelPanel")[0].scrollHeight);
                    $scope.$emit('initialize-pane',"travelPanel");
                }
            },10);
            $timeout(function (){
                if(element.class=="panel-travelMode"){
                    console.log("in panel-travelMode");
                    console.log("scrollHeightTravelModes:"+$("#transcludeTravelModesPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"travelModesPanel");
                }
            },1000);
            $timeout(function (){
                if(element.class=="panel-trainMode"){
                    console.log("in panel-trainMode");
                    console.log("scrollHeightTrainMode:"+$("#transcludeTrainPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"trainPanel");
                }
            },1000);
             $timeout(function (){
                if(element.class=="panel-flightMode"){
                    console.log("in panel-flightMode");
                    console.log("scrollHeightFlightMode:"+$("#transcludeFlightPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"flightPanel");
                }
            },1000);
        }
    };
});

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
    $scope.currentLegIndex = -1;

    $scope.routes = [];
    $scope.trains = [];
    $scope.flights = [];
    $scope.buses = [];

    $scope.isTrainClicked = false;
    $scope.isFlightClicked = false;
    $scope.isBusClicked = false;
    $scope.isCabClicked = false;
    $scope.isCabOperatorClicked = false;
    $scope.cabDetails = [];
    $scope.currentSegment = null;
    $scope.currentRoute = null;

    $scope.cabDetailToggle = [];
    $scope.cabDate = null;

    $scope.isBudgetPanelOpen = false;

    $scope.travelBudgetText = "Travel Expenses";
    $scope.totalBudgetText = "Your Budget";
    $scope.minorBudgetText = "Minor Travel Expenses";
    $scope.totalBudget = 0;
    $scope.travelBudget = 0;
    $scope.minorBudget = 0;

    var defaultRouteData = null;
    var alternateRouteData = null;
    var dateSet = null;
    var outOfBudgetFactor = 0.7;
    var minimumTimeSpentInCityInHours = 4;
    var travelData=null;

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

    $scope.openTravelModesPanel = function(leg, clickEvent, index) {
        if($scope.isModeDetailsPanelOpen) {
            $scope.isModeDetailsPanelOpen = false;
        }
        $scope.isTravelModesPanelOpen = !$scope.isTravelModesPanelOpen;
        $scope.currentLeg = leg;
        $scope.currentLegIndex = index;
        console.log('currentLegIndex:'+index);
        $scope.routes = leg.routes;
        clickEvent.stopPropagation();
        //var travelPanel=angular.element(document.querySelector(".travel-panel"));
        //travelPanel.removeAttr('ng-click');
        //var travelPageSlide=angular.element(document.querySelector(".travel-pageslide"));
        //travelPageSlide.attr('ng-click','closeOtherPanels(1)');
    };

    $scope.openModeDetailsPanel = function(segment,route, clickEvent, custom) {
        $scope.currentSegment = segment;
        $scope.currentRoute = route;
        $scope.isTrainClicked = false;
        $scope.isFlightClicked = false;
        $scope.isBusClicked = false;
        $scope.isCabOperatorClicked = false;
        $scope.isCabClicked = false;
        $scope.isModeDetailsPanelOpen = !$scope.isModeDetailsPanelOpen;
        if(segment.kind == "train") {
            console.log("startTime:"+segment.startTime);
            initializeVehicleDates(segment.trainData,segment.startTime);
            $scope.trains = segment.trainData;
            $scope.isTrainClicked = true;
        }
        else if(segment.kind == "flight") {
            console.log("startTime:"+segment.startTime);
            initializeVehicleDates(segment.flightData,segment.startTime);
            $scope.flights = segment.flightData;
            // $scope.isFlightClicked = true;
             $timeout(function() {
                 $scope.isFlightClicked = true;
             }, 500);
        }
        else if((route.name=="Bus"||route.name=="Bus RedBus")&&(segment.kind!="car"))
        {
            initializeVehicleDates(segment.busData,segment.startTime);
            $scope.buses = segment.busData;
            $timeout(function() {
                $scope.isBusClicked = true;
            }, 500);
        }
        else if(segment.kind="car"){
            if(segment.subkind != undefined && segment.subkind == "cab") {
                if(custom != undefined) {
                    if(custom == 'cabOperator') {
                        console.log("CAB OPERATOR CLICKED");
                        $scope.isTravelModesPanelOpen = false;
                        $scope.isCabOperatorClicked = true;
                        $scope.cabDetails = segment.CabDetails;
                        initializeCabDetailToggle(segment.CabDetails);
                    }
                    else if(custom == 'cabTimings') {
                        $scope.isCabClicked = true;
                        initializeCabDates(segment.startTime);
                    }
                }
            }
            if(segment.subkind=="taxi")
            {
                $scope.isTaxiClicked = true;

            }
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

    angular.element(window).ready(function () {
        console.log('Calling Routes in Sarathi');
        var currentURL = $location.absUrl();
        var pathArray = currentURL.split('?');
        var destinations = getParameterByName('dsts').split(";");
        var originCity  =  getParameterByName('o');
        var citiesString = "";
        var cityIDsString = "";
        if((pathArray.length>1) && (destinations.length==1))
        {
            //only one destination
            console.log("only one destination from input");
            $scope.isTravelPanelOpen = true;
            originCity = JSON.parse(originCity);
            destinations = JSON.parse(destinations);
            citiesString+="cities="+originCity.CityName+","+destinations.CityName+","+originCity.CityName;
            cityIDsString+="cityIDs="+originCity.CityID+","+destinations.CityID+","+originCity.CityName;
            getRoutes(citiesString,cityIDsString,pathArray);
        }
    });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

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
        getRoutes(citiesString,cityIDsString,pathArray);
    });

    function getRoutes(citiesString,cityIDsString,pathArray)
    {
        var queryString = "/showRoutes?"+citiesString+"&"+cityIDsString+"&"+pathArray[1];
        $http.get(queryString).success(function(data,status){
            $scope.loader = true;
            $scope.isTravelPanelDataHidden = false;
            console.log("showRoutes response:"+JSON.stringify(data));
            if(data.tripNotPossible != undefined && data.tripNotPossible == 1) {
                console.log('Page NOT FOUND');
            }
            else {
                dateSet = data.dateSet;
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
                showCurrentRouteOnMap();
                showBudget(data.userTotalbudget);
                $scope.isBudgetPanelOpen = true;
                travelData  = data;
            }
        });
    }

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

    function showCurrentRouteOnMap() {
        $rootScope.$emit('removeSegments');
        for(var legIndex in $scope.legs) {
            for(var segmentIndex in $scope.legs[legIndex].defaultRoute.segments) {
                var segment = $scope.legs[legIndex].defaultRoute.segments[segmentIndex];
                $rootScope.$emit('showSegment', segment);
            }
        }
    }

    function showBudget(userBudget){
        $scope.totalBudget = userBudget;
        alertAndSetTravelBudget();
    }

    function alertAndSetTravelBudget() {
        var majorBudget = 0;
        var minorBudget = 0;
        var endTime = 0;
        var timeOfReachingCity = 0;
        var overlapCity = null;
        var isOverlap = false;
        var isInsufficientTime = false;
        var insufficientTimeCity = null;
        for(var legIndex = 0; legIndex < $scope.legs.length; legIndex++) {
            var segment = $scope.legs[legIndex].defaultRoute.segments;
            for(var segmentIndex = 0; segmentIndex < segment.length; segmentIndex ++) {
                if(segment[segmentIndex].isMajor == 1) {
                    majorBudget += parseInt(segment[segmentIndex].indicativePrice.price);
                    if(segment[segmentIndex].kind == "train" || segment[segmentIndex].kind == "bus") {
                        minorBudget += 300;
                    }
                    segment[segmentIndex].startTime = new Date(segment[segmentIndex].startTime);
                    var startTime = segment[segmentIndex].startTime.getTime();
                    var currentEndTime = new Date(segment[segmentIndex].endTime).getTime();
                    if(endTime > startTime) {
                        isOverlap = true;
                        overlapCity = $scope.legs[legIndex].defaultRoute.stops[segmentIndex].name;
                    }
                    console.log('endTime:'+endTime+",startTime:"+startTime);
                    endTime = currentEndTime;

                    if(segment[segmentIndex].majorIndex == 0) {
                        if((startTime - timeOfReachingCity) / (60 * 60000) < minimumTimeSpentInCityInHours) {
                            isInsufficientTime = true;
                            insufficientTimeCity = $scope.legs[legIndex].places[0].name;
                        }
                    }
                    if(segment[segmentIndex].majorIndex == $scope.legs[legIndex].defaultRoute.majorCount) {
                        timeOfReachingCity = currentEndTime;
                    }
                }
                else {
                    minorBudget += parseInt(segment[segmentIndex].indicativePrice.price);
                }
                console.log('major budget:'+majorBudget);
                console.log('minor budget:'+minorBudget);
            }
        }
        $scope.travelBudget = majorBudget;
        $scope.minorBudget = minorBudget;
        if($scope.travelBudget+$scope.minorBudget>$scope.totalBudget*outOfBudgetFactor)
        {
            if($scope.travelBudget+$scope.minorBudget>$scope.totalBudget)
            {
                $rootScope.$emit('showRecommendation','budgetOutOfLimit');
            }
            else
            {
                $rootScope.$emit('showRecommendation','budgetExceeds');
            }

        }
        else
        {
            $rootScope.$emit('hideRecommendation','budget');
        }
        console.log('overlapCity:'+overlapCity);
        if(isOverlap){
            $rootScope.$emit('showRecommendation','timeOverlap',overlapCity);
        }
        else if(isInsufficientTime) {
            $rootScope.$emit('showRecommendation','timeExceeds',insufficientTimeCity);
        }
        else {
            $rootScope.$emit('hideRecommendation','time');
        }
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
            if($scope.isModeDetailsPanelOpen){
                $scope.isModeDetailsPanelOpen=false;
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

    $scope.getTransparentClass = function(panelNo){
        if(panelNo==1)
        {
            if($scope.isModeDetailsPanelOpen||$scope.isTravelModesPanelOpen)
            {
                return "panel-transparent";
            }
            else
            {
                return "";
            }
        }
        else if(panelNo ==2)
        {
            if($scope.isModeDetailsPanelOpen)
            {
                return "panel-transparent";
            }
            else
            {
                return "";
            }
        }
    }

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
            showCurrentRouteOnMap();
            alertAndSetTravelBudget();
        },1000);
    };

    $scope.isSegmentShown = function(segment,leg) {
        if( segment.majorIndex == leg.defaultRoute.majorCount)
        {
            return true;
        }
        if(segment.kind == 'car') {
            if(segment.subkind != undefined && segment.subkind == "cab") {
                if(segment.startCabTrip != undefined && segment.startCabTrip == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };

    $scope.isViaShown = function(segment) {
        if(segment.kind == 'car') {
            if(segment.subkind != undefined && segment.subkind == "cab") {
                if(segment.endCabTrip != undefined && segment.endCabTrip == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };

    function simpleKeys (original) {
        return Object.keys(original).reduce(function (obj, key) {
            obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
            return obj;
        }, {});
    }

    $scope.getPanelClass = function(vehicle) {
        if(vehicle.isFinal != undefined && vehicle.isFinal == 1) {
            return "panel-success";
        }
        return "panel-info";
    };

    $scope.addToTrip = function(vehicle,$index,$event) {
        console.log('In addtotrip');
        if($scope.vehicleDate[$index].dt == null) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('In If:'+$scope.vehicleDate[$index].opened);
            $scope.vehicleDate[$index].opened = true;
        }
        else {
            var startTime=new Date($scope.vehicleDate[$index].dt);
            var hours=parseInt(vehicle.OriginDepartureTime.split(":")[0]);
            var minutes = parseInt(vehicle.OriginDepartureTime.split(":")[1]);
            startTime.setHours(hours);
            startTime.setMinutes(minutes);
            var duration= getDurationFromStartEndTime(vehicle.OriginDepartureTime,vehicle.DestArrivalTime,vehicle.OriginDay,vehicle.DestDay);

            var vehicles;
            if($scope.isTrainClicked) {
                vehicles = $scope.trains;
            }
            else if($scope.isFlightClicked) {
                vehicles = $scope.flights;
            }
            else if($scope.isCabClicked){
                vehicles = $scope.buses;
            }
            if(!(vehicle.isFinal!=undefined && vehicle.isFinal==1))
            {
                for(var vehicleIndex in vehicles)
                {
                    console.log('vehicle:'+JSON.stringify(vehicleIndex));
                    if(vehicles[vehicleIndex].isFinal!=undefined && (vehicles[vehicleIndex].isFinal==1))
                    {
                        vehicles[vehicleIndex].isFinal = 0;
                    }
                }

                for(var routeIndex in $scope.currentLeg.routes)
                {
                    if($scope.currentLeg.routes[routeIndex].isDefault!= undefined && ($scope.currentLeg.routes[routeIndex].isDefault==1))
                    {
                        $scope.currentLeg.routes[routeIndex].isDefault = 0;
                        var segments = $scope.currentLeg.routes[routeIndex].segments;
                        for(var segmentIndex in segments)
                        {
                            if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].kind=="flight"))
                            {
                                segments[segmentIndex].startTime = null;
                                segments[segmentIndex].endTime = null;
                                for(var flightIndex in segments[segmentIndex].flightData)
                                {
                                    var flight = segments[segmentIndex].flightData[flightIndex];
                                    if(flight.isFinal!=undefined && flight.isFinal==1)
                                    {
                                        flight.isFinal = 0;
                                    }
                                }
                            }
                            if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].kind=="train"))
                            {
                                segments[segmentIndex].startTime = null;
                                segments[segmentIndex].endTime = null;
                                for(var trainIndex in segments[segmentIndex].trainData)
                                {
                                    var train = segments[segmentIndex].trainData[trainIndex];
                                    if(train.isFinal!=undefined && train.isFinal==1)
                                    {
                                        train.isFinal = 0;
                                    }
                                }
                            }
                            if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&($scope.currentLeg.routes[routeIndex].name=="Bus"||$scope.currentLeg.routes[routeIndex].name=="Bus RedBus")&&(segments[segmentIndex].kind=="bus"))
                            {
                                segments[segmentIndex].startTime = null;
                                segments[segmentIndex].endTime = null;
                                for(var busIndex in segments[segmentIndex].busData)
                                {
                                    var bus = segments[segmentIndex].busData[busIndex];
                                    if(bus.isFinal!=undefined && bus.isFinal==1)
                                    {
                                        bus.isFinal = 0;
                                    }
                                }
                            }
                        }
                    }
                }
                vehicle.isFinal =1;
                if(vehicle.fare != undefined) {
                    $scope.currentRoute.indicativePrice.price = vehicle.fare;
                }
                $scope.currentLeg.defaultRoute = $scope.currentRoute;
                $scope.currentRoute.isDefault =1;
            }
            $scope.currentSegment.startTime = startTime;
            $scope.currentSegment.endTime = addMinutes(startTime,duration);
            $scope.currentSegment.duration = duration;

            console.log("currentSegment:"+JSON.stringify($scope.currentSegment));


            if(vehicle.fare != undefined) {
                $scope.currentSegment.indicativePrice.price = vehicle.fare;
            }
            vehicle.date = startTime;
            $scope.isTravelModesPanelOpen = false;
            $scope.isModeDetailsPanelOpen = false;
        }
        showCurrentRouteOnMap();
        alertAndSetTravelBudget();
    };

    $scope.getAddButtonClass = function(vehicle) {
        if(vehicle.isFinal != undefined && vehicle.isFinal == 1) {
            return "btn-success";
        }
        return "btn-primary";
    };

    $scope.getAddButtonText = function(vehicle) {
        if(vehicle.isFinal != undefined && vehicle.isFinal == 1) {
            return "Added";
        }
        return "Add";
    };

    $scope.getNthDay = function(vehicle) {
        var destinationDay = vehicle.DestDay;
        if(destinationDay == "1") {
            return "Same Day";
        }
        else if(destinationDay == "2") {
            return "Next Day";
        }
        else {
            return "3rd Day";
        }
    };


    function getDurationFromStartEndTime(startTime,endTime,originDay,destDay){
        var startHours=parseInt(startTime.split(":")[0]);
        var startMins=parseInt(startTime.split(":")[1]);
        var endHours=parseInt(endTime.split(":")[0]);
        var endMins=parseInt(endTime.split(":")[1]);
        var startTimeInMins = startMins+ startHours*60;
        var endTimeInMins = endMins + endHours*60;

        console.log("startHours:"+startHours+","+"startMins:"+startMins+","+"endHours:"+endHours+","+"startTimeMins:"+startTimeInMins+","+"endTimeInMIns:"+endTimeInMins);

        var duration = 0;
        if(originDay==destDay)
        {
            duration = endTimeInMins - startTimeInMins;
        }
        else
        {
            duration = (destDay-originDay-1)*24*60 + endTimeInMins+(24*60-startTimeInMins);
        }
        console.log("duration:"+duration);
        return duration;
    };

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }

    $scope.getRouteClass = function(segment) {
        if(segment.kind == "car") {
            if(segment.subkind != undefined && segment.subkind == "cab"){
                return "cab-route";
            }
        }
        return "";
    };

    function initializeCabDetailToggle(cabDetails) {
        $scope.cabDetailToggle = [];
        for(var cabDetailIndex in cabDetails) {
            var cabDetailToggleObject  = {
                "open": cabDetails[cabDetailIndex].isFinal != undefined && cabDetails[cabDetailIndex].isFinal == 1
            };
            $scope.cabDetailToggle.push(cabDetailToggleObject);
        }
    }

    $scope.getAccordionHeadingClass = function(cabDetail)
    {
        if(cabDetail.isFinal!=undefined && cabDetail.isFinal==1)
        {
            return "final-cab-segment";
        }
        return "";
    };

    $scope.getCabOperatorClass = function(operator)
    {
        if(operator.isFinal!=undefined && operator.isFinal==1)
        {
            return "final-cab-segment";
        }
        return "";
    };

    $scope.changeCabOperator=function(cabDetail,operator,$event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        for(var cabDetailIndex in $scope.cabDetails)
        {
            if($scope.cabDetails[cabDetailIndex].isFinal!=undefined && $scope.cabDetails[cabDetailIndex].isFinal==1)
            {
                $scope.cabDetails[cabDetailIndex].isFinal=0;
                for(var cabOperatorIndex in $scope.cabDetails[cabDetailIndex].OperatorPrices)
                {
                   var operatorPrice=$scope.cabDetails[cabDetailIndex].OperatorPrices[cabOperatorIndex];
                    if(operatorPrice.isFinal!=undefined && operatorPrice.isFinal==1)
                    {
                        operatorPrice.isFinal=0;
                    }
                }
            }
        }
        cabDetail.isFinal =1;
        operator.isFinal=1;
        console.log('cabDetail:'+JSON.stringify(cabDetail));

        $scope.currentSegment.indicativePrice.price = operator.ActualCabPrice;
        $scope.isTravelModesPanelOpen = false;
        $scope.isModeDetailsPanelOpen = false;
        alertAndSetTravelBudget();
    };
    /*
    * This is the part dealing with datepicker
     */

    function initializeVehicleDates(vehicleData, startTime){
        console.log("in initialize:"+startTime);
        $scope.vehicleDate=[];
        for(var i = 0; i < vehicleData.length; i++){
            var vehicleDate;
            //console.log('trainData[i].dateLimits:'+trainData[i].dateLimits[0]);
            if(vehicleData[i].dateLimits.length > 1) {
                vehicleData[i].dateLimits.sort(function(a,b) {
                    a = new Date(a);
                    b = new Date(b);
                    return a.getTime() - b.getTime();
                });
                if(vehicleData[i].isFinal != undefined && vehicleData[i].isFinal == 1){
                    vehicleDate = {
                        dt:startTime,
                        opened:false,
                        disabled:false,
                        minDate:vehicleData[i].dateLimits[0],
                        maxDate:vehicleData[i].dateLimits[vehicleData[i].dateLimits.length-1]
                    };
                }
                else
                {
                    vehicleDate = {
                        dt:null,
                        opened:false,
                        disabled:false,
                        minDate:vehicleData[i].dateLimits[0],
                        maxDate:vehicleData[i].dateLimits[vehicleData[i].dateLimits.length-1]
                    };
                }
            }
            else if(vehicleData[i].dateLimits.length == 1) {
                vehicleDate = {
                    dt:vehicleData[i].dateLimits[0],
                    opened:false,
                    disabled:true,
                    minDate:vehicleData[i].dateLimits[0],
                    maxDate:vehicleData[i].dateLimits[0]
                };
            }
            else {
                vehicleDate = {
                    dt:null,
                    opened:false,
                    disabled:false,
                    minDate:null,
                    maxDate:null
                }
            }
            console.log('vehicleDate pushed:'+JSON.stringify(vehicleDate));
            $scope.vehicleDate.push(vehicleDate);
        }
    }


    function initializeCabDates(startTime){
        console.log('In initializeCabDates:'+$scope.currentLegIndex);
        var minDate = new Date(dateSet.dateStart[$scope.currentLegIndex]);
        var maxDate = new Date(dateSet.dateEnd[$scope.currentLegIndex]);
        var dt = null;
        var disabled = false;
        minDate.setHours(0,0,0,0);
        maxDate.setHours(0,0,0,0);
        console.log(minDate+","+maxDate);
        if (maxDate.getTime() - minDate.getTime() == 0) {
            console.log('disabled');
            disabled = true;
        }

        if($scope.currentRoute.isDefault != undefined && $scope.currentRoute.isDefault == 1) {
            dt = startTime;
        }
        $scope.cabDate = {
            dt:dt,
            opened:false,
            disabled:disabled,
            minDate:minDate,
            maxDate:maxDate
        };
    }
    $scope.openCabDate=function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.cabDate.opened = true;
    }
    $scope.vehicleDate=[];

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
        for(var i = 0; i < $scope.vehicleDate.length; i++) {
            console.log("i:"+i+",in:"+index);
            if(i == index) {
                $scope.vehicleDate[i].opened = true;
            }
            else {
                $scope.vehicleDate[i].opened = false;
            }
        }
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    $scope.disabled = function(date, mode, vehicle) {
        var currentDay = date.getDay() + 1 + '';
        if(vehicle.DaysOfTravel=="0")
        {
            return false;
        }
        var isRunningOnThatDay = vehicle.DaysOfTravel.indexOf(currentDay) != -1;
        return ( mode === 'day' && ( !isRunningOnThatDay ) );
    };


    /**
     * End of Datepicker
     */


    /**
     * Cab Timings slider
     */
    $scope.value = "8";
    $scope.options = {
        from: 0,
        to: 23,
        step: 1,
        dimension: "hrs",
        css: {
            background: {"background-color": "silver"},
            before: {"background-color": "purple"},
            default: {"background-color": "white"},
            after: {"background-color": "green"},
            pointer: {"background-color": "red"}
        }
    };

    /**
     * Submit Button
     */
    $scope.submitTravel = function(){
        console.log("submitTravel");
        defaultRouteData.isMajorDefault=1;
        alternateRouteData.isMajorDefault=0;
        travelData.travelBudget = $scope.travelBudget;
        travelData.minorTravelBudget = $scope.minorBudget;
        travelData = JSON.stringify(travelData);
        var formElement=angular.element('<form\>');
        formElement.attr("action","/"+'showPlacesAndHotels');
        formElement.attr("method","POST");
        var d=angular.element("<input type='hidden'/>");
        d.attr("name","travelData");
        d.attr("value",travelData);
        formElement.append(d);
        var body=angular.element(document.querySelectorAll("body"));
        body.append(formElement);
        formElement.submit();
    };
});
