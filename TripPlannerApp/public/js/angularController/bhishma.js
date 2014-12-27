inputModule.controller('BhishmaController', function($scope, $rootScope, $http, $q, formData, cityData) {
    $scope.isCarouselCollapsed = true;
    $scope.suggestionsAccordingToSelection = [];
    $scope.myInterval = 5000;
    $scope.requestSemaphoreSuggestionsAccordingToSelection = false;
    $scope.suggestionsAccordingToSelectionCount = 0;
    $scope.currentRequestSerialNumber = 0;//Signifies the request number for nearby destination. A newer request will have a higher number
    $rootScope.$on('destinationSelected', onDestinationSelectedOrRemoved);

    $rootScope.$on('destinationRemoved', onDestinationSelectedOrRemoved);

    function onDestinationSelectedOrRemoved(){
        $scope.currentRequestSerialNumber += 1;
        $scope.requestSemaphoreSuggestionsAccordingToSelection = false;
        $scope.suggestionsAccordingToSelection = [];
        $scope.suggestionsAccordingToSelectionCount = 0;
        $scope.isCarouselCollapsed = true;
        $scope.createQuery();
    }

    $scope.createQuery=function(){
        var originGeoCoordinates = formData.getOriginGeoCoordinates();
        var destinations=formData.getDestinations();
        //console.log("destFirst:"+JSON.stringify(destinations[0]));
        var tastes=formData.getTastes();
        if(destinations.length > 0) {
            $scope.userInputData={
                orgLat:originGeoCoordinates.orgLat,
                orgLong:originGeoCoordinates.orgLong,
                destinations:destinations,
                tastes:tastes,
                distRemaining:formData.getRemainingDistance(),
                requestId:$scope.currentRequestSerialNumber
            };
            $scope.sendQuery($scope.userInputData);
        }
    };

    $scope.sendQuery=function(data)
    {
        if(!$scope.requestSemaphoreSuggestionsAccordingToSelection) {
            $scope.requestSemaphoreSuggestionsAccordingToSelection = true;
            var suggestionsAccordingToSelectionData = data;
            suggestionsAccordingToSelectionData.next = $scope.suggestionsAccordingToSelectionCount;
            $scope.suggestionsAccordingToSelectionCount += 4;
            $http.get('/suggestNearbyDest',{params:suggestionsAccordingToSelectionData}).success(function(data,status){
                    console.log("Success");
                    if(data.requestId == $scope.currentRequestSerialNumber) {
                        console.log('request id matched:'+data.requestId);
                        $scope.requestSemaphoreSuggestionsAccordingToSelection = false;
                        $scope.suggestedCitiesData(data,status);
                    }
                    else {
                        console.log('request id did not match data:'+data.requestId+',scope:'+$scope.currentRequestSerialNumber);
                    }
                }
            )
                .error(
                function(data, status) {
                    console.log(data || "Backend Request failed");
                });
        }
    };

    $scope.suggestedCitiesData=function(data,status){
        if(data.NearbyCityList.length != 0) {
            var suggestionSet = {suggestionArray : data.NearbyCityList};
            $scope.suggestionsAccordingToSelection.push(suggestionSet);
            $scope.isCarouselCollapsed = false;
            if(data.NearbyCityList.length == 4) {
                setTimeout(function () {
                    $scope.createQuery()
                }, 1000);
            }
        }
        //Stop making any further calls
        if(data.NearbyCityList.length < 4) {
            $scope.requestSemaphoreSingleCities = true;
        }
    };

    $scope.destinationSelected = function(destination) {
        console.log("Destination selected:"+JSON.stringify(destination));
        formData.appendDestination(destination);
        $rootScope.$emit('destinationSelectedFromCarousel');
        onDestinationSelectedOrRemoved();
    }


});
