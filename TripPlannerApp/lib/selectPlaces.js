/**
 * Created by rkapoor on 18/01/15.
 */
require('date-utils');
getDistance = require('../lib/UtilityFunctions/getDistance');
var SPEED = 15; //In km/hr
function selectPlaces(destinationAndStops, placesData) {
    for(var i=0;i<destinationAndStops.destinations.length;i++)
    {
        destinationAndStops.destinations[i].places = placesData[i];
    }
    for(var i = 0; i < destinationAndStops.destinations.length; i++) {
        destinationAndStops.destinations[i].durationSpentInHours = destinationAndStops.destinations[i].arrivalTime.getHoursBetween(destinationAndStops.destinations[i].departureTime);
        //Hack to set durationSpentInHours
        //destinationAndStops.destinations[i].durationSpentInHours = 8;
        if( destinationAndStops.destinations[i].isHotelRequired == 1)
        {
            destinationAndStops.destinations[i].startLocationPosition = {
                Latitude : destinationAndStops.destinations[i].hotelDetails.Latitude,
                Longitude : destinationAndStops.destinations[i].hotelDetails.Longitude
            };
            var distance = getDistance.getDistance(destinationAndStops.destinations[i].LocationOfArrival.Latitude,
                destinationAndStops.destinations[i].LocationOfArrival.Longitude,
                destinationAndStops.destinations[i].startLocationPosition.Latitude, destinationAndStops.destinations[i].startLocationPosition.Longitude);
            var timeInMinutes = ( distance * 60 )/SPEED;
            var arrivalTime = destinationAndStops.destinations[i].arrivalTime.clone();
            destinationAndStops.destinations[i].hotelDetails.checkInTime = arrivalTime.addMinutes(timeInMinutes);
            distance = getDistance.getDistance(destinationAndStops.destinations[i].LocationOfDeparture.Latitude,
                destinationAndStops.destinations[i].LocationOfDeparture.Longitude,
                destinationAndStops.destinations[i].startLocationPosition.Latitude, destinationAndStops.destinations[i].startLocationPosition.Longitude);
            timeInMinutes = ( distance * 60 )/SPEED;
            var departureTime = destinationAndStops.destinations[i].departureTime.clone();
            destinationAndStops.destinations[i].hotelDetails.checkOutTime = departureTime.addMinutes(-timeInMinutes);
        }
        else {
            //No hotel present in the city. So the person would not be starting from the hotel but from the position he lands in the city
            destinationAndStops.destinations[i].startLocationPosition = destinationAndStops.destinations[i].LocationOfArrival;
        }
    }
    setMinimumPlacesToBeCovered(destinationAndStops);
    selectSetOfPlaces(destinationAndStops);
    return destinationAndStops;
}
function setMinimumPlacesToBeCovered(destinationAndStops) {
    for(var i = 0; i < destinationAndStops.destinations.length ; i++) {
        var minimumPlacesToBeCovered = 0;
        var timeSpentOnVisiting = 0;
        var durationSpentInHours = destinationAndStops.destinations[i].durationSpentInHours;
        console.log("durationSpentInHours:"+durationSpentInHours);
        if(durationSpentInHours < 24) {
            console.log("Less than 24hrs to spent in city");
            minimumPlacesToBeCovered = 2;
            if(destinationAndStops.destinations[i].isHotelRequired == 1) {
                timeSpentOnVisiting = durationSpentInHours / 2;
            }
            else {
                console.log("No hotel Required and less than 24hs in city");
                timeSpentOnVisiting = durationSpentInHours * (3/4);
            }
        }
        else {
            var days = Math.floor(durationSpentInHours / 24);
            if(days == 1) {
                minimumPlacesToBeCovered = 3;
            }
            else if(days == 2) {
                minimumPlacesToBeCovered = 5;
            }
            else {
                minimumPlacesToBeCovered = 5 + (days - 2);
            }
            timeSpentOnVisiting = 10 * days + ((durationSpentInHours - days * 24) * (3/4));
        }
        /*//Hack
        minimumPlacesToBeCovered = 45;
        //End of Hack*/
        destinationAndStops.destinations[i].minimumPlacesToBeCovered = minimumPlacesToBeCovered;
        //destinationAndStops.destinations[i].minimumPlacesToBeCovered = 4;//Hack
        destinationAndStops.destinations[i].timeSpentOnVisiting = timeSpentOnVisiting * 60;
    }
}
function selectSetOfPlaces(destinationAndStops) {
    console.log("In selectSetOfPlaces");
    var addPlacesToArray = function () {
        console.log("In addPlacesToArray");
        console.log('destination.timeSpentOnVisiting:'+destination.timeSpentOnVisiting);
        console.log('destination.places.length:'+destination.places.length);
        while (durationCovered < destination.timeSpentOnVisiting && currentPlaceIndex < destination.places.length) {
            console.log('durationCovered:'+durationCovered);
            console.log('currentPlaceIndex:'+currentPlaceIndex);
            var currentPlace = destination.places[currentPlaceIndex];
            var distance = getDistance.getDistance(destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude, currentPlace.Latitude, currentPlace.Longitude);
            var timeSpentOnTravelling = (distance / SPEED) * 60;
            console.log('distance:'+distance);
            console.log('timeSpentOnTravelling:'+timeSpentOnTravelling);
            var estimatedDurationOfPlace = timeSpentOnTravelling + currentPlace.Time2Cover;
            console.log('currentPlace.Time2Cover:'+currentPlace.Time2Cover);
            currentPlace.estimatedDurationOfPlace = estimatedDurationOfPlace;
            currentPlaceIndex++;
            if(currentPlace.Score < minimumScore) {
                minimumScore = currentPlace.Score;
            }
            if(isThingsToDo(currentPlace)) {
                console.log("Adding a thing to do:"+currentPlace.Name);
                thingsToDoSelected.push(currentPlace);
            }
            else {
                console.log("Adding a place:"+currentPlace.Name);
                durationCovered += estimatedDurationOfPlace;
                placesSelected.push(currentPlace);
                numberOfPlaces++;
            }
            console.log('durationCovered after adding:'+durationCovered);
            console.log('currentPlaceIndex after adding:'+currentPlaceIndex);
        }
    };
    for (var i = 0; i < destinationAndStops.destinations.length; i++) {
        console.log("In for loop");
        var placesSelected = [];
        var thingsToDoSelected = [];
        var destination = destinationAndStops.destinations[i];
        var durationCovered = 0;
        var currentPlaceIndex = 0;
        var numberOfPlaces = 0;
        var minimumScore = 100;
        console.log('destination.minimumPlacesToBeCovered:'+destination.minimumPlacesToBeCovered);
        var minimumThingsToDo = destination.minimumPlacesToBeCovered / 3;
        addPlacesToArray();
        console.log('numberOfPlaces:'+numberOfPlaces+",currentPlaceIndex:"+currentPlaceIndex);
        var averageScoreOfPlacesInitial = getAverageScoreOfPlaces(placesSelected);
        while (numberOfPlaces < destination.minimumPlacesToBeCovered && currentPlaceIndex < destination.places.length) {
            console.log('currentPlaceIndex:'+currentPlaceIndex);
            if(averageScoreOfPlacesInitial * 0.8 < getAverageScoreOfPlaces(placesSelected)) {
                durationCovered = removePlaceWithMaxEstimatedDurationOfPlace(placesSelected, durationCovered);
                numberOfPlaces--;
                addPlacesToArray();
            }
            else {
                break;
            }
        }
        if(thingsToDoSelected.length < minimumThingsToDo && currentPlaceIndex < destination.places.length) {
            while(currentPlaceIndex < destination.places.length && thingsToDoSelected.length < minimumThingsToDo) {
                var currentPlace = destination.places[currentPlaceIndex];
                if(isThingsToDo(currentPlace)) {
                    if(currentPlace.Score < minimumScore * 0.8) {
                        break;
                    }
                    else {
                        var distance = getDistance.getDistance(destination.startLocationPosition.Latitude, destination.startLocationPosition.Longitude, currentPlace.Latitude, currentPlace.Longitude);
                        var timeSpentOnTravelling = (distance / SPEED) * 60;
                       // console.log('distance:'+distance);
                        //console.log('timeSpentOnTravelling:'+timeSpentOnTravelling);
                        var estimatedDurationOfPlace = timeSpentOnTravelling + currentPlace.Time2Cover;
                        //console.log('currentPlace.Time2Cover:'+currentPlace.Time2Cover);
                        currentPlace.estimatedDurationOfPlace = estimatedDurationOfPlace;
                        thingsToDoSelected.push(currentPlace);
                    }
                }
                currentPlaceIndex ++;
            }
        }
        destinationAndStops.destinations[i].placesSelected = placesSelected;
        destinationAndStops.destinations[i].thingsToDoSelected = thingsToDoSelected;
        for(var i = 0; i < placesSelected.length; i++) {
            console.log(i+":"+JSON.stringify(placesSelected[i]));
        }
        for(var i = 0; i < thingsToDoSelected.length; i++) {
            console.log(i+":"+JSON.stringify(thingsToDoSelected[i]));
        }
    }
    console.log('returns places');
}
function removePlaceWithMaxEstimatedDurationOfPlace(placesSelected, durationCovered) {
    console.log("Removing a place");
    var maxDurationPlaceIndex = 0;
    var maxEstimatedDurationOfPlace = placesSelected[0].estimatedDurationOfPlace;
    for(var i = 0; i < placesSelected.length; i ++) {
        if(placesSelected[i].estimatedDurationOfPlace > maxEstimatedDurationOfPlace) {
            maxDurationPlaceIndex = i;
            maxEstimatedDurationOfPlace = placesSelected[i].estimatedDurationOfPlace;
        }
    }
    durationCovered -= maxEstimatedDurationOfPlace;
    placesSelected.splice(maxDurationPlaceIndex, 1);
    return durationCovered;
}
function getAverageScoreOfPlaces(placesSelected) {
    var sumOfScore = 0;
    for(var i = 0; i < placesSelected.length; i++) {
        sumOfScore += placesSelected[i].Score;
    }
    if(placesSelected.length != 0) {
        return sumOfScore/placesSelected.length;
    }
    return 0;
}

function isThingsToDo(place) {
    var thingsToDoFlag = 15360;
    if ((place.Taste & thingsToDoFlag) != 0) {
        console.log('Place '+place.Name+' is things to do');
        return true;
    }
    return false;
}

module.exports.selectPlaces = selectPlaces;
