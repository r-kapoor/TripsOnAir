/**
 * Created by rkapoor on 01/05/15.
 */
itineraryModule.controller('ModalInstanceCtrl', ['$scope', '$rootScope','$modalInstance', function ($scope, $rootScope,$modalInstance) {

    $scope.permalink = "Getting Link..";
    $scope.isShareOn = false;
    $scope.generatingPDF = false;
    $scope.downloadPDF = function(){
        $scope.generatingPDF = true;
        console.log("generate_pdf");
        $rootScope.$emit("downloadPDF");
    };

    $rootScope.$on('generatedPDF', function onPDFGenerated(){
        $scope.generatingPDF = false;
        $scope.cancel();
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.shareItinerary = function()
    {
        $scope.isShareOn = true;
    };

    $rootScope.$on('gotPermalink',function onGotPermalink(event,permalink){
        $scope.permalink = permalink;
    });
}]);
