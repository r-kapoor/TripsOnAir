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
        numberOfDaysInHotel += (checkOutTimeClone.getTime() - checkInTimeClone.getTime()) / (24*60*60000);
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
        var time = (distance*60)/SPEED;
        var arrivalTime = new Date($scope.currentDestination.arrivalTime);
        var hotelCheckInTime = new Date(arrivalTime.getTime()+time*60*1000);
        var departureTime = new Date($scope.currentDestination.departureTime);
        distance=getDistance($scope.currentDestination.LocationOfDeparture.Latitude,$scope.currentDestination.LocationOfDeparture.Longitude,
            hotel.Latitude,hotel.Longitude);
        time = (distance*60)/SPEED;
        var hotelCheckOutTime = new Date(departureTime.getTime()-time*60*1000);
        hotel.checkInTime = hotelCheckInTime;
        hotel.checkOutTime = hotelCheckOutTime;

    };

    $scope.getHotelEntryTime = function(dateWisePlaceData){
        if(dateWisePlaceData.typeOfDay == 0){
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
