/**
 * Created by rkapoor on 01/02/15.
 */
require('date-utils');
var clone = require('../lib/UtilityFunctions/cloneJSON');
var SPEED = 20; //20 km/hr
var MEAL_START_TIME = [480, 720, 1140]; //8AM, 12 Noon, 7PM
var MEAL_END_TIME = [600, 900, 1320]; //10AM, 3PM, 10PM
var MEAL_DURATION = [90, 120, 120]; //1.5 hrs for breakfast, 2 hrs for both lunch and dinner
var MEAL_CONSTANTS = ['BREAKFAST', 'LUNCH', 'DINNER'];
var getDistance = require('../lib/UtilityFunctions/getDistance');
function getOptimizedItinerary(destinationAndStops) {
    for(var i = 0; i < destinationAndStops.destinations.length; i++) {
        var destination = destinationAndStops.destinations[i];
        var dateWisePlaces = destination.dateWisePlaces;
        for(var dateIndex = 0; dateIndex < dateWisePlaces.length; dateIndex++) {
            getDayWiseItinerary(dateWisePlaces[dateIndex], destination);
        }
    }
}

function getDayWiseItinerary(dateWisePlaceData, destination) {
    var placesData = dateWisePlaceData.placesData;
    //Applying TSP on the places to be visited on that day
    var permArr = [];
    var usedChars = [];
    var minWeight = -1;
    var minPermutation = [];

    var permutationArray = [];
    for(var i = 0 ; i < placesData.length; i++)
    {
        permutationArray.push(i);
    }
    var permuted = permute(permutationArray);


    function permute(input) {
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                var placesPermutation = usedChars.slice();
                console.log('Current Combination:' + placesPermutation);
                if (isValidPermutation(placesPermutation, dateWisePlaceData, destination)) {
                    var weightOfPermutation = getWeight(placesPermutation, dateWisePlaceData);
                    if (weightOfPermutation < minWeight || minWeight == -1) {
                        minWeight = weightOfPermutation;
                        minPermutation = placesPermutation;
                    }
                    permArr.push(placesPermutation);
                }
            }
            permute(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr;
    }
}

function isValidPermutation(placesPermutation, dateWisePlaceData, destination) {
    //Making Copies for this permutation
    var dateWisePlaceData = clone.clone(dateWisePlaceData);
    var placesData = dateWisePlaceData.placesData;
    var startSightSeeingTime = dateWisePlaceData.startSightSeeingTime;

    if(dateWisePlaceData.typeOfDay == 0) {
        //Is arrival day
        if(startSightSeeingTime != null) {
            //Places are to be visited on this day
            //Setting Meal Flags
            var startSightSeeingTimeInMin = getTimeOfDayInMinutesFromDate(startSightSeeingTime);
            dateWisePlaceData.hadMeals = [0, 0, 0];
            for(var i = 0; i < MEAL_CONSTANTS.length; i++) {
                if(startSightSeeingTimeInMin > MEAL_START_TIME[i]) {
                    dateWisePlaceData.hadMeals[i] = 1;
                }
            }

            for(var j = 0; j < placesPermutation.length; j++) {
                var distance = 0;
                var placeIndex = placesPermutation[j];
                if(j == 0) {
                    //Getting distance between Hotel/Arrival Place to the 1st selected place
                    distance = getDistance.getDistance(destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude,
                        placesData[placeIndex].Latitude, placesData[placeIndex].Longitude);
                }
                else {
                    //Getting distance between Last Place to the current selected place
                    distance = getDistance.getDistance(placesData[placesPermutation[j-1]].Latitude, placesData[placesPermutation[j-1]].Longitude,
                        placesData[placeIndex].Latitude, placesData[placeIndex].Longitude);
                }
                var timeInMinutes = ( distance * 60 )/SPEED;
                if(j == 0) {
                    var startTime = startSightSeeingTime.clone();
                    startTime.addMinutes(timeInMinutes);
                    var lagTime = getLagTimeAndSelectedPlaceTimingIndex(startTime, placesData[placeIndex]);
                    if(lagTime == 0) {
                        placesData[placeIndex].placeArrivalTime = startTime.clone();
                        placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(placesData[placeIndex].Time2Cover);
                    }
                    else if(lagTime > 0) {
                        startSightSeeingTime.addMinutes(lagTime);
                        placesData[placeIndex].placeArrivalTime = startTime.clone().addMinutes(lagTime);
                        placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(lagTime + placesData[placeIndex].Time2Cover);
                    }
                    else if(lagTime == -1) {
                        //The place is closed before it can be reached. Hence not a valid permutation
                        return false;
                    }
                    else {
                        //The place is open but not enough time. Hence checking if time = 75% of time2Cover
                        if((-1 * lagTime) > (0.75 * placesData[placeIndex].Time2Cover)) {
                            //Place can still be covered in less time
                            placesData[placeIndex].placeArrivalTime = startTime.clone();
                            placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(-1 * lagTime);
                        }
                        else {
                            return false;
                        }
                    }
                }
                else {
                    var startTime = placesData[placeIndex - 1].placeDepartureTime.clone();
                    startTime.addMinutes(timeInMinutes); //Time taken to go from last place to this place
                    var lagTimeAndSelectedPlaceTimingIndex = getLagTimeAndSelectedPlaceTimingIndex(startTime, placesData[placeIndex]);
                    var lagTime = lagTimeAndSelectedPlaceTimingIndex.lagTime;
                    var selectedPlaceTimingIndex = lagTimeAndSelectedPlaceTimingIndex.selectedPlaceTimingIndex;
                    if(lagTime == 0) {
                        placesData[placeIndex].placeArrivalTime = startTime.clone();
                        placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(placesData[placeIndex].Time2Cover);
                    }
                    else if(lagTime > 0) {
                        increaseDepartureTimeOfPlaceTillClosing(placesData[placesPermutation[j-1]], lagTime);
                        placesData[placeIndex].placeArrivalTime = startTime.clone().clearTime().addMinutes(getTimeOfDayInMinutesFromString(placesData[placeIndex].PlaceTimings[selectedPlaceTimingIndex].TimeStart));
                        placesData[placeIndex].placeDepartureTime = placesData[placeIndex].placeArrivalTime.clone().addMinutes(placesData[placeIndex].Time2Cover);
                    }
                    else if(lagTime == -1) {
                        //The place is closed before it can be reached. Hence not a valid permutation
                        return false;
                    }
                    else {
                        //The place is open but not enough time. Hence checking if time = 75% of time2Cover
                        if((-1 * lagTime) > (0.75 * placesData[placeIndex].Time2Cover)) {
                            //Place can still be covered in less time
                            placesData[placeIndex].placeArrivalTime = startTime.clone();
                            placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(-1 * lagTime);
                        }
                        else {
                            return false;
                        }
                    }
                }

                var mealRequired = checkWhichMealRequired(placesData[placeIndex].placeDepartureTime, dateWisePlaceData.hadMeals);
                if(mealRequired != -1) {
                    fixMealTime(mealRequired, placesData, placeIndex, dateWisePlaceData.hadMeals);
                    placesPermutation.splice(j + 1, 0, placesData.length-1);
                    j++;
                }

                if(j == placesPermutation.length - 1) {
                    //This is the last place of the day
                    distance = getDistance.getDistance(placesData[placesPermutation[j]].Latitude, placesData[placesPermutation[j]].Longitude,
                        destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude);
                    timeInMinutes = ( distance * 60 )/SPEED;
                    dateWisePlaceData.hotelReachingTime = placesData[placesPermutation[j]].departureTime.clone().addMinutes(timeInMinutes);
                }
            }

        }

    }
}

function fixMealTime(mealRequired, placesData, placeIndex, hadMeals) {
    var mealPlace = {
        Name: MEAL_CONSTANTS[mealRequired],
        Latitude: placesData[placeIndex].Latitude,
        Longitude: placesData[placeIndex].Longitude,
        Time2Cover: MEAL_DURATION[mealRequired],
        placeArrivalTime:placesData[placeIndex].placeDepartureTime,
        placeDepartureTime:placesData[placeIndex].placeDepartureTime.clone().addMinutes(MEAL_DURATION[mealRequired]),
        placeTimings: {
            TimeStart:MEAL_START_TIME[mealRequired],
            TimeEnd: MEAL_END_TIME[mealRequired],
            Days: "0"
        }
    };
    placesData.push(mealPlace);
    hadMeals[mealRequired] = 1;
}

function checkWhichMealRequired(currentTime, hadMeals) {
    var currentTimeInMin = getTimeOfDayInMinutesFromDate(currentTime);
    for(var i=0; i<MEAL_CONSTANTS.length; i++) {
        if(currentTimeInMin < MEAL_END_TIME[i] && currentTimeInMin > MEAL_START_TIME[i]) {
            if(hadMeals[i] == 0) {
                return i;
            }
            return -1;
        }
    }
    return -1;
}

function increaseDepartureTimeOfPlaceTillClosing(place, time) {
    var timeEnd;
    for(var i = 0; i < place.PlaceTimings.length; i++) {
        if(place.PlaceTimings[i].isSelected != undefined && place.PlaceTimings[i].isSelected == 1) {
            timeEnd = place.PlaceTimings[i].TimeEnd;
        }
    }
    if(timeEnd != undefined) {
        var timeEndInMin = getTimeOfDayInMinutesFromString(timeEnd);
        var departureTimeInMin = getTimeOfDayInMinutesFromDate(place.placeDepartureTime);
        var timeAfterDepartureTillPlaceOpen = timeEndInMin - departureTimeInMin;
        if(time > timeAfterDepartureTillPlaceOpen) {
            //Place will close if we increase this time in departure time of place
            place.placeDepartureTime.addMinutes(timeAfterDepartureTillPlaceOpen);
        }
        else {
            //Place is open even if we increase the departure time
            place.placeDepartureTime.addMinutes(time);
        }
    }
    else {
        console.log('WARNING : NO PLACE SELECTED');
    }
}

function getLagTimeAndSelectedPlaceTimingIndex(time, placeData) {
    var placeTimings = placeData.PlaceTimings;
    var placeTime2Cover = placeData.Time2Cover;
    var openStatus = 0;
    var currentSelectedTimings = -1;
    for(var i = 0; i < placeTimings.length; i++) {
        if(isOnSameDay(time, placeTimings[i].Days)) {
            var nearestOpeningTime = getNearestOpeningTime(time, placeTimings[i], placeTime2Cover);
            if(nearestOpeningTime == 0) {
                placeTimings[i].isSelected = 1;
                return {
                    lagTime: nearestOpeningTime,
                    selectedPlaceTimingIndex: i
                };
            }
            else if(nearestOpeningTime >0) {
                currentSelectedTimings = i;
                openStatus = nearestOpeningTime;
            }
            else if(nearestOpeningTime < 0) {
                if(openStatus < -1) {
                    currentSelectedTimings = i;
                    openStatus = nearestOpeningTime;
                }
            }
        }
    }
    placeTimings[currentSelectedTimings].isSelected = 1;
    return {
        lagTime: openStatus,
        selectedPlaceTimingIndex: currentSelectedTimings
    };
}

function getTimeOfDayInMinutesFromDate(date) {
    return date.getHours() * 60 + date.getMinutes();
}

/**
 *
 * @param time
 * @param placeTimings
 * @returns {number} 0 if open at that time, > 0 opening after time, -1 place closed, <-1 place open but not enough time returns time left
 */
function getNearestOpeningTime(time, placeTimings, time2Cover) {
    var timeOfReachingInMin = time.getHours() * 60 + time.getMinutes();
    var timeStartInMin = getTimeOfDayInMinutesFromString(placeTimings.TimeStart);
    if(timeOfReachingInMin >= timeStartInMin) {
        //Place was opened before reaching time
        var timeEndInMin = getTimeOfDayInMinutesFromString(placeTimings.TimeEnd);
        if(timeOfReachingInMin < timeEndInMin) {
            //Place has not closed yet
            if(timeEndInMin - timeOfReachingInMin >= time2Cover) {
                return 0;
            }
            else {
                return -(timeEndInMin - timeOfReachingInMin);
            }
        }
        else {
            return -1;
        }
    }
    else {
        return timeStartInMin - timeOfReachingInMin;
    }
}

function getTimeOfDayInMinutesFromString(timeString) {
    var timeStringArray = timeString.split(':');
    return ( parseInt(timeStringArray[0]) * 60 ) + parseInt(timeStringArray[1]);
}

function isOnSameDay(time, days) {
    var day = '' + time.getDay() + 1;
    if(days.indexOf(day) == -1) {
        return false;
    }
    return true;
}

function getWeight(placesPermutation, dateWisePlaceData) {

}
module.exports.getOptimizedItinerary = getOptimizedItinerary;
