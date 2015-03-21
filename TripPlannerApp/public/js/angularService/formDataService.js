inputModule.service('formData', function () {
        var originCity = null;
        var destinationCities = [];
        var startDate = null;
        var endDate = null;
        var budget=null;
        var tastes=null;
        var tripStartTime = null;
        var tripEndTime = null;
        var originGeoCoordinates = null;
        var remainingDistance = 0;
        var numPersons=1;
        function removeDuplicates(){
            angular.forEach(destinationCities, function(destinationCity,index){
                for(var i=index+1;i<destinationCities.length;i++)
                {
                    if(destinationCity.CityName.toLowerCase()===destinationCities[i].CityName.toLowerCase())
                    {
                        destinationCities.splice(i,1);
                        i--;
                    }
                }
            })
        }
        return {
            getOrigin: function () {
                return originCity;
            },
            getDestinations: function () {
                return destinationCities;
            },
            getStartDate: function() {
                return startDate;
            },
            getEndDate: function() {
                return endDate;
            },
            getBudget: function(){
                return budget;
            },
            getTastes: function(){
                return tastes;
            },
            getTripStartTime : function() {
                return tripStartTime;
            },
            getTripEndTime : function() {
                return tripEndTime;
            },
            getOriginGeoCoordinates : function() {
                return originGeoCoordinates;
            },
            getNumPersons : function(){
                 return numPersons;
            },
            getRemainingDistance: function() {
                return remainingDistance;
            },
            setOrigin: function(origin) {
                console.log('Set origin'+origin);
                originCity = origin;
            },
            setDestinations: function(destinations) {
                console.log('Set destination:'+JSON.stringify(destinations));
                destinationCities = destinations;
                removeDuplicates();
            },
            setStartDate: function(start) {
                console.log('Set Start Date');
                startDate = start;
            },
            setEndDate: function(end) {
                console.log('Set End date');
                endDate = end;
            },
            setBudget: function(inputBudget){
              budget=inputBudget;
            },
            setTastes: function(taste) {
                tastes = taste;
            },
            setTripStartTime: function(startTime) {
                tripStartTime = startTime;
            },
            setTripEndTime: function(endTime) {
                tripEndTime = endTime;
            },
            setNumPersons: function(numOfPersons){
                numPersons = numOfPersons;
            },
            setOriginGeoCoordinates: function(coordinates) {
                originGeoCoordinates = coordinates;
            },
            setRemainingDistance: function(distance) {
                remainingDistance = distance;
            },
            appendDestination: function(destination) {
                destinationCities.push(destination);
                removeDuplicates();
            },
            concatDestinations: function(destinations) {
                destinationCities = destinationCities.concat(destinations);
                removeDuplicates();
            }
        };
    });
