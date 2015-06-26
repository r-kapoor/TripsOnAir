var getDuration = require('../lib/UtilityFunctions/getDuration');
require('date-utils');

function chooseMajorDefault(rome2RioDataArray, dates, times, budget, callbackResponse) {
    console.log("In major default");

	var withoutTaxiRome2rioData = rome2RioDataArray[0];
	var withTaxiRome2rioData = rome2RioDataArray[1];

    var tripNotPossible = false;
    if(withTaxiRome2rioData == null && withoutTaxiRome2rioData == null) {
        console.log("TRIP NOT POSSIBLE WITH ANY MODE OF TRAVEL");
        tripNotPossible = true;
    }
    else if(withTaxiRome2rioData == null) {
        console.log('TRIP NOT POSSIBLE WITH TAXI');
        withoutTaxiRome2rioData.isMajorDefault = 1;
    }
    else if(withoutTaxiRome2rioData == null) {
        console.log('TRIP NOT POSSIBLE WITHOUT TAXI');
        withTaxiRome2rioData.isMajorDefault = 1;
    }
    else {
        var budgetFactor = 0.5;// People spend half the budget oon travel

        console.log("withTaxiRome2rioData.TravelBudget:" + withTaxiRome2rioData.TravelBudget);
        console.log("withoutTaxiRome2rioData.TravelBudget:" + withoutTaxiRome2rioData.TravelBudget);
        console.log("UserEndTripTime:" + getDuration.combineDatesTimes(dates, times)[1]);
        console.log("ActualEndTripTimeWithTaxi" + withTaxiRome2rioData.endTimeOfTrip);
        console.log("ActualEndTripTimeWithoutTaxi" + withoutTaxiRome2rioData.endTimeOfTrip);
        if ((withTaxiRome2rioData.TravelBudget < (budget * budgetFactor)) &&
            (getDuration.combineDatesTimes(dates, times)[1].isAfter(withTaxiRome2rioData.endTimeOfTrip))) {
            console.log("1");
            withTaxiRome2rioData.isMajorDefault = 1;
            withoutTaxiRome2rioData.isMajorDefault = 0;
        } else if ((withoutTaxiRome2rioData.TravelBudget < (budget * budgetFactor)) &&
            (getDuration.combineDatesTimes(dates, times)[1].isAfter(withoutTaxiRome2rioData.endTimeOfTrip))) {
            console.log("2");
            withTaxiRome2rioData.isMajorDefault = 0;
            withoutTaxiRome2rioData.isMajorDefault = 1;
        } else {
            console.log("3");
            withTaxiRome2rioData.isMajorDefault = 1;
            withoutTaxiRome2rioData.isMajorDefault = 0;
        }
    }
    if(tripNotPossible){
        callbackResponse(null);
    }
    else{
        var rome2RioDataCombined = {
            withTaxiRome2rioData: withTaxiRome2rioData,
            withoutTaxiRome2rioData: withoutTaxiRome2rioData
        };
        removeNotRecommendedRoutes(rome2RioDataCombined.withoutTaxiRome2rioData);
        removeNotRecommendedRoutes(rome2RioDataCombined.withTaxiRome2rioData);
        callbackResponse(rome2RioDataCombined);
        console.log('Returning combined data');
        var fs = require('fs');
        fs.writeFile("AfterMajorDefault.txt", JSON.stringify(rome2RioDataCombined), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }
}

function removeNotRecommendedRoutes(rome2RioDataObject){
    if(rome2RioDataObject != null){
        var rome2RioData = rome2RioDataObject.rome2RioData;
        for(var legIndex = 0; legIndex < rome2RioData.length; legIndex++){
            var routes = rome2RioData[legIndex].routes;
            for(var routeIndex = 0; routeIndex < routes.length; routeIndex++){
                var route = routes[routeIndex];
                if(route.isRecommendedRoute == 0){
                    routes.splice(routeIndex,1);
                    routeIndex--;
                }
            }
        }
    }
}

module.exports.chooseMajorDefault = chooseMajorDefault;
