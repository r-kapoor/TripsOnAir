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
            }
        };
    });
