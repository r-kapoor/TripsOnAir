/**
 * Created by rkapoor on 15/12/14.
 */
inputModule.controller('KrishnaController', function($scope, $rootScope, $http, $q, formData, cityData) {
//	TODO:outer controller can't pic inner controllers scope variables-check
//	$scope.originCity = null;
//	$scope.destinationCity = null;
    $scope.isSuggestCollapsed = true;
    $rootScope.$on('suggest',function suggestDestinations(){
        $scope.isSuggestCollapsed = false;
        $scope.suggestSinglePlaces();
        //$scope.suggestMultiPlaces();
    });



    $scope.suggestSinglePlaces=function() {
        console.log("singlePlaces Called");
        var origin=formData.getOrigin();
        $scope.getLocation($scope.locationQueryString(origin),$scope.createQuery);


    };

    $scope.sendQuery=function(data)
    {
        console.log("sendQueryCalled");
        $http.get('/suggestDest',{params:data}).success(function(data,status){
                console.log("Success");
                callback(data,status);
            }
        )
            .error(
            function(data, status) {
                console.log(data || "Backend Request failed");
            });
    };
$scope.createQuery=function(data,status){
    console.log("in create query");
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


    var userInputData={
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
    userInputData.next = 0;
    $scope.sendQuery(userInputData);
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





});
