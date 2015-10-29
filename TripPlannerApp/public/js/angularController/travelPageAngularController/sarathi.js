routesModule.directive('postRepeat', ['$timeout', function($timeout) {
    return function($scope,$rootScope, element, $attrs) {

        if ($scope.$last){
            $timeout(function (){
                if(element.class=="panel-travel")
                {
                    //console.log("in panel-travel");
                    //console.log("scrollHeightTravel:"+$("#transcludeTravelPanel")[0].scrollHeight);
                    $scope.$emit('initialize-pane',"travelPanel");
                }
            },100);
            $timeout(function (){
                if(element.class=="panel-travelMode"){
                    //console.log("in panel-travelMode");
                    //console.log("scrollHeightTravelModes:"+$("#transcludeTravelModesPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"travelModesPanel");
                }
            },1000);
            $timeout(function (){
                if(element.class=="panel-trainMode"){
                    //console.log("in panel-trainMode");
                    //console.log("scrollHeightTrainMode:"+$("#transcludeTrainPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"trainPanel");
                }
            },1000);
            $timeout(function (){
                if(element.class=="panel-flightMode"){
                    //console.log("in panel-flightMode");
                    //console.log("scrollHeightFlightMode:"+$("#transcludeFlightPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"flightPanel");
                }
            },1000);
            $timeout(function (){
                if(element.class=="panel-busMode"){
                    //console.log("in panel-busMode");
                    //console.log("scrollHeightBusMode:"+$("#transcludeBusPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"busPanel");
                }
            },100);
            $timeout(function (){
                if(element.class=="panel-cabOperatorMode panel panel-default panel panel-default"){
                    console.log("in panel-cabOperatorMode");
                    //console.log("scrollHeightcabOperatorMode:"+$("#transcludecabOperatorPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"cabOperatorPanel");
                }
            },100);
        }
    };
}]);

routesModule.controller('sarthiController', ['$scope', '$rootScope', '$http', '$q', '$location', 'orderedCities', '$timeout', '$cookies', '$window', function($scope, $rootScope, $http, $q, $location, orderedCities, $timeout, $cookies, $window) {

    $scope.isTravelPanelOpen=false;
    $scope.isTravelModesPanelOpen=false;

    $scope.isTripPanelSetCollapsed = false;
    $scope.isModeDetailsPanelOpen = false;

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
    $scope.isDriveClicked = false;
    $scope.isCabOperatorClicked = false;
    $scope.cabDetails = [];
    $scope.currentSegment = null;
    $scope.currentRoute = null;
    $scope.currentRouteIndex = -1;

    $scope.cabDetailToggle = [];
    $scope.cabDate = null;
    $scope.isBudgetPanelOpen = false;

    $scope.travelBudgetText = "Travel Expenses";
    $scope.totalBudgetText = "Your Budget";
    $scope.minorBudgetText = "Minor Travel Expenses";
    $scope.totalBudget = 0;
    $scope.travelBudget = 0;
    $scope.minorBudget = 0;
    $scope.isTravelPanelDisable = false;
    $scope.altTrip = true;
    $scope.segmentHoverClass = "segment-hover";

    $scope.vehicleLimit = 7;

    $scope.dpopen = false;
    var defaultRouteData = null;
    var alternateRouteData = null;
    var isOtherTripClicked = false;
    var dateSet = null;
    var outOfBudgetFactor = 0.7;
    var minimumTimeSpentInCityInHours = 4;
    var travelData=null;
    var MINUTES_TO_MILLISECONDS = 60*1000;
    var HOURS_TO_MILLISECONDS = MINUTES_TO_MILLISECONDS*60;
    var DAYS_TO_MILLISECONDS = HOURS_TO_MILLISECONDS*24;
    var itineraryInputs = null;

    var isGuideOpened = false;

    var itineraryID;

    //For MixPanel
    var tripTypeSwappedCount = 0;
    var openTravelModesPanelCount = 0;
    var openModeDetailsPanelCount = 0;
    var travelModeChangedCount = 0;
    var cabOperatorClickCount =0;

    $scope.mobilePanelOpen = {
        map: false,
        budget: false,
        alert: false,
        travelMode:true
    };

    $scope.openDateDropdown = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.vehicleDate[index].opened = !$scope.vehicleDate[index].opened;
    };

    $scope.openDateDropdownCab = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.cabDate.opened = !$scope.cabDate.opened;
    };

    $scope.getDateDropdownOpenClass = function(index){
        if($scope.vehicleDate[index].opened){
            return "open";
        }
        return "";
    };

    $scope.getDateDropdownOpenClassCab = function(){
        console.log("in getDateDropdownOpenClassCab");
        if($scope.cabDate.opened){
            return "open";
        }
        return "";
    };

    $scope.setCurrentDateInDropdown = function(index, vehicleIndex){
        $scope.vehicleDate[vehicleIndex].dt = $scope.vehicleDate[vehicleIndex].dateLimits[index];
        $scope.vehicleDate[vehicleIndex].opened = false;
    };

    $scope.setCurrentDateInDropdownCab = function(index){
        $scope.cabDate.dt = $scope.cabDate.dateLimits[index];
        $scope.cabDate.opened = false;
    };

    $scope.openMobilePanel = function(panelName){

        for(var name in $scope.mobilePanelOpen){
            $scope.mobilePanelOpen[name] = false;
        }
        $scope.mobilePanelOpen[panelName] = true;
    };

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

    $scope.IntroOptions = {
        steps: [
            {
                element:  '#travelPanelIntro',
                intro: "Click to Customize Travel Options",
                position: "right"
            },
            {
                element: '#budgetPanel',
                intro: "Keep track of the budget as you modify travel options"
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

    function openPanel() {
        $timeout(function openTravelPanel() {
            $scope.isTravelPanelOpen = true;
            console.log('function timedout:'+$scope.isTravelPanelOpen);
        }, 400);
    }

    $scope.openTravelModesPanel = function(leg, clickEvent, index) {
        openTravelModesPanelCount++;//For MixPanel
        if($scope.isModeDetailsPanelOpen) {
            $scope.isModeDetailsPanelOpen = false;
        }
        $scope.isTravelModesPanelOpen = !$scope.isTravelModesPanelOpen;
        $scope.currentLeg = leg;
        $scope.currentLegIndex = index;
        console.log('currentLegIndex:'+index);
        $scope.routes = leg.routes;
        clickEvent.stopPropagation();
    };

    $scope.openModeDetailsPanel = function(segment,route,routeIndex, clickEvent, custom) {
        openModeDetailsPanelCount++;//For MixPanel
        $scope.currentSegment = segment;
        $scope.currentRoute = route;
        $scope.currentRouteIndex = routeIndex;
        $scope.isTrainClicked = false;
        $scope.isFlightClicked = false;
        $scope.isBusClicked = false;
        $scope.isCabOperatorClicked = false;
        $scope.isCabClicked = false;
        $scope.isDriveClicked = false;
        $scope.isTaxiClicked = false;
        $scope.isModeDetailsPanelOpen = !$scope.isModeDetailsPanelOpen;

        if(segment.kind == "train") {
            $scope.isTrainClicked = true;
            initializeVehicleDates(segment.trainData,segment.startTime);
            $scope.trains = segment.trainData;
            $scope.vehicleLimit = 7;
            $timeout(function() {
                $scope.vehicleLimit = undefined;
            }, 1000);
        }
        else if(segment.kind == "flight") {
            $scope.isFlightClicked = true;
            initializeVehicleDates(segment.flightData,segment.startTime);
            $scope.vehicleLimit = undefined;
            $scope.flights = segment.flightData;
            //$timeout(function() {
            //    initializeVehicleDates(segment.flightData.slice(7),segment.startTime);
            //    $scope.vehicleLimit = undefined;
            //}, 3000);
        }
        else if(segment.kind == "bus")
        {
            $scope.isBusClicked = true;
            initializeVehicleDates(segment.busData,segment.startTime);
            $scope.buses = segment.busData;
            $scope.vehicleLimit = 7;
            $timeout(function() {
                $scope.vehicleLimit = undefined;
            }, 1000);
        }
        else if(segment.kind=="car"){
            if(segment.subkind != undefined && segment.subkind == "cab") {
                if(custom != undefined) {
                    if(custom == 'cabOperator') {
                        cabOperatorClickCount++;//For MixPanel
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
                if(custom == 'cabTimings'){
                    initializeCabDates(segment.startTime);
                }
            }
            if(segment.subkind == "car")
            {
                $scope.isDriveClicked = true;
                if(custom == 'cabTimings'){
                    initializeCabDates(segment.startTime);
                }
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
        $scope.isTravelPanelOpen = true;
        itineraryID = $location.absUrl().split('/')[4].replace(/[^0-9a-z]/g,"");
        $rootScope.$emit('gettingData');
        getRoutes(itineraryID);
    });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function openTravelGuide(){
        isGuideOpened = true;
        var visitedStatus = $cookies.get('visitedStatus');
        var currentDate = new Date();
        var options = {
            expires: new Date(currentDate.getTime() + 30*24*60*60*1000)
        };
        console.log('visitedStatus:'+visitedStatus);
        if(visitedStatus != undefined && visitedStatus != null){
            //Cookie is present
            visitedStatus = JSON.parse(visitedStatus);
            //visitedStatus = JSON.parse(visitedStatus);//Double parsing as 1 parse returns string
            var travelPanelIntro = visitedStatus.travelPanelIntro;
            console.log(typeof visitedStatus);
            console.log(travelPanelIntro);
            if(!(travelPanelIntro != undefined && travelPanelIntro)){
                //travelPanelIntro cookie not present
                $scope.introFunction();
                visitedStatus.travelPanelIntro = true;
                $cookies.put('visitedStatus', JSON.stringify(visitedStatus), options);
            }
        }
        else{
            //Cookie is not present
            $scope.introFunction();
            $cookies.put('visitedStatus', JSON.stringify({
                travelPanelIntro: true
            }), options);
        }
    }

    $rootScope.$on('showTravelPanel', function onShowTravelPanel(event, data) {
        openPanel();
        $rootScope.$emit('gettingData');
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

    $rootScope.$on('guide',function onGuide(){
        if(isGuideOpened){
            $scope.introFunction();
        }
    });

    function getRoutes(itineraryID)
    {
        var getItineraryQuery = "/getItineraryInputs/"+itineraryID;
        $http.get(getItineraryQuery).then(
            function onSuccess(response){
                console.log('Get Itinerary Inputs Success');
                itineraryInputs = response.data;
            },
            function onFailure(response){
                console.log("Get Itinerary Inputs Failed:"+JSON.stringify(response));

            }
        );
        var randomString = Math.random(); //For forcing
        var queryString = "/showRoutes/"+itineraryID+"?nocache="+randomString;
        $http.get(queryString).success(function(data,status){
            //MixPanel Timimg
            mixPanelTimeEvent('Submit Routes');
            $rootScope.$emit('dataLoaded');
            $scope.isTravelPanelDataHidden = false;
            //console.log("showRoutes response:"+JSON.stringify(data));
            if(data.tripNotPossible != undefined && data.tripNotPossible == 1) {
                console.log('Page NOT FOUND');
                $window.location.href = '/tripNotPossible';
            }
            else {
                dateSet = data.dateSet;

                if(data.withoutTaxiRome2rioData==null)
                {
                    defaultRouteData = data.withTaxiRome2rioData;
                    alternateRouteData = null;
                }
                else if(data.withTaxiRome2rioData==null)
                {
                    defaultRouteData = data.withoutTaxiRome2rioData;
                    alternateRouteData = null;
                }
                else{
                    if(data.withoutTaxiRome2rioData.isMajorDefault == 1) {
                        defaultRouteData = data.withoutTaxiRome2rioData;
                        alternateRouteData = data.withTaxiRome2rioData;
                    }
                    else {
                        defaultRouteData = data.withTaxiRome2rioData;
                        alternateRouteData = data.withoutTaxiRome2rioData;
                    }
                }
                getAttributesFromRouteData(defaultRouteData);
                showCurrentRouteOnMap();
                showBudget(data.userTotalbudget);
                $scope.isBudgetPanelOpen = true;
                travelData  = data;
                if($window.innerWidth>=992)//only for desktop
                {
                    openTravelGuide();
                }
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
                    leg.defaultRouteIndex = routeIndex;
                }
            }
        }
        $scope.legs = routeData.rome2RioData;
    }

    function showCurrentRouteOnMap() {
        //var destinations = getParameterByName('dsts').split(";");
        var destinations = itineraryInputs.destinationCities;
        var originCity  =  itineraryInputs.originCity;
        //if(destinations.length==1) {
            //need to plot markers if only one destination
            var data = {
                origin:originCity,
                destinations:destinations
            };
            $rootScope.$emit('plotMarkers',data);
        //}
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
                    majorBudget += parseInt(segment[segmentIndex].indicativePrice.price, 10);
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
                    minorBudget += parseInt(segment[segmentIndex].indicativePrice.price, 10);
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

    $scope.getModeClass = function(route,segment){
        if(route.isDefault!=undefined && route.isDefault ==1)
        {
            if(route.majorCount>0 && segment.isMajor==1 && (segment.startTime==undefined||segment.startTime==null))
            {
                return "segment-warning";
            }
            return "default-route";
        }
        return "";
    };

    $scope.onTaxiDetailsLeave = function(){
        $scope.segmentHoverClass = "segment-hover";
    };

    $scope.onTaxiDetailsHover = function(){
        $scope.segmentHoverClass = "";
    };

    $scope.getIconClass = function(route)
    {
        if(route.isDefault!=undefined && route.isDefault ==1)
        {
            return "icon-default icon-hover";
        }
        return "";
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
        var duration = parseInt(segment.duration, 10);
        var hours = parseInt(duration/60, 10);
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
            if($scope.isTravelModesPanelOpen){
                $scope.isTravelModesPanelOpen=false;
            }
            if($scope.isModeDetailsPanelOpen){
                $scope.isModeDetailsPanelOpen=false;
            }
        }
        else if(panelNo==2){
            //travel modes panel clicked
            if($scope.isModeDetailsPanelOpen) {
                $scope.isModeDetailsPanelOpen = false;
            }
        }
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
    };

    $scope.isShowOtherTrip = function(){
        if(alternateRouteData!=null)
        {
            return true;
        }
        return false;
    };

    $scope.showOtherTrip = function() {
        tripTypeSwappedCount++;
        $scope.isTripPanelSetCollapsed = true;
        isOtherTripClicked = !isOtherTripClicked;
        $timeout(function openCollapsedPanelSet(){
            var swapRouteData = alternateRouteData;
            alternateRouteData = defaultRouteData;
            defaultRouteData = swapRouteData;
            getAttributesFromRouteData(defaultRouteData);
            $scope.isTripPanelSetCollapsed = false;
            showCurrentRouteOnMap();
            alertAndSetTravelBudget();
        },1000);
    };

    $scope.getOtherTripText = function(){
        console.log("getOtherTripText Called");
        console.log("isOtherTripClicked"+isOtherTripClicked);
        if(defaultRouteData.isCabTrip!=undefined && defaultRouteData.isCabTrip==1)
        {
            if(isOtherTripClicked)
            {
                $scope.altTrip = false;
                return "Option 2";
            }
            else
            {
                $scope.altTrip = true;
                return "Option 1";
            }
        }
        else
        {
            if(isOtherTripClicked)
            {
                $scope.altTrip = false;
                return "Option 2";
            }
            else
            {
                $scope.altTrip = true;
                return "Option 1";
            }
        }
    };

    $scope.isSegmentShown = function(segment,leg) {
        if( segment.majorIndex == leg.defaultRoute.majorCount)
        {
            return true;
        }
        //if(segment.kind == 'car') {
        //    if(segment.subkind != undefined && segment.subkind == "cab") {
        //        if(segment.startCabTrip != undefined && segment.startCabTrip == 1) {
        //            return true;
        //        }
        //        else {
        //            //hack
        //            return true;
        //            //return false;
        //        }
        //    }
        //}
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

    $scope.isPriceShown = function(segment){
        if(segment.kind == 'car') {
            if(segment.subkind != undefined && segment.subkind == "cab") {
               return false;
            }
        }
        return true;
    };

    $scope.isPanelFooterShown = function(segment){
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
        return false;
    };

    $scope.getStartCityForTaxi = function(segment){
      return segment.carLegDetails[0];
    };

    $scope.getEndCityForTaxi = function(segment){
        return segment.endCity;
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
        travelModeChangedCount++;//For MixPanel
        var allSegmentSelected = false;
        if($scope.vehicleDate[$index].dt == null) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dpopen = true;
            $scope.vehicleDate[$index].opened = true;
        }
        else {
            var startTime=new Date($scope.vehicleDate[$index].dt);
            var hours=parseInt(vehicle.OriginDepartureTime.split(":")[0], 10);
            var minutes = parseInt(vehicle.OriginDepartureTime.split(":")[1], 10);
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
            else if($scope.isBusClicked){
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

                //set isDefault and isFinal to 0 for existed default route
                clearIsDefaultAndIsFinal();
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

            if(vehicle.fare != undefined) {
                $scope.currentSegment.indicativePrice.price = vehicle.fare;
            }

            vehicle.date = startTime;
            allSegmentSelected = isAllSegmentsSelected();
            if( !allSegmentSelected)
            {
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = true;
            }
            else {
                $scope.isTravelModesPanelOpen = false;
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = false;
            }
        }
        if(allSegmentSelected)
        {
            showCurrentRouteOnMap();
            alertAndSetTravelBudget();
        }
    };

    $scope.addCabToTrip = function($event){

        var cabStartTime = $scope.cabDate.dt;
        if(cabStartTime == null||cabStartTime==undefined) {
            $scope.openCabDate($event);
        }
        else {
            //set isDefault and isFinal to 0 for existed default route
            clearIsDefaultAndIsFinal();
            $scope.currentLeg.defaultRoute = $scope.currentRoute;
            $scope.currentRoute.isDefault =1;
            $scope.currentSegment.startTime = cabStartTime;
            $scope.currentSegment.endTime = addMinutes(cabStartTime,$scope.currentSegment.duration);
            console.log($scope.currentSegment.endTime);
            var allSegmentSelected = isAllSegmentsSelected();
            if( !allSegmentSelected)
            {
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = true;
            }
            else {
                $scope.isTravelModesPanelOpen = false;
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = false;
                showCurrentRouteOnMap();
                alertAndSetTravelBudget();
            }
        }
    };

    $scope.getAddButtonClass = function(vehicle) {
        if(vehicle!=undefined && vehicle.isFinal != undefined && vehicle.isFinal == 1) {
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

    $scope.getAddButtonClassForTaxiOrDrive = function() {
        if(  $scope.currentRoute.isDefault ==1)
        {
            return "btn-success";
        }
        return "btn-primary";
    };

    $scope.getAddButtonTextForTaxiOrDrive = function(){
        if(  $scope.currentRoute.isDefault ==1)
        {
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

    function isAllSegmentsSelected()
    {
        var currentDefaultRoute = $scope.currentRoute;
        if(currentDefaultRoute.majorCount>0)
        {
            //more than one major segments
            var segments = currentDefaultRoute.segments;
            for(var segmentIndex = 0;segmentIndex<segments.length;segmentIndex++)
            {
                if(segments[segmentIndex].isMajor==1 && (segments[segmentIndex].startTime==undefined||segments[segmentIndex].startTime==null))
                {
                    return false;
                }
            }
        }
        return true;
    }

    function clearIsDefaultAndIsFinal(){

        for(var routeIndex in $scope.currentLeg.routes)
        {
            if($scope.currentRouteIndex!=routeIndex)//not for current route
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
                        if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].kind=="bus"))
                        {
                            segments[segmentIndex].startTime = null;
                            segments[segmentIndex].endTime = null;
                            for(var busIndex in segments[segmentIndex].busData)
                            {
                                var bus = segments[segmentIndex].busData[busIndex];
                                if(bus.isFinal!=undefined && bus.isFinal==1)
                                {
                                    console.log("bus final 0:"+busIndex);
                                    bus.isFinal = 0;
                                }
                            }
                        }
                        if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].subkind=="taxi"||segments[segmentIndex].subkind=="car"))
                        {
                            segments[segmentIndex].startTime = null;
                            segments[segmentIndex].endTime = null;
                        }
                    }
                }
            }
        }
    }

    function getDurationFromStartEndTime(startTime,endTime,originDay,destDay){
        var startHours=parseInt(startTime.split(":")[0], 10);
        var startMins=parseInt(startTime.split(":")[1], 10);
        var endHours=parseInt(endTime.split(":")[0], 10);
        var endMins=parseInt(endTime.split(":")[1], 10);
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
        return duration;
    }

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
        $scope.currentSegment.indicativePrice.price = operator.ActualCabPrice;
        $scope.isTravelModesPanelOpen = false;
        $scope.isModeDetailsPanelOpen = false;
        alertAndSetTravelBudget();
    };
    /*
     * This is the part dealing with datepicker
     */

    function initializeVehicleDates(vehicleData, startTime){
        $scope.vehicleDate=[];
        for(var i = 0; i < vehicleData.length; i++){
            var vehicleDate;
            if(vehicleData[i].dateLimits.length > 1) {
                vehicleData[i].dateLimits.sort(getTimeDifference);
                if(vehicleData[i].isFinal != undefined && vehicleData[i].isFinal == 1){
                    vehicleDate = {
                        dt:startTime,
                        opened:false,
                        disabled:false,
                        dateLimits:vehicleData[i].dateLimits,
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
                        dateLimits:vehicleData[i].dateLimits,
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
                    dateLimits:vehicleData[i].dateLimits,
                    minDate:vehicleData[i].dateLimits[0],
                    maxDate:vehicleData[i].dateLimits[0]
                };
            }
            else {
                vehicleDate = {
                    dt:null,
                    opened:false,
                    disabled:false,
                    dateLimits:vehicleData[i].dateLimits,
                    minDate:null,
                    maxDate:null
                };
            }
            $scope.vehicleDate.push(vehicleDate);
        }
        function getTimeDifference(a,b) {
            a = new Date(a);
            b = new Date(b);
            return a.getTime() - b.getTime();
        }
    }

    function initializeCabDates(startTime){
        var minDate = new Date(dateSet.dateStart[$scope.currentLegIndex]);
        var maxDate = new Date(dateSet.dateEnd[$scope.currentLegIndex]);
        var dt = null;
        var disabled = false;
        minDate.setHours(0,0,0,0);
        maxDate.setHours(0,0,0,0);
        if (maxDate.getTime() - minDate.getTime() == 0) {
            disabled = true;
        }

        console.log(minDate);
        console.log(maxDate);

        var dateLimits = [];
        var currentDate = new Date(minDate.getTime());

        while(currentDate.getTime() <= maxDate.getTime()){
            dateLimits.push(new Date(currentDate.getTime()));
            currentDate.setTime(currentDate.getTime() + DAYS_TO_MILLISECONDS);
        }

        console.log('DateLimits:'+dateLimits);

        if($scope.currentRoute.isDefault != undefined && $scope.currentRoute.isDefault == 1) {
            dt = startTime;
        }
        $scope.cabDate = {
            dt:dt,
            opened:false,
            disabled:disabled,
            dateLimits:dateLimits,
            minDate:minDate,
            maxDate:maxDate
        };
    }
    $scope.openCabDate=function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.cabDate.opened = true;
    };

    $scope.vehicleDate=[];

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.open = function($event,index) {
        $event.preventDefault();
        $event.stopPropagation();
        for(var i = 0; i < $scope.vehicleDate.length; i++) {
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

    $scope.getHours = function(){
        if($scope.cabDate.dt == null)
        {
            return "00";
        }
        else
        {
            if($scope.cabDate.dt.getHours()<10)
            {
                return "0"+$scope.cabDate.dt.getHours();
            }
            else
            {
                return $scope.cabDate.dt.getHours();
            }
        }
    };

    $scope.getMins = function(){
        if($scope.cabDate.dt == null)
        {
            return "00";
        }
        else
        {
            if( $scope.cabDate.dt.getMinutes()<10)
            {
                return "0"+$scope.cabDate.dt.getMinutes();
            }
            else
            {
                return $scope.cabDate.dt.getMinutes();
            }
        }
    };

    $scope.incrementHours = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else
        {
            var increasedDate = new Date($scope.cabDate.dt.getTime() + 1*HOURS_TO_MILLISECONDS);
            if(increasedDate<=new Date($scope.cabDate.maxDate.getTime() + 23*HOURS_TO_MILLISECONDS)) {
                $scope.cabDate.dt = increasedDate;
            }
        }
    };

    $scope.incrementMinutes = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else
        {
            var increasedDate = new Date($scope.cabDate.dt.getTime() + 15*60*1000);
            if(increasedDate<=new Date($scope.cabDate.maxDate.getTime() + 23*HOURS_TO_MILLISECONDS + 45*60*1000)) {
                $scope.cabDate.dt = increasedDate;
            }
        }
    };

    $scope.decrementHours = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else {
            var decreasedDate = new Date($scope.cabDate.dt.getTime() - 1 * HOURS_TO_MILLISECONDS);
            if (decreasedDate >= $scope.cabDate.minDate) {
                $scope.cabDate.dt = decreasedDate;
            }
        }
    };

    $scope.decrementMinutes = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else {
            var decreasedDate = new Date($scope.cabDate.dt.getTime() - 15 * 60 * 1000);
            if (decreasedDate >= $scope.cabDate.minDate) {
                $scope.cabDate.dt = decreasedDate;
            }
        }
    };

    $scope.getDayNightNumInDestination = function(index){

        if(index>0 && index<=$scope.legs.length-1)
        {

            var previousLeg = $scope.legs[index-1];
            var destArrivalTime = null;
            var destDepartTime = null;
            //get the end time of the last major segment of previous leg
            for(var i=0;i<previousLeg.defaultRoute.segments.length;i++)
            {
                if(previousLeg.defaultRoute.segments[i].isMajor==1)
                {
                    destArrivalTime = new Date(previousLeg.defaultRoute.segments[i].endTime);
                }
            }
            //get the startTime of current leg first major segment
            var currentLeg = $scope.legs[index];
            for(var k =0;k<currentLeg.defaultRoute.segments.length;k++)
            {
                if(currentLeg.defaultRoute.segments[k].isMajor ==1)
                {
                    destDepartTime = new Date(currentLeg.defaultRoute.segments[k].startTime);
                    break;
                }
            }

            if(destArrivalTime>destDepartTime)
            {
                return "0 days";
            }

            var numDays = 0;
            var numNights = 0;
            var inBetween = 0;

            var arrivalHour = destArrivalTime.getHours();
            var departHour = destDepartTime.getHours();

            if(arrivalHour<3)
            {
                numNights+=2;
                numDays+=1;
            }
            else if(arrivalHour<16)
            {
                numDays+=1;
                numNights+=1;
            }
            else
            {
                numNights+=1;
            }

            if(departHour>12)
            {
                numDays+=1;
            }

            var destArrivalTimeClone = new Date(getTimeFromDate(destArrivalTime));
            destArrivalTimeClone.setDate(destArrivalTimeClone.getDate()+1);
            destArrivalTimeClone.setHours(0,0,0,0);
            var destDepartTimeClone = new Date(getTimeFromDate(destDepartTime));
            destDepartTimeClone.setHours(0,0,0,0);

            inBetween += (getTimeFromDate(destDepartTimeClone) - getTimeFromDate(destArrivalTimeClone)) / (DAYS_TO_MILLISECONDS);
            numDays+=inBetween;
            numNights+=inBetween;
            //if(getTimeFromDate(hotelDetails.checkOutTime) > getTimeFromDate(checkOutTimeClone)) {
            //    numberOfDaysInHotel += 1;
            //}

            if(numDays>0 && numNights>0)
            {
                return numDays+" Days,"+numNights+" Nights";
            }
            else if(numDays>0)
            {
                return numDays+" Days";
            }
            else if(numNights>0)
            {
                return numNights+" Nights";
            }
            else
            {
                return "0 days";
            }
        }
        else
        {
            return "";
        }

        //var startDestDateWithTime = null;
        //var endDestDateWithTime = null;
        //var lastMajorSegment = null;
        //for(var i=0;i<segments.length;i++)
        //{
        //    if(segments[i].isMajor==1)
        //    {
        //        lastMajorSegment = segments[i];
        //        if(startDestDateWithTime==null)
        //        {
        //            //first major segment
        //            startDestDateWithTime = new Date(segments[i].startTime);
        //        }
        //    }
        //}
        //if(lastMajorSegment!=null)
        //{
        //    endDestDateWithTime = new Date(lastMajorSegment.endTime);
        //}
        //
        //return(startDestDateWithTime+","+endDestDateWithTime);
        //console.log(startDestDateWithTime+","+endDestDateWithTime);
    };

    function getTimeFromDate(date){
        if(date instanceof Date){
            return date.getTime();
        }
        date = new Date(date);
        return date.getTime();
    }

    /**
     * Submit Button
     */
    $rootScope.$on('submitTravel',function onSubmitTravel(event, data)
    {
        //MixPanel Tracking
        mixPanelTrack('Submit Routes', {
            "SingleTypeTrip": !$scope.isShowOtherTrip(),
            "TripTypeSwapCount": tripTypeSwappedCount,
            "ModeDetailsPanelClickedCount": openModeDetailsPanelCount,
            "TravelDetailsPanelClickedCount": openTravelModesPanelCount,
            "TravelModeChangedCount": travelModeChangedCount,
            "CabOperatorClickCount": cabOperatorClickCount
        });
        console.log("submitTravel");
        console.log(defaultRouteData);
        if(defaultRouteData!=null)
        {
            defaultRouteData.isMajorDefault=1;
        }
        if(alternateRouteData!=null){
            alternateRouteData.isMajorDefault = 0;
        }
        if(travelData.withTaxiRome2rioData!=null && travelData.withTaxiRome2rioData.isMajorDefault==1)
        {
            delete travelData.withoutTaxiRome2rioData;
        }
        else
        {
            delete travelData.withTaxiRome2rioData;
        }
        travelData.travelBudget = $scope.travelBudget;
        travelData.minorTravelBudget = $scope.minorBudget;

        var requestURL = "/putRoutesData/"+itineraryID;

        $http({
            method: "PUT",
            url: requestURL,
            data: travelData
        })
            .then(
            function success(response){
                console.log('RESPONSE:'+JSON.stringify(response.data));
            },
            function error(response){
            }
        );

        travelData = JSON.stringify(travelData);
        var formElement=angular.element('<form>');
        formElement.attr("action","/"+'showPlacesAndHotels/'+itineraryID);
        formElement.attr("method","GET");
        var body=angular.element(document.querySelectorAll("body"));
        body.append(formElement);
        formElement.submit();
    });
}]);
