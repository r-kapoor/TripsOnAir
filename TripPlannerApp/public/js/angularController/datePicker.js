inputModule.controller('DatepickerCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt1 = new Date();
    $scope.dt2 = null;
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt1 = null;
    $scope.dt2 = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  //$scope.disabled = function(date, mode) {
	//    return ( mode === 'day' && ( date.getTime() < $scope.dt );
  //};

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event,opened) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.minDate1 = $scope.dt1;
    console.log('$scope.dt1:'+$scope.dt1);
    console.log('$scope.dt2:'+$scope.dt2);
    if(opened === 'opened1')
    {
      $scope.opened2 = false;
    }
    else if(opened === 'opened2')
    {
      $scope.opened1 = false;
    };
    if ($scope[opened]) {
      $scope[opened] = false;
    }
    else {
      $scope[opened] = true;
    };
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[1];
});