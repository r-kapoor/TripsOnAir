angular.module('scrollLoad', []).directive('whenScrolled', function($document,$window,$rootScope) {
    return function(scope, elm, attr) {
        var raw = elm[0];
        $document.bind('scroll', function() {
            //console.log(raw.scrollTop+":"+$document[0].body.scrollTop +"+"+ $window.innerHeight +">="+ 0.9 * $document[0].body.offsetHeight);
            if(raw.scrollTop + $window.innerHeight >= 0.9 * $document[0].body.offsetHeight ||
                $document[0].body.scrollTop + $window.innerHeight >= 0.9 * $document[0].body.offsetHeight) {
                $rootScope.$emit('scrolled');
            }
        });
    };
});

var inputModule = angular.module('tripdetails.input.app', ['ui.bootstrap','ngSlider','scrollLoad','ngJScrollPane','ngRestrictInput','duScroll','ngRoute']);

inputModule.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'templates/layouts/home/overviewPanel.html'
                ,controller: 'KuberController'
            }).
            when('/setBudget', {
                templateUrl: 'templates/layouts/home/detailsPanel.html'
                ,controller: 'BrahmaController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

inputModule.controller('form1Controller',  function($scope, $rootScope, $window, formData) {

    var sessionData = $window.sessionStorage.getItem('formData');
    if(sessionData != null){
        formData.setAllData(JSON.parse(sessionData));
    }

    $scope.title='Plan your Trip';

    $scope.isFormPanelCollapsed = false;

    $rootScope.$on('suggest', function collapseEvents(event, data) {
        $scope.isFormPanelCollapsed = true;
    });

    angular.element(document).ready(function onReady(){
        //mixpanel.time_event('Cities Input');
        mixPanelTimeEvent('Cities Input');
    });
  });

function Main($scope) {
    $scope.items = [];

    var counter = 0;
    $scope.loadMore = function() {console.log('load more!!');
    };

    $scope.loadMore();
}
