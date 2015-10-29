inputModule.controller('KuberController', ['$scope', '$rootScope', '$http', '$q', '$location', '$window', '$timeout', 'formData', 'cityData', function($scope, $rootScope, $http, $q, $location, $window, $timeout, formData, cityData) {
    $scope.isDetailsCollapsed = false;
    $scope.isOverviewCollapsed = false;
    $scope.isSuggestDestinationsOn = formData.getSuggestDestinationOn();
    $scope.destinationCityList = formData.getDestinations();
    $scope.helpLabel="Don't know where to go";

    $scope.tripStartTime = formData.getTripStartTime();

    $scope.tripEndTime = formData.getTripEndTime();

    $scope.$watch('tripStartTime', function startTimeSelected() {
        formData.setTripStartTime($scope.tripStartTime);
    }, true);
    $scope.$watch('tripEndTime', function endTimeSelected() {
        formData.setTripEndTime($scope.tripEndTime);
    }, true);


    $rootScope.$on('destinationAdded',function()
    {
        $scope.helpLabel="Don't know where else to go";
    });

    $scope.proceed = function checkAndShowOtherInputs() {
        console.log('PROCEED');
        var startTimeSet=(formData.getTripStartTime()!=null)&&(formData.getTripStartTime().morning == true || formData.getTripStartTime().evening == true);
        var endTimeSet=(formData.getTripEndTime()!=null)&&(formData.getTripEndTime().morning == true || formData.getTripEndTime().evening == true);
        var originSet=formData.getOrigin()!=null;
        var destinationSet=formData.getDestinations().length;
        var startDateSet = (formData.getStartDate() !== null);
        var endDateSet = (formData.getEndDate() !== null);
        console.log("isSuggestDestinationsOn:"+$scope.isSuggestDestinationsOn);
        formData.setSuggestDestinationOn($scope.isSuggestDestinationsOn);
        if( startDateSet && endDateSet && startTimeSet && endTimeSet && originSet && (destinationSet > 0 || $scope.isSuggestDestinationsOn)) {
            var url = $location.path('/setBudget');
            $scope.isOverviewCollapsed = true;
            $scope.setBudgetLimits();

            //MixPanel Tracking
            var destinations = formData.getDestinations();
            var trackObject = {
                "Origin": formData.getOrigin().CityName,
                "Destinations": destinationNames(destinations),
                "StartDate": formData.getStartDate().toISOString(),
                "EndDate": formData.getEndDate().toISOString(),
                "NumberOfDestinations": destinations.length,
                "DestinationGroups": appendNames(destinations),
                "suggestDestination":formData.getSuggestDestinationOn()
            };
            mixObjectsTag(formData.getTripStartTime(), trackObject, 'Start');
            mixObjectsTag(formData.getTripEndTime(), trackObject, 'End');
            console.log('trackObject:'+JSON.stringify(trackObject));
            //mixpanel.track('Cities Input', trackObject);
            mixPanelTrack('Cities Input', trackObject);
            $rootScope.$on('$viewContentLoaded', function() {
                $rootScope.$broadcast('formComplete');
                //MixPanel Timing
                //mixpanel.time_event('Budget Input');
                mixPanelTimeEvent('Budget Input');
            });
        }
        else
        {
            if(!originSet){
                //Origin not valid
                var orgElement=angular.element(document.querySelector("#originId"));
                orgElement.addClass("has-error");
            }
            if(!(destinationSet > 0 || $scope.isSuggestDestinationsOn)) {
                var destElement=angular.element(document.querySelector("#destinationId"));
                destElement.addClass("has-error");
            }
            if(!startDateSet){
                var startDateElement=angular.element(document.querySelector("#depart-date"));
                startDateElement.removeClass("btn-primary");
                startDateElement.addClass("btn-danger");
            }
            if(!endDateSet){
                var endDateElement=angular.element(document.querySelector("#arrival-date"));
                endDateElement.removeClass("btn-primary");
                endDateElement.addClass("btn-danger");
            }
            if(!startTimeSet){
                var startTimeElement = angular.element(document.querySelectorAll(".startTimeE"));
                startTimeElement.addClass("time-not-selected");
            }
            if(!endTimeSet){
                var endTimeElement = angular.element(document.querySelectorAll(".endTimeE"));
                endTimeElement.addClass("time-not-selected");
            }
        }
    };

    function destinationNames(destinations){
        var destinationNamesList = [];
        for(var i = 0; i < destinations.length; i++){
            destinationNamesList.push(destinations[i].CityName);
        }
        return destinationNamesList;
    }
    function appendNames(destinations){
        var appendedDestinations = "";
        for(var i = 0; i < destinations.length; i++){
            appendedDestinations += destinations[i].CityName;
            if(i != destinations.length - 1){
                appendedDestinations += '-';
            }
        }
        return appendedDestinations;
    }

    function cleanDetailsPanelData(){
        formData.resetBudget();
        formData.resetNumPersons();
        formData.resetTastes();
    }

    function mixObjectsTag(source, target, tag) {
        for(var key in source) {
            if (source.hasOwnProperty(key)) {
                target[tag+key] = source[key];
            }
        }
    }

    $scope.getLocation = function(queryString, deferred) {
        $http.get(queryString)
            .success(
            function onLocationFound(data, status) {
                deferred.resolve(data);
            })
            .error(
            function(data, status) {
                console.log(data || "Request failed");
                deferred.reject("Request Failed for:" + queryString);
            });
    };

    $scope.locationQueryString = function(city) {
        console.log('http://maps.googleapis.com/maps/api/geocode/json?address='+city+'&sensor=true&callback=JSON_CALLBACK');
        return 'http://maps.googleapis.com/maps/api/geocode/json?address='+city+'&sensor=true';
    };

    $scope.getDistance = function(originLat, originLong, destinationLat, destinationLong) {
        var R = 6371;
        var dLat = (destinationLat - originLat) * Math.PI / 180;
        var dLon = (destinationLong - originLong) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(originLat * Math.PI / 180) * Math.cos(destinationLat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        var d = R * c;
        return d;
    };

    $scope.getTravelFare = function (totalDistance, numOfDays) {
        var travelFare = 0;
        var avgSpeed = 60;//kmph
        //calculate average non-flight travel time round trip
        var nonFlightTime = (totalDistance / avgSpeed);
        var totalTime = 24 * numOfDays;
        //if avg non-flight travel time is 50% more than non-travel time then go with flight else train or bus or cab

        if ((nonFlightTime * 100) / totalTime >= 50) {
            //travel by flight
            if (totalDistance < 1500) {
                travelFare += 7000;
            }
            else if (totalDistance < 2000) {
                travelFare += 10000;
            }
            else if (totalDistance < 2500) {
                travelFare += 13000;
            }
            else if (totalDistance < 3000) {
                travelFare += 18000;
            }
            else {
                travelFare += 25000;
            }
        }
        else {
            if (totalDistance < 1500) {
                travelFare += 1000;//round trip min travelFare
            }
            else if (totalDistance < 2000) {
                travelFare += 3000;
            }
            else if (totalDistance < 2500) {
                travelFare += 4000;
            }
            else if (totalDistance < 3000) {
                travelFare += 5000;
            }
            else {
                travelFare += 8000;
            }
        }
        console.log('travelFare:'+travelFare);
        return travelFare;
    };

    $scope.getFareFromTier = function(tier) {
        switch(tier){
            case 1:
                return 1500;
            case 2:
                return 1000;
            case 3:
                return 750;
        }
    };

    $scope.getAccommodationFoodFare = function(cities, numOfDays) {
        var accommodationFoodFare = 0;
        var count=0;
        var numOfDaysInEachCity = Math.ceil(numOfDays / cities.length); //Equally dividing the days in each city

        angular.forEach(cities, function(city, indexCity) {
            if(city.tier != undefined) {
                accommodationFoodFare += numOfDaysInEachCity * $scope.getFareFromTier(city.tier);
                count++;
            }
        });
        while(count < cities.length) {
            //Assuming all rest cities are from tier 3
            accommodationFoodFare += $scope.getFareFromTier(3);
            count++;
        }
        console.log('accommodationFoodFare:'+accommodationFoodFare);
        return accommodationFoodFare;
    };

    $scope.getBudget = function(origin,destinations,totalDistance,numOfDays)
    {
        console.log(totalDistance,numOfDays);
        console.log(destinations[0]);
        var fare=0;

        //Add the Approximate Travel Fare
        fare += $scope.getTravelFare(totalDistance, numOfDays, fare);

        //Now calculate approx. accommodation and food fare according to the destination city
        fare += $scope.getAccommodationFoodFare(destinations, numOfDays);

        return fare;

    };

    $scope.setBudgetLimits = function() {
        console.log("in setBudgetLimits");
        console.log($scope.isSuggestDestinationsOn);
        console.log(formData.getDestinations().length);
        if((!$scope.isSuggestDestinationsOn)||(($scope.isSuggestDestinationsOn)&&(formData.getDestinations().length>0))) {
            console.log("in if");
            var origin = formData.getOrigin();
            var destinations = formData.getDestinations();
            var startDate = formData.getStartDate();
            var endDate = formData.getEndDate();
            console.log(startDate+","+endDate);
            if (origin != null && destinations.length != 0 && startDate != null && endDate != null) {
                console.log('3');
                var diff = Math.abs(endDate - startDate);
                var numOfDays = diff / (1000 * 60 * 60 * 24);
                var deferred = [];
                var promise = [];
                deferred[0] = $q.defer();
                promise[0] = deferred[0].promise;
                $scope.getLocation($scope.locationQueryString(origin.CityName), deferred[0]);

                angular.forEach(destinations, function (destination, index) {
                    deferred[index + 1] = $q.defer();
                    promise[index + 1] = deferred[index + 1].promise;
                    $scope.getLocation($scope.locationQueryString(destination.CityName), deferred[index + 1]);
                });

                $q.all(promise)
                    .then(
                    function onQuerySuccessful(results) {
                        var latitudes = [];
                        var longitudes = [];
                        var totalDistance = 0;
                        var destinationsData = formData.getDestinations();
                        angular.forEach(results, function (result, index) {
                            latitudes[index] = result.results[0].geometry.location.lat;
                            longitudes[index] = result.results[0].geometry.location.lng;
                            if (index > 0) {
                                destinationsData[index-1].Latitude = latitudes[index];
                                destinationsData[index-1].Longitude = longitudes[index];
                                totalDistance += parseInt($scope.getDistance(latitudes[index - 1], longitudes[index - 1], latitudes[index], longitudes[index]));
                            }
                            else
                            {
                                formData.setOriginGeoCoordinates({
                                    orgLat:latitudes[index],
                                    orgLong:longitudes[index]
                                });
                            }
                        });
                        formData.setDestinations(destinationsData);
                        console.log(latitudes, longitudes, latitudes.length, longitudes.length);
                        totalDistance += parseInt($scope.getDistance(latitudes[0], longitudes[0], latitudes[latitudes.length-1], longitudes[longitudes.length-1]));

                        var totalFare = $scope.getBudget(origin, destinations, totalDistance, numOfDays);

                        console.log('totalFare:'+totalFare);
                        //$scope.options.from=parseInt(totalFare);
                        //$scope.value1 = $scope.options.from;
                        formData.setMinimumBudget(parseInt(totalFare));
                        formData.setBudget(parseInt(totalFare));
                        //console.log('$scope.value1:'+$scope.value1);
                        //console.log('$scope.options.from:'+$scope.options.from);
                        $rootScope.$on('$viewContentLoaded', function() {
                            $rootScope.$emit('BudgetSet');
                            console.log('BUDGET SET EMITTED');
                        });
                        //$scope.sliderOptions.min = parseInt(totalFare);
                        //$scope.$render();
                        //console.log($scope.sliderOptions.min);
                        //$scope.sliders.sliderValue = $scope.sliderOptions.min;

                    },
                    function onQueryFailure(result) {
                        console.log('At least one request for location failed');
                    }
                );
            }
            else {
                console.log('Some Problem with the inputs. Opening the upper part to fix them');
                console.log(origin.CityName+','+destinations+','+startDate+','+endDate);
                $scope.isDetailsCollapsed = true;
                $scope.isOverviewCollapsed = false;
            }
        }
        else {
            console.log('Will suggest destinations');
        }
    };
}]);
