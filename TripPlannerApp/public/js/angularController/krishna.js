/**
 * Created by rkapoor on 15/12/14.
 */

inputModule.controller('KrishnaController', function($scope, $rootScope, $http, $q, formData, cityData) {
//	TODO:outer controller can't pic inner controllers scope variables-check
//	$scope.originCity = null;
//	$scope.destinationCity = null;
    $scope.destinations=[];
    $scope.isSuggestCollapsed = true;
    $scope.formSubmitted = false;
    $rootScope.$on('suggest',function suggestDestinations(){
        $scope.formSubmitted = true;
        $scope.isSuggestCollapsed = false;
        $scope.suggestAllDestinations();
    });
    $scope.requestSemaphoreSingleCities = false;
    $scope.requestSemaphoreMultiCities = false;
    $scope.suggestDestCount = 0;
    $scope.suggestGroupsCount = 0;
    $scope.singleCityCount = 0;
    $scope.orgLat=0;
    $scope.orgLong=0;
    $scope.range=0;
    $scope.originToLastSelectedCityDistance;

    $scope.userInputData=null;

    $scope.getClassCol = function(index) {
        //console.log(index);
        //console.log(index/3);
        if($scope.destinations[index].GroupID === undefined) {
            if($scope.destinations[index].CityCount%5 == 0 || $scope.destinations[index].CityCount%5 == 1) {
                //console.log('col-md-4');
                return 'col-md-6';
            }
            //console.log('col-md-3');
            return 'col-md-4';
        }
        return 'col-md-6';
    };

    $rootScope.$on('scrolled', function() {
        if($scope.formSubmitted && (!$scope.requestSemaphoreSingleCities || !$scope.requestSemaphoreMultiCities)) {
            $scope.loadMore();
        }
    });

    $scope.loadMore = function() {
        if($scope.userInputData != null) {
            $scope.sendQuery($scope.userInputData);
        }
    };


    $scope.suggestAllDestinations=function() {
        var origin=formData.getOrigin();
        $scope.getLocation($scope.locationQueryString(origin),$scope.createQuery);


    };

    $scope.sendQuery=function(data)
    {
        if(!$scope.requestSemaphoreSingleCities) {
            $scope.requestSemaphoreSingleCities = true;
            var suggestDestData = data;
            suggestDestData.next = $scope.suggestDestCount;
            $scope.suggestDestCount += 5;
            $http.get('/suggestDest',{params:suggestDestData}).success(function(data,status){
                    $scope.requestSemaphoreSingleCities = false;
                    console.log("Success");
                    $scope.singleCitiesData(data,status);
                }
            )
                .error(
                function(data, status) {
                    console.log(data || "Backend Request failed");
                });
        }
        if(!$scope.requestSemaphoreMultiCities) {
            $scope.requestSemaphoreMultiCities = true;
            var suggestGroupsData = JSON.parse(JSON.stringify(data));
            suggestGroupsData.next = $scope.suggestGroupsCount;
            $scope.suggestGroupsCount += 4;
            $http.get('/suggestGroups',{params:suggestGroupsData}).success(function(data,status){
                    $scope.requestSemaphoreMultiCities = false;
                    console.log("Success");
                    $scope.multiCitiesData(data,status);
                }
            )
                .error(
                function(data, status) {
                    console.log(data || "Backend Request failed");
                });
        }
    };
    $scope.singleCitiesData=function(data,status){
        //store origin latitude and longitude
        $scope.orgLat=data.orgLat;
        $scope.orgLong=data.orgLong;
        $scope.range=data.range;

        angular.forEach(data.CityList, function(city, index) {
            city.CityCount = $scope.singleCityCount;
            $scope.singleCityCount += 1;
        });
        $scope.destinations = $scope.destinations.concat(data.CityList);
        $scope.markSelectedDestinations();
        $scope.markOutOfBudgetDestinations();
        //Stop making any further calls
        if(data.CityList.length < 5) {
            $scope.requestSemaphoreSingleCities = true;
        }
    };

    $scope.multiCitiesData=function(multiCitydata,status){
        var groupIDs=[];
        var groupsList=[];

        $scope.orgLat=multiCitydata.orgLat;
        $scope.orgLong=multiCitydata.orgLong;
        $scope.range=multiCitydata.range;

        //console.log("grouplist:"+JSON.stringify(multiCitydata));
        angular.forEach(multiCitydata.GroupList, function(data, index) {
            if(groupIDs.indexOf(data.GroupID) == -1){
                groupIDs.push(data.GroupID);
                data.CityDataFromGroup = [];
                data.CityDataFromGroup.push({
                    name:data.CityName,
                    CityID:data.CityID,
                    Latitude:data.Latitude,
                    Longitude:data.Longitude,
                    CityRating:data.Rating,
                    CityImage:data.Image
                });
                delete data.CityName;
                delete data.CityID;
                delete data.Latitude;
                delete data.Longitude;
                delete data.Rating;
                groupsList.push(data);
            }
            else {
                groupsList[groupIDs.indexOf(data.GroupID)].CityDataFromGroup.push({
                    name:data.CityName,
                    CityID:data.CityID,
                    Latitude:data.Latitude,
                    Longitude:data.Longitude,
                    CityRating:data.Rating,
                    CityImage:data.Image
                });
            }
        });
        $scope.destinations = $scope.destinations.concat(groupsList);
        $scope.markSelectedDestinations();
        $scope.markOutOfBudgetDestinations();
        //Stop making any further calls
        if(groupsList.length < 4) {
            $scope.requestSemaphoreMultiCities = true;
        }
    };

        $scope.createQuery=function(data,status){
    var origin=formData.getOrigin();
    var destinations=formData.getDestinations();
    var startDate=formData.getStartDate();
    var endDate=formData.getEndDate();
    //console.log(startDate+":"+endDate);
    var startTime=formData.getTripStartTime();
    var endTime=formData.getTripStartTime();
    //console.log("stTime:"+JSON.stringify(startTime));
    var budget=formData.getBudget();
    var tastes=formData.getTastes();
    //console.log(JSON.stringify(data));
    var orgLat=data.results[0].geometry.location.lat;
    var orgLong=data.results[0].geometry.location.lng;


    $scope.userInputData={
        origin:origin,
        destinations:destinations,
        startDate:startDate,
        endDate:endDate,
        startTime:startTime,
        endTime:endTime,
        budget:budget,
        tastes:tastes,
        orgLat:orgLat,
        orgLong:orgLong
    };
    $scope.sendQuery($scope.userInputData);
    //var query="orgLat="+orgLat+"&"+"orgLong="+orgLong+"&"+"stDate="+startDate+"&endDate="+endDate+"&stTime="+startTime+"&endTime="+endTime+"&taste="+tastesArray+"&budget="+budget;
    //console.log(query);
};
    $scope.getLocation = function(queryString,callback) {
        $http.get(queryString)
            .success(
            function(data,status){
                console.log("Success");
                callback(data,status);
            }
            )
            .error(
            function(data, status) {
                console.log(data || "Request failed");
            });
    };

    $scope.locationQueryString = function(city) {
        return 'http://maps.googleapis.com/maps/api/geocode/json?address='+city.name+'&sensor=true';
    };


    $scope.destinationSelected = function(index){
        var destination = $scope.destinations[index];
        console.log("Destination selected:"+JSON.stringify(destination));
        if(destination.GroupID === undefined){
            formData.appendDestination(destination);
        }
        else {
            formData.concatDestinations(destination.CityDataFromGroup);
        }
        $scope.markSelectedDestinations();
        $scope.markOutOfBudgetDestinations();
        formData.setOriginGeoCoordinates({
            orgLat:$scope.orgLat,
            orgLong:$scope.orgLong
        });
        formData.setRemainingDistance($scope.range - $scope.originToLastSelectedCityDistance);
        $rootScope.$emit('destinationSelected');
        //$rootScope.$emit('reint-pane');
    };

    $rootScope.$on('destinationRemoved', function onDestinationRemoved() {
        $scope.markSelectedDestinations();
        $scope.markOutOfBudgetDestinations();
    });

    $rootScope.$on('destinationSelectedFromCarousel', function onDestinationSelectedFromCarousel() {
        console.log("carousel selection:");
        $scope.markSelectedDestinations();
        $scope.markOutOfBudgetDestinations();
        $rootScope.$broadcast('reinit-pane',"destinationsPanel");
    });

    /**
     * Following code will handle the budget of user according to selected destinations
     * It will warn user if suggested destination is out of user budget
     *
     *
     */

    $scope.markSelectedDestinations = function() {
        var selectedDestinations = formData.getDestinations();
        angular.forEach($scope.destinations, function(suggestedDestination, index) {
            if(isGroup(suggestedDestination)) {
                var isSelected = true;
                for(var i = 0; i < suggestedDestination.CityDataFromGroup.length; i++) {
                    var isPresent = false;
                    for(var j = 0; j < selectedDestinations.length; j++) {
                        if(suggestedDestination.CityDataFromGroup[i].name.toLowerCase() === selectedDestinations[j].name.toLowerCase()) {
                            isPresent = true;
                        }
                    }
                    if(!isPresent) {
                        //This destination is not selected
                        isSelected = false;
                        break;
                    }

                }
                //console.log("markFunc:"+JSON.stringify(suggestedDestination)+":"+isSelected);
                if(isSelected) {
                    suggestedDestination.selected = 'selected';
                    suggestedDestination.disabled = 'disabled';
                }
                else {
                    suggestedDestination.selected = null;
                    suggestedDestination.disabled = null;
                }
            }
            else {
                var isSelected = false;
                for(var  i = 0; i < selectedDestinations.length; i++) {
                    //console.log("selectedDestinations:"+JSON.stringify(selectedDestinations));
                    //console.log(i+": Suggested:"+JSON.stringify(suggestedDestination));
                    if(selectedDestinations[i].name.toLowerCase() === suggestedDestination.name.toLowerCase()) {
                        isSelected = true;
                    }
                }
                if(isSelected) {
                    suggestedDestination.selected = 'selected';
                    suggestedDestination.disabled = 'disabled';
                }
                else {
                    suggestedDestination.selected = null;
                    suggestedDestination.disabled = null;
                }
            }
        })
    };

    function isGroup(destination) {
        if(destination.GroupID !== undefined) {
            return true;
        }
        return false;
    };

    $scope.getSelectedDataClass=function(destination)
    {
        //console.log("inSelectedDataClass:"+destination);
        return destination.selected;
    };

    $scope.getSelectedDataDisabled=function(destination)
    {
        //console.log("inSelectedDataClass:"+destination);
        return destination.disabled;
    };

    $scope.getOutOfBudgetClass=function(destination) {
        if(destination.selected !== 'selected') {
            return destination.outOfBudget;
        }
        return null;
    };

    $scope.markOutOfBudgetDestinations = function() {
        var selectedDestinations = formData.getDestinations();
        $scope.originToLastSelectedCityDistance = $scope.getDistanceBySequence($scope.orgLat, $scope.orgLong, selectedDestinations);
        if(selectedDestinations.length > 0) {
            var endLat = selectedDestinations[selectedDestinations.length - 1].Latitude;
            var endLong = selectedDestinations[selectedDestinations.length - 1].Longitude;
        }
        angular.forEach($scope.destinations, function(suggestedDestination, index) {
            if(isGroup(suggestedDestination)) {
                var totalEstimatedDistance = parseInt($scope.originToLastSelectedCityDistance +
                parseInt($scope.getDistanceBySequence(endLat, endLong, suggestedDestination.CityDataFromGroup) )+
                        parseInt(calcDist(
                            suggestedDestination.CityDataFromGroup[suggestedDestination.CityDataFromGroup.length - 1].Latitude,
                            suggestedDestination.CityDataFromGroup[suggestedDestination.CityDataFromGroup.length - 1].Longitude,
                            $scope.orgLat, $scope.orgLong
                        )));
                console.log(suggestedDestination.name+":1totalEstimatedDistance > $scope.range:"+totalEstimatedDistance +">"+ $scope.range);
                if(totalEstimatedDistance > $scope.range) {
                    console.log("red");
                    suggestedDestination.outOfBudget = 'out-of-budget';
                }
                else {
                    console.log("not red");
                    suggestedDestination.outOfBudget = null;
                }
            }
            else {
                var totalEstimatedDistance = parseInt($scope.originToLastSelectedCityDistance + parseInt(calcDist(endLat, endLong, suggestedDestination.Latitude, suggestedDestination.Longitude)) +
                parseInt(calcDist(suggestedDestination.Latitude, suggestedDestination.Longitude, $scope.orgLat, $scope.orgLong)));
                console.log(suggestedDestination.name+":2totalEstimatedDistance > $scope.range:"+totalEstimatedDistance +">"+ $scope.range);
                if(totalEstimatedDistance > $scope.range) {
                    suggestedDestination.outOfBudget = 'out-of-budget';
                }
                else {
                    suggestedDestination.outOfBudget = null;
                }
            }
        })
    };

    $scope.getDistanceBySequence = function(startLat, startLong, selectedDestinations){


        var sequentialCityDistance = 0;

        for(var i = 0; i < selectedDestinations.length; i++) {
            var endLat = selectedDestinations[i].Latitude;
            var endLong = selectedDestinations[i].Longitude;
            sequentialCityDistance += parseInt(calcDist(startLat, startLong, endLat, endLong));
            startLat = endLat;
            startLong = endLong;
        }

        return sequentialCityDistance;
    };

    function calcDist(orgLat,orgLong,destLat,destLong)
    {
        //console.log("in calcDist:"+(parseInt( 6371 * Math.acos( Math.cos( toRad(orgLat) ) * Math.cos( toRad( destLat ) ) * Math.cos( toRad( destLong ) - toRad(orgLong) ) + Math.sin( toRad(orgLat) ) * Math.sin( toRad( destLat ) ) ) )));
        //console.log(orgLat+","+orgLong+","+destLat+","+destLong);
        return (parseInt( 6371 * Math.acos( Math.cos( toRad(orgLat) ) * Math.cos( toRad( destLat ) ) * Math.cos( toRad( destLong ) - toRad(orgLong) ) + Math.sin( toRad(orgLat) ) * Math.sin( toRad( destLat ) ) ) ));
    }

    function toRad(Value) {
        /** Converts numeric degrees to radians */
        return Value * Math.PI / 180;
    }




});
