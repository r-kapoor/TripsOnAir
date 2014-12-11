inputModule.controller('AddCityCtrl', function ($scope, $rootScope, cityData, formData) {
  $scope.originCity = null;
  $scope.destinationCity = null;
  $scope.destinationCityList=[];
  $scope.label="Enter the Destination";

  $scope.addDestination = function() {
   $scope.destinationCityList.push($scope.destinationCity); 
  $scope.destinationCity = null;
  $scope.label="Enter another Destination";
   console.log("destinationCityList:"+$scope.destinationCityList);  
  };

  $scope.byMatch = function(viewValue) {
    return function(city) {
      if(city.name.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase()) {
        return -10+city.tier;
      }
      return city.tier;
    }
  };

  $rootScope.$on('formComplete', function setCities(event, data) {
    formData.setOrigin($scope.originCity);
    formData.setDestinations($scope.destinationCityList);
  });

  $scope.hello = function() {
    console.log("Called");
  }
$scope.cities=cityData.getProperty();
});