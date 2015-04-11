itineraryModule.controller('shakuniController',  function($scope, $rootScope, $http, $timeout) {

    $scope.origin = null;
    $scope.destinations = null;
    $scope.destinationsWiseStops = null;
    $scope.isItineraryPlanned= false;
    $scope.stops = null;
    $scope.numberOfPeople = 0;
    $scope.allPlaces = [];
    $scope.allHotels=[];
    $scope.leftPanel = 'places';
    $scope.currentDestination = null;

    $scope.stopClickClass = 'cursor-click';
    var SPEED = 15;//km/hr
    var RATIO = 0.75;
    var MORNING_CHECK_IN_DURATION = 2;//hrs
    var CHECK_OUT_DURATION = 4;//hrs
    var REST_TIME = 8;//hrs

    var MINUTES_TO_MILLISECONDS = 60*1000;
    var HOURS_TO_MILLISECONDS = MINUTES_TO_MILLISECONDS*60;
    var DAYS_TO_MILLISECONDS = HOURS_TO_MILLISECONDS*24;

    var lastTouchIndex;
    var lastTouchParentIndex;
    var touchSemaphore = true;

    $scope.getItinerary = function(){

        $http.get('/planItinerary').success(function(data,status){

            $scope.origin=data.origin;
            $scope.destinations = data.destinations;
            $scope.stops = data.destinationsWiseStops;
            $scope.numberOfPeople = parseInt(data.numPeople);
            $scope.currentDestination = $scope.destinations[0];
            $scope.currentDestination.isCurrent = true;
            calculateHotelExpenses();
            $scope.allPlaces = $scope.currentDestination.places;
            $scope.allHotels = $scope.currentDestination.hotels;
            $scope.isItineraryPlanned=true;

        })
        .error(
        function(data, status) {
            console.log(data || "Backend Request failed");
        });
    };

    $scope.showStopDetails = function(stop) {

    };

    $scope.addHotel = function(hotel){
        $scope.currentDestination.hotelDetails = hotel;
        calculateHotelEntryExitTime(hotel);
        calculateHotelExpenses();
    };

    $scope.showDestinationItinerary = function(destination) {
        $scope.currentDestination.isCurrent = false;
        destination.isCurrent = true;
        $scope.currentDestination = destination;
    };

    $scope.showPlaceDetails = function() {
        if($scope.stopClickClass == 'stop-click') {
            $scope.stopClickClass = 'cursor-click';
        }
        else {
            console.log('Clicked');
            alert('Place Clicked');
        }
    };

    $scope.addPlace = function(event, place) {
        event.stopPropagation();
        console.log("ADD:"+JSON.stringify(place));
        var Time2Cover = place.Time2Cover;
        var placeAdditionCandidates = [];
        for(var itineraryIndex in $scope.currentDestination.dateWiseItinerary){
            console.log(itineraryIndex);
            itineraryIndex = parseInt(itineraryIndex);
            var dateWiseItinerary = $scope.currentDestination.dateWiseItinerary[itineraryIndex];
            var dateWisePlaceData = dateWiseItinerary.dateWisePlaceData;
            if(dateWisePlaceData.typeOfDay == 0) {
                //Is 1st Day
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
                //This is not the last date in dateWiseItinerary
                console.log($scope.currentDestination.dateWiseItinerary);
                console.log($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1]);
                if ((dateWisePlaceData.endSightSeeingTime != undefined) && ($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.startSightSeeingTime != undefined)) {
                    if (timeDifferenceGreaterThan(dateWisePlaceData.endSightSeeingTime, $scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.startSightSeeingTime, REST_TIME * 60 + Time2Cover)) {
                        placeAdditionCandidates.push({
                            type: 'nightMorning',
                            dateWiseItinerary: dateWiseItinerary,
                            dateWiseItineraryIndex:itineraryIndex
                        });
                    }
                }
                else if (dateWisePlaceData.endSightSeeingTime != undefined) {
                    if ($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.typeOfDay == 2) {
                        //This is one before last day
                        if ($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.noPlacesVisited == 1) {
                            if (timeDifferenceGreaterThan(dateWisePlaceData.endSightSeeingTime, $scope.currentDestination.hotelDetails.checkOutTime, REST_TIME * 60 + Time2Cover)) {
                                placeAdditionCandidates.push({
                                    type: 'checkOut',
                                    dateWiseItinerary: dateWiseItinerary,
                                    dateWiseItineraryIndex:itineraryIndex
                                });
                            }
                        }
                    }
                }
                else {
                    if(dateWisePlaceData.typeOfDay == 0){
                        if($scope.currentDestination.hotelDetails.checkInTime, $scope.currentDestination.dateWiseItinerary[itineraryIndex + 1].dateWisePlaceData.startSightSeeingTime, REST_TIME * 60 + Time2Cover){
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
                //This is the last day
                if(dateWisePlaceData.endSightSeeingTime != undefined){
                    //There are some places to visit on that day
                    if(timeDifferenceGreaterThan(dateWisePlaceData.endSightSeeingTime, $scope.currentDestination.hotelDetails.checkOutTime, CHECK_OUT_DURATION * 60 + Time2Cover)) {
                        placeAdditionCandidates.push({
                            type: 'eveningCheckOut',
                            dateWiseItinerary: dateWiseItinerary,
                            dateWiseItineraryIndex:itineraryIndex
                        })
                    }
                }
            }
        }
        console.log('Candidates:'+JSON.stringify(placeAdditionCandidates));
        var selectedIndex =chooseBestCandidate(placeAdditionCandidates, place);
        if(selectedIndex.selectedCandidateIndex == -1||selectedIndex.selectedPlaceTimingsIndex == -1)
        {
            console.log("NO CANDIDATE TILL NOW");
        }
        else
        {
            console.log("GOT THE RIGHT CANDIDATE FOR THIS JOB: "+JSON.stringify(placeAdditionCandidates[selectedIndex.selectedCandidateIndex]));
            console.log("placeTimingsIndex:"+selectedIndex.selectedPlaceTimingsIndex);
        }

    };

    $scope.dragMove = function(){
        $scope.stopClickClass = 'stop-click';
    };

    $scope.onDropComplete = function(data, event, permValue, dateItinerary){
        console.log('Drop Complete:'+JSON.stringify(data));
        dateItinerary.dateWisePlaceData.placesData[permValue] = data;
    };

    function calculateHotelExpenses(){
        var hotelDetails = $scope.currentDestination.hotelDetails;
        var numberOfDaysInHotel = 0;
        hotelDetails.checkInTime = new Date(hotelDetails.checkInTime);
        hotelDetails.checkOutTime = new Date(hotelDetails.checkOutTime);
        var checkInTimeClone = new Date(hotelDetails.checkInTime.getTime());
        checkInTimeClone.setHours(12,0,0,0);
        var checkOutTimeClone = new Date(hotelDetails.checkOutTime.getTime());
        checkOutTimeClone.setHours(12,0,0,0);
        if(hotelDetails.checkInTime.getTime() < checkInTimeClone.getTime()) {
            numberOfDaysInHotel += 1;
        }
        numberOfDaysInHotel += (checkOutTimeClone.getTime() - checkInTimeClone.getTime()) / (DAYS_TO_MILLISECONDS);
        if(hotelDetails.checkOutTime.getTime() > checkOutTimeClone.getTime()) {
            numberOfDaysInHotel += 1;
        }
        var numberOfRooms = Math.ceil($scope.numberOfPeople/hotelDetails.MaxPersons);
        var pricePerPerson = (hotelDetails.Price * numberOfDaysInHotel * numberOfRooms)/$scope.numberOfPeople;
        hotelDetails.pricePerPerson = pricePerPerson;
    }

    function chooseBestCandidate(candidates, place) {
        var selectedCandidateIndex = -1;
        var selectedPlaceTimingsIndex = -1;
        if(place.Days == undefined) {
            place.Days = combineDays(place.PlaceTimings);
        }
        if(place.Days != "0"){
            for(var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                var candidate = candidates[candidateIndex];
                candidate.dateWiseItinerary.dateWisePlaceData.currentDate = new Date(candidate.dateWiseItinerary.dateWisePlaceData.currentDate);
                if(candidate.type == 'morningCheckIn' || candidate.type == 'eveningCheckOut') {
                    if(!checkIfPlaceIsOpenOnDay(place.Days, candidate.dateWiseItinerary.dateWisePlaceData.currentDate)){
                        candidates.splice(candidateIndex,1);
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
                    if(checkIfPlaceIsOpenOnDay(place.Days, new Date(candidate.dateWiseItinerary.dateWisePlaceData.currentDate.getTime() + 1 * DAYS_TO_MILLISECONDS))){
                        if(candidate.isOpenOnDay != undefined && candidate.isOpenOnDay == 1){
                            candidate.isOpenOnDay = 3;//Both Days
                        }
                        else {
                            candidate.isOpenOnDay = 2;
                        }
                    }
                    if(candidate.isOpenOnDay == undefined){
                        //Closed on both days
                        candidate.splice(candidateIndex, 1);
                        candidateIndex--;
                    }
                }
            }
        }
        if(candidates.length > 0){
            //Still some candidates left
            for(var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                var candidate = candidates[candidateIndex];
                var freeTimingsArray = getFreeTimings(candidate, place);
                for(var freeTimingsIndex =0;freeTimingsIndex<freeTimingsArray.length;freeTimingsIndex++)
                {
                    if(!((freeTimingsArray[freeTimingsIndex].freeEndTime.getTime() - freeTimingsArray[freeTimingsIndex].freeStartTime.getTime())>=place.Time2Cover*RATIO*MINUTES_TO_MILLISECONDS))
                    {
                        freeTimingsArray.splice(freeTimingsIndex,1);
                        freeTimingsIndex--;
                    }
                }
                if(freeTimingsArray.length==0)
                {
                    candidates.splice(candidateIndex,1);
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
            for(var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                checkIfPlaceIsOpenOnFreeTimings(candidate,place);

                if(candidate.freeTimingsArray.length==0){
                    candidates.splice(candidateIndex,1);
                    candidateIndex--;
                }
            }
        }
        if(candidates.length > 0)
        {
            var duration=-1;
            for(var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                var candidate = candidates[candidateIndex];
                for(var candidateTimingsIndex=0;candidateTimingsIndex<candidate.freeTimingsArray.length;candidateTimingsIndex++)
                {
                    var freeDuration = candidate.freeTimingsArray[candidateTimingsIndex].freeEndTime.getTime()-candidate.freeTimingsArray[candidateTimingsIndex].freeStartTime.getTime();
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
            console.log('placeTimings['+i+']:'+JSON.stringify(placeTimings[i]));
            var days = placeTimings[i].Days;
            if(days == null || days == undefined) {
                console.log('WARNING: The place does not have any timings. Assuming it is open all days');
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
        if(candidate.type == 'morningCheckIn'){
            var freeTimings = {
                freeStartTime:new Date(),
                freeEndTime:new Date()
            };
            var nextPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[0]];
            nextPlace.placeArrivalTime=new Date(nextPlace.placeArrivalTime);
            var distanceToNextPlace = getDistance(place.Latitude, place.Longitude, nextPlace.Latitude, nextPlace.Longitude);
            var timeToNextPlace = distanceToNextPlace / SPEED;
            var distanceFromHotel = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
            var timeFromHotel = distanceFromHotel / SPEED;
            freeTimings.freeEndTime = new Date(nextPlace.placeArrivalTime.getTime() - timeToNextPlace * HOURS_TO_MILLISECONDS);
            freeTimings.freeStartTime = new Date(hotel.checkInTime.getTime() + MORNING_CHECK_IN_DURATION * RATIO * HOURS_TO_MILLISECONDS + timeFromHotel * HOURS_TO_MILLISECONDS);
            freeTimingsArray.push(freeTimings);
        }
        else if(candidate.type == 'nightMorning') {

            var distanceToHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            var time2Hotel = distanceToHotel / SPEED;
            var nextDayWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];
            if(candidate.isOpenOnDay == 1 || candidate.isOpenOnDay == 3)
            {
                var freeTimings = {
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                var lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
                lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
                var distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
                var timeToNewPlace = distanceToNewPlace / SPEED;
                freeTimings.freeStartTime = new Date(lastPlace.placeDepartureTime.getTime()+timeToNewPlace * HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime=new Date(nextDayWiseItinerary.startSightSeeingTime - REST_TIME*HOURS_TO_MILLISECONDS*RATIO-time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
            if(candidate.isOpenOnDay == 2 || candidate.isOpenOnDay == 3)
            {
                var freeTimings = {
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                var nextDayFirstPlace = nextDayWiseItinerary.dateWisePlaceData.placesData[nextDayWiseItinerary.permutation[0]];
                nextDayFirstPlace.placeArrivalTime = new Date(nextDayFirstPlace.placeArrivalTime);
                var distanceToNextDayFirstPlace = getDistance(place.Latitude,place.Longitude,nextDayFirstPlace.Latitude,nextDayFirstPlace.Longitude);
                var timeToNextDayFirstPlace = distanceToNextDayFirstPlace / SPEED;
                freeTimings.freeEndTime = new Date(nextDayFirstPlace.placeArrivalTime.getTime() - timeToNextDayFirstPlace*HOURS_TO_MILLISECONDS);
                freeTimings.freeStartTime = new Date(candidate.dateWiseItinerary.dateWisePlaceData.endSightSeeingTime.getTime() + REST_TIME*HOURS_TO_MILLISECONDS*RATIO+time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
        }
        else if(candidate.type == 'checkIn'){

            var distanceFromHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            var timeFromHotel = distanceFromHotel/SPEED;
            var nextDayWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];
            var hotelCheckInTime = hotel.checkInTime;
            if(candidate.isOpenOnDay ==1 || candidate.isOpenOnDay ==3)
            {
                var freeTimings = {
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                freeTimings.freeStartTime = new Date(hotelCheckInTime.getTime() + MORNING_CHECK_IN_DURATION*RATIO*HOURS_TO_MILLISECONDS+timeFromHotel*HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime = new Date(nextDayWiseItinerary.startSightSeeingTime - REST_TIME*HOURS_TO_MILLISECONDS*RATIO-timeFromHotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }

            if(candidate.isOpenOnDay == 2 || candidate.isOpenOnDay == 3)
            {
                var freeTimings = {
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                var nextDayFirstPlace = nextDayWiseItinerary.dateWisePlaceData.placesData[nextDayWiseItinerary.permutation[0]];
                nextDayFirstPlace.placeArrivalTime = new Date(nextDayFirstPlace.placeArrivalTime);
                var distanceToNextDayFirstPlace = getDistance(place.Latitude,place.Longitude,nextDayFirstPlace.Latitude,nextDayFirstPlace.Longitude);
                var timeToNextDayFirstPlace = distanceToNextDayFirstPlace / SPEED;

                freeTimings.freeStartTime =new Date(hotelCheckInTime.getTime() + REST_TIME*RATIO*HOURS_TO_MILLISECONDS+timeFromHotel*HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime =  new Date(nextDayFirstPlace.placeArrivalTime.getTime() - timeToNextDayFirstPlace*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
        }
        else if(candidate.type == 'checkout'){

            var lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
            lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
            var distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
            var timeToNewPlace = distanceToNewPlace / SPEED;
            var distanceToHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            var time2Hotel = distanceToHotel / SPEED;

            if(candidate.isOpenOnDay ==1 || candidate.isOpenOnDay ==3)
            {
                var freeTimings = {
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };

                freeTimings.freeStartTime = new Date(lastPlace.placeDepartureTime.getTime()+timeToNewPlace * HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime=new Date(hotel.checkOutTime.getTime() - REST_TIME*HOURS_TO_MILLISECONDS*RATIO-time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
            if((candidate.isOpenOnDay == 2 || candidate.isOpenOnDay == 3))
            {
                var freeTimings = {
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };

                freeTimings.freeStartTime = new Date(candidate.dateWiseItinerary.dateWisePlaceData.endSightSeeingTime.getTime() + REST_TIME*HOURS_TO_MILLISECONDS*RATIO+time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime = new Date(hotel.checkOutTime.getTime() - CHECK_OUT_DURATION*RATIO*HOURS_TO_MILLISECONDS-time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);

            }
        }
        else if(candidate.type='eveningCheckOut')
        {
            var freeTimings = {
                freeStartTime:new Date(),
                freeEndTime:new Date()
            };
            var lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
            lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
            var distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
            var timeToNewPlace = distanceToNewPlace / SPEED;
            var distanceFromHotel = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
            var timeFromHotel = distanceFromHotel / SPEED;
            freeTimings.freeStartTime = new Date(lastPlace.placeDepartureTime.getTime()+timeToNewPlace * HOURS_TO_MILLISECONDS);
            freeTimings.freeEndTime = new Date(hotel.checkOutTime.getTime()- CHECK_OUT_DURATION*RATIO*HOURS_TO_MILLISECONDS - timeFromHotel*HOURS_TO_MILLISECONDS);
            freeTimingsArray.push(freeTimings);
        }
        return freeTimingsArray;
    }

    function checkIfPlaceIsOpenOnFreeTimings(candidate,place){
        for(var candidateTimingsIndex =0;candidateTimingsIndex<candidate.freeTimingsArray.length;candidateTimingsIndex++)
        {
            var freeStartTime = candidate.freeTimingsArray[candidateTimingsIndex].freeStartTime;
            var freeEndTime = candidate.freeTimingsArray[candidateTimingsIndex].freeEndTime;
            for(var placeTimingsIndex = 0; placeTimingsIndex<place.PlaceTimings.length;placeTimingsIndex++) {
                if (checkIfPlaceIsOpenOnDay(place.PlaceTimings[placeTimingsIndex].Days, freeStartTime)) {
                    if (compareTimings(place.PlaceTimings[placeTimingsIndex], place.Time2Cover, freeStartTime, freeEndTime)) {
                        candidate.placeTimingsIndex = placeTimingsIndex;
                        break;
                    }
                }
            }
            if(candidate.placeTimingsIndex==undefined)
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
        var hotelCheckInTime = new Date(arrivalTime.getTime()+time*HOURS_TO_MILLISECONDS);
        var departureTime = new Date($scope.currentDestination.departureTime);
        distance=getDistance($scope.currentDestination.LocationOfDeparture.Latitude,$scope.currentDestination.LocationOfDeparture.Longitude,
            hotel.Latitude,hotel.Longitude);
        time = distance/SPEED;
        var hotelCheckOutTime = new Date(departureTime.getTime()-time*HOURS_TO_MILLISECONDS);
        hotel.checkInTime = hotelCheckInTime;
        hotel.checkOutTime = hotelCheckOutTime;

        fixItinerary();
    }

    function fixItinerary() {
        var hotel = $scope.currentDestination.hotelDetails;
        var distance, time;
        outer:
        for(var dateIndex in $scope.currentDestination.dateWiseItinerary) {
            var dateItinerary = $scope.currentDestination.dateWiseItinerary[dateIndex];
            dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(dateItinerary.dateWisePlaceData.startSightSeeingTime);
            dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(dateItinerary.dateWisePlaceData.endSightSeeingTime);
            if(dateItinerary.dateWisePlaceData.typeOfDay == 0 || dateItinerary.dateWisePlaceData.typeOfDay == 3){
                //This is first day of trip
                if(dateItinerary.hasMorningCheckIn == undefined || (dateItinerary.hasMorningCheckIn != undefined && dateItinerary.hasMorningCheckIn)) {
                    //Has Morning Check-In
                    if((dateItinerary.dateWisePlaceData.startSightSeeingTime - hotel.checkInTime.getTime()) / (HOURS_TO_MILLISECONDS) < RATIO*MORNING_CHECK_IN_DURATION){
                        //Violating Constraint
                        dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(hotel.checkInTime.getTime()+RATIO*MORNING_CHECK_IN_DURATION*HOURS_TO_MILLISECONDS);
                    }
                }
            }
            if(dateItinerary.dateWisePlaceData.typeOfDay == 1 || dateItinerary.dateWisePlaceData.typeOfDay == 2 || dateItinerary.dateWisePlaceData.typeOfDay == 3) {
                var previousDateItinerary = $scope.currentDestination.dateWiseItinerary[dateIndex - 1];
                //TODO: If previous days endSightSeeingTime is indefined ie. No places visited that day then handle case
                if(dateItinerary.dateWisePlaceData.startSightSeeingTime.getTime() - previousDateItinerary.dateWisePlaceData.endSightSeeingTime.getTime() < REST_TIME*HOURS_TO_MILLISECONDS) {
                    //Violating Rest Time Constraint
                    dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(previousDateItinerary.dateWisePlaceData.endSightSeeingTime.getTime() + REST_TIME*HOURS_TO_MILLISECONDS);
                }
            }
            inner:
            for(var placeIndex in dateItinerary.permutation) {
                var place = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[placeIndex]];
                place.placeArrivalTime = new Date(place.placeArrivalTime);
                place.placeDepartureTime = new Date(place.placeDepartureTime);
                if(placeIndex == 0) {
                    //This is the 1st place of day
                    distance = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
                    time = distance/SPEED;
                    console.log(dateItinerary.dateWisePlaceData.startSightSeeingTime);
                    console.log(JSON.stringify(place));
                    if(place.placeArrivalTime.getTime()-dateItinerary.dateWisePlaceData.startSightSeeingTime.getTime() < time*HOURS_TO_MILLISECONDS){
                       console.log("violating constraint");
                        //Violating Travel Duration Constraint
                        place.placeArrivalTime = new Date(dateItinerary.dateWisePlaceData.startSightSeeingTime.getTime() + time*HOURS_TO_MILLISECONDS);
                    }
                    else
                    {
                        //Now, there is more time between hotel and places than required
                        //Increase the hotel exit time
                        dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(place.placeArrivalTime.getTime()-time*HOURS_TO_MILLISECONDS);
                    }
                }
                else {
                    var lastPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[placeIndex - 1]];
                    distance = getDistance(lastPlace.Latitude, lastPlace.Longitude, place.Latitude, place.Longitude);
                    time = distance/SPEED;
                   if(place.placeArrivalTime.getTime() -lastPlace.placeDepartureTime.getTime() < time) {
                        //Violating Travel Duration Constraint
                        place.placeArrivalTime = new Date(lastPlace.placeDepartureTime.getTime() + time*HOURS_TO_MILLISECONDS);
                   }
                }

                if(place.placeDepartureTime.getTime() - place.placeArrivalTime.getTime() < RATIO*place.Time2Cover*MINUTES_TO_MILLISECONDS) {
                    //Violating Place Duration Constraint
                    place.placeDepartureTime = new Date(place.placeArrivalTime.getTime() + RATIO*place.Time2Cover*MINUTES_TO_MILLISECONDS);
                }
                console.log("place.placeDepartureTime:"+place.placeDepartureTime+","+JSON.stringify(place.PlaceTimings));
                if(!(place.isMeal != undefined && place.isMeal == 1)) {
                    if(placeIsClosedAtTime(place.placeDepartureTime, place.PlaceTimings)){
                        //Alert User
                        alert('Place Closed:'+JSON.stringify(place));
                        break outer;
                    }
                }
                if(placeIndex == dateItinerary.permutation.length - 1){
                    //This is the last place of day
                    distance = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
                    time = distance/SPEED;
                    //if(dateItinerary.dateWisePlaceData.endSightSeeingTime.getTime() - place.placeDepartureTime.getTime() < time*HOURS_TO_MILLISECONDS){
                        //Violating Travel Duration Constraint
                        dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(place.placeDepartureTime.getTime() + time*HOURS_TO_MILLISECONDS);
                    //}
                }
            }
            if(dateItinerary.dateWisePlaceData.typeOfDay == 2 || dateItinerary.dateWisePlaceData.typeOfDay == 3) {
                //Is last day of Trip
                if(hotel != undefined) {
                    if(hotel.checkOutTime.getTime() - dateItinerary.dateWisePlaceData.endSightSeeingTime.getTime() < CHECK_OUT_DURATION*HOURS_TO_MILLISECONDS) {
                        alert('Less Time For Check Out');
                        break outer;
                    }
                }
            }
        }
    }

    function placeIsClosedAtTime(time, placeTimings) {
        for(var timingIndex in placeTimings){
            var timing = placeTimings[timingIndex];
            if(isOnSameDay(time, timing.Days)){
                if(getTimeOfDayInMinutesFromDate(time) > getTimeOfDayInMinutesFromString(timing.TimeStart)) {
                    if(getTimeOfDayInMinutesFromDate(time) <= getTimeOfDayInMinutesFromString(timing.TimeEnd)) {
                        return false;
                    }
                }
            }
        }
        return true;

    }

    function compareTimings(placeTimings,time2Cover,freeStartTime,freeEndTime){
        var lowestTime = null;
        var highestTime = null;
        var TimeStart = getDateFromString(placeTimings.TimeStart,freeStartTime);
        var TimeEnd = getDateFromString(placeTimings.TimeEnd,freeStartTime);
        if(TimeStart.getTime()>freeStartTime.getTime())
        {
            lowestTime = freeStartTime;
        }
        else
        {
            lowestTime = TimeStart;
        }

        if(TimeEnd.getTime()>freeEndTime.getTime())
        {
            highestTime = TimeEnd;
        }
        else
        {
            highestTime = freeEndTime;
        }

        console.log("highestTime:"+highestTime);
        console.log("lowestTime:"+lowestTime);


        if((highestTime.getTime()-lowestTime.getTime())>time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
        {
            return true;
        }
        return false;
    }

    function getTimeOfDayInMinutesFromDate(date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    function getTimeOfDayInMinutesFromString(timeString) {
        var timeStringArray = timeString.split(':');
        return ( parseInt(timeStringArray[0]) * 60 ) + parseInt(timeStringArray[1]);
    }

    function getDateFromString(timeString,date)
    {
        var timeStringArray = timeString.split(':');
        var dateClone = new Date(date);
        dateClone.setHours(parseInt(timeStringArray[0]),parseInt(timeStringArray[1]));
        return(dateClone);
    }

    function isOnSameDay(time, days) {
        if(days == '0') {
            return true;
        }
        var day = '' + (time.getDay() + 1);
        console.log('day:'+day);
        if(days.indexOf(day) == -1) {
            console.log('Not on same day');
            return false;
        }
        return true;
    }

    function timeDifferenceGreaterThan(startTime, endTime, difference) {
        endTime = new Date(endTime);
        startTime = new Date(startTime);
        return((endTime.getTime()-startTime.getTime())>difference*MINUTES_TO_MILLISECONDS);

    }

    $scope.getHotelEntryTime = function(dateWisePlaceData, morningCheckIn){
        if(dateWisePlaceData.typeOfDay == 0 && morningCheckIn){
            return $scope.currentDestination.hotelDetails.checkInTime;
        }
        return dateWisePlaceData.endSightSeeingTime;
    };

    $scope.getHotelExitTime = function(dateWisePlaceData, currentIndex, morningCheckIn){
        if(dateWisePlaceData.typeOfDay == 2){
            return $scope.currentDestination.hotelDetails.checkOutTime;
        }
        else if(morningCheckIn != undefined && morningCheckIn) {
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
        console.log('originLat:'+originLat+",originLong:"+originLong+',destinationLat:'+destinationLat+',destinationLong:'+destinationLong);
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

    $scope.getItinerary();
});
