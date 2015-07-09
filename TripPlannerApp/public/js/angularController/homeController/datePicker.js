inputModule.controller('DatepickerCtrl', function ($scope, $rootScope, formData) {
  $scope.today = function() {
      $scope.dt1 = new Date();
      formData.setStartDate($scope.dt1);
      removeErrorHighlightStartDate();
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
          formData.setEndDate($scope.dt2);
          removeErrorHighlightEndDate();
	  }
      formData.setStartDate($scope.dt1);
      removeErrorHighlightStartDate();
  };
  $scope.startDateSelected();

  $scope.endDateSelected = function() {
      $scope.heading = 'h4';
      formData.setEndDate($scope.dt2);
      removeErrorHighlightEndDate();
  };

$scope.startMorningTime = function(){
  var startEveningTimeId=angular.element(document.querySelector("#startEveningTimeId"));
  if(startEveningTimeId.hasClass("active"))
  {
     startEveningTimeId.removeClass("active");
     $scope.tripStartTime.evening=false;
  }
    removeErrorHighlightStartTime()
};

    $scope.proceed = function(){
        $rootScope.$emit('selectionDone');
    };

$scope.startEveningTime = function(){

  var startMorningTimeId=angular.element(document.querySelector("#startMorningTimeId"));
  if(startMorningTimeId.hasClass("active"))
  {
     startMorningTimeId.removeClass("active");
     $scope.tripStartTime.morning=false;
  }
    removeErrorHighlightStartTime();
};

$scope.endMorningTime = function(){

  var endEveningTimeId=angular.element(document.querySelector("#endEveningTimeId"));
  if(endEveningTimeId.hasClass("active"))
  {
     endEveningTimeId.removeClass("active");
      $scope.tripEndTime.evening=false;
  }
    removeErrorHighlightEndTime();
};

$scope.endEveningTime = function(){
  var endMorningTimeId=angular.element(document.querySelector("#endMorningTimeId"));
  if(endMorningTimeId.hasClass("active"))
  {
     endMorningTimeId.removeClass("active");
      $scope.tripEndTime.morning=false;
  }
    removeErrorHighlightEndTime();
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
    startingDay: 1,
      showButtonBar: false
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[1];
    function removeErrorHighlightStartDate(){
        var startDateElement=angular.element(document.querySelector("#depart-date"));
        if(startDateElement.hasClass("btn-danger")){
            startDateElement.removeClass("btn-danger");
            startDateElement.addClass("btn-primary");
        }
    }
    function removeErrorHighlightEndDate(){
        var endDateElement=angular.element(document.querySelector("#arrival-date"));
        if(endDateElement.hasClass("btn-danger")){
            endDateElement.removeClass("btn-danger");
            endDateElement.addClass("btn-primary");
        }
    }
    function removeErrorHighlightStartTime(){
        var startTimeElement = angular.element(document.querySelectorAll(".startTimeE"));
        if(startTimeElement.hasClass("time-not-selected")){
            startTimeElement.removeClass("time-not-selected");
        }
    }
    function removeErrorHighlightEndTime(){
        var endTimeElement = angular.element(document.querySelectorAll(".endTimeE"));
        if(endTimeElement.hasClass("time-not-selected")){
            endTimeElement.removeClass("time-not-selected");
        }
    }

});
