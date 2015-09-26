/**
 * Created by rkapoor on 28/03/15.
 */

adminModule.controller('placesController',  function($scope, $rootScope, $routeParams, $http, $location) {

    $scope.alerts = [];
    $scope.place = null;

    $scope.enableTimingAddition = false;
    $scope.enableReload = true;
    $scope.enableNext = true;
    $scope.submitText = 'Submit the changes';

    $scope.getPlaceDetails = function(){

       var placeID = $routeParams.placeId;

        $http.get('/addorchangeplace/places?id='+placeID).success(function(data,status){
            console.log("Place response:"+JSON.stringify(data));
            $scope.alerts.push({ type: 'success', msg: 'Success' });
            $scope.place = data;

        })
            .error(
            function(data, status) {
                console.log(data || "Backend Request failed");
                $scope.alerts.push({ type: 'danger', msg: 'Failed to fetch data' });
            });
    };
    $scope.getPlaceDetails();

    $scope.submit = function() {
        console.log(JSON.stringify($scope.place));
        $http.post('/addorchangeplace/places',{
            placeDetails: $scope.place
        }).success(function(data,status){
            console.log("Place response:"+JSON.stringify(data));
            if(data.Status == "SUCCESS"){
                $scope.alerts.push({ type: 'success', msg: 'Success' });
                $scope.place = null;
            }
            else {
                $scope.alerts.push({ type: 'danger', msg: 'Failed' });
            }
        })
        .error(
        function(data, status) {
            $scope.alerts.push({ type: 'danger', msg: 'Failed' });
            console.log(data || "Backend Request failed");
        });
    };

    $scope.nextPlace = function(){
        var nextPlaceID = parseInt($routeParams.placeId)+1;
        $location.path( '/place/'+ nextPlaceID);
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

});

adminModule.controller('crawlPlacesController',  function($scope, $rootScope, $routeParams, $http, $location) {

    $scope.alerts = [];
    $scope.place = null;
    $scope.enableTimingAddition = true;
    $scope.enableReload = true;
    $scope.enableNext = true;
    $scope.submitText = 'Submit the changes';

    $scope.getPlaceDetails = function(){

        var placeID = $routeParams.placeId;

        $http.get('/addorchangeplace/crawledPlaces?id='+placeID).success(function(data,status){
            console.log("Place response:"+JSON.stringify(data));
            data.PlaceImages = [{}];
            data.PlaceDates = [{}];
            $scope.place = data;
            $scope.alerts = [{ type: 'success', msg: 'Success' }];
        })
            .error(
            function(data, status) {
                console.log(data || "Backend Request failed");
                $scope.alerts = [{ type: 'danger', msg: 'Failed to fetch data' }];
            });
        $scope.alerts = [{type: 'success', msg:' Fetching Data...'}];
    };
    $scope.getPlaceDetails();

    $scope.submit = function() {
        console.log(JSON.stringify($scope.place));
        $scope.alerts = [{type: 'success', msg:'Submitting Data...'}];
        if($scope.place.PlaceImages[0].ImageURL == null){
            //No Image added
            $scope.place.PlaceImages = [];
        }
        if($scope.place.PlaceDates[0].PlaceStartDate == null){
            //No Dates added
            $scope.place.PlaceDates = [];
        }

            $http.post('/addorchangeplace/newPlace',{
            placeDetails: $scope.place
        }).success(function(data,status){
            console.log("Place response:"+JSON.stringify(data));
            if(data.Status == "SUCCESS"){
                $scope.alerts = [{ type: 'success', msg: 'Success with place id:'+data.placeID }];
                $scope.place = null;
            }
            else {
                $scope.alerts = [{ type: 'danger', msg: 'Failed' }];
            }
        })
            .error(
            function(data, status) {
                $scope.alerts = [{ type: 'danger', msg: 'Failed' }];
                console.log(data || "Backend Request failed");
            });
    };

    $scope.nextPlace = function(){
        var nextPlaceID = parseInt($routeParams.placeId)+1;
        $location.path( '/insertCrawledPlace/'+ nextPlaceID);
        $scope.alerts = [];
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.addTimings = function () {
        $scope.place.PlaceTimings.push({});
    };

    $scope.removeTimings = function(){
        if($scope.place.PlaceTimings.length > 1){
            $scope.place.PlaceTimings.splice($scope.place.PlaceTimings.length-1,1);
        }
    };

});

adminModule.controller('newPlaceController', function($scope, $http){
    console.log('Loads newPlace');
    $scope.alerts = [];
    $scope.place = {};
    $scope.place.PlaceTimings = [{}];
    $scope.enableTimingAddition = true;
    $scope.enableReload = false;
    $scope.enableNext = false;
    $scope.submitText = 'Submit the New Place';

    $scope.loadEmptyPlace = function(){
        $http.get('/addorchangeplace/newPlace')
            .success(function(data, status){
                $scope.place = data;
                $scope.place.PlaceTimings = [{}];
            })
            .error(function(data, status){
                console.log('Backend Request Failed');
            })
    };

    $scope.loadEmptyPlace();

    $scope.submit = function() {
        console.log(JSON.stringify($scope.place));
        $http.post('/addorchangeplace/newPlace',{
            placeDetails: $scope.place
        }).success(function(data,status){
            console.log("Place response:"+JSON.stringify(data));
            if(data.Status == "SUCCESS"){
                $scope.alerts.push({ type: 'success', msg: 'Success' });
                $scope.loadEmptyPlace();
            }
            else {
                $scope.alerts.push({ type: 'danger', msg: 'Failed' });
            }
        })
            .error(
            function(data, status) {
                $scope.alerts.push({ type: 'danger', msg: 'Failed' });
                console.log(data || "Backend Request failed");
            });
    };

    $scope.addTimings = function () {
        $scope.place.PlaceTimings.push({});
    };

    $scope.removeTimings = function(){
        if($scope.place.PlaceTimings.length > 1){
            $scope.place.PlaceTimings.splice($scope.place.PlaceTimings.length-1,1);
        }
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
});

adminModule.controller('placesOfCityController',  function($scope, $rootScope, $http, $location) {

    console.log('Loads PlacesOfCity');
});

adminModule.controller('adminController',  function($scope, $rootScope, $http, $location) {

    console.log('Loads Admin');
});
