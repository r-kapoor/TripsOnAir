inputModule.service('formData', function () {
        var originCity = null;
        var destinationCities = [];
        var startDate = null;
        var endDate = null;
        var budget=null;
        var tastes=null;
        var tripStartTime = null;
        var tripEndTime = null;
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
            setOrigin: function(origin) {
                console.log('Set origin'+origin);
                originCity = origin;
            },
            setDestinations: function(destinations) {
                console.log('Set destination'+destinations);
                destinationCities = destinations;
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
            }
        };
    });
