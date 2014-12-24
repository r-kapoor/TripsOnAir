
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
    }

  $scope.addDestination = function() {
      $scope.destinationCityList.push($scope.destinationCity);
      $scope.destinationCity = null;
      $scope.label="Enter another Destination";
      console.log("destinationCityList:"+$scope.destinationCityList);
  };

    $scope.originSelected = function() {
        if($scope.originCity!== null && typeof $scope.originCity === 'object') {
            $scope.originValid = true;
            console.log($scope.originCity);
            formData.setOrigin($scope.originCity);

            $timeout(function() {
                $("#originId").trigger('xyz');
            }, 0);
            //$scope.triggerOn='xyz';
            console.log('called');
        }
        else
        {
            console.log('called1');
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
        console.log($scope.originValid);
        return $scope.originValid;
    };
    $scope.destinationSelected = function() {
        if($scope.destinationCity!==null && $scope.destinationCity.length!=0 && typeof $scope.originCity === 'object') {
            console.log($scope.destinationCity);
            $scope.addDestination();
            formData.setDestinations($scope.destinationCityList);
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



