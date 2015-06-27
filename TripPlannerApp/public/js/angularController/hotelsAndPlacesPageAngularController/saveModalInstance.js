/**
 * Created by rkapoor on 01/05/15.
 */
itineraryModule.controller('ModalInstanceCtrl', function ($scope, $rootScope,$modalInstance) {

    $scope.generatingPDF = false;
    $scope.downloadPDF = function(){
        $scope.generatingPDF = true;
        $rootScope.$emit("downloadPDF");
    };

    $rootScope.$on('generatedPDF', function onPDFGenerated(){
        $scope.generatingPDF = false;
        $scope.cancel();
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
