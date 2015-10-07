/**
 * Created by rkapoor on 01/05/15.
 */

itineraryModule.controller('indraController', function($scope, $rootScope, $http, $q, $location, $timeout) {
    $scope.isSaveShown = true;
    $scope.isBudgetPercentShown = true;
    $scope.saveText = "SAVE";
    $scope.budgetBadgeClass ="";
    $scope.budgetPercent = 0;

    $rootScope.$on('budgetChanged',  function onBudgetChanged(event, percent) {
        //console.log('budgetChanged:'+percent);
        $scope.budgetPercent = percent;
    });

    $scope.toggleBudgetPanel = function(){
      $rootScope.$emit("toggleBudgetPanel");
    };

    $scope.submitPage = function(){
        $rootScope.$emit("submitPage");
    };

    $scope.setChildClassOnHover = function(){
        $scope.budgetBadgeClass = "badgeOnHover";
    };

    $scope.setChildClassOnOut = function(){
        $scope.budgetBadgeClass = "";
    };

    $scope.guideMe = function(){
        $rootScope.$emit("guide");
    };
});
