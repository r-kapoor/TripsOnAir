/**
 * Created by rkapoor on 23/08/15.
 */
inputModule.controller('BrahmaController', function($scope, $rootScope, $http, $q, $location, $window, formData, cityData) {

    var itineraryID = formData.getItineraryID();
    $scope.isDetailsCollapsed = false;
    $scope.isOverviewCollapsed = false;
    $scope.isSuggestDestinationsOn = false;
    $scope.destinationCityList = formData.getDestinations();
    $scope.helpLabel="Help me choose destinations";
    $scope.numPerson = formData.getNumPersons();
    $scope.value1 = formData.getBudget();
    //$scope.value1 = 5000;
    $scope.options = {
        from: formData.getMinimumBudget(),
        to: 100000,
        step: 100,
        dimension: " Rs",
        css: {
            background: {"background-color": "silver"},
            before: {"background-color": "purple"},
            default: {"background-color": "white"},
            after: {"background-color": "green"},
            pointer: {"background-color": "red"}
        }
    };

    $scope.$watch('value1', function(){
        return $scope.value1;
    });

    $scope.submitOrSuggest = function() {
        console.log('$scope.value:'+$scope.value1);
        formData.setBudget($scope.value1);
        formData.setTastes($scope.checkModel);
        formData.setNumPersons($scope.numPerson);
        //Mix Panel Tracking
        var trackingObject = {
            "Budget": formData.getBudget(),
            "NumberOfPersons": formData.getNumPersons()
        };
        mixObjects(formData.getTastes(), trackingObject);
        console.log('Tracking Object:'+JSON.stringify(trackingObject));
        //mixpanel.track('Budget Input', trackingObject);
        mixPanelTrack('Budget Input', trackingObject);
        $window.sessionStorage.setItem('formData',JSON.stringify(formData.getAllData()));
        putDetailedData();
        if($scope.isSuggestDestinationsOn)
        {
            $rootScope.$emit('suggest');
        }
        else
        {
            $rootScope.$emit('submit', itineraryID);//For selectedDestinationsPanelController to handle
        }
    };

    function mixObjects(source, target) {
        for(var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    $rootScope.$on('BudgetSet', function(){
        $scope.value1 = formData.getBudget();
        $scope.options.from = formData.getMinimumBudget();
    });

    $rootScope.$on('formComplete', function collapseEvents(event, data) {
        //$scope.isOverviewCollapsed = true;
        //cleanDetailsPanelData();
        $scope.isDetailsCollapsed = false;
        //setTimeout(function () {
        //    $scope.isDetailsCollapsed = false;
        //    //$scope.setBudgetLimits();
        //}, 100);

        getItineraryID();

    });

    function cleanDetailsPanelData(){
        formData.resetBudget();
        formData.resetNumPersons();
        formData.resetTastes();
    }

    $scope.addPerson = function(){
        if(parseInt($scope.numPerson)<15){
            $scope.numPerson = ""+(parseInt($scope.numPerson)+1);
        }
    };

    $scope.subPerson = function(){
        if(parseInt($scope.numPerson)>1){
            $scope.numPerson = ""+(parseInt($scope.numPerson)-1);
        }
    };

    $scope.checkModel = formData.getTastes();

    function getItineraryID(){

        if(itineraryID == null){
            //To avoid multiple ID generation for back/forward
            var requestURL = "/getItineraryID";

            var data = {
                origin: formData.getOrigin(),
                destinationList: formData.getDestinations(),
                startDate: formData.getStartDate(),
                endDate: formData.getEndDate(),
                startTime: formData.getTripStartTime(),
                endTime: formData.getTripEndTime()
            };

            $http.post(requestURL, data)
                .then(
                function success(response){
                    itineraryID = response.data.itineraryID;
                    formData.setItineraryID(itineraryID);
                    console.log('RESPONSE:'+JSON.stringify(response.data));
                },
                function error(response){

                }
            );
        }
    }

    function putDetailedData(){
        var requestURL = "/putItineraryInputs/"+itineraryID;
        var data  = formData.getAllData();

        $http({
                method: "PUT",
                url: requestURL,
                data: data
            })
            .then(
            function success(response){
                console.log('RESPONSE:'+JSON.stringify(response.data));
            },
            function error(response){
            }
        )
    }

    $scope.$on('$destroy', function onBrahmaDestroy(){
        //Saving the values set by user to service
        formData.setNumPersons($scope.numPerson);
        formData.setTastes($scope.checkModel);
    })
});

