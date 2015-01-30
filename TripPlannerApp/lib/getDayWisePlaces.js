/**
 * Created by rkapoor on 24/01/15.
 */
require('date-utils');
getDistance = require('../lib/UtilityFunctions/getDistance');
getDirection = require('../lib/UtilityFunctions/getDirection');
getCalendarDaysBetween = require('../lib/UtilityFunctions/getCalendarDaysBetween');
function getDayWisePlaces(destinationAndStops) {
    console.log('Enters getDayWisePlaces');
    for(var i=0;i<destinationAndStops.destinations.length;i++)
    {
        var arrivalTime=destinationAndStops.destinations[i].arrivalTime;
        var departureTime = destinationAndStops.destinations[i].departureTime;
        //var numOfDays= arrivalTime.getDaysBetween(departureTime);
        var isHotelRequired = destinationAndStops.destinations[i].isHotelRequired;
        var daysAndDatesInDestination=getDaysAndDatesInDestination(arrivalTime,departureTime,isHotelRequired);

        destinationAndStops.destinations[i].placesSelected.sort(comparePlaces);
        var placesSelected = destinationAndStops.destinations[i].placesSelected;
        console.log('After Ordering places');
        for(var i = 0; i < placesSelected.length; i++) {
            console.log(i+":"+JSON.stringify(placesSelected[i]));
        }

        var dateWisePlaces = daysAndDatesInDestination.datesInDestination;
        addPlacesToDates(dateWisePlaces, destinationAndStops.destinations[i]);

        function comparePlaces(place1,place2){
            //console.log('Comparing places 1:'+JSON.stringify(place1)+' 2:'+JSON.stringify(place2));
            if(place1.Days == undefined) {
                place1.Days = combineDays(place1.PlaceTimings);
                console.log('Combined days of place:'+place1.Name +' days:'+place1.Days);
            }
            if(place2.Days == undefined) {
                place2.Days = combineDays(place2.PlaceTimings);
                console.log('Combined days of place:'+place2.Name +' days:'+place2.Days);
            }
            if(place1.Days=="0")
            {
                if(place2.Days=="0")
                {
                    return checkEstimatedDuration(place1,place2);
                }
                else
                {
                    return 1;
                }
            }
            else
            {
                if(place2.Days=="0")
                {
                    return -1;
                }
                else
                {
                    //both are non-zero
                    var place1Days=getNumOfDaysForWhichPlacesOpen(place1.Days,daysAndDatesInDestination.daysInDestination);
                    var place2Days=getNumOfDaysForWhichPlacesOpen(place2.Days,daysAndDatesInDestination.daysInDestination);
                    if(place1Days<place2Days)
                    {
                        return -1;
                    }
                    else if(place1Days>place2Days)
                    {
                        return 1;
                    }
                    else
                    {
                        return checkEstimatedDuration(place1,place2);
                    }
                }
            }

        }

    }

}

function getDaysAndDatesInDestination(arrivalTime,departureTime,isHotelRequired)
{
    var datesInDestination = [];
    var hourOfArrival=arrivalTime.toFormat("HH24");
    var hourOfDeparture = departureTime.toFormat("HH24");
    console.log("hourOfArrival:"+hourOfArrival+"isHotelRequired:"+isHotelRequired);
    var startDay=arrivalTime.getDay()+1;
    var arrivalTimeClone = arrivalTime.clone();
    var departureTimeClone = departureTime.clone();
    var daysInDestination = "";
    //typeOfDay - 0 = ArrivalDay, 1 = InBetweenDay, 2 = departureDay, 3 = both 0 and 2
    if(isHotelRequired)
    {
        if(hourOfArrival>=19) {
            var dateObject = {
                typeOfDay: 0,
                startSightSeeingTime: null,
                arrivalTime: arrivalTime
            };
            datesInDestination.push(dateObject);
        }
        else if(hourOfArrival >= 12) {
            var dateObject = {
                typeOfDay: 0,
                startSightSeeingTime: arrivalTimeClone.addHours(2)
            };
            datesInDestination.push(dateObject);
        }
        else {
            var dateObject = {
                typeOfDay: 0,
                startSightSeeingTime: arrivalTimeClone.addHours(4)
            };
            datesInDestination.push(dateObject);
        }
    }
    else {
        var dateObject = {
            typeOfDay: 0,
            startSightSeeingTime: arrivalTimeClone
        };
        datesInDestination.push(dateObject);
    }

    var endSightSeeingTime = null;
    if(isHotelRequired) {
        if(hourOfDeparture > 9) {
            endSightSeeingTime = departureTimeClone.addHours(-5);
        }
    }
    else {
        endSightSeeingTime = departureTimeClone.addHours(-3);
    }

    var numOfDays= 0;
    if(datesInDestination[0].startSightSeeingTime == null) {
        numOfDays = getCalendarDaysBetween.getCalendarDaysBetween(arrivalTime, endSightSeeingTime);
    }
    else {
        numOfDays = getCalendarDaysBetween.getCalendarDaysBetween(datesInDestination[0].startSightSeeingTime, endSightSeeingTime);
    }

    for(var i = 1; i<numOfDays; i++) {
        var currentDate = arrivalTime.clone();
        currentDate.addDays(i);
        currentDate.clearTime();
        var dateObject = {
            typeOfDay: 1,
            currentDate: currentDate
        };
        datesInDestination.push(dateObject);
    }

    if(datesInDestination[0].startSightSeeingTime == null ||
        getCalendarDaysBetween.getCalendarDaysBetween(datesInDestination[0].startSightSeeingTime, endSightSeeingTime) > 0) {
        var dateObject = {
            typeOfDay: 2,
            endSightSeeingTime:endSightSeeingTime
        };
        datesInDestination.push(dateObject);
    }
    else {
        datesInDestination[0].typeOfDay = 3;
        datesInDestination[0].endSightSeeingTime = endSightSeeingTime;
    }

    if(numOfDays>=6)
    {
        daysInDestination = "0";
    }
    else
    {
        for(var i=0;i<datesInDestination.length;i++)
        {
            if(datesInDestination.typeOfDay == 0) {
                if(datesInDestination.startSightSeeingTime != null) {
                    daysInDestination += datesInDestination.startSightSeeingTime.getDay() + 1;
                }
            }
            else if(datesInDestination.typeOfDay = 1) {
                daysInDestination += datesInDestination.currentDate.getDay() + 1;
            }
            else if(datesInDestination.typeOfDay = 2) {
                if(datesInDestination.endSightSeeingTime != null) {
                    daysInDestination += datesInDestination.endSightSeeingTime.getDay() + 1;
                }
            }
            else {
                daysInDestination += datesInDestination.startSightSeeingTime.getDay() + 1;
            }
        }
    }
    return {
        daysInDestination: daysInDestination,
        datesInDestination: datesInDestination
    };
}

function incrementDay(day)
{
    day++;
    if(day==8)
    {
        return 1;
    }
    return day;
}

// get number of days in which place is open on the same day when user is in the destination
function getNumOfDaysForWhichPlacesOpen(daysOfPlace,daysInDestination)
{   var daysOfPlaceArray;
    var daysInDestinationArray;
    var numOfDaysForWhichPlacesOpen =0;
    if(daysInDestination=="0")
    {
        return (daysOfPlace.length);
    }
    //compare strings of number by sorting them first
    daysOfPlaceArray=daysOfPlace.split("");
    daysInDestination = daysInDestination.split("");
    for(var j=0;j<daysOfPlaceArray.length;i++)
    {
        daysOfPlaceArray[j]=parseInt(daysOfPlaceArray[j]);
    }
    for(var k=0;k<daysInDestinationArray.length;k++)
    {
        daysInDestinationArray[k]=parseInt(daysInDestinationArray[k]);
    }

    function compareNumbers(a, b) {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        // a must be equal to b
        return 0;
    };
    daysOfPlaceArray.sort(compareNumbers);
    daysInDestinationArray.sort(compareNumbers);
    var t=0;var k=0;
    while((t<daysOfPlaceArray.length) && (k<daysInDestinationArray.length))
    {
        if(daysOfPlaceArray[t]==daysInDestinationArray[k])
        {
            numOfDaysForWhichPlacesOpen++;
            t++;
            k++;
        }
        else if(daysOfPlaceArray[t]<daysInDestinationArray[k])
        {
            t++;
        }
        else
        {
            k++;
        }
    }
    return numOfDaysForWhichPlacesOpen;
}

function checkEstimatedDuration(place1,place2){

    if(place1.estimatedDurationOfPlace>place2.estimatedDurationOfPlace)
    {
        return -1;
    }
    else if(place1.estimatedDurationOfPlace<place2.estimatedDurationOfPlace)
    {
        return 1;
    }
    else
    {
        return 0;
    }

}

function combineDays(placeTimings) {
    var combinedDays = "";
    for(var i = 0; i < placeTimings.length; i++) {
        var days = placeTimings[i].Days;
        if(days == "0") {
            return "0";
        }
        combinedDays = mergeDaysString(combinedDays, days);
    }
    if(combinedDays.length == 7){
        return "0";
    }
    return combinedDays;
}

function mergeDaysString(days1, days2) {
    var uniqueDays = "";
    for(var i = 0; i < days2.length; i++) {
        if(days1.indexOf(days2.charAt(i)) == -1) {
            uniqueDays += days2.charAt(i);
        }
    }
    return days1 + uniqueDays;
}

function addPlacesToDates(datesInDestination, destination) {
    var placesSelected = destination.PlacesSelected;
    for(var placeIndex = 0; placeIndex < placesSelected.length; placeIndex++) {
        var insertIntoDateIndex = -1;
        for(var dateIndex = 0; dateIndex < datesInDestination.length; dateIndex ++) {
            if(dayIsOpenForSchedulingPlaces(datesInDestination[dateIndex])) {
                //Places Can be scheduled on this day
                if(checkIfPlaceIsOpenOnDay(placesSelected[placeIndex], datesInDestination[dateIndex])) {
                    //The Place is Open On This Day. Can think of scheduling visit on this day
                    if(hasPlaces(datesInDestination[dateIndex])) {
                        //This day already has some places scheduled
                        if(hasTimeLeftOnThisDay(placesSelected[placeIndex], datesInDestination[dateIndex])) {
                            //There is time to put the destination on this day
                            getMinDistanceAndDirectionFromExistingPlace(placesSelected[placeIndex], datesInDestination[dateIndex]);
                            getMinimumDirectionFromExistingPlace(placesSelected[placeIndex], datesInDestination[dateIndex], destination.LocationOfArrival);

                        }
                    }
                    else {
                        //No places currently scheduled on this day. So place can be visited on this day
                        insertIntoDateIndex = dateIndex;
                    }
                }
            }
        }
    }
}

function getMinDistanceAndDirectionFromExistingPlace(place, dateObject, locationOfArrival) {
    //var DISTANCE_THRESHOLD = 15;
    var placesSelected = dateObject.placesSelected;
    var minimumDistanceBetweenPlaces = -1;
    for(var i = 0; i < placesSelected.length; i++) {
        var distanceBetweenPlaces = getDistance.getDistance(place.Latitude, place.Longitude, placesSelected[i].Latitude, placesSelected[i].Longitude);
        var directionOfPlaces = getDirection.getDirection(place.Latitude, place.Longitude, placesSelected[i].Latitude, placesSelected[i].Longitude);

        if(minimumDistanceBetweenPlaces == -1 || distanceBetweenPlaces < minimumDistanceBetweenPlaces) {
            minimumDistanceBetweenPlaces = distanceBetweenPlaces;
        }
    }
    return minimumDistanceBetweenPlaces;
}

function dayIsOpenForSchedulingPlaces(dateObject) {
    if(dateObject.typeOfDay == 0 && dateObject.startSightSeeingTime == null) {
        return false;
    }
    else if(dateObject.typeOfDay == 2 && dateObject.endSightSeeingTime == null) {
        return false;
    }
    return true;
}

function hasTimeLeftOnThisDay(place, dateObject) {
    if(dateObject.totalHoursInDay == undefined) {
        var hoursInNormalDay = 10*60; //10 hours
        var backToHomeBy = 21; //9 PM
        var startFromHomeAt = 10;
        var totalHours = 0;
        if(dateObject.typeOfDay == 1) {
            //Normal Day
            totalHours = hoursInNormalDay;
        }
        else if(dateObject.typeOfDay == 0) {
            if(dateObject.startSightSeeingTime != null) {
                totalHours = backToHomeBy - dateObject.startSightSeeingTime.getHours();
                if(totalHours < 3) {
                    totalHours = 3;
                }
            }
        }
        else if(dateObject.typeOfDay == 2) {
            if(dateObject.endSightSeeingTime != null) {
                totalHours = dateObject.endSightSeeingTime.getHours() - startFromHomeAt;
                if(totalHours < 3) {
                    totalHours = 3;
                }
            }
        }
        else {
            //The person reached and is going back the same day
            if (dateObject.startSightSeeingTime != null && dateObject.endSightSeeingTime != null) {
                totalHours = dateObject.endSightSeeingTime.getHours() - dateObject.startSightSeeingTime.getHours();
                if (totalHours < 1) {
                    totalHours = 1;
                }
            }
        }
        dateObject.totalHoursInDay = totalHours;
    }
    if(dateObject.estimatedTotalDurationOfPlaces + place.estimatedDurationOfPlace <= dateObject.totalHoursInDay) {
        return true;
    }
    return false;
}

function addPlaceToDate(place, dateObject) {
    if(dateObject.placesData == undefined) {
        dateObject.placesData = [];
        dateObject.estimatedTotalDurationOfPlaces = 0;
    }
    dateObject.placesData.push(place);
    dateObject.estimatedTotalDurationOfPlaces += place.estimatedDurationOfPlace;
}

function checkIfPlaceIsOpenOnDay(place, dateObject) {
    if(place.Days != '0') {
        var currentDay = '' + getCurrentDay(dateObject);
        if(place.Days.indexOf(currentDay) == -1) {
            return false;
        }
    }
    return true;
}

function getCurrentDay(dateObject) {
    if(dateObject.typeOfDay == 0) {
        if(dateObject.startSightSeeingTime == null) {
            return dateObject.arrivalTime.getDay() + 1;
        }
        return dateObject.startSightSeeingTime.getDay() + 1;
    }
    else if(dateObject.typeOfDay == 1) {
        return dateObject.currentDate.getDay() + 1;
    }
    else if(dateObject.typeOfDay == 2) {
        return dateObject.endSightSeeingTime.getDay() + 1;
    }
    else {
        return dateObject.startSightSeeingTime.getDay() + 1;
    }
}

function hasPlaces(dateObject) {
    return dateObject.placesData != undefined;
}



function test() {
    var d1 = new Date(2015, 0, 30, 8);
    var d2 = new Date(2015, 1, 5, 7);
    console.log(d1);
    console.log(d2);
    console.log(d1.getDaysBetween(d2));
    console.log((getCalendarDaysBetween.getCalendarDaysBetween(d1, d2)));
}
test();

module.exports.getDayWisePlaces = getDayWisePlaces;
