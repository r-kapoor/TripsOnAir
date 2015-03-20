/**
 * New node file
 */


require('date-utils');
var cabFareDetails = require('../config/cabFareDetails.json');
var clone = require('../lib/UtilityFunctions/cloneJSON');

function calculateBudgetOfTrip(rome2RioData,numPeople,callback)
{
    var completeTrip;
    if(rome2RioData == null) {
        //No trip possible
        console.log('TRIP IS NOT POSSIBLE');
        completeTrip = null;
    }
    else {
        //console.log("calling calculateBudgetOfTrip:%j",rome2RioData);
        var firstCabTime, cabEndTime ,totalBudgetofCabs = 0,isLastTripWithCab = 0, totalBudgetOfTrip = 0, totalBudgetOfMinor = 0,distanceByCab=0, startSegment, endSegment;
        var startTimeOfTrip, endTimeOfTrip;
        for(var i=0;i<rome2RioData.length;i++)
        {
            //console.log("i:"+i);
            var allRoutes=rome2RioData[i].routes;
            for(var j=0;j<allRoutes.length;j++)
            {
                if(allRoutes[j].isDefault && allRoutes[j].isDefault == 1)
                {
                    //console.log("j:"+j);
                    var allSegments=allRoutes[j].segments;
                    for(var k=0;k<allSegments.length;k++)
                    {
                        //console.log("k:"+k);
                        if(!startTimeOfTrip)
                        {
                            startTimeOfTrip = allSegments[k].startTime;
                        }
                        endTimeOfTrip = allSegments[k].endTime;
                        if(allSegments[k].isMajor == 1)
                        {
                            console.log("isMajor");
                            if(allSegments[k].subkind=="cab")
                            {
                                //cab is coming for first Time
                                if(isLastTripWithCab==0)
                                {
                                    console.log('cab is coming for first Time');
                                    firstCabTime=new Date(allSegments[k].startTime.getTime());
                                    isLastTripWithCab=1;
                                    startSegment = allSegments[k];
                                    startSegment.startCabTrip = 1;
                                }
                                console.log('cab is coming');
                                cabEndTime=new Date(allSegments[k].endTime.getTime());
                                distanceByCab+=allSegments[k].distance;
                                endSegment = allSegments[k];
                                allSegments[k].indicativePrice.price = 0;
                            }
                            else
                            {
                                //Not a cab
                                console.log('Not a cab');
                                if(isLastTripWithCab==1)
                                {
                                    endSegment.endCabTrip = 1;
                                    calculateCabBudgetOfLastTrip();
                                }
                                totalBudgetOfTrip += allSegments[k].indicativePrice.price;
                            }
                        }
                    }
                }
            }

        }
        if(isLastTripWithCab == 1) {
            endSegment.endCabTrip = 1;
            calculateCabBudgetOfLastTrip();
        }
        totalBudgetOfTrip += totalBudgetofCabs;

        function calculateCabBudgetOfLastTrip() {
            console.log("isLastTripWithCab==1");
            //Last part of travel was in cab
            isLastTripWithCab=0;

            //TODO: Get Distance from Google / MapQuest API\
            //if source and destination of taxi are not same then add the direct distance of source and destination to distanceByCab
            console.log('firstCabTime:'+firstCabTime);
            console.log('cabEndTime:'+cabEndTime);
            firstCabTime.clearTime();
            cabEndTime.clearTime();
            var numOfDaysOfCab=firstCabTime.getDaysBetween(cabEndTime)+1;
            console.log('numOfDaysOfCab:'+numOfDaysOfCab);
            var totalBudgetOfThisCab = calculateCabBudget(numOfDaysOfCab, numPeople, distanceByCab,startSegment);
            console.log('totalBudgetOfThisCab:'+totalBudgetOfThisCab);
            totalBudgetofCabs += totalBudgetOfThisCab;
            startSegment.indicativePrice.price = totalBudgetofCabs;
        }

        console.log('TOTAL BUDGET OF TRIP:'+totalBudgetOfTrip);
        completeTrip = {
            TravelBudget : totalBudgetOfTrip,
            startTimeOfTrip : new Date(startTimeOfTrip.getTime()),
            endTimeOfTrip : new Date(endTimeOfTrip.getTime()),
            rome2RioData : rome2RioData
        };
        if(totalBudgetofCabs == 0)
        {
            completeTrip.isCabTrip = 0;
        }
        else
        {
            completeTrip.isCabTrip = 1;
        }
    }
    console.log('Calling Callback');
    callback(null, completeTrip);
    var fs = require('fs');
    fs.writeFile("totalbudget.txt",JSON.stringify(completeTrip), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}

function calculateCabBudget(numOfDaysOfCab, numPeople, distanceByCab, segment)
{
	console.log("inside calculateCabBudget");

    //Estimated local travel km per day
    var localTravelKm=120;

    var carSegmentArray = [];
    var carOfPreference=getCarOfPreference(numPeople);

    var cabFareDetailsClone = clone.clone(cabFareDetails);
    var fareDetails = cabFareDetailsClone.FareDetails;
    var minimumKmPerDay = cabFareDetailsClone.MinimumKmPerDay;
    var driver = cabFareDetailsClone.Driver;
    for(var fareDetailIndex in fareDetails) {
        var fareDetail = fareDetails[fareDetailIndex];
        if(fareDetail.Seats <= Math.max(1.5*numPeople, 4)) {
            if(fareDetail.SegmentType == carOfPreference) {
                fareDetail.isFinal = 1;
            }
            fareDetail.NumberOfCabs = Math.max(parseInt(numPeople / fareDetail.Seats), 1);
            for(var operatorIndex in fareDetail.OperatorPrices) {
                var operatorDetails = fareDetail.OperatorPrices[operatorIndex];
                operatorDetails.MinimumKmPerDay = minimumKmPerDay[operatorDetails.Operator].Distance;
                operatorDetails.Driver = driver[operatorDetails.Operator].Price;

                operatorDetails.DistanceForPriceComputation = Math.max(numOfDaysOfCab * operatorDetails.MinimumKmPerDay, distanceByCab + localTravelKm*numOfDaysOfCab);
                operatorDetails.ActualTotalCabPrice = (operatorDetails.DistanceForPriceComputation * operatorDetails.PricePerKm + numOfDaysOfCab * operatorDetails.Driver) * fareDetail.NumberOfCabs;
                operatorDetails.ActualCabPrice = parseInt(operatorDetails.ActualTotalCabPrice / numPeople);
            }
            carSegmentArray.push(fareDetail);
        }
    }

	var minimumCabPrice = -1;
	var minOperator = null;

    for(var fareDetailIndex in carSegmentArray) {
        var fareDetail = fareDetails[fareDetailIndex];
        if(fareDetail.isFinal != undefined && fareDetail.isFinal == 1) {
            for(var operatorIndex in fareDetail.OperatorPrices) {
                var operatorDetails = fareDetail.OperatorPrices[operatorIndex];
                if(minimumCabPrice == -1 || operatorDetails.ActualCabPrice < minimumCabPrice ) {
                    minimumCabPrice = operatorDetails.ActualCabPrice;
                    minOperator = operatorDetails;
                }
            }
        }
    }
console.log("minOperator:"+JSON.stringify(minOperator));
    minOperator.isFinal = 1;
    //fareDetail.fare = minimumCabPrice;

	segment.CabDetails = carSegmentArray;
	return minimumCabPrice;
}


function getCarOfPreference(numPeople)
{
	//TODO : Choose a car depending on the budget of the user
	var carOfPreference = "Bus";
	if(numPeople <= 2)
	{
		carOfPreference = "Mini";
	}
	if(numPeople <= 4)
	{
		carOfPreference = "Sedan";
	}
	else if(numPeople <= 6)
	{
		carOfPreference = "SmallSUV";
	}
	else if(numPeople <= 7)
	{
		carOfPreference = "LargeSUV";
	}
	else if(numPeople <= 14)
	{
		carOfPreference = "TempoTraveller";
	}
	else if(numPeople <= 25)
	{
		carOfPreference = "MiniBus";
	}
    return carOfPreference;
}
module.exports.calculateBudgetOfTrip=calculateBudgetOfTrip;
