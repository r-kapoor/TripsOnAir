inputModule.controller('form1Controller', ['$scope', '$rootScope', '$window', '$location', '$timeout', 'formData', function($scope, $rootScope, $window, $location, $timeout, formData) {

    var sessionData = $window.sessionStorage.getItem('formData');
    if(sessionData != null){
        formData.setAllData(JSON.parse(sessionData));
    }

    $scope.title='Plan your Trip';

    $scope.isFormPanelCollapsed = false;

    $rootScope.$on('suggest', function collapseEvents(event, data) {
        $scope.isFormPanelCollapsed = true;
    });

    $rootScope.$on('detailsLoad', function unCollapseEvents(event, data) {
        $scope.isFormPanelCollapsed = false;
    });

    if($location.path() == '/suggestions'){
        if(formData.getOrigin()){
            $timeout(function(){
                $rootScope.$emit('suggest');
            }, 200);
        }
        else {
            $location.path('/');
        }
    }

    if(formData.getOrigin()){
        $timeout(function(){
            $rootScope.$emit('originSelected');
            if(formData.getDestinations().length > 0){
                $rootScope.$emit('destinationSelected');
            }
        }, 200);
    }

    angular.element(document).ready(function onReady(){
        //mixpanel.time_event('Cities Input');
        mixPanelTimeEvent('Cities Input');
    });
  }]);

function Main($scope) {
    $scope.items = [];

    var counter = 0;
    $scope.loadMore = function() {console.log('load more!!');
    };

    $scope.loadMore();
}
