/**
 * Created by rkapoor on 28/03/15.
 */

adminModule.controller('placesController',  function($scope, $rootScope, $routeParams, $http, $location) {

    $scope.alerts = [];
    $scope.place = null;

    $scope.getPlaceDetails = function(){

       var placeID = $routeParams.placeId;

        $http.get('/admin/places?id='+placeID).success(function(data,status){
            console.log("Place response:"+JSON.stringify(data));
            $scope.place = data;

        })
            .error(
            function(data, status) {
                console.log(data || "Backend Request failed");
            });
    };
    $scope.getPlaceDetails();

    $scope.submit = function() {
        console.log(JSON.stringify($scope.place));
        $http.post('/admin/places',{
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

adminModule.controller('placesOfCityController',  function($scope, $rootScope, $http, $location) {

    console.log('Loads PlacesOfCity');
});

adminModule.controller('adminController',  function($scope, $rootScope, $http, $location) {

    console.log('Loads Admin');
});
