/**
 * Created by rkapoor on 21/12/14.
 */
inputModule.controller('selectedDestinationsPanelController', function($scope, $rootScope, $http, $q, formData, cityData) {
    $scope.origin = null;
    $scope.destinationCityList = [];
    $scope.isSelectedPanelCollapsed = true;

    $rootScope.$on('originSelected', function onOriginSelected() {
        $scope.isSelectedPanelCollapsed = false;
        $scope.origin = formData.getOrigin();
    });

    $rootScope.$on('destinationSelected', function onOriginSelected() {
        $scope.destinationCityList = formData.getDestinations();
    });

    $scope.getDestinationName = function(destination) {
        return toTitleCase(destination.name);
    };

    $scope.destinationRemoved = function(removedDestination) {
        angular.forEach($scope.destinationCityList, function(destination, index) {
            if($scope.getDestinationName(destination).toLowerCase() === $scope.getDestinationName(removedDestination).toLowerCase()) {
                $scope.destinationCityList.splice(index, 1);
                formData.setDestinations($scope.destinationCityList);
            }
        });
        $rootScope.$emit('destinationRemoved');
    };

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
});
