inputModule.controller('KuberController', function($scope, $rootScope, $http, formData) {
//	TODO:outer controller can't pic inner controllers scope variables-check
//	$scope.originCity = null;
//	$scope.destinationCity = null;
	$scope.isDetailsCollapsed = true;
	$scope.isOverviewCollapsed = false;
	$scope.suggestDestinations = false;

	$rootScope.$on('formComplete', function collapseEvents(event, data) {
    	$scope.isDetailsCollapsed = false;
		$scope.isOverviewCollapsed = true;
		$scope.setBudgetLimits();
  	});

  	$scope.search = function(queryString, successCallback) {        
            $http({method: 'JSONP', url: queryString})
            .success(successCallback)
            .error(function(data, status) {
                console.log(data || "Request failed");
            });     
     };

     $scope.locationQueryString = function(city) {
     	return 'http://maps.googleapis.com/maps/api/geocode/json?address='+city+'&sensor=true';
     }

	$scope.setBudgetLimits = function() {
		/*if(!$scope.suggestDestinations) {
			var origin=formData.getOrigin();
			var destinations = formData.getDestinations();
			var startDate=formData.getStartDate();
			var endDate=formData.getEndDate
			if(origin != null && destinations.length != 0 && startDate != null && endDate != null) {
				var originLocationQuery = $scope.locationQueryString(origin); 
				var diff = Math.abs(endDate-startDate);
				var numofDays=diff/(1000*60*60*24);
				$scope.locationQueryString(originLocationQuery, function onOriginLocationFound(data, status) {

				})
				var destLocations=[];var city=[];
				var arg=[];
				arg[0]=$.getJSON(originLocation);
			}
			else {
				$scope.isDetailsCollapsed = true;
				$scope.isOverviewCollapsed = false;
			}*/







		//}
		

	};

	$scope.checkModel = {
		adventure: false,
		wild: false,
    	culture: false,
    	religious: false,
    	romantic: false
  	};
	
		$scope.sliders = {};
		$scope.sliders.sliderValue = 50;

		$scope.sliderOptions = {
			min: 0,
			max: 100,
			step: 1,
		};
        
        $scope.sliders.thirdSliderValue = 0;

        $scope.myFormater = function(value) {
            return value;
        };

});
