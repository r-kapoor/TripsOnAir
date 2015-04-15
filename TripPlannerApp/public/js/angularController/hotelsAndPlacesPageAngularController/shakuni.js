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
    var MAX_RATIO = 1.5;

    var lastTouchIndex;
    var lastTouchParentIndex;
    var touchSemaphore = true;

    //TODO: while adding the place update isSelectedFlag in placeTimings

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
                //console.log($scope.currentDestination.dateWiseItinerary);
                //console.log($scope.currentDestination.dateWiseItinerary[itineraryIndex + 1]);
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
                            console.log("CHECKOUT CASE:"+dateWisePlaceData.endSightSeeingTime +","+ $scope.currentDestination.hotelDetails.checkOutTime+","+ REST_TIME * 60 + Time2Cover)
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
                if(dateWisePlaceData.endSightSeeingTime != undefined && !(dateWisePlaceData.noPlacesVisited != undefined && dateWiseItinerary.noPlacesVisited == 1)){
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
            insertPlaceIntoItinerary(place, placeAdditionCandidates[selectedIndex.selectedCandidateIndex], selectedIndex.selectedPlaceTimingsIndex);
        }

    };

    $scope.dragMove = function(){
        $scope.stopClickClass = 'stop-click';
    };

    $scope.onDropComplete = function(data, event, index, dateItineraryIndex){
        console.log('Drop Complete:'+JSON.stringify(data));
        var dateItinerary = $scope.currentDestination.dateWiseItinerary[dateItineraryIndex];
        var dateItineraryClone = clone(dateItinerary);
        var place = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
        var placeClone = clone(place);
        if(!data.isSwap) {
            //A new place has been dropped from places
            var currentPlace = $scope.allPlaces[data.placeIndex];
            var currentPlaceClone = clone(currentPlace);
            //console.log("replacePlace:"+replacePlace(currentPlaceClone,index,dateItineraryClone));
            if(replacePlace(currentPlaceClone,index,dateItineraryClone))
            {
                console.log("REplace PLace");
                $scope.currentDestination.dateWiseItinerary[dateItineraryIndex] = dateItineraryClone;
            }
        }
        else {
            //A place has been dropped from the itinerary
            var currentDateItinerary = $scope.currentDestination.dateWiseItinerary[data.dateItineraryIndex];
            var currentDateItineraryClone = clone(currentDateItinerary);
            var currentIndex = data.permutationIndex;
            var currentPlace = currentDateItinerary.dateWisePlaceData.placesData[currentDateItinerary.permutation[currentIndex]];
            var currentPlaceClone = clone(currentPlace);

            if(data.dateItineraryIndex==dateItineraryIndex)
            {//same Day

                if(Math.abs(index-currentIndex)==1)
                {
                    //next to each other
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
    };


    function replacePlace(place,index,dateItinerary)
    {
        var permValue = dateItinerary.permutation[index];
        var oldPlace = dateItinerary.dateWisePlaceData.placesData[permValue];
        var hotel = $scope.currentDestination.hotelDetails;
        var replacePlace = false;
        if(place.Days == undefined) {
            place.Days = combineDays(place.PlaceTimings);
        }
        if(checkIfPlaceIsOpenOnDay(place.Days,dateItinerary.dateWisePlaceData.startSightSeeingTime)) {
            //The place is open
            var distanceToHotel = getDistance(place.Latitude, place.Longitude, hotel.Latitude, hotel.Longitude);
            var timeToHotel = distanceToHotel/SPEED;
            if(dateItinerary.permutation.length == 1){
                //This is the only place of the day
                if(!placeIsClosedAtTime(oldPlace.placeArrivalTime, place.PlaceTimings)){
                    var supposedDepartureTime = getPlaceDepartureTimeFromArrival(oldPlace.placeArrivalTime, place.Time2Cover);
                    if(!placeIsClosedAtTime(supposedDepartureTime, place.PlaceTimings)){
                        place.placeArrivalTime = oldPlace.placeArrivalTime;
                        place.placeDepartureTime = supposedDepartureTime;
                    }
                    else {
                        //the place is closed at departure time
                        var timingIndex = getPlaceTimingsToSelect(oldPlace.placeArrivalTime, place.PlaceTimings);
                        place.placeDepartureTime = getDateFromString(place.PlaceTimings[timingIndex], oldPlace.placeArrivalTime);
                        place.placeArrivalTime = getPlaceArrivalTimeFromDeparture(place.placeDepartureTime, place.Time2Cover);
                    }
                }
                else {
                    var nearestTimingIndex = getNearestTimingIndex(oldPlace.placeArrivalTime, place.PlaceTimings);
                    var nearestTiming = place.PlaceTimings[nearestTimingIndex];
                    if(getTimeOfDayInMinutesFromDate(oldPlace.placeArrivalTime) > getTimeOfDayInMinutesFromString(nearestTiming.TimeEnd)){
                        //The current time is after place closes
                        place.placeDepartureTime = getDateFromString(nearestTiming.TimeEnd, oldPlace.placeArrivalTime);
                        place.placeArrivalTime = getPlaceArrivalTimeFromDeparture(place.placeDepartureTime, place.Time2Cover);
                    }
                    else {
                        //The current time is before the place opens
                        place.placeArrivalTime = getDateFromString(nearestTiming.TimeStart, oldPlace.placeArrivalTime);
                        place.placeDepartureTime = getPlaceDepartureTimeFromArrival(place.placeArrivalTime, place.Time2Cover);
                    }
                }
                dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - timeToHotel*HOURS_TO_MILLISECONDS);
                dateItinerary.dateWiseItinerary.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + timeToHotel*HOURS_TO_MILLISECONDS);
            }
            if(index == 0){
                //This is the first place of the day
                var permValueNextPlace = dateItinerary.permutation[index+1];
                var nextPlace = dateItinerary.dateWisePlaceData.placesData[permValueNextPlace];
                var distanceToNextPlace = getDistance(place.Latitude,place.Longitude,nextPlace.Latitude,nextPlace.Longitude);
                var TimeToNextPlace =   distanceToNextPlace/SPEED;
                place.placeDepartureTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - TimeToNextPlace*HOURS_TO_MILLISECONDS);
                var openingTimeIndex = getPlaceTimingsToSelect(place.placeDepartureTime,place.PlaceTimings);
                if(openingTimeIndex!= -1 )
                {
                    place.placeArrivalTime = getPlaceArrivalTimeFromDeparture(place.placeDepartureTime,place.Time2Cover);
                    if(checkIfClosedAtPlaceTiming(place.PlaceTimings[openingTimeIndex],place.placeArrivalTime))
                    {
                        place.placeArrivalTime = getDateFromString(place.PlaceTimings[openingTimeIndex].TimeStart,place.placeDepartureTime);
                        if(getTimeFromDate(place.placeDepartureTime) - getTimeFromDate(place.placeArrivalTime) < place.Time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
                        {
                            alert("You have Less Time to Cover This place. Set Timings Accordingly!");
                        }
                    }
                    dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - timeToHotel*HOURS_TO_MILLISECONDS);
                }
                else {
                    //The place is closed at place departure time
                    //TODO:set arrival Time as initial value so that user can set himself
                    alert('The place is closed at this time');
                }
            }
            else if(index == dateItinerary.permutation.length -1)
            {
                //This is end place of the day
                var permValueLastPlace = dateItinerary.permutation[index-1];
                var lastPlace = dateItinerary.dateWisePlaceData.placesData[permValueLastPlace];
                var distanceFromLastPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
                var TimeFromLastPlace = distanceFromLastPlace/SPEED;
                place.placeArrivalTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + TimeFromLastPlace*HOURS_TO_MILLISECONDS);
                var openingTimeIndex = getPlaceTimingsToSelect(place.placeArrivalTime, place.PlaceTimings);
                if(openingTimeIndex != -1){
                    place.placeDepartureTime = getPlaceDepartureTimeFromArrival(place.placeArrivalTime, place.Time2Cover);
                    if(checkIfClosedAtPlaceTiming(place.PlaceTimings[openingTimeIndex], place.placeDepartureTime)){
                        place.placeDepartureTime = getDateFromString(place.PlaceTimings[openingTimeIndex].TimeEnd, place.placeArrivalTime);
                        if(getTimeFromDate(place.placeDepartureTime) - getTimeFromDate(place.placeArrivalTime) < place.Time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
                        {
                            alert("You have Less Time to Cover This place. Set Timings Accordingly!");
                        }
                    }
                    dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + timeToHotel*HOURS_TO_MILLISECONDS);
                }
                else {
                    //The place is closed at place departure time
                    //TODO:set arrival Time as initial value so that user can set himself
                    alert('The place is closed at this time');
                }
            }
            else {
                //This place is in between some other places
                var isPlaceTimingSet = false;
                var permValueNextPlace = dateItinerary.permutation[index+1];
                var nextPlace = dateItinerary.dateWisePlaceData.placesData[permValueNextPlace];
                var distanceToNextPlace = getDistance(place.Latitude,place.Longitude,nextPlace.Latitude,nextPlace.Longitude);
                var TimeToNextPlace =   distanceToNextPlace/SPEED;
                var permValueLastPlace = dateItinerary.permutation[index-1];
                var lastPlace = dateItinerary.dateWisePlaceData.placesData[permValueLastPlace];
                var distanceFromLastPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
                var TimeFromLastPlace = distanceFromLastPlace/SPEED;

                place.placeArrivalTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + TimeFromLastPlace*HOURS_TO_MILLISECONDS);
                place.placeDepartureTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - TimeToNextPlace*HOURS_TO_MILLISECONDS);
                var openingTimeIndexForDeparture = getPlaceTimingsToSelect(place.placeDepartureTime,place.PlaceTimings);
                var openingTimeIndexForArrival = getPlaceTimingsToSelect(place.placeArrivalTime, place.PlaceTimings);
                console.log("openingTimeIndexForArrival:"+openingTimeIndexForArrival+",openingTimeIndexForDeparture:"+openingTimeIndexForDeparture);
                if(openingTimeIndexForArrival != -1 && openingTimeIndexForDeparture != -1) {
                    //The place is open at both arrival and departure time
                    if(openingTimeIndexForArrival == openingTimeIndexForDeparture){
                        //Both timings are from same index. So the place is open for this whole duration
                        isPlaceTimingSet = true;
                    }
                    else{
                        alert('The place is closed in this duration');
                    }
                }
                else {
                    if(openingTimeIndexForArrival == openingTimeIndexForDeparture) {
                        alert('The place is closed at this time');
                    }
                    else if(openingTimeIndexForDeparture == -1){
                        //The place is open at arrival but closes before departure
                        place.placeDepartureTime = getDateFromString(place.PlaceTimings[openingTimeIndexForArrival].TimeEnd, place.placeArrivalTime);
                        isPlaceTimingSet = true;
                    }
                    else if(openingTimeIndexForArrival == -1){
                        //The place is open at departure time but closed at arrival time
                        place.placeArrivalTime = getDateFromString(place.PlaceTimings[openingTimeIndexForDeparture].TimeStart,place.placeDepartureTime);
                        isPlaceTimingSet = true;
                    }
                    if(isPlaceTimingSet && getTimeFromDate(place.placeDepartureTime) - getTimeFromDate(place.placeArrivalTime) < place.Time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
                    {
                        alert("You have Less Time to Cover This place. Set Timings Accordingly!");
                    }
                }
            }
            dateItinerary.dateWisePlaceData.placesData[permValue] = place;
            replacePlace = true;
        }
        else {
            alert('Place closed on this day');
        }
        return replacePlace;
    }


    function getPlaceDepartureTimeFromArrival(arrivalTime, time2Cover){
        return new Date(getTimeFromDate(arrivalTime) + time2Cover*MINUTES_TO_MILLISECONDS);

    }

    function getPlaceArrivalTimeFromDeparture(departureTime, time2Cover){
        return new Date(getTimeFromDate(departureTime) - time2Cover*MINUTES_TO_MILLISECONDS);
    }

    function checkIfClosedAtPlaceTiming(placeTime, time)
    {
        if(isOnSameDay(time, placeTime.Days)){
            if(getTimeOfDayInMinutesFromDate(time) > getTimeOfDayInMinutesFromString(placeTime.TimeStart)) {
                if(getTimeOfDayInMinutesFromDate(time) <= getTimeOfDayInMinutesFromString(placeTime.TimeEnd)) {
                    return false;
                }
            }
        }
        return true;
    }

    function calculateHotelExpenses(){
        var hotelDetails = $scope.currentDestination.hotelDetails;
        var numberOfDaysInHotel = 0;
        hotelDetails.checkInTime = new Date(hotelDetails.checkInTime);
        hotelDetails.checkOutTime = new Date(hotelDetails.checkOutTime);
        var checkInTimeClone = new Date(getTimeFromDate(hotelDetails.checkInTime));
        checkInTimeClone.setHours(12,0,0,0);
        var checkOutTimeClone = new Date(getTimeFromDate(hotelDetails.checkOutTime));
        checkOutTimeClone.setHours(12,0,0,0);
        if(getTimeFromDate(hotelDetails.checkInTime) < getTimeFromDate(checkInTimeClone)) {
            numberOfDaysInHotel += 1;
        }
        numberOfDaysInHotel += (getTimeFromDate(checkOutTimeClone) - getTimeFromDate(checkInTimeClone)) / (DAYS_TO_MILLISECONDS);
        if(getTimeFromDate(hotelDetails.checkOutTime) > getTimeFromDate(checkOutTimeClone)) {
            numberOfDaysInHotel += 1;
        }
        var numberOfRooms = Math.ceil($scope.numberOfPeople/hotelDetails.MaxPersons);
        var pricePerPerson = (hotelDetails.Price * numberOfDaysInHotel * numberOfRooms)/$scope.numberOfPeople;
        hotelDetails.pricePerPerson = pricePerPerson;
    }

    function insertPlaceIntoItinerary(place, candidate, selectedPlaceTimingIndex){
        console.log('insertPlaceIntoItinerary');
        var freeTiming = candidate.freeTimingsArray[selectedPlaceTimingIndex];
        console.log(freeTiming.freeStartTime + " = "+ freeTiming.lowestTime);
        var dateWiseItinerary = candidate.dateWiseItinerary;
        var nextDateWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];

        if(candidate.type == "nightMorning" || candidate.type == "checkIn" || candidate.type == "checkOut") {
            if(freeTiming.insertionDay == 0) {
                //The insertion is on the same day
                console.log('insertion is on the same day');
                //The place has to inserted as the last place of the day
                insertPlaceAtLastOfDay(dateWiseItinerary, place);
                place.placeArrivalTime = freeTiming.lowestTime;
                if(getTimeFromDate(freeTiming.freeStartTime) == getTimeFromDate(freeTiming.lowestTime)) {
                    //The starting of the free time is the same as lowest time when that place can be reached
                    //So this place can be inserted at that time
                    console.log('place can be inserted at start of free time');
                }
                else {
                    //The place is not open when person is reaching there
                    if(candidate.type != "checkIn") {
                        //Make Departure time from last place equal to endTime or Max time so that person reach at new place near by opening time
                        console.log("Increasing Departure Time of Previous Place");
                        //Departing from place
                        increaseDepartureTimeOfPreviousPlace(dateWiseItinerary, place, freeTiming);
                    }
                }
                setPlaceDepartureTime(place, freeTiming);
                console.log("Place.placeDepartureTime:"+place.placeDepartureTime);
                console.log("place.timeToHotel:"+place.timeToHotel);
                dateWiseItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + place.timeToHotel * HOURS_TO_MILLISECONDS);
                console.log("dateWiseItinerary.endSightSeeingTime:"+dateWiseItinerary.dateWisePlaceData.endSightSeeingTime);
                if(candidate.type == "checkIn") {
                    dateWiseItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - place.timeToHotel * HOURS_TO_MILLISECONDS);
                }
            }
            else if(freeTiming.insertionDay == 1){
                //The insertion is on the next day
                console.log('insertion on next day');
                insertPlaceAtBeginningOfDay(nextDateWiseItinerary, place);
                place.placeDepartureTime = freeTiming.highestTime;
                if(getTimeFromDate(freeTiming.freeEndTime) == getTimeFromDate(freeTiming.highestTime)) {
                    //The starting of the free time is the same as lowest time when that place can be reached
                    //So this place can be inserted at that time
                    console.log('place can be inserted at end of free time');
                }
                else {
                    if(candidate.type != "checkOut") {
                        decreaseArrivalTimeOfNextPlace(nextDateWiseItinerary, place, freeTiming);
                    }
                }
                setPlaceArrivalTime(place, freeTiming);
                nextDateWiseItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - place.timeToHotel * HOURS_TO_MILLISECONDS);
                if(candidate.type == "checkOut") {
                    nextDateWiseItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + place.timeToHotel * HOURS_TO_MILLISECONDS);
                }
            }
        }
        else if(candidate.type == "morningCheckIn") {
            console.log('morningCheckIn');
            //The insertion is on the same day
            console.log('insertion is on the same day');
            insertPlaceAtBeginningOfDay(dateWiseItinerary, place);
            place.placeDepartureTime = freeTiming.highestTime;
            if(getTimeFromDate(freeTiming.freeStartTime) == getTimeFromDate(freeTiming.lowestTime)) {
                //The starting of the free time is the same as lowest time when that place can be reached
                //So this place can be inserted at that time
                console.log('place can be inserted at end of free time');
            }
            else {
                decreaseArrivalTimeOfNextPlace(dateWiseItinerary, place, freeTiming);
            }
            setPlaceDepartureTime(place, freeTiming);
            dateWiseItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime) - place.timeToHotel * HOURS_TO_MILLISECONDS);

        }
        else if(candidate.type == "eveningCheckOut") {
            console.log('eveningCheckOut');
            //The insertion is on the same day
            console.log('insertion is on the same day');
            insertPlaceAtLastOfDay(dateWiseItinerary, place);
            place.placeArrivalTime = freeTiming.lowestTime;
            if(getTimeFromDate(freeTiming.freeStartTime) == getTimeFromDate(freeTiming.lowestTime)) {
                //The starting of the free time is the same as lowest time when that place can be reached
                //So this place can be inserted at that time
                console.log('place can be inserted at start of free time');
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
                        console.log('Place is not open on day:'+candidateIndex);
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
                        candidate.splice(candidateIndex, 1);
                        console.log('Place is not open on both days:'+candidateIndex);
                        candidateIndex--;
                    }
                }
            }
        }
        else {
            for(var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                var candidate = candidates[candidateIndex];
                candidate.isOpenOnDay = 3;
            }
        }
        if(candidates.length > 0){
            //Still some candidates left
            for(var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++){
                var candidate = candidates[candidateIndex];
                var freeTimingsArray = getFreeTimings(candidate, place);
                for(var freeTimingsIndex =0;freeTimingsIndex<freeTimingsArray.length;freeTimingsIndex++)
                {
                    if(!((getTimeFromDate(freeTimingsArray[freeTimingsIndex].freeEndTime) - getTimeFromDate(freeTimingsArray[freeTimingsIndex].freeStartTime)>=place.Time2Cover*RATIO*MINUTES_TO_MILLISECONDS)))
                    {
                        console.log("Removing time :"+freeTimingsArray[freeTimingsIndex].freeEndTime +" - "+ freeTimingsArray[freeTimingsIndex].freeStartTime +" >= "+ place.Time2Cover*RATIO);
                        freeTimingsArray.splice(freeTimingsIndex,1);
                        freeTimingsIndex--;
                    }
                }
                if(freeTimingsArray.length==0)
                {
                    candidates.splice(candidateIndex,1);
                    console.log('Duration is less that time to cover:'+candidateIndex);
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
                var candidate = candidates[candidateIndex];
                checkIfPlaceIsOpenOnFreeTimings(candidate,place);
                if(candidate.freeTimingsArray.length==0){
                    candidates.splice(candidateIndex,1);
                    console.log('Place is not open on free timings:'+candidateIndex);
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
                    var freeDuration = getTimeFromDate(candidate.freeTimingsArray[candidateTimingsIndex].freeEndTime)-getTimeFromDate(candidate.freeTimingsArray[candidateTimingsIndex].freeStartTime);
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
        if(candidate.type == 'morningCheckIn'){
            var freeTimings = {
                insertionDay: 0,//Same Day
                freeStartTime:new Date(),
                freeEndTime:new Date()
            };
            var nextPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[0]];
            nextPlace.placeArrivalTime=new Date(nextPlace.placeArrivalTime);
            var distanceToNextPlace = getDistance(place.Latitude, place.Longitude, nextPlace.Latitude, nextPlace.Longitude);
            var timeToNextPlace = distanceToNextPlace / SPEED;
            var distanceFromHotel = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
            var timeFromHotel = distanceFromHotel / SPEED;
            place.timeToHotel = timeFromHotel;
            freeTimings.freeEndTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - timeToNextPlace * HOURS_TO_MILLISECONDS);
            freeTimings.freeStartTime = new Date(getTimeFromDate(hotel.checkInTime) + MORNING_CHECK_IN_DURATION * RATIO * HOURS_TO_MILLISECONDS + timeFromHotel * HOURS_TO_MILLISECONDS);
            freeTimingsArray.push(freeTimings);
        }
        else if(candidate.type == 'nightMorning') {

            var distanceToHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            var time2Hotel = distanceToHotel / SPEED;
            place.timeToHotel = time2Hotel;
            var nextDayWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];
            if(candidate.isOpenOnDay == 1 || candidate.isOpenOnDay == 3)
            {
                var freeTimings = {
                    insertionDay: 0,//Same Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                var lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
                lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
                var distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
                var timeToNewPlace = distanceToNewPlace / SPEED;
                freeTimings.freeStartTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime)+timeToNewPlace * HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime=new Date(getTimeFromDate(nextDayWiseItinerary.dateWisePlaceData.startSightSeeingTime) - REST_TIME*HOURS_TO_MILLISECONDS*RATIO-time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
            if(candidate.isOpenOnDay == 2 || candidate.isOpenOnDay == 3)
            {
                var freeTimings = {
                    insertionDay: 1,//Next Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                var nextDayFirstPlace = nextDayWiseItinerary.dateWisePlaceData.placesData[nextDayWiseItinerary.permutation[0]];
                nextDayFirstPlace.placeArrivalTime = new Date(nextDayFirstPlace.placeArrivalTime);
                var distanceToNextDayFirstPlace = getDistance(place.Latitude,place.Longitude,nextDayFirstPlace.Latitude,nextDayFirstPlace.Longitude);
                var timeToNextDayFirstPlace = distanceToNextDayFirstPlace / SPEED;
                freeTimings.freeEndTime = new Date(getTimeFromDate(nextDayFirstPlace.placeArrivalTime) - timeToNextDayFirstPlace*HOURS_TO_MILLISECONDS);
                freeTimings.freeStartTime = new Date(getTimeFromDate(candidate.dateWiseItinerary.dateWisePlaceData.endSightSeeingTime) + REST_TIME*HOURS_TO_MILLISECONDS*RATIO+time2Hotel*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
                console.log("freeTimingsArray:"+JSON.stringify(freeTimingsArray));
                console.log('nextDayFirstPlace:'+nextDayFirstPlace.Name);
            }
        }
        else if(candidate.type == 'checkIn'){

            var distanceFromHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            var timeFromHotel = distanceFromHotel/SPEED;
            place.timeToHotel = timeFromHotel;
            var nextDayWiseItinerary = $scope.currentDestination.dateWiseItinerary[candidate.dateWiseItineraryIndex+1];
            var hotelCheckInTime = hotel.checkInTime;
            if(candidate.isOpenOnDay ==1 || candidate.isOpenOnDay ==3)
            {
                var freeTimings = {
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
                var freeTimings = {
                    insertionDay: 1,//Next Day
                    freeStartTime:new Date(),
                    freeEndTime:new Date()
                };
                var nextDayFirstPlace = nextDayWiseItinerary.dateWisePlaceData.placesData[nextDayWiseItinerary.permutation[0]];
                nextDayFirstPlace.placeArrivalTime = new Date(nextDayFirstPlace.placeArrivalTime);
                var distanceToNextDayFirstPlace = getDistance(place.Latitude,place.Longitude,nextDayFirstPlace.Latitude,nextDayFirstPlace.Longitude);
                var timeToNextDayFirstPlace = distanceToNextDayFirstPlace / SPEED;

                freeTimings.freeStartTime =new Date(getTimeFromDate(hotelCheckInTime) + REST_TIME*RATIO*HOURS_TO_MILLISECONDS+timeFromHotel*HOURS_TO_MILLISECONDS);
                freeTimings.freeEndTime =  new Date(getTimeFromDate(nextDayFirstPlace.placeArrivalTime) - timeToNextDayFirstPlace*HOURS_TO_MILLISECONDS);
                freeTimingsArray.push(freeTimings);
            }
        }
        else if(candidate.type == 'checkOut'){

            console.log('Enters checkout');
            var lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
            lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
            var distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
            var timeToNewPlace = distanceToNewPlace / SPEED;
            var distanceToHotel = getDistance(place.Latitude, place.Longitude,hotel.Latitude,hotel.Longitude);
            var time2Hotel = distanceToHotel / SPEED;
            place.timeToHotel = time2Hotel;
            console.log(candidate.isOpenOnDay);
            if(candidate.isOpenOnDay ==1 || candidate.isOpenOnDay ==3)
            {
                console.log('Open on 1st day');
                var freeTimings = {
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
                console.log('Open on 2nd day');
                var freeTimings = {
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
            var freeTimings = {
                insertionDay: 0,//Same Day
                freeStartTime:new Date(),
                freeEndTime:new Date()
            };
            var lastPlace = candidate.dateWiseItinerary.dateWisePlaceData.placesData[candidate.dateWiseItinerary.permutation[candidate.dateWiseItinerary.permutation.length-1]];
            lastPlace.placeDepartureTime = new Date(lastPlace.placeDepartureTime);
            var distanceToNewPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,place.Latitude,place.Longitude);
            var timeToNewPlace = distanceToNewPlace / SPEED;
            var distanceFromHotel = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
            var timeFromHotel = distanceFromHotel / SPEED;
            place.timeToHotel = timeFromHotel;
            freeTimings.freeStartTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime)+timeToNewPlace * HOURS_TO_MILLISECONDS);
            freeTimings.freeEndTime = new Date(getTimeFromDate(hotel.checkOutTime)- CHECK_OUT_DURATION*RATIO*HOURS_TO_MILLISECONDS - timeFromHotel*HOURS_TO_MILLISECONDS);
            freeTimingsArray.push(freeTimings);
        }
        return freeTimingsArray;
    }

    function checkIfPlaceIsOpenOnFreeTimings(candidate,place){
        console.log('In checkIfPlaceIsOpenOnFreeTimings');
        for(var candidateTimingsIndex =0;candidateTimingsIndex<candidate.freeTimingsArray.length;candidateTimingsIndex++)
        {
            var freeStartTime = candidate.freeTimingsArray[candidateTimingsIndex].freeStartTime;
            var freeEndTime = candidate.freeTimingsArray[candidateTimingsIndex].freeEndTime;
            for(var placeTimingsIndex = 0; placeTimingsIndex<place.PlaceTimings.length;placeTimingsIndex++) {
                if (checkIfPlaceIsOpenOnDay(place.PlaceTimings[placeTimingsIndex].Days, freeStartTime)) {
                    console.log('Place is Open on day');
                    if (compareTimings(place.PlaceTimings[placeTimingsIndex], place.Time2Cover, candidate.freeTimingsArray[candidateTimingsIndex])) {
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
        var hotelCheckInTime = new Date(getTimeFromDate(arrivalTime)+time*HOURS_TO_MILLISECONDS);
        var departureTime = new Date($scope.currentDestination.departureTime);
        distance=getDistance($scope.currentDestination.LocationOfDeparture.Latitude,$scope.currentDestination.LocationOfDeparture.Longitude,
            hotel.Latitude,hotel.Longitude);
        time = distance/SPEED;
        var hotelCheckOutTime = new Date(getTimeFromDate(departureTime)-time*HOURS_TO_MILLISECONDS);
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
                    if((dateItinerary.dateWisePlaceData.startSightSeeingTime - getTimeFromDate(hotel.checkInTime)) / (HOURS_TO_MILLISECONDS) < RATIO*MORNING_CHECK_IN_DURATION){
                        //Violating Constraint
                        dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(hotel.checkInTime)+RATIO*MORNING_CHECK_IN_DURATION*HOURS_TO_MILLISECONDS);
                    }
                }
            }
            if(dateItinerary.dateWisePlaceData.typeOfDay == 1 || dateItinerary.dateWisePlaceData.typeOfDay == 2 || dateItinerary.dateWisePlaceData.typeOfDay == 3) {
                var previousDateItinerary = $scope.currentDestination.dateWiseItinerary[dateIndex - 1];
                //TODO: If previous days endSightSeeingTime is indefined ie. No places visited that day then handle case
                if(getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) - getTimeFromDate(previousDateItinerary.dateWisePlaceData.endSightSeeingTime) < REST_TIME*HOURS_TO_MILLISECONDS) {
                    //Violating Rest Time Constraint
                    dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(previousDateItinerary.dateWisePlaceData.endSightSeeingTime) + REST_TIME*HOURS_TO_MILLISECONDS);
                }
            }
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
                    if(getTimeFromDate(place.placeArrivalTime)-getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) < time*HOURS_TO_MILLISECONDS){
                       console.log("violating constraint");
                        //Violating Travel Duration Constraint
                        place.placeArrivalTime = new Date(getTimeFromDate(dateItinerary.dateWisePlaceData.startSightSeeingTime) + time*HOURS_TO_MILLISECONDS);
                    }
                    else
                    {
                        //Now, there is more time between hotel and places than required
                        //Increase the hotel exit time
                        dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(place.placeArrivalTime)-time*HOURS_TO_MILLISECONDS);
                    }
                }
                else {
                    var lastPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[placeIndex - 1]];
                    distance = getDistance(lastPlace.Latitude, lastPlace.Longitude, place.Latitude, place.Longitude);
                    time = distance/SPEED;
                   if(getTimeFromDate(place.placeArrivalTime) -getTimeFromDate(lastPlace.placeDepartureTime) < time) {
                        //Violating Travel Duration Constraint
                        place.placeArrivalTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + time*HOURS_TO_MILLISECONDS);
                   }
                }

                if(getTimeFromDate(place.placeDepartureTime) - getTimeFromDate(place.placeArrivalTime) < RATIO*place.Time2Cover*MINUTES_TO_MILLISECONDS) {
                    //Violating Place Duration Constraint
                    place.placeDepartureTime = new Date(getTimeFromDate(place.placeArrivalTime) + RATIO*place.Time2Cover*MINUTES_TO_MILLISECONDS);
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
                        dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(place.placeDepartureTime) + time*HOURS_TO_MILLISECONDS);
                    //}
                }
            }
            if(dateItinerary.dateWisePlaceData.typeOfDay == 2 || dateItinerary.dateWisePlaceData.typeOfDay == 3) {
                //Is last day of Trip
                if(hotel != undefined) {
                    if(getTimeFromDate(hotel.checkOutTime) - getTimeFromDate(dateItinerary.dateWisePlaceData.endSightSeeingTime) < CHECK_OUT_DURATION*HOURS_TO_MILLISECONDS) {
                        alert('Less Time For Check Out');
                        break outer;
                    }
                }
            }
        }
    }

    function placeIsClosedAtTime(time, placeTimings) {
        for(var timingIndex=0; timingIndex < placeTimings.length; timingIndex++){
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

    function getPlaceTimingsToSelect(time, placeTimings) {
        for(var timingIndex=0; timingIndex < placeTimings.length; timingIndex++){
            var timing = placeTimings[timingIndex];
            if(isOnSameDay(time, timing.Days)){
                if(getTimeOfDayInMinutesFromDate(time) > getTimeOfDayInMinutesFromString(timing.TimeStart)) {
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
            if(isOnSameDay(time, timing.Days)){
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

    function compareTimings(placeTimings,time2Cover,freeTimings){
        var freeStartTime = freeTimings.freeStartTime;
        var freeEndTime = freeTimings.freeEndTime;
        var lowestTime = null;//Time at which place can be reached and place is also open
        var highestTime = null;//Time at which place can be departed and is not closed
        var TimeStart = getDateFromString(placeTimings.TimeStart,freeStartTime);
        var TimeEnd = getDateFromString(placeTimings.TimeEnd,freeStartTime);
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

        console.log("highestTime:"+highestTime);
        console.log("lowestTime:"+lowestTime);
        freeTimings.highestTime = highestTime;
        freeTimings.lowestTime = lowestTime;

        if((getTimeFromDate(highestTime)-getTimeFromDate(lowestTime))>time2Cover*RATIO*MINUTES_TO_MILLISECONDS)
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

    function getTimeFromDate(date){
        if(date instanceof Date){
            return date.getTime();
        }
        date = new Date(date);
        return date.getTime();
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
        return((getTimeFromDate(endTime)-getTimeFromDate(startTime))>difference*MINUTES_TO_MILLISECONDS);

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
                var maxDepartTime = getDateFromString(placeTime.TimeEnd, departTime);
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
                var minArrivalTime = getDateFromString(placeTime.TimeStart, arrivalTime);
                if (getTimeFromDate(minArrivalTime) > getTimeFromDate(supposedNextPlaceArrivalTime)) {
                    nextPlace.placeArrivalTime = minArrivalTime;
                }
                else {
                    nextPlace.placeArrivalTime = supposedNextPlaceArrivalTime;
                }
            }
        }
    }

    $scope.removePlace=function(dateItinerary,index){
        console.log("place removed:"+index);
        dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]].isPlaceRemoved = 1;
        //dateItinerary.permutation.splice(index,1);

    };

    $scope.removePlaceHolder=function(dateItinerary,index){
        console.log("place removed:"+index);
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
        //first place of the day
        if(index==0)
        {
            //increase time in hotel
            var nextPlace=dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[0]];//Now same index has next place
            var hotelToNextPlaceDistance=getDistance(hotel.Latitude, hotel.Longitude, nextPlace.Latitude, nextPlace.Longitude);
            var time = hotelToNextPlaceDistance/SPEED;
            dateItinerary.dateWisePlaceData.startSightSeeingTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - time*HOURS_TO_MILLISECONDS);
        }
        //last place of the day
        else if(index == dateItinerary.permutation.length)
        {
            //increase time in hotel
            var lastPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[dateItinerary.permutation.length-1]];
            var lastPlaceToHotel = getDistance(lastPlace.Latitude,lastPlace.Longitude,hotel.Latitude,hotel.Longitude);
            var timeToHotel = lastPlaceToHotel/SPEED;
            dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + timeToHotel*HOURS_TO_MILLISECONDS);
        }
        else
        {
            console.log('Neither 1st place or last place');
            var lastPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index-1]];
            var nextPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
            var lastPlaceTimings = getSelectedPlaceTimings(lastPlace);
            var lastPlaceEndTime = getDateFromString(lastPlaceTimings.TimeEnd,lastPlace.placeDepartureTime);
            var maxPlaceDepartureTime = new Date(getTimeFromDate(lastPlace.placeArrivalTime) + lastPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
            var lastPlaceToNextPlace = getDistance(lastPlace.Latitude,lastPlace.Longitude,nextPlace.Latitude,nextPlace.Longitude);
            var timeFromLastPlaceToNextPlace = lastPlaceToNextPlace/SPEED;
            var supposedLastPlaceDepartTime = new Date(getTimeFromDate(nextPlace.placeArrivalTime) - timeFromLastPlaceToNextPlace*HOURS_TO_MILLISECONDS);
            maxPlaceDepartureTime = getMinimum(lastPlaceEndTime,maxPlaceDepartureTime);
            if(maxPlaceDepartureTime>=supposedLastPlaceDepartTime)
            {
                lastPlace.placeDepartureTime = supposedLastPlaceDepartTime;
                console.log('Extending last place departure time. This covers the gap');
            }
            else
            {
                //The last place cannot be extended to cover the complete time vacated by the removed place
                lastPlace.placeDepartureTime = maxPlaceDepartureTime;
                console.log('Extending last place departure time. This does not cover the gap');
                //Decreasing the arrival time of the next places to cover the vacated time
                var timeCoveredInBetween = false;
                for(var placeIndex = index; placeIndex < dateItinerary.permutation.length; placeIndex++) {
                    var currentPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[index]];
                    var lastPlaceToCurrentPlaceDistance = getDistance(lastPlace.Latitude,lastPlace.Longitude,currentPlace.Latitude,currentPlace.Longitude);
                    var timeFromLastPlaceToCurrentPlace = lastPlaceToCurrentPlaceDistance/SPEED;
                    var supposedCurrentPlaceArrivalTime = new Date(getTimeFromDate(lastPlace.placeDepartureTime) + timeFromLastPlaceToCurrentPlace*HOURS_TO_MILLISECONDS);
                    var currentPlaceTimings = getSelectedPlaceTimings(currentPlace);
                    var currentPlaceStartTime = getDateFromString(currentPlaceTimings.TimeStart, currentPlace.placeArrivalTime);
                    var maxPlaceArrivalTime = new Date(getTimeFromDate(currentPlace.placeDepartureTime) - currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
                    maxPlaceArrivalTime = getMaximum(currentPlaceStartTime, maxPlaceArrivalTime);
                    if(maxPlaceArrivalTime<=supposedCurrentPlaceArrivalTime){
                        currentPlace.placeArrivalTime = supposedCurrentPlaceArrivalTime;
                        timeCoveredInBetween = true;
                        console.log('Decreasing current place arrival time. This covers the gap');
                        break;
                    }
                    else {
                        if(supposedCurrentPlaceArrivalTime >= currentPlaceStartTime) {
                            //The place is open at the time of reaching but time2cover does not satisfy
                            console.log('Place is open at time of arrival but does not satisfy time2cover');
                            console.log('Place opens at:'+currentPlaceStartTime);
                            console.log('Max of opening time and time2cover constraint:'+maxPlaceArrivalTime);
                            currentPlace.placeArrivalTime = maxPlaceArrivalTime;
                            currentPlace.placeDepartureTime = new Date(getTimeFromDate(currentPlace.placeArrivalTime) + currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
                            console.log('Decreasing current place arrival time and departure time. This does not cover the gap');
                        }
                        else {
                            //The place is not opened yet
                            console.log('Place not open at time of arrival');
                            console.log('Place opens at:'+currentPlaceStartTime);
                            console.log('Max of opening time and time2cover constraint:'+maxPlaceArrivalTime);
                            if(maxPlaceArrivalTime > currentPlaceStartTime){
                                //The place opens before the time2cover constraint is satisfied
                                currentPlace.placeArrivalTime = currentPlaceStartTime;//At this time time2cover constraint is not satisfied
                                currentPlace.placeDepartureTime = new Date(getTimeFromDate(currentPlace.placeArrivalTime) + currentPlace.Time2Cover*MINUTES_TO_MILLISECONDS*MAX_RATIO);
                                console.log('Decreasing current place arrival time and departure time. This does not cover the gap');
                            }
                            else {
                                //The place opens on or after the time2cover constraint is satisfied
                                currentPlace.placeArrivalTime = maxPlaceArrivalTime;
                                timeCoveredInBetween = true;
                                console.log('Decreasing current place arrival time. This covers the gap');
                                break;
                            }
                        }
                        lastPlace = currentPlace;
                    }
                }
                if(!timeCoveredInBetween){
                    //The ripple reached the last place
                    //Need to fix the hotel arrival time
                    console.log('Need to fix hotel arrival time');
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
        if(time1<time2)
        {
            return time1;
        }
        return time2;
    }

    function getMaximum(time1,time2)
    {
        if(time1>time2)
        {
            return time1;
        }
        return time2;
    }

    function clone(a) {
        return JSON.parse(JSON.stringify(a));
    }

    $scope.getItinerary();
});
