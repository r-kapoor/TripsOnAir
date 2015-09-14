/**
 * Created by rkapoor on 28/04/15.
 */

itineraryModule.controller('hanumanController', function($scope, $rootScope, $http, $q, $location, $timeout) {

    $scope.alerts = [];
    $scope.currentAlert = null;
    var isBudgetAlertPresent=false;
    var messages =
    {
        addWhenPlaceHolder:{kind:'place',type:'danger',msg:'? is closed when time is available in your itinerary.'},
        addFail:{kind:'place',type:'danger',msg:'Your itinerary is too full to accommodate ?.'},
        replaceAndClosedOnDay:{kind:'place',type:'danger',msg:'? is closed on this day'},
        replaceAndClosedOnArrival:{kind:'place',type:'danger',msg:'? is closed at your arrival time. Set it accordingly'},
        replaceAndLessTime:{kind:'place',type:'danger',msg:'You have less time to cover ?'},
        replaceAndClosedOnDeparture:{kind:'place',type:'danger',msg:'? is closed at your departure time. Set it accordingly'},
        replaceAndClosedInDuration:{kind:'place',type:'danger',msg:'? is closed in between your arrival and departure time'},
        replaceAndClosedOnArrivalAndDeparture:{kind:'place',type:'danger',msg:'? is closed on your arrival and departure times'},
        replaceAndNoTimeAfterArrival:{kind:'place',type:'danger',msg:'You do not have enough time after arrival to city to cover the place'},
        replaceAndNoTimeBeforeDeparture:{kind:'place',type:'danger',msg:'You do not have enough time before departure from city to cover the place'},
        reorderAndPlaceClosed:{kind:'place',type:'danger',msg:'? is closed at reordered timings'},
        reorderAndClosed:{kind:'place',type:'danger',msg:'Places are closed at reordered timings'},
        reorderAndLessTime:{kind:'place',type:'danger',msg:'You have less time to cover these places'},
        timingChangeInvalid:{kind:'place',type:'danger',msg:'Arrival time cannot be ahead of departure time'},
        hotelAndLessTime:{kind:'hotel',type:'danger',msg:'You have less time in hotel'},
        replaceHotelLessTimeOnDate:{kind:'hotel',type:'danger',msg:'You have less time in hotel on ?'},
        replaceHotelLessTimeInMorning:{kind:'hotel',type:'danger',msg:'You have less time in hotel in morning of ?'}
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.closeCurrentAlert = function(){
        $scope.currentAlert = null;
    };
    $rootScope.$on('showRecommendation',function onShowRecommendation(event,category,params){
        var alert=messages[category];
        var alertClone = JSON.parse(JSON.stringify(alert));
        removeAlert(alertClone.kind);
        if(params!=undefined)
        {
            alertClone.msg = alertClone.msg.replace('?',params);
        }
        $scope.alerts.push(alertClone);
        $scope.currentAlert = JSON.parse(JSON.stringify(alertClone));
        $timeout(function(){$scope.currentAlert = null}, 2500);
    });

    $rootScope.$on('hideRecommendation',function onHideRecommendation(event,kind){
        removeAlert(kind);
    });

    var removeAlert = function (kind) {
        for (var alertIndex in $scope.alerts) {
            if ($scope.alerts[alertIndex].kind == kind) {
                $scope.alerts.splice(alertIndex, 1);
            }
        }
    };
});
