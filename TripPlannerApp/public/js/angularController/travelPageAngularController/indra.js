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
        var currentURL = $location.absUrl();
        var pathArray = currentURL.split("?");
        var destinations = getParameterByName("dsts").split(";");
        if(pathArray.length>1)
        {
            if(destinations.length==1)
            {
                $rootScope.$emit("submitTravel");
            }
            else if(destinations.length>1)
            {
                console.log("length>1");
                if(isReorder)
                {
                    console.log("reorder true");
                    $rootScope.$emit("showRoutes");
                    isReorder = false;
                }
                else
                {
                    console.log("reorder false");
                    $rootScope.$emit("submitTravel");
                }
            }
        }
    };

    $scope.getSubmitFunction = function(){
        return $scope.submitFunctionName;
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

