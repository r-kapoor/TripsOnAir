/**
 * Created by rkapoor on 01/05/15.
 */

itineraryModule.controller('indraController', function($scope, $rootScope, $http, $q, $location, $timeout) {
    $scope.isSaveShown = true;
    $scope.isBudgetShown = true;
    $scope.saveText = "SAVE";

    $scope.budgetPercent = 0;

    $rootScope.$on('budgetChanged',  function onBudgetChanged(event, percent) {
        console.log('budgetChanged:'+percent);
        $scope.budgetPercent = percent;
    });

    $scope.toggleBudgetPanel = function(){
      $rootScope.$emit("toggleBudgetPanel");
    };

    $scope.submitPage = function(){
        $rootScope.$emit("submitPage");
    }
});
