itineraryModule.controller('shakuniController',  function($scope, $rootScope, $http) {

 $http.get('/planItinerary').success(function(data,status){
                    


                }
            )
                .error(
                function(data, status) {
                    console.log(data || "Backend Request failed");
                });



	});