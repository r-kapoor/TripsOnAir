/**
 * Created by rkapoor on 21/12/14.
 */
inputModule.controller('selectedDestinationsPanelController', function($scope, $rootScope, $http, $q, formData, cityData) {
    $scope.origin = null;
    $scope.destinationCityList = [];
    $scope.isSelectedPanelCollapsed = true;
    $scope.submitItinerary=false;
    $scope.destinationLabel=true;
    $rootScope.$on('originSelected', function onOriginSelected() {
        $scope.isSelectedPanelCollapsed = false;
        $scope.origin = formData.getOrigin();
    });

    $rootScope.$on('destinationSelected', function onOriginSelected() {
        $scope.destinationLabel=false;
        $scope.destinationCityList = formData.getDestinations();
        var element = angular.element(document.querySelector("#destinationsPanel"));
        $scope.$broadcast('reinit-pane',"destinationsPanel");
    });

    $scope.getDestinationName = function(destination) {
        return toTitleCase(destination.name);
    };

    $scope.destinationRemoved = function(removedDestination) {
        angular.forEach($scope.destinationCityList, function(destination, index) {
            if($scope.getDestinationName(destination).toLowerCase() === $scope.getDestinationName(removedDestination).toLowerCase()) {
                $scope.destinationCityList.splice(index, 1);
                formData.setDestinations($scope.destinationCityList);
            }
        });
        if(formData.getDestinations().length==0)
           {
              $scope.destinationLabel=true;
           } 
        $rootScope.$emit('destinationRemoved');
        //$scope.$broadcast('reinit-pane',"destinationsPanel");
    };

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    $rootScope.$on('submit',function onSubmit(){
         $scope.onSubmit();
    });

    $scope.onSubmit = function()
    {
        console.log("OnSubmit");
        var dto1 = dto();
        var formElement=angular.element('<form\>');
        formElement.attr("action","/"+'getTravelOptions');
        formElement.attr("method","GET");
        for(var key in dto1)
        {
            if (dto1.hasOwnProperty(key)) {
                console.log("key:"+dto1[key]);
                var d=angular.element("<input type='hidden'/>");
                d.attr("name",key);
                d.attr("value",dto1[key]);
                formElement.append(d);
            }
        }
        /*var csrf=$("<input ng-hide="true"/>");
        csrf.attr("name","_csrf");
        csrf.attr("value",csrf_token);
        $("body").append(c);*/
        var body=angular.element(document.querySelectorAll("body"));
        body.append(formElement);
        formElement.submit();
    };

        function dto(){
            var origin=JSON.stringify(formData.getOrigin());
            var destinations=(formData.getDestinations());
            var startDate=formData.getStartDate();
            var endDate=formData.getEndDate();
            //console.log(startDate+":"+endDate);
            var startTime=JSON.stringify(formData.getTripStartTime());
            var endTime=JSON.stringify(formData.getTripEndTime());
            //console.log("stTime:"+JSON.stringify(startTime));
            var budget=formData.getBudget();
            var tastes=JSON.stringify(formData.getTastes());
            var destinationString="";
            for(var i=0;i<destinations.length-1;i++)
            {
                   destinationString+=JSON.stringify(destinations[i])+";";

            } 
            destinationString+=JSON.stringify(destinations[destinations.length-1]);
            //console.log(JSON.stringify(data));
            var orgLat=formData.getOriginGeoCoordinates().orgLat;
            var orgLong=formData.getOriginGeoCoordinates().orgLong;
            var numP = formData.getNumPersons();

           return {
                o:origin,
                dsts:destinationString,
                startDate:startDate,
                endDate:endDate,
                startTime:startTime,
                endTime:endTime,
                budget:budget,
                tastes:tastes,
                orgLat:orgLat,
                orgLong:orgLong,
                numP:numP
                }
            }
});