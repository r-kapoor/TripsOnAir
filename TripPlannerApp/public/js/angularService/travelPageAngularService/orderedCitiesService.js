/**
 * Created by rkapoor on 09/02/15.
 */
routesModule.service('orderedCities', function () {
    var orderedDestinationCities = [];
    var originCity = null;
    var weightArray = [];
    var minimumWeight = 0;

    return {
        getOrderedDestinationCities: function() {
            return orderedDestinationCities;
        },
        getOriginCity: function() {
            return originCity;
        },
        getWeightArray: function() {
            return weightArray;
        },
        getMinimumWeight: function() {
            return minimumWeight;
        },
        setOrderedDestinationCities: function(orderedCities) {
            orderedDestinationCities = orderedCities;
        },
        setOriginCity: function(origin) {
            originCity = origin;
        },
        setWeightArray: function(weights) {
            weightArray = weights;
        },
        setMinimumWeight: function(minWeight) {
            minimumWeight = minWeight;
        }
    };
});

