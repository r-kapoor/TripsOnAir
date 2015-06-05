/**
 * Created by rajat on 6/5/2015.
 */

itineraryModule.controller('detailModalInstanceCtrl', function ($scope, $rootScope,$modalInstance,itemDetails) {

    $scope.itemDetails = itemDetails;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    for (var i=0; i<4; i++) {
        $scope.addSlide();
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

});
