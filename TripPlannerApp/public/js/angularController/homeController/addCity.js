
inputModule.config(['$tooltipProvider', function($tooltipProvider){
    $tooltipProvider.setTriggers({
        'xyz': 'abc'
    });
}]);

inputModule.filter('filterByOrigin',function()
{
    return function (items,origin) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.CityID!=origin.CityID) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});

inputModule.filter('filterDestinations', function() {
   return function (items){
       var filtered = [];
       for(var i = 0; i < items.length; i++){
           var item = items[i];
           if(item.IsDestination == 1){
               filtered.push(item);
           }
       }
       return filtered;
   };

});

inputModule.filter('filterByCityAndState', function(){
    return function (items, viewValue){
        var filtered = [];
        for (var i = 0; i < items.length; i++){
            var item = items[i];
            if(item.AlternateName.toUpperCase().indexOf(viewValue.toUpperCase()) != -1 || item.State.toUpperCase().indexOf(viewValue.toUpperCase()) != -1){
                filtered.push(item);
            }
        }
        return filtered;
    };
});

inputModule.controller('AddCityCtrl', ['$scope', '$rootScope', '$timeout', 'cityData', 'formData', function ($scope, $rootScope, $timeout, cityData, formData) {
  $scope.originCity = formData.getOrigin();
  $scope.destinationCity = null;
  $scope.destinationCityList=formData.getDestinations();

    console.log('DESTINATIONS IN LIST:'+JSON.stringify($scope.destinationCityList));
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
        }
        //else
        //{
        //    console.log("has error");
        //    var orgElement=angular.element(document.querySelector("#originId"));
        //    orgElement.addClass("has-error");
        //    $scope.originValid = false;
        //}
    };

    $scope.destinationRemoved = function(removedDestination) {
        angular.forEach($scope.destinationCityList, function(destination, index) {
            console.log(destination.CityName + " " + removedDestination.CityName);
            if(destination.CityName.toLowerCase() === removedDestination.CityName.toLowerCase()) {
                $scope.destinationCityList.splice(index, 1);
                formData.setDestinations($scope.destinationCityList);
            }
        });
        if(formData.getDestinations().length==0)
        {
            $scope.destinationLabel=true;
        }
        $rootScope.$emit('destinationRemoved');
        $scope.$emit('initialize-pane',"destinationsPanel");
        //$scope.$broadcast('reinit-pane',"destinationsPanel");
    };

    //$scope.isDestinationValid = function(){
    //  return $scope.destinationValid;
    //};

    //$scope.isOriginValid = function(){
    //    return $scope.originValid;
    //};

    $scope.destinationSelected = function() {
      //console.log("in destinationSelected");
      //console.log(typeof $scope.destinationCity);
      if(formData.getOrigin()!=null){
        //console.log("origin not null");
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
        //else
        //{
        //  var destElement=angular.element(document.querySelector("#destinationId"));
        //    destElement.addClass("has-error");
        //    $scope.destinationValid=false;
        //}
      }
    };

  $scope.byMatch = function(viewValue) {
    return function(city) {
      if(city.CityName.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase()) {
        return -10+city.tier;
      }
      return city.tier;
    };
  };


  $rootScope.$on('formComplete', function setCities(event, data) {
    formData.setOrigin($scope.originCity);
    formData.setDestinations($scope.destinationCityList);
  });

$scope.cities=cityData.getProperty();
}]);



