/**
 * Created by rkapoor on 07/02/15.
 */

var routesModule = angular.module('tripdetails.routes.app', ['ui.bootstrap','pageslide-directive','ngDraggable','ngJScrollPane','angular-intro', 'ngCookies','ngRoute']);

routesModule.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/reorder', {
                templateUrl: '/templates/layouts/travelPage/reorderAll.html',
                controller: 'suryaController'
            }).
            when('/routes', {
                templateUrl: '/templates/layouts/travelPage/routes.html',
                controller: 'sarthiController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

routesModule.controller('routesController',  ['$scope', '$rootScope','$location','$http', function($scope, $rootScope, $location, $http) {

    function openRelevantRoute(){

        var itineraryID = $location.absUrl().split('/')[4].replace(/[^0-9a-z]/g,"");
        console.log('itineraryID:'+itineraryID);
        getReorderNeeded(itineraryID, function onGettingReorderNeed(err, need){
            if(err){
                console.log(err);
            }
            else {
                if(need){
                    $location.path('/reorder');
                }
                else{
                    $location.path('/routes');
                }
            }
        });
    }
    openRelevantRoute();

    function getReorderNeeded(itineraryID, callback){
        var requestURL = "/getReorderNeeded/"+itineraryID;

        $http({
            method: "GET",
            url: requestURL
        })
            .then(
            function success(response){
                console.log('RESPONSE:'+JSON.stringify(response.data));
                callback(null, response.data.reorderNeeded);
            },
            function error(response){
                console.log('ERROR in getReorderNeeded'+JSON.stringify(response));
                callback(new Error('Error in getReoderNeeded'));
            }
        );
    }


}]);
