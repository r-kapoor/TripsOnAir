inputModule.controller('DatepickerCtrl', function ($scope, $rootScope, formData) {
  $scope.today = function() {
    $scope.dt1 = new Date();
    $scope.dt2 = null;
  };
  $scope.today();

    $scope.heading = 'h5';

  $scope.clear = function () {
    $scope.dt1 = null;
    $scope.dt2 = 'Select';
  };

  $scope.startDateSelected = function() {
	  if($scope.dt2 !== null) {
		  $scope.dt2 = $scope.dt1;
	  }
  };
  $scope.startDateSelected();

  $scope.endDateSelected = function() {
        $scope.heading = 'h4';
        formData.setStartDate($scope.dt1);
        formData.setEndDate($scope.dt2);
        $rootScope.$emit('selectionDone');
  };

$scope.startMorningTime = function(){
  var startEveningTimeId=angular.element(document.querySelector("#startEveningTimeId"));
  if(startEveningTimeId.hasClass("active"))
  {
     startEveningTimeId.removeClass("active");
     $scope.tripStartTime.evening=false;
  }
}

$scope.startEveningTime = function(){

  var startMorningTimeId=angular.element(document.querySelector("#startMorningTimeId"));
  if(startMorningTimeId.hasClass("active"))
  {
     startMorningTimeId.removeClass("active");
     $scope.tripStartTime.morning=false;
  }
}

$scope.endMorningTime = function(){

  var endEveningTimeId=angular.element(document.querySelector("#endEveningTimeId"));
  if(endEveningTimeId.hasClass("active"))
  {
     endEveningTimeId.removeClass("active");
      $scope.tripEndTime.evening=false;
  }
}

$scope.endEveningTime = function(){
  var endMorningTimeId=angular.element(document.querySelector("#endMorningTimeId"));
  if(endMorningTimeId.hasClass("active"))
  {
     endMorningTimeId.removeClass("active");
      $scope.tripEndTime.morning=false;
  }
}

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
