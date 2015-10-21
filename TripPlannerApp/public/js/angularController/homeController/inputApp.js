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
when('/suggestions',{

}).
otherwise({
    redirectTo: '/'
});
}]);
