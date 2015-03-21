/**
 * Created by rkapoor on 21/03/15.
 */

routesModule.controller('balaramaController', function($scope, $rootScope, $http, $q, $location, orderedCities, $timeout) {

    $scope.alerts = [];
    var isBudgetAlertPresent=false;
    var messages =
    {
        budgetExceeds:{kind:'budget',type:'danger',msg:'You may go out of your budget!!'},
        budgetOutOfLimit:{kind:'budget',type:'danger',msg:'Yoy have Exceeded your budget!!'},
        timeExceeds:{kind:'time',type:'danger',msg:'You are spending very less time in ?!!'},
        timeOverlap:{kind:'time',type:'danger',msg:'You are leaving ? before reaching!!'},
        inEfficientOrder:{kind:'order', type:'',msg:'You are covering too much distance!!'}
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('showRecommendation',function onShowRecommendation(event,category,params){
        var alert=messages[category];
        removeAlert(alert.kind);
        if(params!=undefined)
        {
            alert.msg = alert.msg.replace('?',params);
        }
        $scope.alerts.push(alert);
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
