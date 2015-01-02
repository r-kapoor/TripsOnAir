
inputModule.config(function($tooltipProvider){
    $tooltipProvider.setTriggers({
        'xyz': 'abc'
    });
});

inputModule.controller('AddCityCtrl', function ($scope, $rootScope, $timeout, cityData, formData) {
  $scope.originCity = null;
  $scope.destinationCity = null;
  $scope.destinationCityList=[];
  $scope.label="Enter the Destination";
  
    $scope.originValid = true;
    $scope.destinationValid=false;
    $scope.triggerOn = 'xyz';
    $scope.getTriggerOn = function() {
        return $scope.triggerOn;
    };

  $scope.addDestination = function() {
      $scope.destinationCityList.push($scope.destinationCity);
      $scope.destinationCity = null;
      $scope.label="Enter another Destination";
      $rootScope.$emit('destinationAdded');
  };

    $scope.originSelected = function() {
        if($scope.originCity!== null && typeof $scope.originCity === 'object') {
            $scope.originValid = true;
            console.log($scope.originCity);
            formData.setOrigin($scope.originCity);
            $rootScope.$emit('originSelected');
            $timeout(function() {
                $("#originId").trigger('xyz');
            }, 0);
            //$scope.triggerOn='xyz';
        }
        else
        {
            $timeout(function() {
                $("#originId").trigger('xyz');
            }, 0);
            //$scope.triggerOn = 'blur';
            $scope.originValid = false;
        }
    };

    $scope.isDestinationValid = function(){
      return $scope.destinationValid;
    };

    $scope.isOriginValid = function(){
        return $scope.originValid;
    };
    $scope.destinationSelected = function() {
      console.log("in destinationSelected");
      console.log(typeof $scope.destinationCity);
        if($scope.destinationCity!==null && $scope.destinationCity.length!=0 && typeof $scope.destinationCity === 'object') {
            $scope.addDestination();
            formData.setDestinations($scope.destinationCityList);
            $rootScope.$emit('destinationSelected');
            $scope.destinationValid = true;
        }
        else
        {
            $scope.destinationValid=false;
        }
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



