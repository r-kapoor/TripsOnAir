/**
 * Created by rkapoor on 28/03/15.
 */
var adminModule = angular.module('admin.places', ['ui.bootstrap', 'ngRoute']);

adminModule.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'templates/layouts/admin/admin.html',
                controller: 'adminController'
            }).
            when('/placesOfCity/:cityId', {
                templateUrl: 'templates/layouts/admin/placesOfCity.html',
                controller: 'placesOfCityController'
            }).
            when('/place/:placeId', {
                templateUrl: 'templates/layouts/admin/places.html',
                controller: 'placesController'
            }).
            when('/newPlace', {
                templateUrl: 'templates/layouts/admin/newPlace.html',
                controller: 'newPlaceController'
            }).
            when('/insertCrawledPlace/:placeId', {
                templateUrl: 'templates/layouts/admin/places.html',
                controller: 'crawlPlacesController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
