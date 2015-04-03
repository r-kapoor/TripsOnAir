itineraryModule.controller('shakuniController',  function($scope, $rootScope, $http) {

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
    var SPEED = 15;//km/hr
    var RATIO = 0.75;
    var MORNING_CHECK_IN_DURATION = 2;//hrs
    var CHECK_OUT_DURATION = 4;//hrs
    var REST_TIME = 8;//hrs

    var MINUTES_TO_MILLISECONDS = 60*1000;
    var HOURS_TO_MILLISECONDS = MINUTES_TO_MILLISECONDS*60;
    var DAYS_TO_MILLISECONDS = HOURS_TO_MILLISECONDS*24;

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
            dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(dateItinerary.dateWisePlaceData.startSightSeeingTime);
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
                    if(place.placeArrivalTime.getTime()-dateItinerary.dateWisePlaceData.startSightSeeingTime.getTime() < time){
                        console.log("violating constraint");
                        //Violating Travel Duration Constraint
                        place.placeArrivalTime = new Date(dateItinerary.dateWisePlaceData.startSightSeeingTime.getTime() + time);
                    }
                }
                else {
                    var lastPlace = dateItinerary.dateWisePlaceData.placesData[dateItinerary.permutation[placeIndex - 1]];
                    distance = getDistance(lastPlace.Latitude, lastPlace.Longitude, place.Latitude, place.Longitude);
                    time = distance/SPEED;
                    if(place.placeArrivalTime.getTime() -lastPlace.placeDepartureTime.getTime() < time) {
                        //Violating Travel Duration Constraint
                        place.placeArrivalTime = new Date(lastPlace.placeDepartureTime.getTime() + time);
                    }
                }
                if(place.placeDepartureTime.getTime() - place.placeArrivalTime.getTime() < RATIO*place.Time2Cover*MINUTES_TO_MILLISECONDS) {
                    //Violating Place Duration Constraint
                    place.placeDepartureTime = new Date(place.placeArrivalTime.getTime() + RATIO*place.Time2Cover*MINUTES_TO_MILLISECONDS);
                }
                console.log("place.placeDepartureTime:"+place.placeDepartureTime+","+JSON.stringify(place.PlaceTimings));
                if(placeIsClosedAtTime(place.placeDepartureTime, place.PlaceTimings)) {
                    //Alert User
                    alert('Place Closed:'+JSON.stringify(place));
                    break outer;
                }
                if(placeIndex == dateItinerary.permutation.length - 1){
                    //This is the last place of day
                    distance = getDistance(hotel.Latitude, hotel.Longitude, place.Latitude, place.Longitude);
                    time = distance/SPEED;
                    if(dateItinerary.dateWisePlaceData.endSightSeeingTime.getTime() - place.placeDepartureTime.getTime() < time){
                        //Violating Travel Duration Constraint
                        dateItinerary.dateWisePlaceData.endSightSeeingTime = new Date(place.placeDepartureTime.getTime() + time);
                    }
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


    function getTimeOfDayInMinutesFromDate(date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    function getTimeOfDayInMinutesFromString(timeString) {
        var timeStringArray = timeString.split(':');
        return ( parseInt(timeStringArray[0]) * 60 ) + parseInt(timeStringArray[1]);
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
