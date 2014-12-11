inputModule.service('formData', function () {
        var originCity = null;
        var destinationCities = [];
        var startDate = null;
        var endDate = null;
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
            setOrigin: function(origin) {
                originCity = origin;
            },
            setDestinations: function(destinations) {
                destinationCities = destinations;
            },
            setStartDate: function(start) {
                startDate = start;
            },
            setEndDate: function(end) {
                endDate = end;
            }
        };
    });