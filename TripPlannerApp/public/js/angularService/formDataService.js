inputModule.service('formData', function () {
        var MIN_BUDGET = "5000";
        var DEFAULT_TASTES = {
            RELIGIOUS   : false,
            ADVENTURE   : false,
            BEACHES     : false,
            LANDMARKS   : false,
            NATURE      : false,
            LIVE_EVENTS : false,
            HILL_STATION: false,
            ROMANTIC    : false,
            FAMILY      : false,
            FRIENDS     : false
        };
        var MIN_NUM_PERSONS = 4;
        var DEFAULT_TRIP_START_TIME = {
            morning : false,
            evening : false
        };
        var DEFAULT_TRIP_END_TIME = {
            morning : false,
            evening : false
        };
        var DEFAULT_BUDGET_MIN = 5000;
        var originCity = null;
        var destinationCities = [];
        var suggestDestinationOn = false;
        var startDate = null;
        var endDate = null;
        var budget=MIN_BUDGET;
        var tastes= DEFAULT_TASTES;
        var tripStartTime = DEFAULT_TRIP_START_TIME;
        var tripEndTime = DEFAULT_TRIP_END_TIME;
        var originGeoCoordinates = null;
        var remainingDistance = 0;
        var numPersons=MIN_NUM_PERSONS;
        var minimumBudget = DEFAULT_BUDGET_MIN;
        var itineraryID = null;
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
            getSuggestDestinationOn: function(){
                return suggestDestinationOn;
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
            getMinimumBudget : function() {
                return minimumBudget;
            },
            getItineraryID: function() {
                return itineraryID;
            },
            getAllData: function(){
                return {
                    originCity: originCity,
                    destinationCities: destinationCities,
                    startDate: startDate,
                    endDate: endDate,
                    budget: budget,
                    tastes: tastes,
                    tripStartTime: tripStartTime,
                    tripEndTime: tripEndTime,
                    originGeoCoordinates: originGeoCoordinates,
                    remainingDistance: remainingDistance,
                    numPersons: numPersons,
                    minimumBudget: minimumBudget,
                    itineraryID: itineraryID
                };
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
            setSuggestDestinationOn: function(suggestDest){
                suggestDestinationOn = suggestDest;
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
            setMinimumBudget: function(minBudget) {
                minimumBudget = minBudget;
            },
            setItineraryID: function(id) {
                itineraryID = id;
            },
            setAllData: function(allData){
                originCity = allData.originCity;
                destinationCities = allData.destinationCities;
                startDate = new Date(allData.startDate);
                endDate = new Date(allData.endDate);
                budget = allData.budget;
                tastes = allData.tastes;
                tripStartTime = allData.tripStartTime;
                tripEndTime = allData.tripEndTime;
                originGeoCoordinates = allData.originGeoCoordinates;
                remainingDistance = allData.remainingDistance;
                numPersons = allData.numPersons;
                minimumBudget = allData.minimumBudget;
                itineraryID = allData.itineraryID;
            },
            appendDestination: function(destination) {
                destinationCities.push(destination);
                removeDuplicates();
            },
            concatDestinations: function(destinations) {
                destinationCities = destinationCities.concat(destinations);
                removeDuplicates();
            },
            resetBudget: function(){
                budget = MIN_BUDGET;
            },
            resetTastes: function(){
                tastes = DEFAULT_TASTES;
            },
            resetNumPersons: function(){
                numPersons = MIN_NUM_PERSONS;
            }
        };
    });
