var getDuration = require('../lib/UtilityFunctions/getDuration');
require('date-utils');

function chooseMajorDefault(rome2RioDataArray, dates, times, budget, callbackResponse) {
	var withoutTaxiRome2rioData = rome2RioDataArray[0];
	var withTaxiRome2rioData = rome2RioDataArray[1];
	var budgetFactor = 0.5;// People spend half the budget oon travel

	console.log("In major default");
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

	var rome2RioDataCombined = {
		withTaxiRome2rioData: withTaxiRome2rioData,
		withoutTaxiRome2rioData: withoutTaxiRome2rioData
	};
	callbackResponse(rome2RioDataCombined);
	var fs = require('fs');
	fs.writeFile("AfterMajorDefault.txt", JSON.stringify(rome2RioDataCombined), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	});
}

module.exports.chooseMajorDefault = chooseMajorDefault;
