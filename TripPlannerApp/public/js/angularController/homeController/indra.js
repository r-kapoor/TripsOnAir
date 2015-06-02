/**
 * Created by rkapoor on 01/05/15.
 */

inputModule.controller('indraController', function($scope, $rootScope, $http, $q, $location, $timeout) {

    $scope.isHomeShown = false;
    $scope.isHowItWorksShown = true;
    $scope.isLogInShown = false;
    $scope.isSaveShown = false;
    $scope.isBudgetPercentShown = false;
    $scope.isSignUpShown = false;
    $scope.saveText = "CONTINUE";
    $scope.budgetPercent = 0;
});

