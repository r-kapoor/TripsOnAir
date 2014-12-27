inputModule.controller('BhishmaController', function($scope, $rootScope, $http, $q, formData, cityData) {
    $scope.isCarouselCollapsed = true;
    $scope.suggestionsAccordingToSelection = [];
    $scope.myInterval = 5000;
    $scope.requestSemaphoreSuggestionsAccordingToSelection = false;
    $scope.suggestionsAccordingToSelectionCount = 0;
    $rootScope.$on('destinationSelected', function onDestinationSelected(){
        $scope.suggestionsAccordingToSelection = [];
        $scope.suggestionsAccordingToSelectionCount = 0;
        $scope.isCarouselCollapsed = true;
        $scope.createQuery();
    });

    $rootScope.$on('destinationRemoved', function onDestinationSelected(){
        $scope.suggestionsAccordingToSelection = [];
        $scope.suggestionsAccordingToSelectionCount = 0;
        $scope.isCarouselCollapsed = true;
        $scope.createQuery();
    });

    $scope.createQuery=function(){
        var originGeoCoordinates = formData.getOriginGeoCoordinates();
        var destinations=formData.getDestinations();
        //console.log("destFirst:"+JSON.stringify(destinations[0]));
        var tastes=formData.getTastes();

        $scope.userInputData={
            orgLat:originGeoCoordinates.orgLat,
            orgLong:originGeoCoordinates.orgLong,
            destinations:destinations,
            tastes:tastes,
            distRemaining:formData.getRemainingDistance()
        };
        $scope.sendQuery($scope.userInputData);
    };

    $scope.sendQuery=function(data)
    {
        if(!$scope.requestSemaphoreSuggestionsAccordingToSelection) {
            $scope.requestSemaphoreSuggestionsAccordingToSelection = true;
            var suggestionsAccordingToSelectionData = data;
            suggestionsAccordingToSelectionData.next = $scope.suggestionsAccordingToSelectionCount;
            $scope.suggestionsAccordingToSelectionCount += 4;
            $http.get('/suggestNearbyDest',{params:suggestionsAccordingToSelectionData}).success(function(data,status){
                    $scope.requestSemaphoreSuggestionsAccordingToSelection = false;
                    console.log("Success");
                    $scope.suggestedCitiesData(data,status);
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
            setTimeout(function(){ $scope.createQuery() }, 1000);
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
    }


});
