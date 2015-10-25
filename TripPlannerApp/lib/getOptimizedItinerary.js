/**
 * Created by rkapoor on 01/02/15.
 */
require('date-utils');
var clone = require('../lib/UtilityFunctions/cloneJSON');
var SPEED = 15; //20 km/hr
var MEAL_START_TIME = [480, 720, 1140]; //8AM, 12 Noon, 7PM
var MEAL_END_TIME = [600, 900, 1320]; //10AM, 3PM, 10PM
var MEAL_START_TIME_STRING = ['08:00:00', '12:00:00', '19:00:00']; //8AM, 12 Noon, 7PM
var MEAL_END_TIME_STRING = ['10:00:00', '15:00:00', '22:00:00']; //10AM, 3PM, 10PM
var MEAL_DURATION = [90, 120, 120]; //1.5 hrs for breakfast, 2 hrs for both lunch and dinner
var MEAL_CONSTANTS = ['BREAKFAST', 'LUNCH', 'DINNER'];
var REST_TIME = 480; //8 hrs
var TIME2COVER_RATIO = 0.75;
var getDistance = require('../lib/UtilityFunctions/getDistance');
function getOptimizedItinerary(destinationAndStops) {
    console.log('---------------------In getOptimizedItinerary---------------------');
    for(var i = 0; i < destinationAndStops.destinations.length; i++) {
        var destination = destinationAndStops.destinations[i];
        console.log('Current Destination:'+destination.name);
        var dateWisePlaces = destination.dateWisePlaces;
        var hotel = destination.hotelDetails;
        var allPlaces = destination.places;
        var dateWiseItinerary = [];
        for(var dateIndex = 0; dateIndex < dateWisePlaces.length; dateIndex++) {
            console.log('Current date['+dateIndex+'] with places:'+JSON.stringify(dateWisePlaces[dateIndex]));
            if(dayIsOpenForSchedulingPlaces(dateWisePlaces[dateIndex])){
                if(dateIndex == 0) {
                    var dateItinerary = getDayWiseItinerary(dateWisePlaces[dateIndex], destination, null, hotel, allPlaces);
                    if(dateItinerary instanceof Error){
                        return dateItinerary;
                    }
                    dateWiseItinerary.push(dateItinerary);
                }
                else {
                    console.log('Going for next. Passing prev itinerary:'+JSON.stringify(dateWiseItinerary[dateIndex - 1]));
                    var dateItinerary = getDayWiseItinerary(dateWisePlaces[dateIndex], destination, dateWiseItinerary[dateIndex - 1], hotel, allPlaces);
                    if(dateItinerary instanceof Error){
                        return dateItinerary;
                    }
                    dateWiseItinerary.push(dateItinerary);
                }
            }
            else {
                dateWisePlaces[dateIndex].noPlacesVisited = 1;
                var emptyDateWiseItinerary = {
                    validity: true,
                    permutation: [],
                    dateWisePlaceData: dateWisePlaces[dateIndex]
                };
                dateWiseItinerary.push(emptyDateWiseItinerary);
            }
        }
        destination.dateWiseItinerary = dateWiseItinerary;
    }
}

function getDayWiseItinerary(dateWisePlaceData, destination, previousDaysItinerary, hotel, places) {
    console.log('In getDayWiseItinerary');
    var placesData = dateWisePlaceData.placesData;
    if(placesData!=undefined && placesData.length > 0){
        var previousDaysDateWisePlaceData = null;
        if(previousDaysItinerary != null) {
            var previousDaysDateWisePlaceData = previousDaysItinerary.dateWisePlaceData;
        }

        //Applying TSP on the places to be visited on that day
        var permArr = [];
        var usedChars = [];
        var minWeight = -1;
        var minPermutation = null;
        var minPermutationDateWisePlaceData = null;
        var lastInvalidItinerary = null;

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

                    var validPermutation = getValidPermutation(placesPermutation, dateWisePlaceData, destination, previousDaysDateWisePlaceData, hotel);
                    if(validPermutation instanceof Error){
                        return validPermutation;
                    }
                    if(validPermutation.validity) {
                        console.log('Got a valid permutation:'+JSON.stringify(validPermutation.dateWisePlaceData));
                        var weightOfPermutation = getWeight(placesPermutation, dateWisePlaceData);
                        if (weightOfPermutation < minWeight || minWeight == -1) {
                            minWeight = weightOfPermutation;
                            minPermutation = placesPermutation;
                            minPermutationDateWisePlaceData = validPermutation.dateWisePlaceData;
                        }
                        permArr.push(placesPermutation);
                    }
                    else {
                        lastInvalidItinerary = {
                            validity: false,
                            permutation: placesPermutation,
                            dateWisePlaceData: validPermutation.dateWisePlaceData
                        }
                    }
                }
                permute(input);
                input.splice(i, 0, ch);
                usedChars.pop();
            }
            return permArr;
        }
        if(minPermutation != null) {
            markSelectedPlaces(minPermutation, minPermutationDateWisePlaceData, places);
            return {
                validity: true,
                permutation: minPermutation,
                dateWisePlaceData: minPermutationDateWisePlaceData
            };
        }
        else {
            markSelectedPlaces(lastInvalidItinerary.permutation, lastInvalidItinerary.dateWisePlaceData, places);
            return lastInvalidItinerary;
        }
    }
    else {
        dateWisePlaceData.noPlacesVisited = 1;
        return {
            validity: true,
            permutation: [],
            dateWisePlaceData: dateWisePlaceData
        }
    }
}

function markSelectedPlaces(permutation, dateWisePlaceData, places){
    for(var permutationIndex = 0; permutationIndex < permutation.length; permutationIndex++){
        var permValue = permutation[permutationIndex];
        var place = dateWisePlaceData.placesData[permValue];
        place.placeAdded = true;
        if(place.isMeal == undefined || place.isMeal != 1){
            //Only if it not a meal
            places[place.placeIndex].placeAdded = true;
        }
    }
}

function getValidPermutation(placesPermutation, dateWisePlaceData, destination, previousDaysDateWisePlaceData, hotel) {
    //console.log('In getValidPermutation');
    //Making Copies for this permutation
    var dateWisePlaceData = clone.clone(dateWisePlaceData);
    var placesData = dateWisePlaceData.placesData;
    var startSightSeeingTime = dateWisePlaceData.startSightSeeingTime;
    var validity=true;
    var makeItinerary = function (isDepartureDate) {
        var startSightSeeingTimeInMin = getTimeOfDayInMinutesFromDate(startSightSeeingTime);
        dateWisePlaceData.hadMeals = [0, 0, 0];
        for (var i = 0; i < MEAL_CONSTANTS.length; i++) {
            if (startSightSeeingTimeInMin > MEAL_START_TIME[i]) {
                dateWisePlaceData.hadMeals[i] = 1;
            }
        }

        for (var j = 0; j < placesPermutation.length; j++) {
            console.log('For Place No.'+j+' of the day');
            console.log('Trying to see whether the place is open on current timings and adding the place if it is');
            var placeAdded = false;
            var distance = 0;
            var placeIndex = placesPermutation[j];
            console.log('PlaceIndex:'+placeIndex);
            console.log('Place:'+placesData[placeIndex].Name);
            if (j == 0) {
                //Getting distance between Hotel/Arrival Place to the 1st selected place
                distance = getDistance.getDistance(destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude,
                    placesData[placeIndex].Latitude, placesData[placeIndex].Longitude);
            }
            else {
                //Getting distance between Last Place to the current selected place
                distance = getDistance.getDistance(placesData[placesPermutation[j - 1]].Latitude, placesData[placesPermutation[j - 1]].Longitude,
                    placesData[placeIndex].Latitude, placesData[placeIndex].Longitude);
            }
            var timeInMinutes = ( distance * 60 ) / SPEED;
            if (j == 0) {
                console.log('This is the first place of the day');
                var startTime = startSightSeeingTime.clone();
                startTime.addMinutes(timeInMinutes);
                var lagTimeAndSelectedPlaceTimingIndex = getLagTimeAndSelectedPlaceTimingIndex(startTime, placesData[placeIndex]);
                var lagTime = lagTimeAndSelectedPlaceTimingIndex.lagTime;
                var selectedPlaceTimingIndex = lagTimeAndSelectedPlaceTimingIndex.selectedPlaceTimingIndex;
                console.log('Lag Time:'+lagTime);
                if (lagTime == 0) {
                    console.log('Place open at this time');
                    placesData[placeIndex].placeArrivalTime = startTime.clone();
                    placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(placesData[placeIndex].Time2Cover);
                    placeAdded = true;

                }
                else if (lagTime > 0) {
                    console.log('Place opening after time:'+lagTime);
                    startSightSeeingTime.addMinutes(lagTime);
                    placesData[placeIndex].placeArrivalTime = startTime.clone().addMinutes(lagTime);
                    placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(lagTime + placesData[placeIndex].Time2Cover);
                    placeAdded = true;
                }
                else if (lagTime == -1) {
                    console.log('Place closed before reaching');
                    //The place is closed before it can be reached. Hence not a valid permutation
                    validity = false;
                    placesPermutation.splice(j, 1);
                    j--;
                    if(j!=-1){
                        placeIndex = placesPermutation[j];
                    }
                    else {
                        placeIndex = -1;
                    }
                }
                else {
                    console.log('Place open but not enough time:'+(-1*lagTime));
                    //The place is open but not enough time. Hence checking if time = 75% of time2Cover
                    if ((-1 * lagTime) > (TIME2COVER_RATIO * placesData[placeIndex].Time2Cover)) {
                        console.log('Covering in less time');
                        //Place can still be covered in less time
                        placesData[placeIndex].placeArrivalTime = startTime.clone();
                        placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(-1 * lagTime);
                        placeAdded = true;
                    }
                    else {
                        console.log('Not covering place');
                        validity = false;
                        placesPermutation.splice(j, 1);
                        j--;
                        if(j!=-1){
                            placeIndex = placesPermutation[j];
                        }
                        else {
                            placeIndex = -1;
                        }
                    }
                }
            }
            else {
                console.log('This is some place after 1st place');
                console.log('Last Place:'+JSON.stringify(placesData[placesPermutation[j - 1]]));
                var startTime = placesData[placesPermutation[j - 1]].placeDepartureTime.clone();
                startTime.addMinutes(timeInMinutes); //Time taken to go from last place to this place
                var lagTimeAndSelectedPlaceTimingIndex = getLagTimeAndSelectedPlaceTimingIndex(startTime, placesData[placeIndex]);
                var lagTime = lagTimeAndSelectedPlaceTimingIndex.lagTime;
                var selectedPlaceTimingIndex = lagTimeAndSelectedPlaceTimingIndex.selectedPlaceTimingIndex;
                console.log('Lag Time:'+lagTime);
                if (lagTime == 0) {
                    console.log('Place open at this time');
                    placesData[placeIndex].placeArrivalTime = startTime.clone();
                    placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(placesData[placeIndex].Time2Cover);
                    placeAdded = true;
                }
                else if (lagTime > 0) {
                    console.log('Place opening after time:'+lagTime);
                    increaseDepartureTimeOfPlaceTillClosing(placesData[placesPermutation[j - 1]], lagTime);
                    placesData[placeIndex].placeArrivalTime = startTime.clone().clearTime().addMinutes(getTimeOfDayInMinutesFromString(placesData[placeIndex].PlaceTimings[selectedPlaceTimingIndex].TimeStart));
                    placesData[placeIndex].placeDepartureTime = placesData[placeIndex].placeArrivalTime.clone().addMinutes(placesData[placeIndex].Time2Cover);
                    placeAdded = true;
                }
                else if (lagTime == -1) {
                    console.log('Place closed before reaching');
                    //The place is closed before it can be reached. Hence not a valid permutation
                    validity = false;
                    placesPermutation.splice(j, 1);
                    j--;
                    if(j!=-1){
                        placeIndex = placesPermutation[j];
                    }
                    else {
                        placeIndex = -1;
                    }
                }
                else {
                    console.log('Place open but not enough time:'+(-1*lagTime));
                    //The place is open but not enough time. Hence checking if time = 75% of time2Cover
                    if ((-1 * lagTime) > (TIME2COVER_RATIO * placesData[placeIndex].Time2Cover)) {
                        console.log('Covering in less time');
                        //Place can still be covered in less time
                        placesData[placeIndex].placeArrivalTime = startTime.clone();
                        placesData[placeIndex].placeDepartureTime = startTime.clone().addMinutes(-1 * lagTime);
                        placeAdded = true;
                    }
                    else {
                        console.log('Not covering place');
                        validity = false;
                        placesPermutation.splice(j, 1);
                        j--;
                        if(j!=-1){
                            placeIndex = placesPermutation[j];
                        }
                        else {
                            placeIndex = -1;
                        }
                    }
                }
            }

            if(placeAdded) {
                console.log('The place was added');
                console.log('Place Timings Selected');
                console.log('placeArrivalTime:'+placesData[placeIndex].placeArrivalTime);
                console.log('placeDepartureTime:'+placesData[placeIndex].placeDepartureTime);

                var isPlaceRemoved = false;
                if(isDepartureDate){
                    if(Date.compare(placesData[placeIndex].placeArrivalTime,dateWisePlaceData.endSightSeeingTime)==1){
                        //1 means endSightSeeingTime < placeArrivalTime
                        console.log('Removing the place as arriving after endSightSeeingTime');
                        isPlaceRemoved = true;
                        placesPermutation.splice(j, 1);
                        j--;
                        if(j == -1){
                            placeIndex = -1;
                        }
                        else {
                            placeIndex = placesPermutation[j];
                        }
                        if(placesPermutation.length == 0) {
                            //No Places Left For this day
                            dateWisePlaceData.startSightSeeingTime = null;
                            dateWisePlaceData.endSightSeeingTime = null;
                            dateWisePlaceData.noPlacesVisited = 1;
                        }
                    }
                    else if(Date.compare(placesData[placeIndex].placeDepartureTime,dateWisePlaceData.endSightSeeingTime)==1)
                    {
                        //1 means endSightSeeingTime < placeDepartureTime
                        distance = getDistance.getDistance(placesData[placesPermutation[j]].Latitude, placesData[placesPermutation[j]].Longitude,
                            destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude);
                        timeInMinutes = ( distance * 60 ) / SPEED;
                        placesData[placeIndex].placeDepartureTime=dateWisePlaceData.endSightSeeingTime.clone().addMinutes(-timeInMinutes);
                        if(placesData[placeIndex].placeArrivalTime.getMinutesBetween(placesData[placeIndex].placeDepartureTime) < TIME2COVER_RATIO * placesData[placeIndex].Time2Cover){
                            console.log('removing place as not enough time to cover the place');
                            isPlaceRemoved = true;
                            placesPermutation.splice(j, 1);
                            j--;
                            placeIndex = placesPermutation[j];
                            if(placesPermutation.length == 0) {
                                //No Places Left For this day
                                dateWisePlaceData.startSightSeeingTime = null;
                                dateWisePlaceData.endSightSeeingTime = null;
                                dateWisePlaceData.noPlacesVisited = 1;
                            }
                        }
                    }
                }

                if(!isPlaceRemoved) {
                    //No place was removed
                    var mealRequired = checkWhichMealRequired(placesData[placeIndex].placeDepartureTime, dateWisePlaceData.hadMeals);
                    if (mealRequired != -1) {
                        fixMealTime(mealRequired, placesData, placeIndex, dateWisePlaceData.hadMeals);
                        placesPermutation.splice(j + 1, 0, placesData.length - 1);
                        j++;
                    }
                }

                if (!isDepartureDate && (j == placesPermutation.length - 1)) {
                    console.log('This is the last place of the day');
                    //This is the last place of the day
                    distance = getDistance.getDistance(placesData[placesPermutation[j]].Latitude, placesData[placesPermutation[j]].Longitude,
                        destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude);
                    timeInMinutes = ( distance * 60 ) / SPEED;
                    dateWisePlaceData.endSightSeeingTime = placesData[placesPermutation[j]].placeDepartureTime.clone().addMinutes(timeInMinutes);
                }
            }
            else {
                console.log('The place could not be added');
                if(j == placesPermutation.length - 1){
                    console.log('No more places left to add');
                    if(j==-1){
                        console.log('No place has been added till now');
                        dateWisePlaceData.noPlacesVisited = 1;
                        if(isDepartureDate){
                            dateWisePlaceData.startSightSeeingTime = null;
                            dateWisePlaceData.endSightSeeingTime = null;
                        }
                        else {
                            dateWisePlaceData.endSightSeeingTime = dateWisePlaceData.startSightSeeingTime;
                        }
                    }
                    else {
                        distance = getDistance.getDistance(placesData[placesPermutation[j]].Latitude, placesData[placesPermutation[j]].Longitude,
                            destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude);
                        timeInMinutes = ( distance * 60 ) / SPEED;
                        dateWisePlaceData.endSightSeeingTime = placesData[placesPermutation[j]].placeDepartureTime.clone().addMinutes(timeInMinutes);
                    }
                }
                else {
                    console.log('Moving on to next place in permutation');
                }
            }
        }
    };
    if(dateWisePlaceData.typeOfDay == 0) {
        console.log('Is arrival day');
        startSightSeeingTime = dateWisePlaceData.startSightSeeingTime;
        //Is arrival day
        if(startSightSeeingTime != null) {
            console.log('Places to be visited');
            //Places are to be visited on this day
            //Setting Meal Flags
            makeItinerary(false);
        }
        else {
            console.log('No places to be visited');
            //No places to be visited this day
            var distance = getDistance.getDistance(destination.LocationOfArrival.Latitude,
                destination.LocationOfArrival.Longitude,
                destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude);
            var timeInMinutes = ( distance * 60 )/SPEED;
            dateWisePlaceData.endSightSeeingTime = destination.arrivalTime.clone().addMinutes(timeInMinutes);
        }

    }
    else if(dateWisePlaceData.typeOfDay == 1) {
        console.log('Is normal day');
        //It is a normal day
        //if(previousDaysDateWisePlaceData != undefined && previousDaysDateWisePlaceData != null){
        var err =  setStartSightSeeingTime(dateWisePlaceData, previousDaysDateWisePlaceData, hotel);
        if(err != undefined){
            return err;
        }
        startSightSeeingTime = dateWisePlaceData.startSightSeeingTime;
        makeItinerary(false);
        //}
        //else {
            //console.log('Problem with previousDaysDateWisePlaceData.');
        //}
    }
    else if(dateWisePlaceData.typeOfDay==2)
    {
        console.log('Is departure day');
        //It is the departure day
        //if(dateWisePlaceData.endSightSeeingTime!=null) {
        var err =  setStartSightSeeingTime(dateWisePlaceData, previousDaysDateWisePlaceData, hotel);
        if(err != undefined){
            return err;
        }
        dateWisePlaceData.startSightSeeingTime = previousDaysDateWisePlaceData.endSightSeeingTime.clone().addMinutes(REST_TIME);
        startSightSeeingTime = dateWisePlaceData.startSightSeeingTime;
        makeItinerary(true);
        //}
    }
    else
    {
        console.log('Is arrival as well as departure day');
        //It is arrival as well as departure day
        startSightSeeingTime = dateWisePlaceData.startSightSeeingTime;
        makeItinerary(true);
    }
    console.log('Returning validity:'+validity+", data:"+dateWisePlaceData);
    return {
        validity : validity,
        dateWisePlaceData: dateWisePlaceData
    }
}

function fixMealTime(mealRequired, placesData, placeIndex, hadMeals) {
    console.log('Fixing Meal Time');
    var placeTimings = [];
    placeTimings.push({
        TimeStart:MEAL_START_TIME_STRING[mealRequired],
        TimeEnd: MEAL_END_TIME_STRING[mealRequired],
        Days: "0",
        isSelected: 1
    });
    var mealPlace = {
        Name: MEAL_CONSTANTS[mealRequired],
        Latitude: placesData[placeIndex].Latitude,
        Longitude: placesData[placeIndex].Longitude,
        Time2Cover: MEAL_DURATION[mealRequired],
        placeArrivalTime:placesData[placeIndex].placeDepartureTime,
        placeDepartureTime:placesData[placeIndex].placeDepartureTime.clone().addMinutes(MEAL_DURATION[mealRequired]),
        PlaceTimings: placeTimings,
        isMeal: 1
    };
    console.log('Had '+MEAL_CONSTANTS[mealRequired]);
    console.log('placeArrivalTime:'+mealPlace.placeArrivalTime);
    console.log('placeDepartureTime:'+mealPlace.placeDepartureTime);
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
    console.log('In increaseDepartureTimeOfPlaceTillClosing');
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
        console.log('WARNING : NO PLACE TIMING SELECTED');
    }
}

function getLagTimeAndSelectedPlaceTimingIndex(time, placeData) {
    //console.log('In getLagTimeAndSelectedPlaceTimingIndex');
    var placeTimings = placeData.PlaceTimings;
    var placeTime2Cover = placeData.Time2Cover;
    //console.log('placeTimings:'+JSON.stringify(placeTimings));
    var openStatus = 0;
    var currentSelectedTimings = -1;
    for(var i = 0; i < placeTimings.length; i++) {
        if(isOnSameDay(time, placeTimings[i].Days)) {
            //console.log('placeTimings is on the same day as:'+time);
            var nearestOpeningTime = getNearestOpeningTime(time, placeTimings[i], placeTime2Cover);
            //console.log('nearestOpeningTime:'+nearestOpeningTime);
            if(nearestOpeningTime == 0) {
                placeTimings[i].isSelected = 1;
                return {
                    lagTime: nearestOpeningTime,
                    selectedPlaceTimingIndex: i
                };
            }
            else if(nearestOpeningTime > 0) {
                currentSelectedTimings = i;
                openStatus = nearestOpeningTime;
            }
            else if(nearestOpeningTime < 0) {
                if(nearestOpeningTime < -1) {
                    currentSelectedTimings = i;
                    openStatus = nearestOpeningTime;
                }
                else if(nearestOpeningTime == -1) {
                    if(currentSelectedTimings == -1) {
                        //No better place timing than this one till now
                        openStatus = -1;
                    }
                }
            }
        }
    }
    //console.log('currentSelectedTimings:'+currentSelectedTimings);
    if(currentSelectedTimings != -1) {
        placeTimings[currentSelectedTimings].isSelected = 1;
    }
    else {
        openStatus = -1;
    }
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
    console.log('In getNearestOpeningTime');
    var timeOfReachingInMin = time.getHours() * 60 + time.getMinutes();
    var timeStartInMin = getTimeOfDayInMinutesFromString(placeTimings.TimeStart);
    console.log('timeOfReachingInMin:'+timeOfReachingInMin+', timeStartInMin:'+timeStartInMin+', timeEndInMin:'+placeTimings.TimeEnd);
    if(timeOfReachingInMin >= timeStartInMin) {
        //Place was opened before reaching time
        var timeEndInMin = getTimeOfDayInMinutesFromString(placeTimings.TimeEnd);
        console.log('timeEndInMin:'+timeEndInMin);
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
    if(days == '0') {
        return true;
    }
    var day = '' + (time.getDay() + 1);
    console.log('day:'+day);
    if(days.indexOf(day) == -1) {
        console.log('Not on same day');
        return false;
    }
    return true;
}

function getWeight(placesPermutation, dateWisePlaceData) {

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

function setStartSightSeeingTime(dateWisePlaceData, previousDaysDateWisePlaceData, hotel){
    if(previousDaysDateWisePlaceData.endSightSeeingTime == undefined || previousDaysDateWisePlaceData.endSightSeeingTime == null){
        //No end sight seeing time in previous day
        if(previousDaysDateWisePlaceData.typeOfDay == 0){
            //Previous day is 1st day
            if(previousDaysDateWisePlaceData.startSightSeeingTime == null){
                //No places visited on 1st day
                if(hotel != undefined){
                    //There is a hotel taken. startSightSeeingTime calculated according to hotel check in
                    dateWisePlaceData.startSightSeeingTime=hotel.checkInTime.clone().addMinutes(REST_TIME);
                }
                else {
                    //No hotel
                    var err = new Error('No hotel and no startSightSeeingTime and endSightSeeingTime for typeOfDay = 0', 1000);
                    console.log('ISSUE: No hotel and no startSightSeeingTime and endSightSeeingTime for typeOfDay = 0');
                    return err;
                }
            }
            else {
                err = new Error('StartSightSeeingTime Not Null and endSightSeeingTime not present for typeOfDay = 0', 1000);
                console.log('ISSUE: StartSightSeeingTime Not Null and endSightSeeingTime not present for typeOfDay = 0');
                return err;
            }
        }
        else {
            err = new Error('endSightSeeingTime not present for typeOfDay != 0', 1000);
            console.log('ISSUE: StartSightSeeingTime Not Null and endSightSeeingTime not present for typeOfDay = 0');
            return err;
        }
    }
    else {
        dateWisePlaceData.startSightSeeingTime = previousDaysDateWisePlaceData.endSightSeeingTime.clone().addMinutes(REST_TIME);
    }
    if(dateWisePlaceData.startSightSeeingTime.isBefore(dateWisePlaceData.currentDate)){
        //Startsightseeingtime before currentdate(this can be possible if adding resttime to endtime is still in last day). Need to move to current day
        dateWisePlaceData.startSightSeeingTime = dateWisePlaceData.currentDate.clone();
    }
}


module.exports.getOptimizedItinerary = getOptimizedItinerary;
