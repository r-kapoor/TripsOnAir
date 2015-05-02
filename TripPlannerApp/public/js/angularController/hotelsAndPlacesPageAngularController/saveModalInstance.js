/**
 * Created by rkapoor on 01/05/15.
 */
itineraryModule.controller('ModalInstanceCtrl', function ($scope, $rootScope,$modalInstance) {


    $scope.downloadPDF = function(){

        $rootScope.$emit("downloadPDF");
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
