/**
 * Created by rkapoor on 01/05/15.
 */

inputModule.controller('indraController', function($scope, $rootScope, formData) {

    $scope.isHomeShown = false;
    $scope.isHowItWorksShown = true;
    $scope.isLogInShown = false;
    $scope.isSaveShown = false;
    $scope.isBudgetPercentShown = false;
    $scope.isSignUpShown = false;
    $scope.saveText = "CONTINUE";
    $scope.budgetPercent = 0;
    $scope.isHelpShown = false;

    $rootScope.$on('suggest', function onSuggest(){
        $scope.isHowItWorksShown = false;
        $scope.isSaveShown = true;
    });

    $scope.submitPage = function(){
        console.log('Emiting submitPage');
        $rootScope.$emit('submitPage');
    };

    $rootScope.$on('detailsLoad', function collapseSuggestions() {
        $scope.isHowItWorksShown = true;
        $scope.isSaveShown = false;
    });
});

