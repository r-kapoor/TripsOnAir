itineraryModule.directive('postRepeat', ['$timeout', function($timeout) {
    return function($scope,$rootScope, element, $attrs) {
        //console.log("element:"+element.class);

        if ($scope.$last){
            //console.log("last");
            $timeout(function (){
                if(element.class=="panel-places clearfix")
                {
                    //console.log("in panel-places");
                    //console.log("scrollHeightTravel:"+$("#transcludePlacesPanel")[0].scrollHeight);
                    $scope.$emit('initialize-pane',"placesPanel");
                }
            },1000);
            $timeout(function (){
                if(element.class=="panel-hotels clearfix")
                {
                    //console.log("in panel-hotels");
                    //console.log("scrollHeightTravel:"+$("#transcludeHotelsPanel")[0].scrollHeight);
                    $scope.$emit('initialize-pane',"hotelsPanel");
                }
            },1000);
        }
    };
}]);

itineraryModule.controller('shakuniController', ['$scope', '$rootScope', '$http','$modal', '$timeout', '$document','$filter','mapData', '$cookies', '$location','$window', function($scope, $rootScope, $http,$modal, $timeout, $document,$filter,mapData, $cookies, $location,$window) {

    $scope.origin = null;
    $scope.destinations = null;
    $scope.destinationsWiseStops = null;
    $scope.isItineraryPlanned= false;
    $scope.stops = null;
    $scope.numberOfPeople = 0;
    $scope.allPlaces = [];
    $scope.allHotels=[];
    $scope.leftPanel = 'places';
    $scope.mobileViewLabel = 'Map';
    $scope.lowerPanelContent = 'default';
    $scope.replaceLabel = 'Replace';
    $scope.currentDestination = null;

    $scope.stopClickClass = 'cursor-click';

    $scope.currentStartTime = new Date();
    $scope.currentEndTime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;
    $scope.isFixItinerary = {
        fix:true
    };
    $scope.isDataLoaded = false;

    $scope.currentDate = null;
    $scope.currentDay = null;
    $scope.isDateBarCollapsed = false;
    $scope.destinationsWithStop = [];//Only used in showCityPanel

    $scope.isBudgetPanelOpen = false;
    $scope.isMobileAlertPanelShown = false;
    $scope.isItineraryPanelOpen = true;
    $scope.totalBudgetText = "Budget";
    $scope.totalExpensesText = "Total Expenses";
    $scope.travelBudgetText = "Travel Expenses";
    $scope.otherCitiesBudgetText = "Other Destination(s) Expenses";
    $scope.cityBudgetText = "";
    $scope.hotelExpensesText = "";
    $scope.localTravelAndFoodText = "Food & Local Travel";
    $scope.placesExpensesText = "Places Entry Fee";

    $scope.totalBudget = 0;
    $scope.travelBudget = 0;
    $scope.hotelExpenses = 0;
    $scope.localTravelAndFoodExpenses = 0;
    $scope.placesExpenses = 0;
    $scope.cityExpenses = 0;
    $scope.otherCitiesExpenses = 0;
    $scope.totalExpenses = 0;

    $scope.isHover = true;

    $scope.isNewPlace = false;
    $scope.animationsEnabled = true;
    $scope.replaceData = {
        isSwap: false,
        placeIndex: -1
    };
    $scope.replacePlaceOn = false;
    $scope.showPlacesForCustomization = false;
    $scope.showHotelsForCustomization = false;
    $scope.showMap = false;
    $scope.isCustomizationOn = false;
    var responseData;

    var SPEED = 15;//km/hr
    var RATIO = 0.75;
    var MORNING_CHECK_IN_DURATION = 2;//hrs
    var CHECK_OUT_DURATION = 4;//hrs
    var REST_TIME = 8;//hrs

    var MINUTES_TO_MILLISECONDS = 60*1000;
    var HOURS_TO_MILLISECONDS = MINUTES_TO_MILLISECONDS*60;
    var DAYS_TO_MILLISECONDS = HOURS_TO_MILLISECONDS*24;
    var MAX_RATIO = 1.5;
    var PER_DAY_FOOD_AND_LOCAL_TRAVEL = 1000;

    var removedPlacesList = [];

    var itineraryID;

    //Mix Panel
    var mapClickCount = 0;
    var budgetClickCount = 0;
    var changeTimingsCount = 0;

    $scope.IntroOptions = {
        steps: [
            {
                element: '#destinationsIntro',
                intro: "Switch between destinations",
                position: "bottom"
            },
            {
                element: '#itineraryPanelIntro',
                intro: "View the itinerary of the destination. Click X to remove the place. Click the timing to edit the timing of visit.",
                position: "left"
            },
            {
                element:  '#leftPanelIntro',
                intro: "Add or replace Places, change Hotel and View Map of the Itinerary",
                position: "right"
            },
            {
                element: '#saveButton',
                intro: "Save and Download the itinerary when done"
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


    //TODO: while adding the place update isSelectedFlag in placeTimings

    $scope.getItinerary = function(){
        itineraryID = $location.absUrl().split('/')[4].replace(/[^0-9a-z]/g,"");

        var randomString = Math.random(); //For forcing
        var queryString = "/planItinerary/"+itineraryID+"?nocache="+randomString;

        $http.get(queryString).success(function(data,status){
            //Mix Panel
            //mixpanel.time_event("CustomizePlaces");
            //mixpanel.time_event("CustomizeHotels");
            //mixpanel.time_event("SaveItinerary");
            mixPanelTimeEvent('CustomizePlaces');
            mixPanelTimeEvent('CustomizeHotels');
            mixPanelTimeEvent('SaveItinerary');

            responseData = data;
            $scope.origin=data.origin;
            $scope.destinations = data.destinations;
            $scope.stops = data.destinationsWiseStops;
            $scope.numberOfPeople = parseInt(data.numPeople);
            $scope.currentDestination = $scope.destinations[0];
            $scope.currentDestination.isCurrent = true;
            $scope.currentDay = 0;

            var stopIndex = 0, stop = null;
            //only for showCityPanel
            if($scope.stops[0]!=undefined)
            {
                for(stopIndex =0;stopIndex<$scope.stops[0].length;stopIndex++)
                {
                    stop = $scope.stops[0][stopIndex];
                    stop.isDestination = false;
                    $scope.destinationsWithStop.push(stop);
                }
            }

            for(var destinationIndex = 0;destinationIndex<$scope.destinations.length;destinationIndex++)
            {
                var destinationWithStop = [];
                var destination = $scope.destinations[destinationIndex];
                destination.isDestination = true;
                $scope.destinationsWithStop.push(destination);
                if($scope.stops[destinationIndex+1]!=undefined)
                {
                    for(stopIndex =0;stopIndex<$scope.stops[destinationIndex+1].length;stopIndex++)
                    {
                        stop = $scope.stops[destinationIndex+1][stopIndex];
                        stop.isDestination = false;
                        $scope.destinationsWithStop.push(stop);
                    }
                }
            }
            $scope.travelBudget = parseInt(data.travelBudget) + parseInt(data.minorTravelBudget);

            $scope.totalBudget = parseInt(data.userTotalbudget);
            setBudgetModels();
            setDestinationSpecificModels();

            $scope.isItineraryPlanned=true;
            initializeMapDataArray();
            $scope.currentDestination.position = {
                Latitude:parseFloat($scope.currentDestination.pos.split(',')[0]),
                Longitude:parseFloat($scope.currentDestination.pos.split(',')[1])
            };
            //console.log('Data Loaded');
            calculatePlacesExpenses();
            calculateCityExpenses();
            $rootScope.$emit('dataLoaded');
            $scope.isDataLoaded = true;
            if($window.innerWidth>=992)//only for desktop
            {
                openTravelGuide();
            }
            //$rootScope.$emit('loadMap',$scope.currentDestination.position);
        })
            .error(
            function(data, status) {
                //console.log(data || "Backend Request failed");
            });
    };

    function openTravelGuide() {
        var visitedStatus = $cookies.get('visitedStatus');
        var currentDate = new Date();
        var options = {
            expires: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        };
        //console.log('visitedStatus:' + visitedStatus);
        if (visitedStatus != undefined && visitedStatus != null) {
            //Cookie is present
            visitedStatus = JSON.parse(visitedStatus);
            //visitedStatus = JSON.parse(visitedStatus);//Double parsing as 1 parse returns string
            var itineraryPanelIntro = visitedStatus.itineraryPanelIntro;
            //console.log(typeof visitedStatus);
            //console.log(itineraryPanelIntro);
            if (!(itineraryPanelIntro != undefined && itineraryPanelIntro)) {
                //        //itineraryPanelIntro cookie not present
                $scope.introFunction();
                visitedStatus.itineraryPanelIntro = true;
                $cookies.put('visitedStatus', JSON.stringify(visitedStatus), options);
            }
        }
        else {
            //Cookie is not present
            $scope.introFunction();
            $cookies.put('visitedStatus', JSON.stringify({
                itineraryPanelIntro: true
            }), options);
        }
    }

    $rootScope.$on('guide',function onGuide(){
        $scope.introFunction();
    });

    function initializeMapDataArray(){
        var mapDataArray = [];
        for(var i = 0; i < $scope.currentDestination.dateWiseItinerary.length; i++){
            mapDataArray.push(false);
        }
        mapData.setRouteDataUpdated(mapDataArray);
    }
    $scope.loadMaps = function(mapId){
        //console.log('Load');
        mapClickCount++;//for mix panel
        $scope.$broadcast('loadMap',$scope.currentDestination.position,mapId);

        loadItinerary();
    };

    $scope.showStopDetails = function(stop) {

    };

    $scope.addHotel = function(hotel){
        $scope.allHotels[$scope.currentDestination.hotelDetails.hotelIndex].hotelAdded = false;
        hotel.hotelAdded = true;
        $scope.currentDestination.hotelDetails = hotel;
        calculateHotelEntryExitTime(hotel);
        calculateHotelExpenses();
        initializeMapDataArray();
        //Mix Panel
        //mixpanel.track('AddHotel',{
        //    "HotelPrice":hotel.Price
        //});
        mixPanelTrack('AddHotel',{
            "HotelPrice":hotel.Price
        });
    };

    $scope.showDestinationItinerary = function(destination) {
        //console.log('showDestinationItinerary CLICKED');

        $scope.currentDestination.isCurrent = false;
        destination.isCurrent = true;
        $scope.currentDestination = destination;

       // console.log('showDestinationItinerary CLICKED 1');

        setBudgetModels();

        //console.log('showDestinationItinerary CLICKED 2');
        setDestinationSpecificModels();

        //console.log('showDestinationItinerary CLICKED 3');

        initializeMapDataArray();

        //console.log('showDestinationItinerary CLICKED 4');
        $scope.currentDestination.position = {
            Latitude:parseFloat($scope.currentDestination.pos.split(',')[0]),
            Longitude:parseFloat($scope.currentDestination.pos.split(',')[1])
        };
        calculatePlacesExpenses();

        //console.log('showDestinationItinerary CLICKED 5');
        calculateCityExpenses();

        //console.log('showDestinationItinerary CLICKED 6');
        $rootScope.$emit('newPlace', destination.name);

        //console.log('showDestinationItinerary CLICKED 7');
    };

    $scope.showLeftPanelDetails = function(item) {
        if($scope.stopClickClass == 'stop-click') {
            $scope.stopClickClass = 'cursor-click';
        }
        else {
            //console.log('Clicked');
            //alert('Place Clicked');
            $scope.itemDetails = item;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'detailModalContent.html',
                controller: 'detailModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    itemDetails: function () {
                        return $scope.itemDetails;
                    }
                }
            });
        }
    };

    $scope.closeBudgetPanel = function(){
        $scope.isBudgetPanelOpen = false;
    };

    $scope.saveItineraryMobile = function(){
        $rootScope.$emit("submitPage");
    };

    $rootScope.$on("toggleBudgetPanel",function(){
        $scope.isBudgetPanelOpen = !$scope.isBudgetPanelOpen;
        budgetClickCount++;//Mix Panel
    });

    $rootScope.$on("submitPage",function(){

        //Mix Panel
        mixPanelTrack("SaveItinerary",{
            "MapClickCount":mapClickCount,
            "BudgetClickCount":budgetClickCount,
            "changeTimingsCount":changeTimingsCount
        });

        //open Modal

        var req = {
            method: 'PUT',
            url: '/saveItinerary/'+itineraryID,
            headers: {
                'Content-Type': 'application/json'
            },
            data: responseData
        };

        $http(req)
            .then(
            function onSuccess(response){
                //console.log('RESPONSE:'+JSON.stringify(response.data));
                var permalink = response.data.permalink;
                var host = $location.host();
                var port = $location.port();
                if(port == 80){
                    permalink = host+permalink;
                }
                else {
                    permalink = host + ':' + port + permalink;
                }
                $rootScope.$emit('gotPermalink',permalink);
                //console.log('PERMALINK:'+permalink);
            },
            function onFailure(){}
        );

        var modalInstance = $modal.open({
            templateUrl: 'saveModalContent.html',
            controller: 'ModalInstanceCtrl'
        });
    });

    $rootScope.$on("downloadPDF",function(){
        var req = {
            method: 'POST',
            url: '/downloadItinerary/'+itineraryID,
            headers: {
                'Content-Type': 'application/json'
            },
            data: { data: responseData }
        };

        $http(req).success(function(data,status) {
            //console.log("downloadedPDF");
            $rootScope.$emit('generatedPDF');
            if(data.success){
                //console.log("FILE:"+data.file);
                var elem = jQuery('#download');
                elem.attr('href',"/"+data.file);
                elem[0].click();
            }

        }).error(
            function(data, status) {
                console.log(data || "Cannot Download. Backend Request failed");
            });

    });


    $scope.addPlace = function(event, place) {
        event.stopPropagation();
        //console.log("ADD:"+JSON.stringify(place));
        //Mix panel
        //mixpanel.track('AddPlace',{
        //    "PlaceTaste":place.Taste
        //});
        mixPanelTrack('AddPlace',{
            "PlaceTaste":place.Taste
        });

        var hasHotel = ($scope.currentDestination.isHotelRequired == 1);
        var locationOfArrival = $scope.currentDestination.LocationOfArrival;
        var locationOfDeparture = $scope.currentDestination.LocationOfDeparture;

        //Checking if a place has been removed and place holder is still there
        var isInsertedInPlaceHolder = false, insertedByCreatingPosition = false, hasRemovedPlace = false;
        for(var i = removedPlacesList.length-1; i >=0; i--){
            hasRemovedPlace = true;
            var dateItinerary = $scope.currentDestination.dateWiseItinerary[removedPlacesList[i].dateItineraryIndex];
            var dateItineraryClone = clone(dateItinerary);
            var placeHolder = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[removedPlacesList[i].index]];
            var placeHolderClone = clone(placeHolder);
            var currentPlace = place;
            var currentPlaceClone = clone(currentPlace);
            if(replacePlace(currentPlaceClone,removedPlacesList[i].index,dateItineraryClone, locationOfArrival, locationOfDeparture)) {
                //console.log("REplace PLace");
                $scope.currentDestination.dateWiseItinerary[removedPlacesList[i].dateItineraryIndex] = dateItineraryClone;
                currentPlaceClone.isPlaceRemoved = 0;
                isInsertedInPlaceHolder = true;
                break;
            }
        }

        if(isInsertedInPlaceHolder){
            //console.log('Inserted In Place Holder');
            //set data for map
            setMapData(removedPlacesList[i].dateItineraryIndex);
            removedPlacesList.splice(i,1);
        }
        else {
            //console.log('Not Inserted In Place Holder, Trying to insert elsewhere');
            var Time2Cover = place.Time2Cover;
            var dateWiseItinerary = null, dateWisePlaceData = null;
            if(hasHotel) {
                var placeAdditionCandidates = [];
                for(var itineraryIndex in $scope.currentDestination.dateWiseItinerary){
                    //console.log(itineraryIndex);
                    itineraryIndex = parseInt(itineraryIndex);
                    dateWiseItinerary = $scope.currentDestination.dateWiseItinerary[itineraryIndex];
                    dateWisePlaceData = dateWiseItinerary.dateWisePlaceData;


                    if(dateWisePlaceData.typeOfDay == 0) {
                        //Is 1st Day
                        //console.log('dateWisePlaceData:'+JSON.stringify(dateWisePlaceData));
                        if (dateWiseItinerary.hasMorningCheckIn != undefined && dateWiseItinerary.hasMorningCheckIn) {
                            if (timeDifferenceGreaterThan($scope.currentDestination.hotelDetails.checkInTime, dateWisePlaceData.startSightSeeingTime, MORNING_CHECK_IN_DURATION * 60 + Time2Cover)) {
                                placeAdditionCandidates.push({
                                    type: 'morningCheckIn',
                                    dateWiseItinerary: dateWiseItinerary,
                                    dateWiseItineraryIndex:itineraryIndex
                                });
                            }
                        }
                    }
                    if(itineraryIndex < $scope.currentDestination.dateWiseItinerary.length - 1) {
                        //console.log("not morning check in");
                        //This is not the last date in dateWiseItinerary
                        //console.log($scope.currentDestination.dateWiseItinerary);
                        //console.log($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1]);
                        if ((dateWisePlaceData.endSightSeeingTime != undefined) && ($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.startSightSeeingTime != undefined) && ($scope.currentDestination.dateWiseItinerary[itineraryIndex].dateWisePlaceData.noPlacesVisited == undefined)) {
                            //console.log("nightMorning");
                            if (timeDifferenceGreaterThan(dateWisePlaceData.endSightSeeingTime, $scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.startSightSeeingTime, REST_TIME * 60 + Time2Cover)) {
                                placeAdditionCandidates.push({
                                    type: 'nightMorning',
                                    dateWiseItinerary: dateWiseItinerary,
                                    dateWiseItineraryIndex:itineraryIndex
                                });
                            }
                        }
                        else if (dateWisePlaceData.endSightSeeingTime != undefined && $scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.typeOfDay == 2) {
                            //This is one before last day
                            if ($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.noPlacesVisited == 1) {
                                //console.log("CHECKOUT CASE:"+dateWisePlaceData.endSightSeeingTime +","+ $scope.currentDestination.hotelDetails.checkOutTime+","+ REST_TIME * 60 + Time2Cover)
                                if (timeDifferenceGreaterThan(dateWisePlaceData.endSightSeeingTime, $scope.currentDestination.hotelDetails.checkOutTime, REST_TIME * 60 + Time2Cover)) {
                                    placeAdditionCandidates.push({
                                        type: 'checkOut',
                                        dateWiseItinerary: dateWiseItinerary,
                                        dateWiseItineraryIndex:itineraryIndex
                                    });
                                }
                            }
                        }
                        else {
                            if(dateWisePlaceData.typeOfDay == 0 && dateWisePlaceData.noPlacesVisited == 1){
                                //console.log("TYPE OF DAY:0");
                                if(timeDifferenceGreaterThan($scope.currentDestination.hotelDetails.checkInTime, $scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.startSightSeeingTime, REST_TIME * 60 + Time2Cover)){
                                    //console.log("timeDifference Greater");
                                    placeAdditionCandidates.push({
                                        type: 'checkIn',
                                        dateWiseItinerary: dateWiseItinerary,
                                        dateWiseItineraryIndex:itineraryIndex
                                    });
                                }
                            }
                        }
                    }
                    if(dateWisePlaceData.typeOfDay == 2){
                        //console.log("LAST DAY ADDITION");
                        //This is the last day
                        if(dateWisePlaceData.endSightSeeingTime != undefined && !(dateWisePlaceData.noPlacesVisited != undefined && dateWiseItinerary.noPlacesVisited == 1)){
                            //There are some places to visit on that day
                            if(timeDifferenceGreaterThan(dateWisePlaceData.endSightSeeingTime, $scope.currentDestination.hotelDetails.checkOutTime, CHECK_OUT_DURATION * 60 + Time2Cover)) {
                                placeAdditionCandidates.push({
                                    type: 'eveningCheckOut',
                                    dateWiseItinerary: dateWiseItinerary,
                                    dateWiseItineraryIndex:itineraryIndex
                                });
                            }
                        }
                    }
                }
                //console.log('Candidates:'+JSON.stringify(placeAdditionCandidates));
                var selectedIndex =chooseBestCandidate(placeAdditionCandidates, place);
                if(selectedIndex.selectedCandidateIndex == -1||selectedIndex.selectedPlaceTimingsIndex == -1)
                {
                    //console.log("NO CANDIDATE TILL NOW");

                }
                else
                {
                    //console.log("GOT THE RIGHT CANDIDATE FOR THIS JOB: "+JSON.stringify(placeAdditionCandidates[selectedIndex.selectedCandidateIndex]));
                    //console.log("placeTimingsIndex:"+selectedIndex.selectedPlaceTimingsIndex);
                    insertPlaceIntoItinerary(place, placeAdditionCandidates[selectedIndex.selectedCandidateIndex], selectedIndex.selectedPlaceTimingsIndex);
                    setSelectedPlaceTimingIndex(place.PlaceTimings, selectedIndex.selectedPlaceTimingsIndex);
                    insertedByCreatingPosition = true;
                }
            }
            else {
                //No hotel
                //Since if there is no hotel, only 1 day is inserted into the itinerary
                //Hence safely assuming only 1 day
                dateWiseItinerary = $scope.currentDestination.dateWiseItinerary[0];
                dateWisePlaceData = dateWiseItinerary.dateWisePlaceData;

                if(place.Days == undefined) {
                    place.Days = combineDays(place.PlaceTimings);
                }
                if(checkIfPlaceIsOpenOnDay(place.Days,dateWisePlaceData.startSightSeeingTime)) {
                    //The place is open
                    var permValue = dateWiseItinerary.permutation[0];
                    var lastPermValue = dateWiseItinerary.permutation[dateWiseItinerary.permutation.length - 1];
                    var firstPlace = dateWisePlaceData.placesData[permValue];
                    var lastPlace = dateWisePlaceData.placesData[lastPermValue];

                    var distanceFromArrivalPlace = getDistance(locationOfArrival.Latitude, locationOfArrival.Longitude, place.Latitude, place.Longitude);
                    var timeFromArrivalPlace = distanceFromArrivalPlace/SPEED;

                    var distanceToFirstPlace = getDistance(place.Latitude, place.Longitude, firstPlace.Latitude, firstPlace.Longitude);
                    var timeToFirstPlace = distanceToFirstPlace/SPEED;

                    var startSightSeeingTime = dateWisePlaceData.startSightSeeingTime;
                    var firstPlaceArrivalTime = firstPlace.placeArrivalTime;

                    var timeAvailableBeforeFirstPlace = getTimeFromDate(firstPlaceArrivalTime) - getTimeFromDate(startSightSeeingTime) - timeFromArrivalPlace * HOURS_TO_MILLISECONDS - timeToFirstPlace * HOURS_TO_MILLISECONDS;

                    var distanceToDeparturePlace = getDistance(place.Latitude, place.Longitude, locationOfDeparture.Latitude, locationOfDeparture.Longitude);
                    var timeToDeparturePlace = distanceToDeparturePlace/SPEED;

                    var distanceFromLastPlace = getDistance(lastPlace.Latitude, lastPlace.Longitude, place.Latitude, place.Longitude);
                    var timeFromLastPlace = distanceFromLastPlace/SPEED;

                    var endSightSeeingTime = dateWisePlaceData.endSightSeeingTime;
                    var lastPlaceDepartureTime = lastPlace.placeDepartureTime;

                    var timeAvailableAfterLastPlace = getTimeFromDate(endSightSeeingTime) - getTimeFromDate(lastPlaceDepartureTime) - timeFromLastPlace * HOURS_TO_MILLISECONDS- timeToDeparturePlace * HOURS_TO_MILLISECONDS;

                    var arrivalTimeOfPlaceAfter, departureTimeOfPlaceAfter, arrivalTimingIndexAfter, departureTimingIndexAfter;
                    var arrivalTimeOfPlaceBefore, departureTimeOfPlaceBefore, arrivalTimingIndexBefore, departureTimingIndexBefore;
                    var candidates = [true, true];//[0] for before first place [1] for after last place
                    if(timeAvailableAfterLastPlace > 0){
                        //There is time insert place after last place
                        arrivalTimeOfPlaceAfter = new Date(getTimeFromDate(lastPlaceDepartureTime) + timeFromLastPlace * HOURS_TO_MILLISECONDS);
                        departureTimeOfPlaceAfter = new Date(getTimeFromDate(endSightSeeingTime) - timeToDeparturePlace * HOURS_TO_MILLISECONDS);
                        arrivalTimingIndexAfter = getPlaceTimingsToSelect(arrivalTimeOfPlaceAfter,place.PlaceTimings);
                        departureTimingIndexAfter = getPlaceTimingsToSelect(departureTimeOfPlaceAfter, place.PlaceTimings);
                        if(arrivalTimingIndexAfter!= -1 && departureTimingIndexAfter != -1){
                            if(arrivalTimingIndexAfter != departureTimingIndexAfter){
                                //Place closed in between
                                //console.log('Place closed in between after last place');
                                candidates[1] = false;
                            }
                        }
                        else {
                            //Place closed at both timings
                            //console.log('Place closed at both timings after last place');
                            candidates[1] = false;
                        }
                    }
                    else {
                        //console.log('timeAvailableAfterLastPlace < 0');
                        candidates[1] = false;
                    }
                    if(timeAvailableBeforeFirstPlace > 0){
                        //There is time to insert place before first place
                        arrivalTimeOfPlaceBefore = new Date(getTimeFromDate(startSightSeeingTime) + timeFromArrivalPlace * HOURS_TO_MILLISECONDS);
                        departureTimeOfPlaceBefore = new Date(getTimeFromDate(firstPlaceArrivalTime) - timeToFirstPlace * HOURS_TO_MILLISECONDS);
                        //console.log('arrival:'+arrivalTimeOfPlaceBefore + ' departure:'+departureTimeOfPlaceBefore);
                        arrivalTimingIndexBefore = getPlaceTimingsToSelect(arrivalTimeOfPlaceBefore,place.PlaceTimings);
                        departureTimingIndexBefore = getPlaceTimingsToSelect(departureTimeOfPlaceBefore, place.PlaceTimings);
                        if(arrivalTimingIndexBefore!=-1 && departureTimingIndexBefore != -1){
                            if(arrivalTimingIndexBefore != departureTimingIndexBefore){
                               // console.log('Place closed in between before first place');
                                candidates[0]=false;
                            }
                        }
                        else{
                            //console.log('Place closed at both timings before first place');
                            candidates[0]=false;
                        }
                    }
                    else {
                        //console.log('timeAvailableBeforeFirstPlace < 0');
                        candidates[0] = false;
                    }
                    if(candidates[0] && candidates[1]){
                        //Both timings are available for insertion. Need to find better one
                        if(timeAvailableAfterLastPlace > timeAvailableBeforeFirstPlace){
                            place.placeArrivalTime = arrivalTimeOfPlaceAfter;
                            place.placeDepartureTime = departureTimeOfPlaceAfter;
                            insertPlaceAtLastOfDay(dateWiseItinerary, place);
                            setSelectedPlaceTimingIndex(place.PlaceTimings, arrivalTimingIndexAfter);
                            insertedByCreatingPosition = true;

                        }
                        else {
                            //console.log(arrivalTimeOfPlaceBefore + "---" + departureTimeOfPlaceBefore);
                            place.placeArrivalTime = arrivalTimeOfPlaceBefore;
                            place.placeDepartureTime = departureTimeOfPlaceBefore;
                            place.placeArrivalTime = new Date();
                            insertPlaceAtBeginningOfDay(dateWiseItinerary, place);
                            setSelectedPlaceTimingIndex(place.PlaceTimings, arrivalTimingIndexBefore);
                            insertedByCreatingPosition = true;
                        }
                    }
                    else {
                        if(candidates[0]){
                            //console.log(arrivalTimeOfPlaceBefore + "---" + departureTimeOfPlaceBefore);
                            place.placeArrivalTime = arrivalTimeOfPlaceBefore;
                            place.placeDepartureTime = departureTimeOfPlaceBefore;
                            place.placeArrivalTime = new Date();
                            insertPlaceAtBeginningOfDay(dateWiseItinerary, place);
                            setSelectedPlaceTimingIndex(place.PlaceTimings, arrivalTimingIndexBefore);
                            insertedByCreatingPosition = true;
                        }
                        else if(candidates[1]) {
                            place.placeArrivalTime = arrivalTimeOfPlaceAfter;
                            place.placeDepartureTime = departureTimeOfPlaceAfter;
                            insertPlaceAtLastOfDay(dateWiseItinerary, place);
                            setSelectedPlaceTimingIndex(place.PlaceTimings, arrivalTimingIndexAfter);
                            insertedByCreatingPosition = true;
                        }
                    }
                }
            }
        }

        if(!insertedByCreatingPosition && !isInsertedInPlaceHolder){
            if(hasRemovedPlace){
                //ALERT1
                createAlert('addWhenPlaceHolder',place.Name);
            }
            else {
                createAlert('addFail',place.Name);
                //alert('Cannot add place due to no place available');//ALERT2
            }
        }
        else {
            calculatePlacesExpenses();
            markPlaceAsAdded(place);
            scrollToPlace(place.PlaceID);
        }

        if(insertedByCreatingPosition)
        {
            //TODO:NEED TO SET THE VALUE OF ONLY THAT DATE AS FALSE WHICH IS AFFECTED
            initializeMapDataArray();
        }
    };

    function scrollToPlace(placeID){
        function getPlaceElement(tries, callback){
            $timeout(function(){
                tries--;
                element = document.getElementById('place-'+placeID);
                if(element != null){
                    callback(null, element);
                }
                else if(tries>0){
                    getPlaceElement(tries, callback);
                }
                else {
                    callback(new Error('No element'));
                }
            }, 500);
        }
        getPlaceElement(5, function onGettingElement(err, element){
            if(err){
                console.log(err);
            }
            else{
                var section = angular.element(element);
                $document.duScrollToElementAnimated(section);
            }
        });
    }

    //$scope.dragMove = function(){
    //    $scope.stopClickClass = 'stop-click';
    //    var element = jQuery("#placesPanel");
    //    jQuery("#placesPanel").css("overflow","visible");
    //    jQuery(".jspContainer").css("overflow","visible");
    //};
    //
    //$scope.dragStop = function(){
    //    var element = jQuery("#placesPanel");
    //    jQuery("#placesPanel").css("overflow","hidden");
    //    jQuery(".jspContainer").css("overflow","hidden");
    //};

    /** mobile Method start**/
    $scope.replaceLowerPanelPlace= function($event,$index)
    {
        if($scope.replacePlaceOn)
        {
            $scope.replacePlaceOn = false;
            $scope.replaceLabel = 'Replace';
        }
        else
        {
            $scope.replaceData.placeIndex = $index;
            $scope.replacePlaceOn = true;
            $scope.replaceLabel = 'undo';
        }
    };

    $scope.replaceMe = function(event,index,dateItineraryIndex)
    {
        //console.log("replaceMe:"+index+","+dateItineraryIndex);
        if($scope.replaceData.placeIndex!=-1 && $scope.replacePlaceOn)
        {
            $scope.onDropComplete($scope.replaceData,event,index,dateItineraryIndex);
        }
        $scope.replaceData.placeIndex=-1;
        $scope.replacePlaceOn = false;
        $scope.replaceLabel = 'Replace';
    };

    $scope.openMobilePanel = function(panel)
    {
        if(panel=='expenses')
        {
            $scope.isBudgetPanelOpen = true;
            $scope.isMobileAlertPanelShown = false;
            $scope.isItineraryPanelOpen = false;
            budgetClickCount++;//Mix Panel
        }
        else if(panel=='alert')
        {
            $scope.isMobileAlertPanelShown = true;
            $scope.isBudgetPanelOpen = false;
            $scope.isItineraryPanelOpen = false;
        }
        else if(panel=='city')
        {
            $scope.isBudgetPanelOpen = false;
            $scope.isMobileAlertPanelShown = false;
            $scope.isItineraryPanelOpen = true;
        }
    };
    /** mobile Method end**/

    $scope.onDropComplete = function(data, event, index, dateItineraryIndex){
        //console.log('Drop Complete:'+JSON.stringify(data));
        var element = jQuery("#placesPanel");
        jQuery("#placesPanel").css("overflow","hidden");
        jQuery(".jspContainer").css("overflow","hidden");
        var dateItinerary = $scope.currentDestination.dateWiseItinerary[dateItineraryIndex];
        var dateItineraryClone = clone(dateItinerary);
        var place = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
        var placeClone = clone(place);
        var locationOfArrival = $scope.currentDestination.LocationOfArrival;
        var locationOfDeparture = $scope.currentDestination.LocationOfDeparture;
        var currentPlace = null, currentPlaceClone = null;
        if(!data.isSwap) {
            //A new place has been dropped from places
            currentPlace = $scope.allPlaces[data.placeIndex];
            currentPlaceClone = clone(currentPlace);
            //console.log("replacePlace:"+replacePlace(currentPlaceClone,index,dateItineraryClone));
            if(replacePlace(currentPlaceClone,index,dateItineraryClone, locationOfArrival, locationOfDeparture))
            {
                //console.log("Replace PLace");
                $scope.currentDestination.dateWiseItinerary[dateItineraryIndex] = dateItineraryClone;
                calculatePlacesExpenses();
                markPlaceAsAdded(currentPlace);
                markPlaceAsNotAdded(place);
                for(var i = 0; i < removedPlacesList.length; i++){
                    if(removedPlacesList[i].dateItineraryIndex == dateItineraryIndex && removedPlacesList[i].index == index){
                        removedPlacesList.splice(i,1);
                        break;
                    }
                }
            }
        }
        else {
            //A place has been dropped from the itinerary
            var currentDateItinerary = $scope.currentDestination.dateWiseItinerary[data.dateItineraryIndex];
            var currentDateItineraryClone = clone(currentDateItinerary);
            var currentIndex = data.permutationIndex;
            currentPlace = currentDateItinerary.dateWisePlaceData.placesData[currentDateItinerary.permutation[currentIndex]];
            currentPlaceClone = clone(currentPlace);

            if(data.dateItineraryIndex==dateItineraryIndex)
            {//same Day

                if(Math.abs(index-currentIndex)==1)
                {
                    //next to each other
                    if(index>currentIndex)
                    {
                        if(replaceAdjacentPlaces(dateItineraryClone,currentIndex,index,currentPlaceClone,placeClone))
                        {
                            $scope.currentDestination.dateWiseItinerary[data.dateItineraryIndex] = dateItineraryClone;
                        }
                    }
                    else
                    {
                        if(replaceAdjacentPlaces(dateItineraryClone,index,currentIndex,placeClone,currentPlaceClone))
                        {
                            $scope.currentDestination.dateWiseItinerary[data.dateItineraryIndex] = dateItineraryClone;
                        }
                    }
                }
                else
                {
                    if(index-currentIndex>0)
                    {
                        if(replacePlace(placeClone,currentIndex,currentDateItineraryClone))
                        {
                            if(replacePlace(currentPlaceClone,index,currentDateItineraryClone))
                            {
                                //place = placeClone;
                                $scope.currentDestination.dateWiseItinerary[data.dateItineraryIndex] = currentDateItineraryClone;
                                //currentPlace = currentPlaceClone;
                                // $scope.currentDestination.dateWiseItinerary[dateItineraryIndex] = dateItineraryClone;
                            }
                        }
                    }
                    else
                    {
                        if(replacePlace(currentPlaceClone,index,currentDateItineraryClone))
                        {
                            if(replacePlace(placeClone,currentIndex,currentDateItineraryClone))
                            {
                                //place = placeClone;
                                $scope.currentDestination.dateWiseItinerary[data.dateItineraryIndex] = currentDateItineraryClone;
                                //currentPlace = currentPlaceClone;
                                //$scope.currentDestination.dateWiseItinerary[dateItineraryIndex] = dateItineraryClone;
                            }
                        }
                    }
                }
            }
            else
            {
                if(replacePlace(placeClone,currentIndex,currentDateItineraryClone))
                {
                    if(replacePlace(currentPlaceClone,index,dateItineraryClone))
                    {
                        //place = placeClone;
                        $scope.currentDestination.dateWiseItinerary[data.dateItineraryIndex] = currentDateItineraryClone;
                        //currentPlace = currentPlaceClone;
                        $scope.currentDestination.dateWiseItinerary[dateItineraryIndex] = dateItineraryClone;
                    }
                }
            }
        }
        setMapData(dateItineraryIndex);
    };


    $rootScope.$on('checkIfDataLoaded',function onCheckDataLoaded(){

        if($scope.isDataLoaded)
        {
            $rootScope.$emit('dataLoaded');
        }
    });

    $rootScope.$on('checkIfBudgetSet',function onCheckBudgetSet(){
        if($scope.isDataLoaded)
        {
            calculateBudgetPercent();
        }
    });

    $scope.showLowerPanel = function(content){
        //console.log("content:"+content);
        if(content=='places')
        {
            $scope.lowerPanelContent = 'places';
            //mixpanel.track('CustomizePlaces');
            //mixpanel.time_event("AddPlace");
            mixPanelTrack('CustomizePlaces');
            mixPanelTimeEvent("AddPlace");
        }
        else if(content=='hotels')
        {
            $scope.lowerPanelContent = 'hotels';
            //mixpanel.track('CustomizeHotels');
            //mixpanel.time_event("AddHotel");
            mixPanelTrack('CustomizeHotels');
            mixPanelTimeEvent('AddHotel');
        }
    };

    $scope.removeLowerPanel = function(){
        //console.log("editRemoveLowerPanel:"+$scope.lowerPanelContent);
        $scope.lowerPanelContent = 'default';
    };

    $scope.changeView = function(){

        if($scope.mobileViewLabel=='Map')
        {
            $scope.mobileViewLabel = 'Itinerary';
            $scope.isItineraryPanelOpen = false;
        }
        else
        {
            $scope.mobileViewLabel = 'Map';
            $scope.isItineraryPanelOpen = true;
        }
    };

    $scope.getTimeToPlaceText = function(dateItinerary, index){
        var originPosition;
        if(index == 0){
            var name = "Hotel";
            if($scope.currentDestination.hotelDetails == undefined || $scope.currentDestination.hotelDetails == null){
                name = "Arrival Location";
            }
            originPosition = {
                name:name,
                Latitude:$scope.currentDestination.LocationOfArrival.Latitude,
                Longitude:$scope.currentDestination.LocationOfArrival.Longitude
            };
        }
        else {
            originPosition = {
                name: dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index - 1]].Name,
                Latitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index - 1]].Latitude,
                Longitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index - 1]].Longitude
            };
        }
        var destinationPosition = {
            Latitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].Latitude,
            Longitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].Longitude
        };
        var time = getTimeFromPlaces(originPosition, destinationPosition);
        var formattedTime = formatTime(time);
        if(formattedTime != ""){
            return "Approx Travel Time From "+originPosition.name + " is "+formattedTime;
        }
        return "";
    };

    $scope.getTimeFromPlaceText = function(dateItinerary, index) {
        var originPosition = {
            Latitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].Latitude,
            Longitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].Longitude
        };
        var destinationPosition;
        if(index == dateItinerary.permutation.length - 1){
            var name = "Hotel";
            if($scope.currentDestination.hotelDetails == undefined || $scope.currentDestination.hotelDetails == null){
                name = "Departure Location";
            }
            destinationPosition = {
                name:name,
                Latitude:$scope.currentDestination.LocationOfArrival.Latitude,
                Longitude:$scope.currentDestination.LocationOfArrival.Longitude
            };
        }
        else {
            destinationPosition = {
                name: dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index + 1]].Name,
                Latitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index + 1]].Latitude,
                Longitude:dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index + 1]].Longitude
            };
        }
        var time = getTimeFromPlaces(originPosition, destinationPosition);
        var formattedTime = formatTime(time);
        if(formattedTime != ""){
            return "Approx Travel Time To "+destinationPosition.name + " is "+formattedTime;
        }
        return "";
    };

    //position previous-'0', next-'1'
    $scope.changeDestination = function(position)
    {
        var index = $scope.destinations.indexOf($scope.currentDestination);
        if((position=='1')&&index!=-1 && index<$scope.destinations.length-1)
        {
            $scope.showDestinationItinerary($scope.destinations[index+1]);
        }
        else if((position=='0') && index!=-1 && index>0)
        {
            $scope.showDestinationItinerary($scope.destinations[index-1]);
        }
    };

    $scope.isDestExist = function(position)
    {
        if($scope.currentDestination==null)
        {
            return true;
        }
        var index = $scope.destinations.indexOf($scope.currentDestination);
        if(position=='1')
        {
            if(index!=-1 && index<$scope.destinations.length-1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            if(index!=-1 && index>0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };

    function getTimeFromPlaces(originPosition, destinationPosition){
        var distance = getDistance(originPosition.Latitude, originPosition.Longitude, destinationPosition.Latitude, destinationPosition.Longitude);
        var time = distance/SPEED;
        return time;
    }

    function formatTime(time){
        var hours = 0, mins = 0;
        if(time > 1) {
            hours =  Math.floor(time);
            mins = Math.floor(time*60 - hours*60);
        }
        else{
            mins = Math.floor(time*60);
        }
        if(hours > 0 && mins > 0){
            return hours+"h "+mins+"m";
        }
        else if(hours > 0){
            return hours + "h";
        }
        else if(mins > 0){
            return mins + "m";
        }
        return "";
    }

    $scope.enableChangeTimings = function(dateItinerary,index)
    {
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].isChangeTiming = true;
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone = new Date(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime);
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone = new Date(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime);
    };

    $scope.setUserTimings= function(dateItinerary,dateItineraryIndex,index){
        //console.log(dateItinerary );
        changeTimingsCount++;//Mix Panel
        //console.log("index:"+index+",date:"+dateItineraryIndex);
        fixItineraryOnChangeTimings(dateItinerary,dateItineraryIndex,index);
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone;
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone;
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].isChangeTiming = false;
    };

    $scope.disableChangeTimings = function(dateItinerary,index){
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].isChangeTiming = false;
    };

    $scope.isPlaceTimingsCorrect = function(place){
        var warningMessage;
        if(place.placeArrivalTime == undefined || place.placeDepartureTime == undefined){
            warningMessage = "Timings are not set";
        }
        else {
            var selectedPlaceTimingIndex = -1;
            for(var placeTimingIndex = 0; placeTimingIndex < place.PlaceTimings.length; placeTimingIndex++){
                if(place.PlaceTimings[placeTimingIndex].isSelected != undefined && place.PlaceTimings[placeTimingIndex].isSelected == 1){
                    selectedPlaceTimingIndex = placeTimingIndex;
                }
            }
            if(selectedPlaceTimingIndex == -1){
                warningMessage = "No selected place timings";
            }
            else {
                var timeStart = $scope.getDateFromString(place.PlaceTimings[selectedPlaceTimingIndex].TimeStart, place.placeArrivalTime);
                var timeEnd = $scope.getDateFromString(place.PlaceTimings[selectedPlaceTimingIndex].TimeEnd, place.placeDepartureTime);
                if(getTimeFromDate(place.placeArrivalTime) < getTimeFromDate(timeStart) || getTimeFromDate(place.placeDepartureTime > getTimeFromDate(timeEnd))){
                    warningMessage = "The place is not open at the timings";
                }
            }
        }
        //console.log('Warning Message:'+warningMessage);
        if(warningMessage != undefined){
            place.warningMessage = warningMessage;
            return false;
        }
        return true;
    };

    $scope.getItineraryAlignClass = function(alignment){
        if(alignment=="left")
        {
            if($scope.isCustomizationOn)
            {
                return("col-md-4");
            }
            else
            {
                return("col-md-3");
            }
        }
        else if(alignment=="right")
        {
            if($scope.isCustomizationOn)
            {
                return("col-md-1");
            }
            else
            {
                return("col-md-3");
            }
        }
        else if(alignment=="middle")
        {
            if($scope.isCustomizationOn)
            {
                return("col-md-1");
            }
            else
            {
                return("");
            }
        }
    };

    $scope.customize = function(type)
    {
        $scope.showHotelsForCustomization = false;
        $scope.showPlacesForCustomization = false;
        $scope.showMap = false;
        if(type=='places')
        {
            $scope.showPlacesForCustomization = true;
            //mix panel
            //mixpanel.track('CustomizePlaces');
            //mixpanel.time_event("AddPlace");
            mixPanelTrack('CustomizePlaces');
            mixPanelTimeEvent('AddPlace');
        }
        else if(type=='hotels')
        {
            $scope.showHotelsForCustomization = true;
            //mixpanel.track('CustomizeHotels');
            //mixpanel.time_event("AddHotel");
            mixPanelTrack('CustomizeHotels');
            mixPanelTimeEvent('AddHotel');
        }
        else if(type=='map')
        {
            $scope.showMap = true;
        }
        else
        {
            $scope.showPlacesForCustomization = false;
            $scope.showHotelsForCustomization = false;
        }
        $scope.isCustomizationOn=!$scope.isCustomizationOn;
    };

    $scope.getPlaceRating = function(place)
    {
        var score = (place.Score)/20;
        return(Math.round(score*10) / 10);
    };

    function setBudgetModels(){
        $scope.cityBudgetText = $scope.currentDestination.name+"'s Expenses";
        calculateOtherCitiesExpenses();
        calculateLocalTravelExpenses();
    }

    function setDestinationSpecificModels(){
        $scope.currentDay = 0;
        var firstDay = $scope.currentDestination.dateWiseItinerary[$scope.currentDay].dateWisePlaceData.startSightSeeingTime;
        if(firstDay == null || firstDay == undefined){
            //No places being visited on this day
            firstDay = $scope.currentDestination.dateWiseItinerary[$scope.currentDay].dateWisePlaceData.arrivalTime;
        }
        firstDay = new Date(firstDay);
        $scope.currentDate = firstDay.setHours(0,0,0,0);
        calculateHotelExpenses();
        $scope.allPlaces = $scope.currentDestination.places;
        if($scope.currentDestination.hotels != undefined){
            $scope.allHotels = $scope.currentDestination.hotels;
        }
        else{
            $scope.allHotels = [];
        }
    }

    function setMapData(dateItineraryIndex){
        mapData.setRouteNthData(dateItineraryIndex,false);
        loadItinerary();
        //$scope.$broadcast('loadItinerary',$scope.currentDestination.dateWiseItinerary[dateItineraryIndex],dateItineraryIndex,$scope.currentDestination.hotelDetails);
    }

    function fixItineraryOnChangeTimings(dateItinerary,dateItineraryIndex,index){
        var place = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
        var placeArrivalTime = place.placeArrivalTime;
        var placeDepartureTime = place.placeDepartureTime;
        var hotel = $scope.currentDestination.hotelDetails;
        var distanceToPlace = getDistance(hotel.Latitude,hotel.Longitude,place.Latitude,place.Longitude);
        var timeToPlace = distanceToPlace/SPEED;

        if(getTimeFromDate(place.placeArrivalTimeClone)>getTimeFromDate(place.placeDepartureTimeClone))
        {
            //TODO: Create timepicker
            //alert('Arrival Time cannot be ahead of Departure Time');//ALERT12
            createAlert('timingChangeInvalid');
        }
        //console.log("$scope.isFixItinerary:"+$scope.isFixItinerary.fix);
        if($scope.isFixItinerary.fix)
        {
            var previousPlace = null;
            if(dateItinerary.permutation.length==1)
            {
                //only one place
                dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTimeClone) - timeToPlace*HOURS_TO_MILLISECONDS);
                if(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone) >(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime)))
                {
                    //No need to fix itinerary on this side
                }
                else if(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone) < (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime)))
                {
                    isSufficientTimeInHotel(dateItinerary,dateItineraryIndex,0);
                }

                dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTimeClone) + timeToPlace*HOURS_TO_MILLISECONDS);
                if(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone) <(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime)))
                {
                    //No need to fix itinerary on this side
                }
                else if(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone) > (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime)))
                {
                    isSufficientTimeInHotel(dateItinerary,dateItineraryIndex,1);
                }
            }
            else if(index==0) {
                //first element
                dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTimeClone) - timeToPlace * HOURS_TO_MILLISECONDS);
                if (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone) > (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime))) {
                    //No need to fix itinerary on this side
                }
                else if (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone) < (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime))) {
                    isSufficientTimeInHotel(dateItinerary, dateItineraryIndex, 0);
                }

                previousPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[0]];
                if (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone) != (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime))) {
                    previousPlace.placeArrivalTime = previousPlace.placeArrivalTimeClone;
                    previousPlace.placeDepartureTime = previousPlace.placeDepartureTimeClone;
                    fixPostPlaceItinerary(dateItinerary,previousPlace,dateItineraryIndex,hotel, index);
                }
            }
            else if(index==dateItinerary.permutation.length-1)
            {
                //last place
                if (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone) != (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime))) {
                    //set endSightSeeingTime
                    dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTimeClone)+timeToPlace*HOURS_TO_MILLISECONDS);

                    if (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone) > (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime))) {
                        isSufficientTimeInHotel(dateItinerary,dateItineraryIndex,1);
                    }
                    else if (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone) < (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime))) {
                        //No need to fix
                    }
                }
                if(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone) != (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime))) {
                    previousPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
                    previousPlace.placeArrivalTime = previousPlace.placeArrivalTimeClone;
                    previousPlace.placeDepartureTime = previousPlace.placeDepartureTimeClone;
                    fixPrePlaceItinerary(dateItinerary,previousPlace,dateItineraryIndex,hotel, index);
                }
            }
            else
            {
                //normal place
                if(getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTimeClone) != (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeArrivalTime))) {
                    previousPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
                    previousPlace.placeArrivalTime = previousPlace.placeArrivalTimeClone;
                    previousPlace.placeDepartureTime = previousPlace.placeDepartureTimeClone;
                    fixPrePlaceItinerary(dateItinerary,previousPlace,dateItineraryIndex,hotel,index);
                }

                if (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTimeClone) != (getTimeFromDate(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].placeDepartureTime))) {
                    previousPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
                    previousPlace.placeArrivalTime = previousPlace.placeArrivalTimeClone;
                    previousPlace.placeDepartureTime = previousPlace.placeDepartureTimeClone;
                    fixPostPlaceItinerary(dateItinerary,previousPlace,dateItineraryIndex,hotel, index);
                }
            }
        }
    }


    function fixPrePlaceItinerary(dateItinerary,place,dateItineraryIndex,hotel, placeIndex)
    {
        for(var reverseIndex = placeIndex-1;reverseIndex>=0;reverseIndex--)
        {
            var currentPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[reverseIndex]];
            var distanceFromPreviousPlace = getDistance(currentPlace.Latitude,currentPlace.Longitude,place.Latitude,place.Longitude);
            var timeFromPreviousPlace = distanceFromPreviousPlace/SPEED;
            currentPlace.placeDepartureTime = new Date(getTimeFromDate(place.placeArrivalTime) - timeFromPreviousPlace*HOURS_TO_MILLISECONDS);
            currentPlace.placeArrivalTime = new Date(getTimeFromDate(currentPlace.placeDepartureTime) - currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS);
            place = currentPlace;
        }
        var firstPlaceOfDay = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[0]];
        var distanceToHotel = getDistance(firstPlaceOfDay.Latitude,firstPlaceOfDay.Longitude,hotel.Latitude,hotel.Longitude);
        var timeToHotel = distanceToHotel/SPEED;
        dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(firstPlaceOfDay.placeArrivalTime) - timeToHotel*HOURS_TO_MILLISECONDS);
        isSufficientTimeInHotel(dateItinerary,dateItineraryIndex,0);

    }

    function fixPostPlaceItinerary(dateItinerary,place,dateItineraryIndex,hotel, placeIndex)
    {
        for(var ItrIndex =placeIndex+1; ItrIndex<dateItinerary.permutation.length;ItrIndex++)
        {
            var currentPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[ItrIndex]];
            var distanceFromPreviousPlace = getDistance(place.Latitude,place.Longitude,currentPlace.Latitude,currentPlace.Longitude);
            var timeFromPreviousPlace = distanceFromPreviousPlace/SPEED;
            currentPlace.placeArrivalTime = new Date(getTimeFromDate(place.placeDepartureTime)+timeFromPreviousPlace*HOURS_TO_MILLISECONDS);
            currentPlace.placeDepartureTime = new Date(getTimeFromDate(currentPlace.placeArrivalTime) + currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS);
            place = currentPlace;
        }
        var endPlaceOFDay = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[dateItinerary.permutation.length-1]];
        var distanceToHotel = getDistance(endPlaceOFDay.Latitude,endPlaceOFDay.Longitude,hotel.Latitude,hotel.Longitude);
        var timeToHotel = distanceToHotel/SPEED;
        dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(endPlaceOFDay.placeDepartureTime) + timeToHotel*HOURS_TO_MILLISECONDS);
        isSufficientTimeInHotel(dateItinerary,dateItineraryIndex,1);
    }

    //typeOfHotelState: 0 means depart from hotel for sightSeeing, 1 means arrive at hotel after sightseeing
    function isSufficientTimeInHotel(dateItinerary,dateItineraryIndex,typeOfHotelState)
    {
        var typeOfDay = dateItinerary.dateWisePlaceData.typeOfDay;
        var hotelCheckInTime = $scope.currentDestination.hotelDetails.checkInTime;
        var hotelCheckOutTime = $scope.currentDestination.hotelDetails.checkOutTime;
        var startSightSeeingTime = dateItinerary.dateWisePlaceData.startSightSeeingTime;
        var endSightSeeingTime = dateItinerary.dateWisePlaceData.endSightSeeingTime;
        var nextDateItinerary;
        var previousDateItinerary;
        var hotelExitTime;

        if(($scope.currentDestination.dateWiseItinerary.length-1)!=dateItineraryIndex)
        {
            nextDateItinerary = $scope.currentDestination.dateWiseItinerary[dateItineraryIndex+1];
        }

        if(dateItineraryIndex!=0)
        {
            previousDateItinerary = $scope.currentDestination.dateWiseItinerary[dateItineraryIndex-1];
        }

        if(typeOfDay==0||typeOfDay==3)
        {
            if(typeOfHotelState==0)
            {
                //depart from hotel
                if((getTimeFromDate(startSightSeeingTime) - getTimeFromDate(hotelCheckInTime)) < MORNING_CHECK_IN_DURATION*RATIO*HOURS_TO_MILLISECONDS)
                {
                    //alert("You have less time in Hotel");//ALERT13
                    createAlert('hotelAndLessTime');
                }
            }
            else
            {
                if(nextDateItinerary!=undefined)
                {
                    hotelExitTime = nextDateItinerary.dateWisePlaceData.startSightSeeingTime;
                    //arrive at hotel after sightSeeing
                    if(nextDateItinerary.dateWisePlaceData.typeOfDay == 2)
                    {
                        if(nextDateItinerary.dateWisePlaceData.noPlacesVisited!=undefined && (nextDateItinerary.dateWisePlaceData.noPlacesVisited==1))
                        {
                            hotelExitTime = $scope.currentDestination.hotelDetails.checkOutTime;
                        }
                    }

                }
                else
                {
                    hotelExitTime = $scope.currentDestination.hotelDetails.checkOutTime;
                }

                if((getTimeFromDate(hotelExitTime) - getTimeFromDate(endSightSeeingTime)) < REST_TIME*RATIO*HOURS_TO_MILLISECONDS)
                {
                    //alert("You have less time in Hotel");//ALERT13
                    createAlert('hotelAndLessTime');
                }
            }
        }
        else if(typeOfDay ==1)
        {
            //normal day
            if(typeOfHotelState==0)
            {
                checkPreviousNightRestTime(previousDateItinerary,startSightSeeingTime,hotelCheckInTime);
            }
            else
            {
                //arrive at hotel after sightSeeing
                if(nextDateItinerary!=undefined)
                {
                    hotelExitTime = nextDateItinerary.dateWisePlaceData.startSightSeeingTime;
                    if(nextDateItinerary.dateWisePlaceData.typeOfDay == 2)
                    {
                        if(nextDateItinerary.dateWisePlaceData.noPlacesVisited!=undefined && (nextDateItinerary.dateWisePlaceData.noPlacesVisited==1))
                        {
                            hotelExitTime = $scope.currentDestination.hotelDetails.checkOutTime;
                        }
                    }
                }
                else
                {
                    hotelExitTime = $scope.currentDestination.hotelDetails.checkOutTime;
                }

                if((getTimeFromDate(hotelExitTime) - getTimeFromDate(endSightSeeingTime)) < REST_TIME*RATIO*HOURS_TO_MILLISECONDS)
                {
                    // alert("You have less time in Hotel");//ALERT13
                    createAlert('hotelAndLessTime');
                }
            }
        }
        else if(typeOfDay ==2||typeOfDay==3)
        {
            if(typeOfHotelState==0)
            {
                checkPreviousNightRestTime(previousDateItinerary,startSightSeeingTime,hotelCheckInTime);
            }
            else
            {
                if(getTimeFromDate(hotelCheckOutTime) - getTimeFromDate(endSightSeeingTime)<REST_TIME*RATIO*HOURS_TO_MILLISECONDS)
                {
                    //alert("You have less time in Hotel");//ALERT13
                    createAlert('hotelAndLessTime');
                }
            }
        }
    }

    function checkPreviousNightRestTime(previousDateItinerary,startSightSeeingTime,hotelCheckInTime)
    {
        if(previousDateItinerary!=undefined)
        {
            if(previousDateItinerary.dateWisePlaceData.noPlacesVisited!=undefined && previousDateItinerary.dateWisePlaceData.noPlacesVisited==1)
            {
                if((getTimeFromDate(startSightSeeingTime) - getTimeFromDate(hotelCheckInTime))< REST_TIME*RATIO*HOURS_TO_MILLISECONDS)
                {
                    // alert("You have less time in Hotel");//ALERT13
                    createAlert('hotelAndLessTime');
                }
            }
            else
            {
                if(getTimeFromDate(startSightSeeingTime) - getTimeFromDate(previousDateItinerary.dateWisePlaceData.endSightSeeingTime)<REST_TIME*RATIO*HOURS_TO_MILLISECONDS)
                {
                    // alert("You have less time in Hotel");//ALERT13
                    createAlert('hotelAndLessTime');
                }
            }
        }
        else
        {
            if((getTimeFromDate(startSightSeeingTime) - getTimeFromDate(hotelCheckInTime))< REST_TIME*RATIO*HOURS_TO_MILLISECONDS)
            {
                // alert("You have less time in Hotel");//ALERT13
                createAlert('hotelAndLessTime');
            }
        }
    }

    function replaceAdjacentPlaces(dateItinerary,index1,index2,place1,place2)
    {
        var distanceBetweenPlaces = getDistance(place1.Latitude,place1.Longitude,place2.Latitude,place2.Longitude);
        var timeBetweenPlaces = distanceBetweenPlaces/SPEED;
        var hotel = $scope.currentDestination.hotelDetails;
        var distanceToPlace1 = getDistance(hotel.Latitude,hotel.Longitude,place1.Latitude,place1.Longitude);
        var distanceToPlace2 = getDistance(hotel.Latitude,hotel.Longitude,place2.Latitude,place2.Longitude);
        var timeToPlace1 = distanceToPlace1/SPEED;
        var timeToPlace2 = distanceToPlace2/SPEED;

        var place3 = null, distFromPlace1 = null, timeFromPlace1 = null, place1DepartureTime = null, selectedTimeIndex = 0, place1ArrivalTime = null,
            place2DepartureTime = null, selectedPlace2TimeIndex = null, place2ArrivalTime = null, place0 = null, distFromPlace2 = null, timeFromPlace2 = null;


        if(index1 == 0 && index2 == dateItinerary.permutation.length-1)
        {
            var place1TimingsArray = getDateArrayFromPlaceTimings(place1.PlaceTimings,place1.placeArrivalTime);
            var place2TimingsArray = getDateArrayFromPlaceTimings(place2.PlaceTimings,place2.placeArrivalTime);
            var placeTimingsFinalArray = [];
            place1DepartureTime = place1.placeDepartureTime;
            var finalPlace2DepartureTime;
            for(var timingIndex = 0;timingIndex<place1TimingsArray.length;timingIndex++)
            {
                place1TimingsArray[timingIndex].timeEnd = new Date(getTimeFromDate(place1TimingsArray[timingIndex].timeEnd) - place1.Time2Cover*MINUTES_TO_MILLISECONDS);
                if(getTimeFromDate(place1TimingsArray[timingIndex].timeEnd)<getTimeFromDate(place1TimingsArray[timingIndex].timeStart))
                {
                    place1TimingsArray.splice(timingIndex,1);
                    timingIndex--;
                }
            }
            //console.log(JSON.stringify(place1TimingsArray));
            //Place1TimingsArray now contains ranges of time when place1 can be reached

            for(var timeIndex =0;timeIndex<place1TimingsArray.length;timeIndex++)
            {
               // console.log("timeBetweenPlaces:"+timeBetweenPlaces);
                var place1TimeStart = getTimeFromDate(place1TimingsArray[timeIndex].timeStart);
                var place1TimeEnd = getTimeFromDate(place1TimingsArray[timeIndex].timeEnd);
                place1TimingsArray[timeIndex].timeStart = new Date(place1TimeStart - timeBetweenPlaces*HOURS_TO_MILLISECONDS);
                place1TimingsArray[timeIndex].timeEnd = new Date(place1TimeEnd - timeBetweenPlaces*HOURS_TO_MILLISECONDS);
            }
            //console.log(JSON.stringify(place1TimingsArray));
            //Now place1TimingsArray contains ranges of time when place1 can be left

            for(var place2TimeIndex =0;place2TimeIndex<place2TimingsArray.length;place2TimeIndex++)
            {
                place2TimingsArray[place2TimeIndex].timeStart = new Date(getTimeFromDate(place2TimingsArray[place2TimeIndex].timeStart) + place2.Time2Cover*MINUTES_TO_MILLISECONDS);
                if(getTimeFromDate(place2TimingsArray[place2TimeIndex].timeEnd)<getTimeFromDate(place2TimingsArray[place2TimeIndex].timeStart))
                {
                    place2TimingsArray.splice(place2TimeIndex,1);
                    place2TimeIndex--;
                }
            }
            //console.log(JSON.stringify(place2TimingsArray));
            //place2TimingsArray contains time ranges when place2 can be left according to place2 is open

            //Taking intersection of arrays
            for(var place1TimingsIndex =0;place1TimingsIndex<place1TimingsArray.length;place1TimingsIndex++)
            {
                for(var place2TimingsIndex =0; place2TimingsIndex < place2TimingsArray.length;place2TimingsIndex++)
                {
                    var maxTimeStart = getMaximum(place1TimingsArray[place1TimingsIndex].timeStart,place2TimingsArray[place2TimingsIndex].timeStart);
                    var minTimeEnd = getMinimum(place1TimingsArray[place1TimingsIndex].timeEnd,place2TimingsArray[place2TimingsIndex].timeEnd);
                    if(getTimeFromDate(maxTimeStart)<getTimeFromDate(minTimeEnd))
                    {
                        placeTimingsFinalArray.push({
                            timeStart:maxTimeStart,
                            timeEnd: minTimeEnd
                        });
                    }
                }
            }
            //console.log(JSON.stringify(placeTimingsFinalArray));
            //console.log(place1DepartureTime);

            if(placeTimingsFinalArray.length>0)
            {
                var minTimeDifference = -1;
                for(var finalPlaceTimingsIndex = 0;finalPlaceTimingsIndex<placeTimingsFinalArray.length;finalPlaceTimingsIndex++)
                {
                    var timeStart = placeTimingsFinalArray[finalPlaceTimingsIndex].timeStart;
                    var timeEnd = placeTimingsFinalArray[finalPlaceTimingsIndex].timeEnd;
                    if(getTimeFromDate(timeStart)<=getTimeFromDate(place1DepartureTime) && getTimeFromDate(timeEnd)>=getTimeFromDate(place1DepartureTime))
                    {
                        //console.log('in if');
                        finalPlace2DepartureTime = place1DepartureTime;
                        break;
                    }
                    else
                    {
                        //console.log('In else');
                        var timeDiff = null;
                        if(getTimeFromDate(timeStart)>getTimeFromDate(place1DepartureTime))
                        {
                            //console.log('In 2nd if');
                            timeDiff = getTimeFromDate(timeStart)-getTimeFromDate(place1DepartureTime);
                            if(minTimeDifference==-1 || minTimeDifference>timeDiff)
                            {
                                minTimeDifference= timeDiff;
                                finalPlace2DepartureTime = timeStart;
                            }
                        }
                        else if(getTimeFromDate(timeEnd)<getTimeFromDate(place1DepartureTime))
                        {
                            //console.log('In 2nd else');
                            timeDiff = getTimeFromDate(place1DepartureTime)-getTimeFromDate(timeEnd);
                            if(minTimeDifference==-1 || minTimeDifference>timeDiff)
                            {
                                minTimeDifference= timeDiff;
                                finalPlace2DepartureTime = timeEnd;
                            }
                        }
                    }
                }
                //console.log(JSON.stringify(placeTimingsFinalArray));
            }
            else
            {
                finalPlace2DepartureTime = place1DepartureTime;
                // alert("place is closed");//ALERT8
                createAlert('reorderAndClosed');
            }
            //console.log(finalPlace2DepartureTime);
            place2.placeDepartureTime = finalPlace2DepartureTime;
            place2.placeArrivalTime = new Date(getTimeFromDate(finalPlace2DepartureTime) - place2.Time2Cover*MINUTES_TO_MILLISECONDS);
            place1.placeArrivalTime = new Date(getTimeFromDate(finalPlace2DepartureTime) + timeBetweenPlaces*HOURS_TO_MILLISECONDS);
            place1.placeDepartureTime = new Date(getTimeFromDate(place1.placeArrivalTime) + place1.Time2Cover*MINUTES_TO_MILLISECONDS);
            var timingIndexPlace1 = setPlaceTimingsToSelect(place1.placeArrivalTime, place1.PlaceTimings);
            var timingIndexPlace2 = setPlaceTimingsToSelect(place2.placeArrivalTime, place2.PlaceTimings);
            setSelectedPlaceTimingIndex(place1.PlaceTimings, timingIndexPlace1);
            setSelectedPlaceTimingIndex(place2.PlaceTimings, timingIndexPlace2);

            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index1]] = place2;
            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index2]] = place1;
            dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place2.placeArrivalTime) - timeToPlace2*HOURS_TO_MILLISECONDS);
            dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place1.placeDepartureTime) + timeToPlace1*HOURS_TO_MILLISECONDS);
            return true;
        }
        else if(index1 == 0)
        {
            place3 = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index2+1]];
            distFromPlace1 = getDistance(place1.Latitude,place1.Longitude,place3.Latitude,place3.Longitude);
            timeFromPlace1 = distFromPlace1/SPEED;
            place1DepartureTime = new Date(getTimeFromDate(place3.placeArrivalTime) - timeFromPlace1*HOURS_TO_MILLISECONDS);
            selectedTimeIndex = getPlaceTimingsToSelect(place1DepartureTime,place1.PlaceTimings);
            place1ArrivalTime = new Date(getTimeFromDate(place1DepartureTime) - place1.Time2Cover*MINUTES_TO_MILLISECONDS);
            place1.placeArrivalTime = place1ArrivalTime;
            place1.placeDepartureTime = place1DepartureTime;

            place2DepartureTime = new Date(getTimeFromDate(place1.placeArrivalTime) - timeBetweenPlaces*HOURS_TO_MILLISECONDS);
            selectedPlace2TimeIndex = getPlaceTimingsToSelect(place2DepartureTime,place2.PlaceTimings);
            place2ArrivalTime = new Date(getTimeFromDate(place2DepartureTime) - place2.Time2Cover*MINUTES_TO_MILLISECONDS);

            place2.placeArrivalTime = place2ArrivalTime;
            place2.placeDepartureTime = place2DepartureTime;
            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index1]] = place2;
            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index2]] = place1;
            dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place2.placeArrivalTime) - timeToPlace2*HOURS_TO_MILLISECONDS);

            if(selectedTimeIndex!=-1)
            {
                if(!checkIfClosedAtPlaceTiming(place1.PlaceTimings[selectedTimeIndex],place1ArrivalTime))
                {
                    if(selectedPlace2TimeIndex!= -1)
                    {
                        if(!checkIfClosedAtPlaceTiming(place2.PlaceTimings[selectedPlace2TimeIndex],place2ArrivalTime))
                        {
                            return true;
                        }
                        else
                        {
                            //alert("place is closed at arrival Time");//ALERT4
                            createAlert('replaceAndClosedOnArrival',place2.Name);
                        }
                    }
                    else
                    {
                        createAlert('replaceAndClosedOnDeparture',place2.Name);
                        // alert("Place is closed at departure Time");//ALERT6
                    }
                }
                else
                {
                    //alert("Place is closed at arrival Time");//ALERT4
                    createAlert('replaceAndClosedOnArrival',place1.Name);
                }
            }
            else
            {
                // alert("place is closed at departure Time");//ALERT6
                createAlert('replaceAndClosedOnDeparture',place1.Name);
            }
            return true;
        }
        else if(index2 == dateItinerary.permutation.length -1)
        {
            place0 = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index1-1]];
            distFromPlace2 = getDistance(place2.Latitude,place2.Longitude,place0.Latitude,place0.Longitude);
            timeFromPlace2 = distFromPlace2/SPEED;
            place2ArrivalTime = new Date(getTimeFromDate(place0.placeDepartureTime) + timeFromPlace2*HOURS_TO_MILLISECONDS);
            selectedTimeIndex = getPlaceTimingsToSelect(place2ArrivalTime,place2.PlaceTimings);
            place2DepartureTime = new Date(getTimeFromDate(place2ArrivalTime) + place2.Time2Cover*MINUTES_TO_MILLISECONDS);
            place2.placeArrivalTime = place2ArrivalTime;
            place2.placeDepartureTime = place2DepartureTime;

            place1ArrivalTime = new Date(getTimeFromDate(place2.placeDepartureTime) + timeBetweenPlaces*HOURS_TO_MILLISECONDS);
            selectedPlace1TimeIndex = getPlaceTimingsToSelect(place1ArrivalTime,place1.PlaceTimings);
            place1DepartureTime = new Date(getTimeFromDate(place1ArrivalTime) + place1.Time2Cover*MINUTES_TO_MILLISECONDS);
            place1.placeArrivalTime = place1ArrivalTime;
            place1.placeDepartureTime = place1DepartureTime;
            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index1]] = place2;
            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index2]] = place1;
            dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place1.placeDepartureTime) + timeToPlace1*HOURS_TO_MILLISECONDS);

            if(selectedTimeIndex!=-1)
            {
                if(!checkIfClosedAtPlaceTiming(place2.PlaceTimings[selectedTimeIndex],place2DepartureTime))
                {
                    if(selectedPlace1TimeIndex!= -1)
                    {
                        if(!checkIfClosedAtPlaceTiming(place1.PlaceTimings[selectedPlace1TimeIndex],place1DepartureTime))
                        {
                            return true;
                        }
                        else
                        {
                            //alert("place is closed at arrival Time");//ALERT4
                            createAlert('replaceAndClosedOnArrival',place1.Name);
                        }
                    }
                    else
                    {
                        //alert("Place is closed at departure Time");//ALERT6
                        createAlert('replaceAndClosedOnDeparture',place1.Name);
                    }
                }
                else
                {
                    //alert("Place is closed at arrival Time");//ALERT6
                    createAlert('replaceAndClosedOnArrival',place2.Name);
                }
            }
            else
            {
                // alert("place is closed at departure Time");//ALERT6
                createAlert('replaceAndClosedOnDeparture',place2.Name);
            }
            return true;
        }
        else
        {
            //The places are in between places
            place0 = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index1-1]];
            distFromPlace2 = getDistance(place2.Latitude,place2.Longitude,place0.Latitude,place0.Longitude);
            timeFromPlace2 = distFromPlace2/SPEED;
            place2ArrivalTime = new Date(getTimeFromDate(place0.placeDepartureTime) + timeFromPlace2*HOURS_TO_MILLISECONDS);

            place3 = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index2+1]];
            distFromPlace1 = getDistance(place1.Latitude,place1.Longitude,place3.Latitude,place3.Longitude);
            timeFromPlace1 = distFromPlace1/SPEED;
            place1DepartureTime = new Date(getTimeFromDate(place3.placeArrivalTime) - timeFromPlace1*HOURS_TO_MILLISECONDS);

            //console.log(place1DepartureTime);
            //console.log(place2ArrivalTime);

            selectedPlace2TimeIndex = getPlaceTimingsToSelect(place2ArrivalTime,place2.PlaceTimings);
            var selectedPlace1TimeIndex = getPlaceTimingsToSelect(place1DepartureTime,place1.PlaceTimings);
            var minimumTimeNeeded = timeBetweenPlaces*HOURS_TO_MILLISECONDS + RATIO*place1.Time2Cover*MINUTES_TO_MILLISECONDS + RATIO*place2.Time2Cover*MINUTES_TO_MILLISECONDS;
            var time2CoverCombined = getTimeFromDate(place1DepartureTime) - getTimeFromDate(place2ArrivalTime) - timeBetweenPlaces*HOURS_TO_MILLISECONDS;
            var time2CoverPlace1 = time2CoverCombined * (place1.Time2Cover / (place1.Time2Cover + place2.Time2Cover));
            var time2CoverPlace2 = time2CoverCombined - time2CoverPlace1;
            //console.log(time2CoverCombined);
            //console.log(time2CoverPlace1 + " - "+ time2CoverPlace2);
            place2DepartureTime = new Date(getTimeFromDate(place2ArrivalTime) + time2CoverPlace2);
            place1ArrivalTime = new Date(getTimeFromDate(place1DepartureTime) - time2CoverPlace1);

            place2.placeArrivalTime = place2ArrivalTime;
            place2.placeDepartureTime = place2DepartureTime;
            place1.placeArrivalTime = place1ArrivalTime;
            place1.placeDepartureTime = place1DepartureTime;
            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index1]] = place2;
            dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index2]] = place1;

            if(selectedPlace1TimeIndex!= -1 && selectedPlace2TimeIndex != -1){
                if(getTimeFromDate(place1DepartureTime) - getTimeFromDate(place2ArrivalTime) > minimumTimeNeeded){
                    //There is sufficient time to cover
                    var isPlace1Closed = checkIfClosedAtPlaceTiming(place1.PlaceTimings[selectedPlace1TimeIndex], place1ArrivalTime);
                    var isPlace2Closed = checkIfClosedAtPlaceTiming(place2.PlaceTimings[selectedPlace2TimeIndex], place2DepartureTime);
                    if(!isPlace1Closed && !isPlace2Closed){
                        return true;
                    }
                    else {
                        //console.log(JSON.stringify(place1.PlaceTimings[selectedPlace1TimeIndex]) +" for "+place1ArrivalTime);
                        //console.log(JSON.stringify(place2.PlaceTimings[selectedPlace2TimeIndex]) +" for "+place2DepartureTime);
                        //alert('Place closed at departure/arrival times');//ALERT10
                        if(isPlace1Closed && isPlace2Closed)
                        {
                            createAlert('reorderAndClosed');
                        }
                        else if(isPlace1Closed)
                        {
                            createAlert('reorderAndPlaceClosed',place1.Name);
                        }
                        else
                        {
                            createAlert('reorderAndPlaceClosed',place2.Name);
                        }
                    }
                }
                else {
                    // alert('Not enough time to cover places in this order');//ALERT11
                    createAlert('reorderAndLessTime');
                }
            }
            else{
                // alert('Places closed at this time');//ALERT10
                if(selectedPlace1TimeIndex==-1 && selectedPlace2TimeIndex==-1)
                {
                    createAlert('reorderAndClosed');
                }
                else if(selectedPlace1TimeIndex==-1)
                {
                    createAlert('reorderAndPlaceClosed',place1.Name);
                }
                else
                {
                    createAlert('reorderAndPlaceClosed',place2.Name);
                }
            }
            return true;
        }
        return false;
    }

    function setSelectedPlaceTimingIndex(placeTimings, index){
        for(var timingIndex=0; timingIndex < placeTimings.length; timingIndex++){
            placeTimings[timingIndex].isSelected = 0;
        }
        if(placeTimings[index]!=undefined){
            placeTimings[index].isSelected = 1;
        }
        else{
            //console.log('Invalid Index:'+index+'in placeTimings:'+JSON.stringify(placeTimings));
        }
    }

    function replacePlace(place,index,dateItinerary, locationOfArrival, locationOfDeparture)
    {
        var permValue = dateItinerary.permutation[index];
        var oldPlace = dateItinerary.dateWisePlaceData.placesData[permValue];
        var hasHotel = ($scope.currentDestination.isHotelRequired == 1);
        var hotel = $scope.currentDestination.hotelDetails;
        var replacePlaceDone = true;
        if(place.Days == undefined) {
            place.Days = combineDays(place.PlaceTimings);
        }
        if(checkIfPlaceIsOpenOnDay(place.Days,dateItinerary.dateWisePlaceData.startSightSeeingTime)) {
            //The place is open
            var timeToHotel = 0, distanceFromArrivalToPlace = 0, distanceFromPlaceToDeparture = 0, timeFromArrivalToPlace = 0, timeFromPlaceToDeparture = 0,
                permValueNextPlace = 0, nextPlace = null, distanceToNextPlace = 0, TimeToNextPlace = 0, maxPlaceDepartureTime = 0, openingTimeIndexForArrival = 0,
                openingTimeIndexForDeparture = 0;

            if(hasHotel){
                var distanceToHotel = getDistance(place.Latitude, place.Longitude, hotel.Latitude, hotel.Longitude);
                timeToHotel = distanceToHotel/SPEED;
            }
            if(dateItinerary.permutation.length == 1){
                //This is the only place of the day
                var timingIndex = -1;
                if(hasHotel){
                    timingIndex = getPlaceTimingsToSelect(oldPlace.placeArrivalTime, place.PlaceTimings);
                    if(timingIndex!=-1){
                        var supposedDepartureTime = getPlaceDepartureTimeFromArrival(oldPlace.placeArrivalTime, place.Time2Cover);
                        var expectedTimingIndex = getPlaceTimingsToSelect(supposedDepartureTime, place.PlaceTimings);
                        if(expectedTimingIndex == timingIndex){
                            //Place is open in same timing at departure
                            place.placeArrivalTime = oldPlace.placeArrivalTime;
                            place.placeDepartureTime = supposedDepartureTime;
                        }
                        else {
                            //the place is closed at departure time
                            place.placeDepartureTime = $scope.getDateFromString(place.PlaceTimings[timingIndex].TimeEnd, oldPlace.placeArrivalTime);
                            place.placeArrivalTime = getPlaceArrivalTimeFromDeparture(place.placeDepartureTime, place.Time2Cover);
                        }
                        setSelectedPlaceTimingIndex(place.PlaceTimings, timingIndex);
                    }
                    else {
                        var nearestTimingIndex = getNearestTimingIndex(oldPlace.placeArrivalTime, place.PlaceTimings);
                        var nearestTiming = place.PlaceTimings[nearestTimingIndex];
                        if(getTimeOfDayInMinutesFromDate(oldPlace.placeArrivalTime) > getTimeOfDayInMinutesFromString(nearestTiming.TimeEnd)){
                            //The current time is after place closes
                            place.placeDepartureTime = $scope.getDateFromString(nearestTiming.TimeEnd, oldPlace.placeArrivalTime);
                            place.placeArrivalTime = getPlaceArrivalTimeFromDeparture(place.placeDepartureTime, place.Time2Cover);
                        }
                        else {
                            //The current time is before the place opens
                            place.placeArrivalTime = $scope.getDateFromString(nearestTiming.TimeStart, oldPlace.placeArrivalTime);
                            place.placeDepartureTime = getPlaceDepartureTimeFromArrival(place.placeArrivalTime, place.Time2Cover);
                        }
                        setSelectedPlaceTimingIndex(place.PlaceTimings, nearestTimingIndex);
                    }
                    dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - timeToHotel*HOURS_TO_MILLISECONDS);
                    dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + timeToHotel*HOURS_TO_MILLISECONDS);
                }
                else {
                    distanceFromArrivalToPlace = getDistance(locationOfArrival.Latitude, locationOfArrival.Longitude, place.Latitude, place.Longitude);
                    distanceFromPlaceToDeparture = getDistance(place.Latitude, place.Longitude, locationOfDeparture.Latitude, locationOfDeparture.Longitude);
                    timeFromArrivalToPlace = distanceFromArrivalToPlace/SPEED;
                    timeFromPlaceToDeparture = distanceFromPlaceToDeparture/SPEED;

                    var supposedPlaceArrivalTime = new Date(getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) + timeFromArrivalToPlace*HOURS_TO_MILLISECONDS);
                    maxPlaceDepartureTime = new Date(getTimeFromDate(dateItinerary.dateWisePlaceData.endSightSeeingTime) - timeFromPlaceToDeparture*HOURS_TO_MILLISECONDS);
                    timingIndex = getPlaceTimingsToSelect(supposedPlaceArrivalTime, place.PlaceTimings);
                    if(timingIndex != -1){
                        //The place is open when reached directly from the place of arrival
                        //Trying to fix the whole available time to this place
                        var timingIndexDeparture = getPlaceTimingsToSelect(maxPlaceDepartureTime, place.PlaceTimings);
                        if(timingIndex == timingIndexDeparture){
                            //The place is open at departure time and is the same timing
                            place.placeArrivalTime = supposedPlaceArrivalTime;
                            place.placeDepartureTime = maxPlaceDepartureTime;
                            setSelectedPlaceTimingIndex(place.PlaceTimings, timingIndex);
                        }
                        else if(timingIndexDeparture == -1){
                            //The place closes before departure time
                            //Fixing the departure time when the place closes
                            place.placeDepartureTime = $scope.getDateFromString(place.PlaceTimings[timingIndex].TimeEnd, oldPlace.placeArrivalTime);
                            place.placeArrivalTime = supposedPlaceArrivalTime;
                            setSelectedPlaceTimingIndex(place.PlaceTimings, timingIndex);
                        }
                        else {
                            //The place is open at both times but in different place timings
                            //Need to select the time where more time is spent
                            var departureTimeAccordingToArrival = $scope.getDateFromString(place.PlaceTimings[timingIndex].TimeEnd, oldPlace.placeArrivalTime);
                            var arrivalTimeAccordingToDeparture = $scope.getDateFromString(place.PlaceTimings[timingIndexDeparture].TimeStart, oldPlace.placeArrivalTime);
                            var durationAccordingToArrival = getTimeFromDate(departureTimeAccordingToArrival) - getTimeFromDate(supposedPlaceArrivalTime);
                            var durationAccordingToDeparture = getTimeFromDate(maxPlaceDepartureTime) - getTimeFromDate(arrivalTimeAccordingToDeparture);
                            if(durationAccordingToArrival > durationAccordingToDeparture){
                                place.placeArrivalTime = supposedPlaceArrivalTime;
                                place.placeDepartureTime = departureTimeAccordingToArrival;
                                setSelectedPlaceTimingIndex(place.PlaceTimings, timingIndex);
                            }
                            else {
                                place.placeArrivalTime = arrivalTimeAccordingToDeparture;
                                place.placeDepartureTime = maxPlaceDepartureTime;
                                setSelectedPlaceTimingIndex(place.PlaceTimings, timingIndexDeparture);
                            }
                        }
                    }
                    else {
                        //The place is closed when reached directly
                        timingIndex = getNearestTimingIndexAfterTime(supposedPlaceArrivalTime, place.PlaceTimings);
                        if(timingIndex != -1){
                            //Fixing this timing
                            place.placeArrivalTime = $scope.getDateFromString(place.PlaceTimings[timingIndex].TimeStart, oldPlace.placeArrivalTime);
                            var supposedPlaceDepartureTime = $scope.getDateFromString(place.PlaceTimings[timingIndex].TimeEnd, oldPlace.placeArrivalTime);
                            if(getTimeFromDate(supposedPlaceDepartureTime) > getTimeFromDate(maxPlaceDepartureTime)){
                                //Departure after endSightSeeingTime
                                place.placeDepartureTime = maxPlaceDepartureTime;
                            }
                            else {
                                place.placeDepartureTime = supposedPlaceDepartureTime;
                            }
                            setSelectedPlaceTimingIndex(place.PlaceTimings, timingIndex);
                        }
                        else {
                            //Place is closed before reaching the destination
                            place.placeArrivalTime = supposedPlaceArrivalTime;
                            place.placeDepartureTime = maxPlaceDepartureTime;
                            createAlert('replaceAndClosedOnArrival',place.Name);
                        }
                    }

                }
            }
            else if(index == 0){
                //This is the first place of the day
                permValueNextPlace = dateItinerary.permutation[index+1];
                nextPlace = dateItinerary.dateWisePlaceData.placesData[permValueNextPlace];
                distanceToNextPlace = getDistance(place.Latitude,place.Longitude,nextPlace.Latitude,nextPlace.Longitude);
                TimeToNextPlace =   distanceToNextPlace/SPEED;

                place.placeDepartureTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - TimeToNextPlace*HOURS_TO_MILLISECONDS);
                place.placeArrivalTime = getPlaceArrivalTimeFromDeparture(place.placeDepartureTime,place.Time2Cover);

                openingTimeIndexForDeparture = -1;
                openingTimeIndexForArrival = -1;
                if(!hasHotel){
                    //If no hotel then will try to adjust the place arrival time
                    distanceFromArrivalToPlace = getDistance(locationOfArrival.Latitude, locationOfArrival.Longitude, place.Latitude, place.Longitude);
                    timeFromArrivalToPlace = distanceFromArrivalToPlace/SPEED;
                    var minPlaceArrivalTime = new Date(getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) + timeFromArrivalToPlace*HOURS_TO_MILLISECONDS);
                    if(getTimeFromDate(place.placeArrivalTime) < getTimeFromDate(minPlaceArrivalTime)){
                        //Arrival time before min arrival. Not possible
                        if(getTimeFromDate(place.placeDepartureTime) < getTimeFromDate(minPlaceArrivalTime)){
                            //Departing from place before coming to city
                            createAlert('replaceAndNoTimeAfterArrival');
                        }
                        else{
                            //Need to adjust arrival time
                            place.placeArrivalTime = minPlaceArrivalTime;
                        }
                    }
                }

                openingTimeIndexForDeparture = getPlaceTimingsToSelect(place.placeDepartureTime,place.PlaceTimings);
                openingTimeIndexForArrival = getPlaceTimingsToSelect(place.placeArrivalTime,place.PlaceTimings);

                if((openingTimeIndexForArrival != -1) && (openingTimeIndexForArrival == openingTimeIndexForDeparture)){
                    setSelectedPlaceTimingIndex(place.PlaceTimings, openingTimeIndexForArrival);
                }

                checkAndAlertOnPlaceReplace(place,openingTimeIndexForArrival,openingTimeIndexForDeparture);
                if(hasHotel){
                    //If has hotel then adjust the hotel timings
                    dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - timeToHotel*HOURS_TO_MILLISECONDS);
                }
            }
            else if(index == dateItinerary.permutation.length -1)
            {
                //This is end place of the day
                permValueLastPlace = dateItinerary.permutation[index-1];
                lastPlace = dateItinerary.dateWisePlaceData.placesData[permValueLastPlace];
                distanceFromLastPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
                TimeFromLastPlace = distanceFromLastPlace/SPEED;
                place.placeArrivalTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + TimeFromLastPlace*HOURS_TO_MILLISECONDS);
                place.placeDepartureTime = getPlaceDepartureTimeFromArrival(place.placeArrivalTime, place.Time2Cover);

                if(!hasHotel){
                    //No hotel. Try adjusting the place departure time
                    distanceFromPlaceToDeparture = getDistance(place.Latitude, place.Longitude, locationOfDeparture.Latitude, locationOfDeparture.Longitude);
                    timeFromPlaceToDeparture = distanceFromPlaceToDeparture/SPEED;
                    maxPlaceDepartureTime = new Date(getTimeFromDate(dateItinerary.dateWisePlaceData.endSightSeeingTime) - timeFromPlaceToDeparture*HOURS_TO_MILLISECONDS);
                    if(getTimeFromDate(place.placeDepartureTime) > getTimeFromDate(maxPlaceDepartureTime)){
                        //Departure after max possible departure time
                        if(getTimeFromDate(place.placeArrivalTime) > getTimeFromDate(maxPlaceDepartureTime)){
                            //Arrival also after max possible departure time
                            createAlert('replaceAndNoTimeBeforeDeparture');
                        }
                        else{
                            //Need to adjust departure time
                            place.placeDepartureTime = maxPlaceDepartureTime;
                        }
                    }
                }
                openingTimeIndexForArrival = getPlaceTimingsToSelect(place.placeArrivalTime, place.PlaceTimings);
                openingTimeIndexForDeparture = getPlaceTimingsToSelect(place.placeDepartureTime, place.PlaceTimings);
                if((openingTimeIndexForArrival != -1) && (openingTimeIndexForArrival == openingTimeIndexForDeparture)){
                    setSelectedPlaceTimingIndex(place.PlaceTimings, openingTimeIndexForArrival);
                }
                checkAndAlertOnPlaceReplace(place,openingTimeIndexForArrival,openingTimeIndexForDeparture);
                if(hasHotel){
                    dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + timeToHotel*HOURS_TO_MILLISECONDS);
                }
            }
            else {
                //This place is in between some other places
                permValueNextPlace = dateItinerary.permutation[index+1];
                nextPlace = dateItinerary.dateWisePlaceData.placesData[permValueNextPlace];
                distanceToNextPlace = getDistance(place.Latitude,place.Longitude,nextPlace.Latitude,nextPlace.Longitude);
                TimeToNextPlace =   distanceToNextPlace/SPEED;
                var permValueLastPlace = dateItinerary.permutation[index-1];
                var lastPlace = dateItinerary.dateWisePlaceData.placesData[permValueLastPlace];
                var distanceFromLastPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
                var TimeFromLastPlace = distanceFromLastPlace/SPEED;

                place.placeArrivalTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + TimeFromLastPlace*HOURS_TO_MILLISECONDS);
                place.placeDepartureTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - TimeToNextPlace*HOURS_TO_MILLISECONDS);
                openingTimeIndexForDeparture = getPlaceTimingsToSelect(place.placeDepartureTime,place.PlaceTimings);
                openingTimeIndexForArrival = getPlaceTimingsToSelect(place.placeArrivalTime, place.PlaceTimings);

                if(timeDifferenceGreaterThan(place.placeArrivalTime, place.placeDepartureTime, 0) && (openingTimeIndexForArrival != -1) && (openingTimeIndexForArrival == openingTimeIndexForDeparture)){
                    setSelectedPlaceTimingIndex(place.PlaceTimings, openingTimeIndexForArrival);
                }
                //console.log("openingTimeIndexForArrival:"+openingTimeIndexForArrival+",openingTimeIndexForDeparture:"+openingTimeIndexForDeparture);
                if(timeDifferenceGreaterThan(place.placeDepartureTime, place.placeArrivalTime, 0)){
                    //Arriving at place after Departure time. Cannot replace
                    createAlert('replaceAndNoTime', place.Name);
                    replacePlaceDone = false;
                }
                else {
                    checkAndAlertOnPlaceReplace(place,openingTimeIndexForArrival,openingTimeIndexForDeparture);
                }

            }
            if(replacePlaceDone){
                dateItinerary.dateWisePlaceData.placesData[permValue] = place;
            }
        }
        else {
            //alert('Place closed on this day');//ALERT3
            createAlert('replaceAndClosedOnDay',place.Name);
            replacePlaceDone = false;
        }
        return replacePlaceDone;
    }

    function checkAndAlertOnPlaceReplace(place,openingTimeIndexForArrival,openingTimeIndexForDeparture)
    {
        var isPlaceTimingSet = false;
        if(openingTimeIndexForArrival != -1 && openingTimeIndexForDeparture != -1) {
            //The place is open at both arrival and departure time
            if(openingTimeIndexForArrival == openingTimeIndexForDeparture){
                //Both timings are from same index. So the place is open for this whole duration
                isPlaceTimingSet = true;
            }
            else{
                // alert('The place is closed in this duration');//ALERT7
                createAlert('replaceAndClosedInDuration',place.Name);
            }
        }
        else {
            if(openingTimeIndexForArrival == openingTimeIndexForDeparture) {
                //alert('The place is closed at this time');//ALERT7
                createAlert('replaceAndClosedOnArrivalAndDeparture',place.Name);
            }
            else if(openingTimeIndexForDeparture == -1){
                //The place is open at arrival but closes before departure
                place.placeDepartureTime = $scope.getDateFromString(place.PlaceTimings[openingTimeIndexForArrival].TimeEnd, place.placeArrivalTime);
                isPlaceTimingSet = true;
            }
            else if(openingTimeIndexForArrival == -1){
                //The place is open at departure time but closed at arrival time
                place.placeArrivalTime = $scope.getDateFromString(place.PlaceTimings[openingTimeIndexForDeparture].TimeStart,place.placeDepartureTime);
                isPlaceTimingSet = true;
            }
            if(isPlaceTimingSet && getTimeFromDate(place.placeDepartureTime) - getTimeFromDate(place.placeArrivalTime) < place.Time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
            {
                //alert("You have Less Time to Cover This place. Set Timings Accordingly!");//ALERT5
                createAlert('replaceAndLessTime',place.Name);
            }
        }
    }

    function getPlaceDepartureTimeFromArrival(arrivalTime, time2Cover){
        return new Date(getTimeFromDate(arrivalTime) + time2Cover*MINUTES_TO_MILLISECONDS);
    }

    function getPlaceArrivalTimeFromDeparture(departureTime, time2Cover){
        return new Date(getTimeFromDate(departureTime) - time2Cover*MINUTES_TO_MILLISECONDS);
    }

    function checkIfClosedAtPlaceTiming(placeTime, time)
    {
        if($scope.isOnSameDay(time, placeTime.Days)){
            if(getTimeOfDayInMinutesFromDate(time) >= getTimeOfDayInMinutesFromString(placeTime.TimeStart)) {
                if(getTimeOfDayInMinutesFromDate(time) <= getTimeOfDayInMinutesFromString(placeTime.TimeEnd)) {
                    return false;
                }
            }
        }
        return true;
    }

    function getDateArrayFromPlaceTimings(placeTimings,currentDate)
    {
        var placeTimingsDateArray =[];
        for(var i=0;i<placeTimings.length;i++)
        {
            if($scope.isOnSameDay(currentDate,placeTimings[i].Days))
            {
                placeTimingsDateArray.push({
                    timeStart:$scope.getDateFromString(placeTimings[i].TimeStart,currentDate),
                    timeEnd: $scope.getDateFromString(placeTimings[i].TimeEnd,currentDate)
                });
            }
        }
        return placeTimingsDateArray;
    }

    function calculateHotelExpenses(destination){
        var currentCity = false;
        var pricePerPerson = 0;
        if(destination == undefined){
            destination = $scope.currentDestination;
            currentCity = true;
        }
        if(destination.isHotelRequired == 1){
            var hotelDetails = destination.hotelDetails;
            if($scope.currentDestination.isHotelRequired == 1){
                $scope.hotelExpensesText = $scope.currentDestination.hotelDetails.Name;
            }
            var numberOfDaysInHotel = 0;
            hotelDetails.checkInTime = new Date(hotelDetails.checkInTime);
            hotelDetails.checkOutTime = new Date(hotelDetails.checkOutTime);
            var checkInTimeClone = new Date(getTimeFromDate(hotelDetails.checkInTime));
            checkInTimeClone.setHours(12,0,0,0);
            var checkOutTimeClone = new Date(getTimeFromDate(hotelDetails.checkOutTime));
            checkOutTimeClone.setHours(12,0,0,0);
            //if(getTimeFromDate(hotelDetails.checkInTime) < getTimeFromDate(checkInTimeClone)) {
            //    numberOfDaysInHotel += 1;
            //}
            if(hotelDetails.checkInTime.getHours()<6)
            {
                numberOfDaysInHotel += 1;
            }
            numberOfDaysInHotel += (getTimeFromDate(checkOutTimeClone) - getTimeFromDate(checkInTimeClone)) / (DAYS_TO_MILLISECONDS);
            //if(getTimeFromDate(hotelDetails.checkOutTime) > getTimeFromDate(checkOutTimeClone)) {
            //    numberOfDaysInHotel += 1;
            //}
            var numberOfRooms = Math.ceil($scope.numberOfPeople/hotelDetails.MaxPersons);
            pricePerPerson = (hotelDetails.Price * numberOfDaysInHotel * numberOfRooms)/$scope.numberOfPeople;
            hotelDetails.pricePerPerson = pricePerPerson;
            hotelDetails.numberOfDays = numberOfDaysInHotel;
            hotelDetails.numberOfRooms = numberOfRooms;
        }
        if(currentCity){
            $scope.hotelExpenses = pricePerPerson;
            calculateCityExpenses();
        }
        else {
            return pricePerPerson;
        }
    }

    function calculateLocalTravelExpenses(destination){
        var currentCity = false;
        if(destination == undefined){
            destination = $scope.currentDestination;
            currentCity = true;
        }
        var localTravelAndFoodExpenses = destination.dateWiseItinerary.length * PER_DAY_FOOD_AND_LOCAL_TRAVEL;
        destination.localTravelAndFoodExpenses = localTravelAndFoodExpenses;
        if(currentCity){
            $scope.localTravelAndFoodExpenses = localTravelAndFoodExpenses;
            calculateCityExpenses();
        }
        else {
            return localTravelAndFoodExpenses;
        }
    }

    function calculatePlacesExpenses(destination){
        var currentCity = false;
        if(destination == undefined){
            destination = $scope.currentDestination;
            currentCity = true;
        }
        var dateItinerary = destination.dateWiseItinerary;
        var expenses = 0;
        for(var i = 0; i < dateItinerary.length; i++){
            for(var j = 0; j < dateItinerary[i].permutation.length; j++){
                var isPlaceRemoved = dateItinerary[i].dateWisePlaceData.placesData[dateItinerary[i].permutation[j]].isPlaceRemoved;
                if(!(isPlaceRemoved != undefined && isPlaceRemoved == 1)){
                    if(dateItinerary[i].dateWisePlaceData.placesData[dateItinerary[i].permutation[j]].AdultCharge != undefined){
                        if(dateItinerary[i].dateWisePlaceData.placesData[dateItinerary[i].permutation[j]].AdultCharge > 0){
                            expenses += parseInt(dateItinerary[i].dateWisePlaceData.placesData[dateItinerary[i].permutation[j]].AdultCharge);
                        }
                    }
                }
            }
        }
        destination.placesExpenses = expenses;
        if(currentCity){
            $scope.placesExpenses = expenses;
            calculateCityExpenses();
        }
        else {
            return expenses;
        }
    }

    function calculateCityExpenses(){
        //console.log($scope.hotelExpenses +","+$scope.placesExpenses +","+$scope.localTravelAndFoodExpenses);
        $scope.cityExpenses = $scope.hotelExpenses + $scope.placesExpenses + $scope.localTravelAndFoodExpenses;
        calculateBudgetPercent();
    }

    function calculateBudgetPercent(){
        $scope.totalExpenses = $scope.travelBudget + $scope.cityExpenses + $scope.otherCitiesExpenses;
        //console.log($scope.totalBudget);
        var percent = parseInt(($scope.totalExpenses * 100)/ $scope.totalBudget);
        $rootScope.$emit('budgetChanged', percent);
        //console.log('budgetChanged:'+percent);
    }

    function calculateOtherCitiesExpenses() {
        var otherCitiesExpenses = 0;
        for(var destinationIndex = 0; destinationIndex < $scope.destinations.length; destinationIndex++){
            var destination = $scope.destinations[destinationIndex];
            if(!destination.isCurrent){
                var hotelExpenses = 0;
                if(destination.isHotelRequired == 1){
                    hotelExpenses = calculateHotelExpenses(destination);
                }
                var placeExpenses = calculatePlacesExpenses(destination);
                var localTravelExpenses = calculateLocalTravelExpenses(destination);
                destination.totalExpenses = hotelExpenses + placeExpenses + localTravelExpenses;
                otherCitiesExpenses += destination.totalExpenses;
            }
        }
        $scope.otherCitiesExpenses = otherCitiesExpenses;
    }

    function insertPlaceIntoItinerary(place, candidate, selectedPlaceTimingIndex){
        //console.log('insertPlaceIntoItinerary');
        var freeTiming = candidate.freeTimingsArray[selectedPlaceTimingIndex];
        //console.log(freeTiming.freeStartTime + " = "+ freeTiming.lowestTime);
        var dateWiseItinerary = candidate.dateWiseItinerary;
        var nextDateWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];

        if(candidate.type == "nightMorning" || candidate.type == "checkIn" || candidate.type == "checkOut") {
            if(freeTiming.insertionDay == 0) {
                //The insertion is on the same day
                //console.log('insertion is on the same day');
                //The place has to inserted as the last place of the day
                insertPlaceAtLastOfDay(dateWiseItinerary, place);
                place.placeArrivalTime = freeTiming.lowestTime;
                if(getTimeFromDate(freeTiming.freeStartTime) == getTimeFromDate(freeTiming.lowestTime)) {
                    //The starting of the free time is the same as lowest time when that place can be reached
                    //So this place can be inserted at that time
                    //console.log('place can be inserted at start of free time');
                }
                else {
                    //The place is not open when person is reaching there
                    if(candidate.type != "checkIn") {
                        //Make Departure time from last place equal to endTime or Max time so that person reach at new place near by opening time
                       // console.log("Increasing Departure Time of Previous Place");
                        //Departing from place
                        increaseDepartureTimeOfPreviousPlace(dateWiseItinerary, place, freeTiming);
                    }
                }
                setPlaceDepartureTime(place, freeTiming);
                //console.log("Place.placeDepartureTime:"+place.placeDepartureTime);
                //console.log("place.timeToHotel:"+place.timeToHotel);
                dateWiseItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + place.timeToHotel * HOURS_TO_MILLISECONDS);
                //console.log("dateWiseItinerary.endSightSeeingTime:"+dateWiseItinerary.dateWisePlaceData.endSightSeeingTime);
                if(candidate.type == "checkIn") {
                    dateWiseItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - place.timeToHotel * HOURS_TO_MILLISECONDS);
                    dateWiseItinerary.hasMorningCheckIn = true;
                }
                if( dateWiseItinerary.dateWisePlaceData.noPlacesVisited!=undefined && dateWiseItinerary.dateWisePlaceData.noPlacesVisited==1)
                {
                    dateWiseItinerary.dateWisePlaceData.noPlacesVisited = 0;
                }
            }
            else if(freeTiming.insertionDay == 1){
                //The insertion is on the next day
                //console.log('insertion on next day');
                insertPlaceAtBeginningOfDay(nextDateWiseItinerary, place);
                place.placeDepartureTime = freeTiming.highestTime;
                if(getTimeFromDate(freeTiming.freeEndTime) == getTimeFromDate(freeTiming.highestTime)) {
                    //The starting of the free time is the same as lowest time when that place can be reached
                    //So this place can be inserted at that time
                    //console.log('place can be inserted at end of free time');
                }
                else {
                    if(candidate.type != "checkOut") {
                        decreaseArrivalTimeOfNextPlace(nextDateWiseItinerary, place, freeTiming);
                    }
                }
                setPlaceArrivalTime(place, freeTiming);
                nextDateWiseItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - place.timeToHotel * HOURS_TO_MILLISECONDS);
                if( nextDateWiseItinerary.dateWisePlaceData.noPlacesVisited!=undefined && nextDateWiseItinerary.dateWisePlaceData.noPlacesVisited==1)
                {
                    nextDateWiseItinerary.dateWisePlaceData.noPlacesVisited = 0;
                }
                //console.log("nextDateWiseItinerary.dateWisePlaceData.startSightSeeingTime:"+nextDateWiseItinerary.dateWisePlaceData.startSightSeeingTime+","+place.timeToHotel);
                if(candidate.type == "checkOut") {
                    nextDateWiseItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + place.timeToHotel * HOURS_TO_MILLISECONDS);
                }
            }
        }
        else if(candidate.type == "morningCheckIn") {
            //console.log('morningCheckIn');
            //The insertion is on the same day
            //console.log('insertion is on the same day');
            insertPlaceAtBeginningOfDay(dateWiseItinerary, place);
            place.placeDepartureTime = freeTiming.highestTime;
            if(getTimeFromDate(freeTiming.freeStartTime) == getTimeFromDate(freeTiming.lowestTime)) {
                //The starting of the free time is the same as lowest time when that place can be reached
                //So this place can be inserted at that time
                //console.log('place can be inserted at end of free time');
            }
            else {
                decreaseArrivalTimeOfNextPlace(dateWiseItinerary, place, freeTiming);
            }
            setPlaceDepartureTime(place, freeTiming);
            dateWiseItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - place.timeToHotel * HOURS_TO_MILLISECONDS);

        }
        else if(candidate.type == "eveningCheckOut") {
            //console.log('eveningCheckOut');
            //The insertion is on the same day
            //console.log('insertion is on the same day');
            insertPlaceAtLastOfDay(dateWiseItinerary, place);
            place.placeArrivalTime = freeTiming.lowestTime;
            if(getTimeFromDate(freeTiming.freeStartTime) == getTimeFromDate(freeTiming.lowestTime)) {
                //The starting of the free time is the same as lowest time when that place can be reached
                //So this place can be inserted at that time
                //console.log('place can be inserted at start of free time');
            }
            else {
                increaseDepartureTimeOfPreviousPlace(dateWiseItinerary, place, freeTiming);
            }
            setPlaceDepartureTime(place, freeTiming);
            dateWiseItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + place.timeToHotel * HOURS_TO_MILLISECONDS);
        }
    }

    function chooseBestCandidate(candidates, place) {
        var selectedCandidateIndex = -1;
        var selectedPlaceTimingsIndex = -1;
        var candidateIndex = 0, candidate = null;
        if(place.Days == undefined) {
            place.Days = combineDays(place.PlaceTimings);
        }
        if(place.Days != "0"){
            for(candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                candidate = candidates[candidateIndex];
                candidate.dateWiseItinerary.dateWisePlaceData.currentDate = new Date(candidate.dateWiseItinerary.dateWisePlaceData.currentDate);
                if(candidate.type == 'morningCheckIn' || candidate.type == 'eveningCheckOut') {
                    if(!checkIfPlaceIsOpenOnDay(place.Days, candidate.dateWiseItinerary.dateWisePlaceData.currentDate)){
                        candidates.splice(candidateIndex,1);
                        //console.log('Place is not open on day:'+candidateIndex);
                        candidateIndex--;
                    }
                    else {
                        candidate.isOpenOnDay = 1;
                    }
                }
                else {
                    if(checkIfPlaceIsOpenOnDay(place.Days, candidate.dateWiseItinerary.dateWisePlaceData.currentDate)){
                        candidate.isOpenOnDay = 1;//current day
                    }
                    if(checkIfPlaceIsOpenOnDay(place.Days, new Date(getTimeFromDate(candidate.dateWiseItinerary.dateWisePlaceData.currentDate) + 1 * DAYS_TO_MILLISECONDS))){
                        if(candidate.isOpenOnDay != undefined && candidate.isOpenOnDay == 1){
                            candidate.isOpenOnDay = 3;//Both Days
                        }
                        else {
                            candidate.isOpenOnDay = 2;
                        }
                    }
                    if(candidate.isOpenOnDay == undefined){
                        //Closed on both days
                        candidates.splice(candidateIndex, 1);
                        //console.log('Place is not open on both days:'+candidateIndex);
                        candidateIndex--;
                    }
                }
            }
        }
        else {
            for(candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                candidate = candidates[candidateIndex];
                candidate.isOpenOnDay = 3;
            }
        }
        if(candidates.length > 0){
            //Still some candidates left
            for(candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                candidate = candidates[candidateIndex];
                var freeTimingsArray = getFreeTimings(candidate, place);
                for(var freeTimingsIndex =0;freeTimingsIndex<freeTimingsArray.length;freeTimingsIndex++)
                {
                    if(getTimeFromDate(freeTimingsArray[freeTimingsIndex].freeEndTime) - getTimeFromDate(freeTimingsArray[freeTimingsIndex].freeStartTime)<place.Time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
                    {
                       // console.log("Removing time :"+freeTimingsArray[freeTimingsIndex].freeEndTime +" - "+ freeTimingsArray[freeTimingsIndex].freeStartTime +" >= "+ place.Time2Cover*RATIO);
                        freeTimingsArray.splice(freeTimingsIndex,1);
                        freeTimingsIndex--;
                    }
                }
                if(freeTimingsArray.length==0)
                {
                    candidates.splice(candidateIndex,1);
                    //console.log('Duration is less that time to cover:'+candidateIndex);
                    candidateIndex--;
                }
                else
                {
                    candidate.freeTimingsArray = freeTimingsArray;
                }
            }
        }
        if(candidates.length > 0)
        {
            for(candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                candidate = candidates[candidateIndex];
                //console.log('For candidate:'+candidateIndex);
                checkIfPlaceIsOpenOnFreeTimings(candidate,place);
                if(candidate.freeTimingsArray.length==0){
                    candidates.splice(candidateIndex,1);
                    //console.log('Place is not open on free timings:'+candidateIndex);
                    candidateIndex--;
                }

            }
        }
        if(candidates.length > 0)
        {
            var duration=-1;
            for(candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                candidate = candidates[candidateIndex];
                for(var candidateTimingsIndex=0;candidateTimingsIndex<candidate.freeTimingsArray.length;candidateTimingsIndex++)
                {
                    var freeDuration = getTimeFromDate(candidate.freeTimingsArray[candidateTimingsIndex].highestTime)-getTimeFromDate(candidate.freeTimingsArray[candidateTimingsIndex].lowestTime);
                    if((freeDuration)>duration)
                    {
                        duration = freeDuration;
                        selectedCandidateIndex = candidateIndex;
                        selectedPlaceTimingsIndex = candidateTimingsIndex;
                    }
                }
            }
        }
        return{
            selectedCandidateIndex:selectedCandidateIndex,
            selectedPlaceTimingsIndex:selectedPlaceTimingsIndex
        };
    }

    function combineDays(placeTimings) {
        var combinedDays = "";
        for(var i = 0; i < placeTimings.length; i++) {
            //console.log('placeTimings['+i+']:'+JSON.stringify(placeTimings[i]));
            var days = placeTimings[i].Days;
            if(days == null || days == undefined) {
               // console.log('WARNING: The place does not have any timings. Assuming it is open all days');
                placeTimings[i].Days = "0";
                placeTimings[i].TimeStart = "11:00:00";
                placeTimings[i].TimeEnd = "07:00:00";
                return "0";
            }
            if(days == "0") {
                return "0";
            }
            combinedDays = mergeDaysString(combinedDays, days);
        }
        if(combinedDays.length == 7){
            return "0";
        }
        return combinedDays;
    }


    function checkIfPlaceIsOpenOnDay(Days, date) {
        if(Days != '0') {
            var currentDay = '' + getCurrentDay(date);
            if(Days.indexOf(currentDay) == -1) {
                return false;
            }
        }
        return true;
    }

    function getCurrentDay(date) {
        if(!(date instanceof Date)){
            date = new Date(date);
        }
        return date.getDay() + 1;
    }

    function mergeDaysString(days1, days2) {
        var uniqueDays = "";
        for(var i = 0; i < days2.length; i++) {
            if(days1.indexOf(days2.charAt(i)) == -1) {
                uniqueDays += days2.charAt(i);
            }
        }
        return days1 + uniqueDays;
    }

    function getFreeTimings(candidate, place){
        var freeTimingsArray = [];
        var hotel = $scope.currentDestination.hotelDetails;
        var freeTimings = null, distanceToHotel = 0, time2Hotel = 0, nextDayFirstPlace = null, distanceFromHotel = 0, timeFromHotel = 0,
            lastPlace = null, distanceToNewPlace = 0, timeToNewPlace = 0, nextDayWiseItinerary = null;
        if(candidate.type == 'morningCheckIn'){
            freeTimings = {
                insertionDay: 0,//Same Day
                freeStartTime:new Date(),
                freeEndTime:new Date()
            };
            var nextPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[0]];
            nextPlace.placeArrivalTime=new Date(nextPlace.placeArrivalTime);
            var distanceToNextPlace = getDistance(place.Latitude, place.Longitude, nextPlace.Latitude, nextPlace.Longitude);
            var timeToNextPlace = distanceToNextPlace / SPEED;
            distanceFromHotel = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
            timeFromHotel = distanceFromHotel / SPEED;
            place.timeToHotel = timeFromHotel;
            freeTimings.freeEndTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - timeToNextPlace * HOURS_TO_MILLISECONDS);
            freeTimings.freeStartTime = new Date(getTimeFromDate(hotel.checkInTime) + MORNING_CHECK_IN_DURATION * RATIO * HOURS_TO_MILLISECONDS + timeFromHotel * HOURS_TO_MILLISECONDS);
            freeTimingsArray.push(freeTimings);
        }
        else if(candidate.type == 'nightMorning') {

            distanceToHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            time2Hotel = distanceToHotel / SPEED;
            place.timeToHotel = time2Hotel;
            nextDayWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];
            if(candidate.isOpenOnDay == 1 || candidate.isOpenOnDay == 3)
            {
                freeTimings = {
                    insertionDay: 0,//Same Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
                lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
                distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
                timeToNewPlace = distanceToNewPlace / SPEED;
                freeTimings.freeStartTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime)+timeToNewPlace * HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime=new Date(getTimeFromDate(nextDayWiseItinerary.dateWisePlaceData.startSightSeeingTime) - REST_TIME*HOURS_TO_MILLISECONDS*RATIO-time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
            if(candidate.isOpenOnDay == 2 || candidate.isOpenOnDay == 3)
            {
                freeTimings = {
                    insertionDay: 1,//Next Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                nextDayFirstPlace = nextDayWiseItinerary.dateWisePlaceData.placesData[nextDayWiseItinerary.permutation[0]];
                nextDayFirstPlace.placeArrivalTime = new Date(nextDayFirstPlace.placeArrivalTime);
                distanceToNextDayFirstPlace = getDistance(place.Latitude,place.Longitude,nextDayFirstPlace.Latitude,nextDayFirstPlace.Longitude);
                timeToNextDayFirstPlace = distanceToNextDayFirstPlace / SPEED;
                freeTimings.freeEndTime = new Date(getTimeFromDate(nextDayFirstPlace.placeArrivalTime) - timeToNextDayFirstPlace*HOURS_TO_MILLISECONDS);
                freeTimings.freeStartTime = new Date(getTimeFromDate(candidate.dateWiseItinerary.dateWisePlaceData.endSightSeeingTime) + REST_TIME*HOURS_TO_MILLISECONDS*RATIO+time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
                //console.log("freeTimingsArray:"+JSON.stringify(freeTimingsArray));
                //console.log('nextDayFirstPlace:'+nextDayFirstPlace.Name);
            }
        }
        else if(candidate.type == 'checkIn'){

            distanceFromHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            timeFromHotel = distanceFromHotel/SPEED;
            place.timeToHotel = timeFromHotel;
            nextDayWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];
            var hotelCheckInTime = hotel.checkInTime;
            if(candidate.isOpenOnDay ==1 || candidate.isOpenOnDay ==3)
            {
                freeTimings = {
                    insertionDay: 0,//Same Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                freeTimings.freeStartTime = new Date(getTimeFromDate(hotelCheckInTime) + MORNING_CHECK_IN_DURATION*RATIO*HOURS_TO_MILLISECONDS+timeFromHotel*HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime = new Date(getTimeFromDate(nextDayWiseItinerary.dateWisePlaceData.startSightSeeingTime) - REST_TIME*HOURS_TO_MILLISECONDS*RATIO-timeFromHotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }

            if(candidate.isOpenOnDay == 2 || candidate.isOpenOnDay == 3)
            {
                freeTimings = {
                    insertionDay: 1,//Next Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                nextDayFirstPlace = nextDayWiseItinerary.dateWisePlaceData.placesData[nextDayWiseItinerary.permutation[0]];
                nextDayFirstPlace.placeArrivalTime = new Date(nextDayFirstPlace.placeArrivalTime);
                var distanceToNextDayFirstPlace = getDistance(place.Latitude,place.Longitude,nextDayFirstPlace.Latitude,nextDayFirstPlace.Longitude);
                var timeToNextDayFirstPlace = distanceToNextDayFirstPlace / SPEED;

                freeTimings.freeStartTime =new Date(getTimeFromDate(hotelCheckInTime) + REST_TIME*RATIO*HOURS_TO_MILLISECONDS+timeFromHotel*HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime =  new Date(getTimeFromDate(nextDayFirstPlace.placeArrivalTime) - timeToNextDayFirstPlace*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
        }
        else if(candidate.type == 'checkOut'){

            //console.log('Enters checkout');
            lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
            lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
            distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
            timeToNewPlace = distanceToNewPlace / SPEED;
            distanceToHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            time2Hotel = distanceToHotel / SPEED;
            place.timeToHotel = time2Hotel;
            //console.log(candidate.isOpenOnDay);
            if(candidate.isOpenOnDay ==1 || candidate.isOpenOnDay ==3)
            {
                //console.log('Open on 1st day');
                freeTimings = {
                    insertionDay: 0,//Same Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };

                freeTimings.freeStartTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime)+timeToNewPlace * HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime=new Date(getTimeFromDate(hotel.checkOutTime) - REST_TIME*HOURS_TO_MILLISECONDS*RATIO-time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
            if((candidate.isOpenOnDay == 2 || candidate.isOpenOnDay == 3))
            {
                //console.log('Open on 2nd day');
                freeTimings = {
                    insertionDay: 1,//Next Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };

                freeTimings.freeStartTime = new Date(getTimeFromDate(candidate.dateWiseItinerary.dateWisePlaceData.endSightSeeingTime) + REST_TIME*HOURS_TO_MILLISECONDS*RATIO+time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime = new Date(getTimeFromDate(hotel.checkOutTime) - CHECK_OUT_DURATION*RATIO*HOURS_TO_MILLISECONDS-time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);

            }
        }
        else if(candidate.type=='eveningCheckOut')
        {
            freeTimings = {
                insertionDay: 0,//Same Day
                freeStartTime:new Date(),
                freeEndTime:new Date()
            };
            lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
            lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
            distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
            timeToNewPlace = distanceToNewPlace / SPEED;
            distanceFromHotel = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
            timeFromHotel = distanceFromHotel / SPEED;
            place.timeToHotel = timeFromHotel;
            freeTimings.freeStartTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime)+timeToNewPlace * HOURS_TO_MILLISECONDS);
            freeTimings.freeEndTime = new Date(getTimeFromDate(hotel.checkOutTime)- CHECK_OUT_DURATION*RATIO*HOURS_TO_MILLISECONDS - timeFromHotel*HOURS_TO_MILLISECONDS);
            freeTimingsArray.push(freeTimings);
        }
        return freeTimingsArray;
    }

    function checkIfPlaceIsOpenOnFreeTimings(candidate,place){
        //console.log('In checkIfPlaceIsOpenOnFreeTimings');
        for(var candidateTimingsIndex =0;candidateTimingsIndex<candidate.freeTimingsArray.length;candidateTimingsIndex++)
        {
            var freeStartTime = candidate.freeTimingsArray[candidateTimingsIndex].freeStartTime;
            var freeEndTime = candidate.freeTimingsArray[candidateTimingsIndex].freeEndTime;
            var candidateTimingValid = false;
            for(var placeTimingsIndex = 0; placeTimingsIndex<place.PlaceTimings.length;placeTimingsIndex++) {
                if (checkIfPlaceIsOpenOnDay(place.PlaceTimings[placeTimingsIndex].Days, freeStartTime)) {
                    //console.log('Place is Open on day :'+candidateTimingsIndex);
                    if (compareTimings(place.PlaceTimings[placeTimingsIndex], place.Time2Cover, candidate.freeTimingsArray[candidateTimingsIndex])) {
                        candidate.placeTimingsIndex = placeTimingsIndex;
                        candidateTimingValid = true;
                        break;
                    }
                }
            }
            if(!candidateTimingValid)
            {
                candidate.freeTimingsArray.splice(candidateTimingsIndex,1);
                candidateTimingsIndex--;
            }
        }
    }

    function calculateHotelEntryExitTime(hotel){

        var distance=getDistance($scope.currentDestination.LocationOfArrival.Latitude,$scope.currentDestination.LocationOfArrival.Longitude,
            hotel.Latitude,hotel.Longitude);
        var time = distance/SPEED;
        var arrivalTime = new Date($scope.currentDestination.arrivalTime);
        var hotelCheckInTime = new Date(getTimeFromDate(arrivalTime)+time*HOURS_TO_MILLISECONDS);
        var departureTime = new Date($scope.currentDestination.departureTime);
        distance=getDistance($scope.currentDestination.LocationOfDeparture.Latitude,$scope.currentDestination.LocationOfDeparture.Longitude,
            hotel.Latitude,hotel.Longitude);
        time = distance/SPEED;
        var hotelCheckOutTime = new Date(getTimeFromDate(departureTime)-time*HOURS_TO_MILLISECONDS);
        hotel.checkInTime = hotelCheckInTime;
        hotel.checkOutTime = hotelCheckOutTime;

        fixItineraryOnHotelChange();
    }

    function fixItineraryOnHotelChange() {
        var hotel = $scope.currentDestination.hotelDetails;

        for(var dateIndex in $scope.currentDestination.dateWiseItinerary) {
            var dateItinerary = $scope.currentDestination.dateWiseItinerary[dateIndex];
            console.log('DATE ITINERARY:'+JSON.stringify(dateItinerary));
            if(dateItinerary.permutation.length == 0){
                //No places scheduled for this day. So no fix required
                continue;
            }
            var firstPlaceOfCurrentDay = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[0]];
            var lastPlaceOfDay = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[dateItinerary.permutation.length-1]];
            var distanceToHotel;
            var timeToHotel;
            var distanceFromHotel;
            var timeFromHotel;
            var hotelEntryTime = null, previousDay = null;

            if(firstPlaceOfCurrentDay!=undefined)
            {
                distanceFromHotel = getDistance(hotel.Latitude,hotel.Longitude,firstPlaceOfCurrentDay.Latitude,firstPlaceOfCurrentDay.Longitude);
                timeFromHotel = distanceFromHotel/SPEED;
            }
            if(lastPlaceOfDay!=undefined)
            {
                distanceToHotel = getDistance(lastPlaceOfDay.Latitude,lastPlaceOfDay.Longitude,hotel.Latitude,hotel.Longitude);
                timeToHotel = distanceToHotel/SPEED;
            }
            if(dateItinerary.dateWisePlaceData.typeOfDay == 0 || dateItinerary.dateWisePlaceData.typeOfDay == 3){
                //This is first day of trip
                if(dateItinerary.hasMorningCheckIn == undefined || (dateItinerary.hasMorningCheckIn != undefined && dateItinerary.hasMorningCheckIn)) {
                    //Has Morning Check-In
                    dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(firstPlaceOfCurrentDay.placeArrivalTime) - timeFromHotel*HOURS_TO_MILLISECONDS);
                    if((getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) - getTimeFromDate(hotel.checkInTime))  < RATIO*MORNING_CHECK_IN_DURATION*HOURS_TO_MILLISECONDS){
                        //Violating Constraint
                        // alert("You have less time in hotel on "+dateItinerary.dateWisePlaceData.startSightSeeingTime);//ALERT14
                        createAlert('replaceHotelLessTimeOnDate',$filter('date')(dateItinerary.dateWisePlaceData.startSightSeeingTime, 'mediumDate'));
                    }
                    dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(lastPlaceOfDay.placeDepartureTime)+timeToHotel*HOURS_TO_MILLISECONDS);
                }
            }

            else if(dateItinerary.dateWisePlaceData.typeOfDay == 1)
            {
                //Normal Day
                dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(firstPlaceOfCurrentDay.placeArrivalTime) - timeFromHotel*HOURS_TO_MILLISECONDS);
                previousDay = $scope.currentDestination.dateWiseItinerary[dateIndex-1];
                if(previousDay.dateWisePlaceData.endSightSeeingTime!=undefined)
                {
                    hotelEntryTime = previousDay.dateWisePlaceData.endSightSeeingTime;
                }
                else
                {
                    hotelEntryTime = hotel.checkInTime;
                }
                if((getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) - getTimeFromDate(hotelEntryTime))  < RATIO*REST_TIME*HOURS_TO_MILLISECONDS){
                    //Violating Constraint
                    // alert("You have less time in hotel on morning of "+dateItinerary.dateWisePlaceData.startSightSeeingTime);//ALERT15
                    createAlert('replaceHotelLessTimeInMorning',$filter('date')(dateItinerary.dateWisePlaceData.startSightSeeingTime, 'mediumDate'));
                }
                dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(lastPlaceOfDay.placeDepartureTime)+timeToHotel*HOURS_TO_MILLISECONDS);
            }

            else if(dateItinerary.dateWisePlaceData.typeOfDay ==2|| dateItinerary.dateWisePlaceData.typeOfDay == 3){
                //end day
                previousDay = null;
                if(dateItinerary.dateWisePlaceData.noPlacesVisited!=undefined && dateItinerary.dateWisePlaceData.noPlacesVisited==1)
                {
                    //no place visited on this day
                    previousDay = $scope.currentDestination.dateWiseItinerary[dateIndex-1];
                    if(previousDay!=undefined)
                    {
                        if(previousDay.dateWisePlaceData.endSightSeeingTime!=undefined)
                        {
                            hotelEntryTime = previousDay.dateWisePlaceData.endSightSeeingTime;
                        }
                        else
                        {
                            hotelEntryTime = hotel.checkInTime;
                        }
                        if((getTimeFromDate(hotel.checkOutTime) - getTimeFromDate(hotelEntryTime))  < RATIO*REST_TIME*HOURS_TO_MILLISECONDS){
                            //Violating Constraint
                            // alert("You have less time in hotel on morning of "+hotel.checkOutTime);//ALERT15
                            createAlert('replaceHotelLessTimeInMorning',$filter('date')(dateItinerary.dateWisePlaceData.startSightSeeingTime, 'mediumDate'));
                        }
                    }
                }
                else
                {
                    previousDay = $scope.currentDestination.dateWiseItinerary[dateIndex-1];
                    if(previousDay!=undefined)
                    {
                        if(previousDay.dateWisePlaceData.endSightSeeingTime!=undefined)
                        {
                            hotelEntryTime = previousDay.dateWisePlaceData.endSightSeeingTime;
                        }
                        else
                        {
                            hotelEntryTime = hotel.checkInTime;
                        }
                        if((getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) - getTimeFromDate(hotelEntryTime))  < RATIO*REST_TIME*HOURS_TO_MILLISECONDS){
                            //Violating Constraint
                            //alert("You have less time in hotel on morning of "+dateItinerary.dateWisePlaceData.startSightSeeingTime);//ALERT15
                            createAlert('replaceHotelLessTimeInMorning',$filter('date')(dateItinerary.dateWisePlaceData.startSightSeeingTime, 'mediumDate'));
                        }
                    }
                }
            }
        }
    }

    function placeIsClosedAtTime(time, placeTimings) {
        for(var timingIndex=0; timingIndex < placeTimings.length; timingIndex++){
            var timing = placeTimings[timingIndex];
            if($scope.isOnSameDay(time, timing.Days)){
                if(getTimeOfDayInMinutesFromDate(time) >= getTimeOfDayInMinutesFromString(timing.TimeStart)) {
                    if(getTimeOfDayInMinutesFromDate(time) <= getTimeOfDayInMinutesFromString(timing.TimeEnd)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function getPlaceTimingsToSelect(time, placeTimings) {
        for(var timingIndex=0; timingIndex < placeTimings.length; timingIndex++){
            var timing = placeTimings[timingIndex];
            if($scope.isOnSameDay(time, timing.Days)){
                if(getTimeOfDayInMinutesFromDate(time) >= getTimeOfDayInMinutesFromString(timing.TimeStart)) {
                    if(getTimeOfDayInMinutesFromDate(time) <= getTimeOfDayInMinutesFromString(timing.TimeEnd)) {
                        return timingIndex;
                    }
                }
            }
        }
        return -1;
    }

    function getNearestTimingIndex(time, placeTimings) {
        var minimumMinutes = -1;
        var minimumIndex = -1;
        for(var timingIndex=0; timingIndex < placeTimings.length; timingIndex++){
            var timing = placeTimings[timingIndex];
            if($scope.isOnSameDay(time, timing.Days)){
                var timeAfterClosing = getTimeOfDayInMinutesFromDate(time) - getTimeOfDayInMinutesFromString(timing.TimeEnd);
                var timeBeforeOpening =  getTimeOfDayInMinutesFromString(timing.TimeStart) - getTimeOfDayInMinutesFromDate(time);
                if(timeAfterClosing > 0){
                    //The time is after closing time
                    if(minimumMinutes == -1 || minimumMinutes > timeAfterClosing){
                        minimumIndex = timingIndex;
                        minimumMinutes = timeAfterClosing;
                    }
                }
                else if(timeBeforeOpening > 0){
                    //the time is before the place opens
                    if(minimumMinutes == -1 || minimumMinutes > timeBeforeOpening){
                        minimumIndex = timingIndex;
                        minimumMinutes = timeBeforeOpening;
                    }
                }
            }
        }
        return minimumIndex;
    }

    function getNearestTimingIndexAfterTime(time, placeTimings){
        var minimumMinutes = -1;
        var minimumIndex = -1;
        for(var timingIndex=0; timingIndex < placeTimings.length; timingIndex++){
            var timing = placeTimings[timingIndex];
            if($scope.isOnSameDay(time, timing.Days)){
                var timeBeforeOpening =  getTimeOfDayInMinutesFromString(timing.TimeStart) - getTimeOfDayInMinutesFromDate(time);
                if(timeBeforeOpening > 0){
                    //the time is before the place opens
                    if(minimumMinutes == -1 || minimumMinutes > timeBeforeOpening){
                        minimumIndex = timingIndex;
                        minimumMinutes = timeBeforeOpening;
                    }
                }
            }
        }
        return minimumIndex;
    }

    function compareTimings(placeTimings,time2Cover,freeTimings){
        var freeStartTime = freeTimings.freeStartTime;
        var freeEndTime = freeTimings.freeEndTime;
        var lowestTime = null;//Time at which place can be reached and place is also open
        var highestTime = null;//Time at which place can be departed and is not closed
        var TimeStart = $scope.getDateFromString(placeTimings.TimeStart,freeStartTime);
        var TimeEnd = $scope.getDateFromString(placeTimings.TimeEnd,freeStartTime);
        if(getTimeFromDate(TimeStart)>getTimeFromDate(freeStartTime))
        {
            lowestTime = TimeStart;
        }
        else
        {
            lowestTime = freeStartTime;
        }

        if(getTimeFromDate(TimeEnd)>getTimeFromDate(freeEndTime))
        {
            highestTime = freeEndTime;
        }
        else
        {
            highestTime = TimeEnd;
        }

        //console.log("highestTime:"+highestTime);
        //console.log("lowestTime:"+lowestTime);
        freeTimings.highestTime = highestTime;
        freeTimings.lowestTime = lowestTime;

        if((getTimeFromDate(highestTime)-getTimeFromDate(lowestTime))>time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
        {
            return true;
        }
        return false;
    }

    function getTimeOfDayInMinutesFromDate(date) {

        return getHoursFromDate(date) * 60 + getMinutesFromDate(date);
    }

    function getTimeOfDayInMinutesFromString(timeString) {
        var timeStringArray = timeString.split(':');
        return ( parseInt(timeStringArray[0]) * 60 ) + parseInt(timeStringArray[1]);
    }

    $scope.getDateFromString = function(timeString,date)
    {
        var timeStringArray = timeString.split(':');
        var dateClone = new Date(date);
        dateClone.setHours(parseInt(timeStringArray[0]),parseInt(timeStringArray[1]));
        return(dateClone);
    };

    function getTimeFromDate(date){
        if(date instanceof Date){
            return date.getTime();
        }
        date = new Date(date);
        return date.getTime();
    }

    function getHoursFromDate(date){
        if(!(date instanceof Date)){
            date = new Date(date);
        }
        return date.getHours();
    }

    function getMinutesFromDate(date){
        if(!(date instanceof Date)){
            date = new Date(date);
        }
        return date.getMinutes();
    }

    $scope.isOnSameDay = function(currentTime, days) {
        if(!(currentTime instanceof Date))
        {
            currentTime = new Date(currentTime);
        }
        if(days == '0') {
            return true;
        }
        var day = '' + (currentTime.getDay() + 1);
        if(days.indexOf(day) == -1) {
            return false;
        }
        return true;
    };

    function timeDifferenceGreaterThan(startTime, endTime, difference) {
        endTime = new Date(endTime);
        startTime = new Date(startTime);
        return((getTimeFromDate(endTime)-getTimeFromDate(startTime))>difference*MINUTES_TO_MILLISECONDS);

    }

    $scope.getHotelEntryTime = function(dateWisePlaceData, morningCheckIn){
        if(dateWisePlaceData.typeOfDay == 0 && morningCheckIn){
            return $scope.currentDestination.hotelDetails.checkInTime;
        }
        return dateWisePlaceData.endSightSeeingTime;
    };

    $scope.getHotelExitTime = function(dateWisePlaceData, currentIndex,morningCheckIn){
        //console.log("currentIndex:"+currentIndex+","+$scope.currentDestination.dateWiseItinerary.length);

        if((dateWisePlaceData.typeOfDay == 1 && currentIndex ==$scope.currentDestination.dateWiseItinerary.length-1)||dateWisePlaceData.typeOfDay == 2){
            return $scope.currentDestination.hotelDetails.checkOutTime;
        }
        else if(morningCheckIn != undefined && morningCheckIn) {
            if(dateWisePlaceData.noPlacesVisited != undefined && dateWisePlaceData.noPlacesVisited == 1)
            {
                return $scope.currentDestination.dateWiseItinerary[currentIndex+1].dateWisePlaceData.startSightSeeingTime;
            }
            return dateWisePlaceData.startSightSeeingTime;
        }
        if($scope.currentDestination.dateWiseItinerary[currentIndex+1].dateWisePlaceData.noPlacesVisited != undefined && $scope.currentDestination.dateWiseItinerary[currentIndex+1].dateWisePlaceData.noPlacesVisited == 1) {
            //Not visiting any places on the last day, so will go to airport/station directly from the hotel. So exit time  = checkOutTime
            return $scope.currentDestination.hotelDetails.checkOutTime;
        }
        return $scope.currentDestination.dateWiseItinerary[currentIndex+1].dateWisePlaceData.startSightSeeingTime;
    };

    $scope.getButtonClass = function(destination) {
        if(destination.isCurrent != undefined && destination.isCurrent){
            return "btn-primary";
        }
        return "btn-default";
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

    $scope.getArrivalTitleText = function(segment){
        if(segment.kind == "flight"){
            return "Arrive at "+segment.tCode+" Airport";
        }
        else if(segment.kind == "train"){
            return "Arrive at "+segment.tName+" Station";
        }
        else if(segment.kind == "bus"){
            return "Arrive at "+segment.tName+" Bus Stand";
        }
        else if(segment.kind == "car"){
            return "Arrive at "+segment.tName;
        }
    };

    $scope.getDepartureTitleText = function(segment){
        if(segment.kind == "flight"){
            return "Depart from "+segment.sCode+" Airport";
        }
        else if(segment.kind == "train"){
            return "Depart from "+segment.sName+" Station";
        }
        else if(segment.kind == "bus"){
            return "Depart from "+segment.sName+" Bus Stand";
        }
        else if(segment.kind == "car"){
            return "Depart from "+segment.sName;
        }
    };
    function getDistance(originLat, originLong, destinationLat, destinationLong) {
        var R = 6371;
        var dLat = (destinationLat - originLat) * Math.PI / 180;
        var dLon = (destinationLong - originLong) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(originLat * Math.PI / 180) * Math.cos(destinationLat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        var d = R * c;
        return d;
    }

    function setPlaceDepartureTime(place, freeTiming) {
        var endOfTime2Cover = new Date(getTimeFromDate(place.placeArrivalTime) + place.Time2Cover * MINUTES_TO_MILLISECONDS);
        if (getTimeFromDate(endOfTime2Cover) > getTimeFromDate(freeTiming.highestTime)) {
            place.placeDepartureTime = freeTiming.highestTime;
        }
        else {
            place.placeDepartureTime = endOfTime2Cover;
        }
    }

    function setPlaceArrivalTime(place, freeTiming) {
        var startOfTime2Cover = new Date(getTimeFromDate(place.placeDepartureTime) - place.Time2Cover * MINUTES_TO_MILLISECONDS);
        if(getTimeFromDate(startOfTime2Cover) < getTimeFromDate(freeTiming.lowestTime)){
            place.placeArrivalTime = freeTiming.lowestTime;
        }
        else {
            place.placeArrivalTime = startOfTime2Cover;
        }
    }

    function insertPlaceAtLastOfDay(dateWiseItinerary, place) {
        var placesLength = dateWiseItinerary.dateWisePlaceData.placesData.push(place);
        dateWiseItinerary.permutation.push(placesLength - 1);
    }

    function insertPlaceAtBeginningOfDay(dateWiseItinerary, place) {
        //console.log('Place:'+JSON.stringify(place));
        var placesLength = dateWiseItinerary.dateWisePlaceData.placesData.push(place);
        dateWiseItinerary.permutation.splice(0,0,placesLength - 1);
    }

    function increaseDepartureTimeOfPreviousPlace(dateWiseItinerary, place, freeTiming) {
        var lastPlaceIndex = dateWiseItinerary.permutation[dateWiseItinerary.permutation.length - 1];
        var lastPlace = dateWiseItinerary.dateWisePlaceData.placesData[lastPlaceIndex];
        var departTime = lastPlace.placeDepartureTime;
        var distanceToNewPlace = getDistance(lastPlace.Latitude, lastPlace.Longitude, place.Latitude, place.Longitude);
        var timeToNewPlace = distanceToNewPlace / SPEED;
        var supposedLastPlaceDepartureTime = new Date(getTimeFromDate(freeTiming.lowestTime) - timeToNewPlace * HOURS_TO_MILLISECONDS);

        for (var lastPlaceTimingsIndex = 0; lastPlaceTimingsIndex < lastPlace.PlaceTimings.length; lastPlaceTimingsIndex++) {
            var placeTime = lastPlace.PlaceTimings[lastPlaceTimingsIndex];
            if (placeTime.isSelected != undefined && placeTime.isSelected == 1) {
                var maxDepartTime = $scope.getDateFromString(placeTime.TimeEnd, departTime);
                if (getTimeFromDate(maxDepartTime) < getTimeFromDate(supposedLastPlaceDepartureTime)) {
                    lastPlace.placeDepartureTime = maxDepartTime;
                }
                else {
                    lastPlace.placeDepartureTime = supposedLastPlaceDepartureTime;
                }
            }
        }
    }

    function decreaseArrivalTimeOfNextPlace(dateWiseItinerary, place, freeTiming) {
        var nextPlaceIndex = dateWiseItinerary.permutation[1];
        var nextPlace = dateWiseItinerary.dateWisePlaceData.placesData[nextPlaceIndex];
        var arrivalTime = nextPlace.placeArrivalTime;
        var distanceToNewPlace = getDistance(nextPlace.Latitude, nextPlace.Longitude, place.Latitude, place.Longitude);
        var timeToNewPlace = distanceToNewPlace / SPEED;
        var supposedNextPlaceArrivalTime = new Date(getTimeFromDate(place.placeDepartureTime) + timeToNewPlace * HOURS_TO_MILLISECONDS);

        for (var nextPlaceTimingsIndex = 0; nextPlaceTimingsIndex < nextPlace.PlaceTimings.length; nextPlaceTimingsIndex++) {
            var placeTime = nextPlace.PlaceTimings[nextPlaceTimingsIndex];
            if (placeTime.isSelected != undefined && placeTime.isSelected == 1) {
                var minArrivalTime = $scope.getDateFromString(placeTime.TimeStart, arrivalTime);
                if (getTimeFromDate(minArrivalTime) > getTimeFromDate(supposedNextPlaceArrivalTime)) {
                    nextPlace.placeArrivalTime = minArrivalTime;
                }
                else {
                    nextPlace.placeArrivalTime = supposedNextPlaceArrivalTime;
                }
            }
        }
    }

    $scope.removePlace=function(dateItinerary,dateItineraryIndex, index ){
        //console.log("place removed:"+index +", date index:"+dateItineraryIndex);

        removedPlacesList.push({
            dateItineraryIndex:dateItineraryIndex,
            index:index
        });
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].isPlaceRemoved = 1;
        setMapData(dateItineraryIndex);
        calculatePlacesExpenses();
        markPlaceAsNotAdded(dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]]);
        //dateItinerary.permutation.splice(index,1);

    };

    $scope.removePlaceHolder=function(dateItinerary,index, dateItineraryIndex){
        //console.log("place removed:"+index);

        //Removing from removed places list so that new place is not added there
        for(var i = 0; i < removedPlacesList.length; i++){
            if(removedPlacesList[i].dateItineraryIndex == dateItineraryIndex && removedPlacesList[i].index == index){
                removedPlacesList.splice(i,1);
                break;
            }
        }

        if(dateItinerary.permutation.length == 1){
            alert('You have removed all places');
        }
        else {
            dateItinerary.permutation.splice(index,1);
            fixItineraryOnPlaceRemove(dateItinerary,index);
        }
    };

    function fixItineraryOnPlaceRemove(dateItinerary,index){
        var hotel = $scope.currentDestination.hotelDetails;
        var nextPlace = null, lastPlace = null;
        //first place of the day
        if(index==0)
        {
            //increase time in hotel
            nextPlace=dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[0]];//Now same index has next place
            var hotelToNextPlaceDistance=getDistance(hotel.Latitude, hotel.Longitude, nextPlace.Latitude, nextPlace.Longitude);
            var time = hotelToNextPlaceDistance/SPEED;
            dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - time*HOURS_TO_MILLISECONDS);
        }
        //last place of the day
        else if(index == dateItinerary.permutation.length)
        {
            //increase time in hotel
            lastPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[dateItinerary.permutation.length-1]];
            var lastPlaceToHotel = getDistance(lastPlace.Latitude,lastPlace.Longitude,hotel.Latitude,hotel.Longitude);
            var timeToHotel = lastPlaceToHotel/SPEED;
            dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + timeToHotel*HOURS_TO_MILLISECONDS);
        }
        else
        {
            //console.log('Neither 1st place or last place');
            lastPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index-1]];
            nextPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
            var lastPlaceTimings = getSelectedPlaceTimings(lastPlace);
            var lastPlaceEndTime = $scope.getDateFromString(lastPlaceTimings.TimeEnd,lastPlace.placeDepartureTime);
            var maxPlaceDepartureTime = new Date(getTimeFromDate(lastPlace.placeArrivalTime) + lastPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
            var lastPlaceToNextPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,nextPlace.Latitude,nextPlace.Longitude);
            var timeFromLastPlaceToNextPlace = lastPlaceToNextPlace/SPEED;
            var supposedLastPlaceDepartTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - timeFromLastPlaceToNextPlace*HOURS_TO_MILLISECONDS);
            maxPlaceDepartureTime = getMinimum(lastPlaceEndTime,maxPlaceDepartureTime);
            if(getTimeFromDate(maxPlaceDepartureTime) >= getTimeFromDate(supposedLastPlaceDepartTime))
            {
                lastPlace.placeDepartureTime = supposedLastPlaceDepartTime;
                //console.log('Extending last place departure time. This covers the gap');
            }
            else
            {
                //The last place cannot be extended to cover the complete time vacated by the removed place
                lastPlace.placeDepartureTime = maxPlaceDepartureTime;
                //console.log('Extending last place departure time. This does not cover the gap');
                //Decreasing the arrival time of the next places to cover the vacated time
                var timeCoveredInBetween = false;
                for(var placeIndex = index; placeIndex < dateItinerary.permutation.length; placeIndex++) {
                    var currentPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
                    var lastPlaceToCurrentPlaceDistance = getDistance(lastPlace.Latitude,lastPlace.Longitude,currentPlace.Latitude,currentPlace.Longitude);
                    var timeFromLastPlaceToCurrentPlace = lastPlaceToCurrentPlaceDistance/SPEED;
                    var supposedCurrentPlaceArrivalTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + timeFromLastPlaceToCurrentPlace*HOURS_TO_MILLISECONDS);
                    var currentPlaceTimings = getSelectedPlaceTimings(currentPlace);
                    var currentPlaceStartTime = $scope.getDateFromString(currentPlaceTimings.TimeStart, currentPlace.placeArrivalTime);
                    var maxPlaceArrivalTime = new Date(getTimeFromDate(currentPlace.placeDepartureTime) - currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
                    maxPlaceArrivalTime = getMaximum(currentPlaceStartTime, maxPlaceArrivalTime);
                    if(maxPlaceArrivalTime<=supposedCurrentPlaceArrivalTime){
                        currentPlace.placeArrivalTime = supposedCurrentPlaceArrivalTime;
                        timeCoveredInBetween = true;
                        //console.log('Decreasing current place arrival time. This covers the gap');
                        break;
                    }
                    else {
                        if(getTimeFromDate(supposedCurrentPlaceArrivalTime) >= getTimeFromDate(currentPlaceStartTime)) {
                            //The place is open at the time of reaching but time2cover does not satisfy
                            //console.log('Place is open at time of arrival but does not satisfy time2cover');
                            //console.log('Place opens at:'+currentPlaceStartTime);
                            //console.log('Max of opening time and time2cover constraint:'+maxPlaceArrivalTime);
                            currentPlace.placeArrivalTime = maxPlaceArrivalTime;
                            currentPlace.placeDepartureTime = new Date(getTimeFromDate(currentPlace.placeArrivalTime) + currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
                            //console.log('Decreasing current place arrival time and departure time. This does not cover the gap');
                        }
                        else {
                            //The place is not opened yet
                            //console.log('Place not open at time of arrival');
                            //console.log('Place opens at:'+currentPlaceStartTime);
                            //console.log('Max of opening time and time2cover constraint:'+maxPlaceArrivalTime);
                            if(getTimeFromDate(maxPlaceArrivalTime) > getTimeFromDate(currentPlaceStartTime)){
                                //The place opens before the time2cover constraint is satisfied
                                currentPlace.placeArrivalTime = currentPlaceStartTime;//At this time time2cover constraint is not satisfied
                                currentPlace.placeDepartureTime = new Date(getTimeFromDate(currentPlace.placeArrivalTime) + currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
                                //console.log('Decreasing current place arrival time and departure time. This does not cover the gap');
                            }
                            else {
                                //The place opens on or after the time2cover constraint is satisfied
                                currentPlace.placeArrivalTime = maxPlaceArrivalTime;
                                timeCoveredInBetween = true;
                                //console.log('Decreasing current place arrival time. This covers the gap');
                                break;
                            }
                        }
                        lastPlace = currentPlace;
                    }
                }
                if(!timeCoveredInBetween){
                    //The ripple reached the last place
                    //Need to fix the hotel arrival time
                    //console.log('Need to fix hotel arrival time');
                    var lastPlaceToHotelDistance = getDistance(lastPlace.Latitude, lastPlace.Longitude, hotel.Latitude, hotel.Longitude);
                    var timeFromLastPlaceToHotel = lastPlaceToHotelDistance/SPEED;
                    dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + timeFromLastPlaceToHotel*HOURS_TO_MILLISECONDS);

                }

            }

        }
    }

    function getSelectedPlaceTimings(place)
    {
        for(var placeTimingsIndex = 0; placeTimingsIndex<place.PlaceTimings.length;placeTimingsIndex++)
        {
            if(place.PlaceTimings[placeTimingsIndex].isSelected!=undefined && place.PlaceTimings[placeTimingsIndex].isSelected==1)
            {
                return (place.PlaceTimings[placeTimingsIndex]);
            }
        }
    }

    function getMinimum(time1,time2)
    {
        if(getTimeFromDate(time1)<getTimeFromDate(time2))
        {
            return time1;
        }
        return time2;
    }

    function getMaximum(time1,time2)
    {
        if(getTimeFromDate(time1)>getTimeFromDate(time2))
        {
            return time1;
        }
        return time2;
    }

    function clone(a) {
        return JSON.parse(JSON.stringify(a));
    }

    $scope.nextDay = function(){
        if(($scope.currentDay < $scope.currentDestination.dateWiseItinerary.length-1) && !($scope.currentDestination.dateWiseItinerary[$scope.currentDay+1].dateWisePlaceData.noPlacesVisited!=undefined && $scope.currentDestination.dateWiseItinerary[$scope.currentDay+1].dateWisePlaceData.noPlacesVisited == 1)){
            $scope.currentDay += 1;
            var currentDay = new Date($scope.currentDestination.dateWiseItinerary[$scope.currentDay].dateWisePlaceData.startSightSeeingTime);
            //console.log($scope.currentDestination.dateWiseItinerary[$scope.currentDay].dateWisePlaceData.startSightSeeingTime);
            $scope.currentDate = currentDay.setHours(0,0,0,0);
            var section = angular.element(document.getElementById('day-'+($scope.currentDay)));
            //console.log('day-'+($scope.currentDay));
            //console.log(section);
            $document.duScrollToElementAnimated(section);
            loadItinerary();
        }
    };

    $scope.previousDay = function(){
        if($scope.currentDate > 0){
            $scope.currentDay -= 1;
            var currentDay = new Date($scope.currentDestination.dateWiseItinerary[$scope.currentDay].dateWisePlaceData.startSightSeeingTime);
            $scope.currentDate = currentDay.setHours(0,0,0,0);
            var section = angular.element(document.getElementById('day-'+($scope.currentDay)));
            //console.log('day-'+($scope.currentDay));
            //console.log(section);
            $document.duScrollToElementAnimated(section);
            loadItinerary();
        }
    };

    $scope.scrollToView = function(){
        //console.log("position at: "+$window.scrollY);
        var viewPortHeight = $(window).height();
        if($window.scrollY<viewPortHeight)
        {
            $document.duScrollTop(viewPortHeight,1000);
        }
    };

    function collapseDateBar(){
        $timeout(function(){
            $scope.isDateBarCollapsed = false;
        }, 1500);
    }

    $scope.changeCurrentDate = function(item){
        //console.log("day visible:"+(parseInt(item)+1));
        if((parseInt(item)<=$scope.currentDestination.dateWiseItinerary.length-1) && !($scope.currentDestination.dateWiseItinerary[parseInt(item)].dateWisePlaceData.noPlacesVisited!=undefined && $scope.currentDestination.dateWiseItinerary[parseInt(item)].dateWisePlaceData.noPlacesVisited == 1)){
            $scope.currentDay = parseInt(item);
            var currentDay = new Date($scope.currentDestination.dateWiseItinerary[$scope.currentDay].dateWisePlaceData.startSightSeeingTime);
            $scope.currentDate = currentDay.setHours(0,0,0,0);
            loadItinerary();
        }
    };

    $scope.isNextDisable = function(){
        if($scope.currentDestination != null && $scope.currentDestination != undefined){
            return !(($scope.currentDay < $scope.currentDestination.dateWiseItinerary.length-1) && !($scope.currentDestination.dateWiseItinerary[$scope.currentDay+1].dateWisePlaceData.noPlacesVisited!=undefined && $scope.currentDestination.dateWiseItinerary[$scope.currentDay+1].dateWisePlaceData.noPlacesVisited == 1));
        }
        return true;
    };

    $scope.isPreviousDisable = function(){
        if($scope.currentDay == 0)
        {
            return true;
        }
        else if($scope.currentDay>0 && $scope.currentDestination.dateWiseItinerary[$scope.currentDay-1].dateWisePlaceData.noPlacesVisited!=undefined && $scope.currentDestination.dateWiseItinerary[$scope.currentDay-1].dateWisePlaceData.noPlacesVisited==1)
        {
            return true;
        }
        return false;
    };

    function createAlert(category,param){
        $rootScope.$broadcast('showRecommendation',category,param);
        //$scope.hasAnyAlert =
    }

    function markPlaceAsAdded(place){
        place.placeAdded = true;
        place.isPlaceRemoved = 0;
        if(place.isMeal == undefined || place.isMeal != 1){
            $scope.allPlaces[place.placeIndex].placeAdded = true;
            $scope.allPlaces[place.placeIndex].isPlaceRemoved = 0;
        }
    }

    function markPlaceAsNotAdded(place){
        place.placeAdded = false;
        if(place.isMeal == undefined || place.isMeal != 1){
            $scope.allPlaces[place.placeIndex].placeAdded = false;
        }
    }

    function loadItinerary(){
        if($scope.currentDestination.isHotelRequired == 1){
            $scope.$broadcast('loadItinerary',$scope.currentDestination.dateWiseItinerary[$scope.currentDay],$scope.currentDay,$scope.currentDestination.hotelDetails, $scope.currentDestination.hotelDetails);
        }
        else {
            $scope.$broadcast('loadItinerary',$scope.currentDestination.dateWiseItinerary[$scope.currentDay],$scope.currentDay,$scope.currentDestination.LocationOfArrival, $scope.currentDestination.LocationOfDeparture);
        }
    }
    $scope.getItinerary();
}]);
