
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
            formData.setOriginGeoCoordinates({
                orgLat:$scope.originCity.Latitude,
                orgLong:$scope.originCity.Longitude
            });
            var orgElm=angular.element(document.querySelector("#originId"));
            if(orgElm.hasClass("has-error"))
            {
              orgElm.removeClass("has-error");
            }
            $rootScope.$emit('originSelected');
            /*$timeout(function() {
                $("#originId").trigger('xyz');
            }, 0);*/
            //$scope.triggerOn='xyz';
        }
        else
        {
           /* $timeout(function() {
                $("#originId").trigger('xyz');
            }, 0);*/
            //$scope.triggerOn = 'blur';
            console.log("has error");
            var orgElement=angular.element(document.querySelector("#originId"));
            orgElement.addClass("has-error");
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
      if(formData.getOrigin()!=null){
        console.log("origin not null");
        if($scope.destinationCity!==null && $scope.destinationCity.length!=0 && typeof $scope.destinationCity === 'object') {
            $scope.addDestination();
            formData.setDestinations($scope.destinationCityList);
            var destElm=angular.element(document.querySelector("#destinationId"));
            if(destElm.hasClass("has-error"))
            {
              destElm.removeClass("has-error");
            }
            $rootScope.$emit('destinationSelected');
            $scope.destinationValid = true;
        }
        else
        {
          var destElement=angular.element(document.querySelector("#destinationId"));
            destElement.addClass("has-error");
            $scope.destinationValid=false;
        }
      }
    };

  $scope.byMatch = function(viewValue) {
    return function(city) {
      if(city.CityName.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase()) {
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



