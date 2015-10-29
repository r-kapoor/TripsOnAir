/**
 * Created by rajat on 6/5/2015.
 */

itineraryModule.controller('detailModalInstanceCtrl', ['$scope', '$rootScope','$modalInstance','itemDetails', function ($scope, $rootScope,$modalInstance,itemDetails) {

    $scope.itemDetails = itemDetails;
    var slides = $scope.slides = [];

    console.log($scope.itemDetails);

    for (var i=0; i<$scope.itemDetails.NumberOfImages; i++) {
        slides.push({
            image: 'http://res.cloudinary.com/picsonair/image/upload/c_limit,h_300/'+$scope.itemDetails.PlaceID+'-'+(parseInt(i+1))+'.png'
        });
    }

    if($scope.itemDetails.NumberOfImages==0)
    {
        slides.push({
            image: 'http://res.cloudinary.com/picsonair/image/upload/v1445451772/NA_vjx1ej.png'
        });
    }

    $scope.getDateFromString = function(timeString)
    {
        var timeStringArray = timeString.split(':');
        var dateClone = new Date();
        dateClone.setHours(parseInt(timeStringArray[0]),parseInt(timeStringArray[1]));
        return(dateClone);
    };

    $scope.getDayClass = function(Days,index)
    {
        if(Days.indexOf(index)!=-1)
        {
            return "btn-default";
        }
        return "btn-danger";
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
