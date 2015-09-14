/**
 * Created by rkapoor on 01/05/15.
 */
var routesModule;
routesModule.controller("indraController", ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
    "use strict";
    $scope.isHomeShown = false;
    $scope.isHowItWorksShown = false;
    $scope.isLogInShown = false;
    $scope.isSaveShown = true;
    $scope.isBudgetPercentShown = false;
    $scope.isSignUpShown = false;
    $scope.saveText = "CONTINUE";
    $scope.budgetPercent = 0;
    $scope.submitFunctionName = "";
    var isReorder = true;

    $scope.submitPage = function(){
        var currentPath = $location.path();
        if(currentPath == '/reorder'){
            $location.path('/routes');
            $rootScope.$emit("showRoutes");
        }
        else {
            $rootScope.$emit("submitTravel");
        }
    };

    $scope.getSubmitFunction = function(){
        return $scope.submitFunctionName;
    };

    $scope.guideMe = function(){
        $rootScope.$emit("guide");
    };
    //$rootScope.$on('showBudget',function onShowBudget(event,data){
    //    $scope.budgetPercent = data;
    //    $scope.isBudgetPercentShown = true;
    //});

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}]);

