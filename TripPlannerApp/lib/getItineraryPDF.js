/**
 * Created by rkapoor on 02/05/15.
 */
'use strict';
require('date-utils');
var path = require("path");
var pdf = require('phantom-html2pdf');
var fs = require('fs');
var randomstring = require("randomstring");
var doc;

function getItineraryPDF(travelData, itineraryData, returnPDF){

    var defaultTrip = getDefaultTrip(travelData);

    var htmlContent = '<!DOCTYPE html>';
    var head = getHead();
    htmlContent += head;
    var logo = getLogo();
    var salutation = getSalutation();
    var travelDetailsPanel = getTravelDetailsPanel(defaultTrip);
    var hotelDetailsPanel = getHotelDetailsPanel(itineraryData);
    var itineraryDetailsPanel = getItineraryDetailsPanel(itineraryData);
    htmlContent += addToTag('body', logo + salutation + travelDetailsPanel + hotelDetailsPanel + itineraryDetailsPanel);
    htmlContent += '</html>';

    var itineraryId = randomstring.generate();
    var htmlFilePath = "public/saved_itinerary/html/"+itineraryId+".html";
    var pdfFilePath = "public/saved_itinerary/pdf/"+itineraryId+".pdf";
    var publicPdfFilePath = "saved_itinerary/pdf/"+itineraryId+".pdf";
    var fileName = itineraryId+".pdf";
    var options = {
        "html" : htmlFilePath,
        "css" : "public/css/bootstrapCSS/bootstrap.min.css",
        //"js" : "Path to additional JavaScript file",
        //"runnings" : "Path to runnings file. Check further below for explanation.",
        "deleteOnAction" : false //(Deletes the created temp file once you access it via toBuffer() or toFile())
    };

    fs.writeFile(htmlFilePath, htmlContent, function(err) {
        if(err) {
            console.log("error in writefile:"+err);
            return err;
        }
        console.log("The html file was saved!:"+htmlFilePath);

        pdf.convert(options, function(result) {

            /* Using a buffer and callback */
            result.toBuffer(function(returnedBuffer) {});

            /* Using a readable stream */
            var stream = result.toStream();

            /* Using the temp file path */
            var tmpPath = result.getTmpPath();
            console.log(tmpPath);

            /* Using the file writer and callback */
            result.toFile(pdfFilePath, function(err) {
                if(err){
                    console.log(err);
                }
                returnPDF(publicPdfFilePath, fileName);
            });
        });


    });

}

function getHead(){
    var head = '<head lang="en">'
        +'<meta charset="UTF-8">'
        +'<title></title>'
        +'<link rel="stylesheet" type="text/css" href="/TripPlannerApp/public/css/bootstrapCSS/bootstrap.min.css">'
        +'</head>';
    return head;
}

function addToTag(tag, content){
    return '<'+tag+'>' + content + '</'+tag + '>';
}

function getLogo(){
    var logo = '<div class="row">'
        +'<div class="col-xs-3">'
    +'<img src="'+path.resolve(".")+'/public/images/Logo.png" alt="tripsonair" class="img-responsive" style="width: 100%">'
    +'</div>'
    +'</div>';
    return logo;
}

function getSalutation(){
    var salutationText = 'You have successfully created your itinerary. Your trip details are given below. It was a great pleasure serving you. We look forward to your visit again. Have a happy journey.';
    var salutation = '<div class="row" style="padding-top: 5%">'
        +'<div class="col-xs-1"></div>'
    +'<div class="col-xs-10">'
    +'<p>Dear User,</p>'
    +'<p>'+salutationText+'</p>'
    +'</div>'
    +'<div class="col-xs-1"></div>'
    +'</div>';
    return salutation;
}

function getItineraryDetailsPanel(itinerary){
    var outerPanelStart = '<div class="panel panel-primary">';
    var outerPanelEnd = '</div>';
    var panelHeading = '<div class="panel-heading text-center">'
        +'<h3>Itinerary</h3>'
        +'</div>';
    var outerPanelBodyStart = '<div class="panel-body">';
    var outerPanelBodyEnd = '</div>';
    var innerPanels = getInnerItineraryPanels(itinerary);

    if(innerPanels != '') {
        return outerPanelStart + panelHeading + outerPanelBodyStart + innerPanels + outerPanelBodyEnd + outerPanelEnd;
    }
    return '';
}

function getHotelDetailsPanel(itinerary){
    var outerPanelStart = '<div class="panel panel-primary">';
    var outerPanelEnd = '</div>';
    var panelHeading = '<div class="panel-heading text-center">'
        +'<h3>Hotel Details</h3>'
        +'</div>';
    var outerPanelBodyStart = '<div class="panel-body">';
    var outerPanelBodyEnd = '</div>';
    var innerPanels = getInnerHotelPanels(itinerary);

    if(innerPanels != '') {
        console.log('hotel panel not empty');
        return outerPanelStart + panelHeading + outerPanelBodyStart + innerPanels + outerPanelBodyEnd + outerPanelEnd;
    }
    console.log('hotel panel empty');
    return '';
}

function getTravelDetailsPanel(trip){
    var outerPanelStart = '<div class="panel panel-primary">';
    var outerPanelEnd = '</div>';
    var panelHeading = '<div class="panel-heading text-center">'
                            +'<h3>Travel Details</h3>'
                        +'</div>';
    var outerPanelBodyStart = '<div class="panel-body">';
    var outerPanelBodyEnd = '</div>';

    var innerPanels = getInnerPanels(trip);

    return outerPanelStart + panelHeading + outerPanelBodyStart + innerPanels + outerPanelBodyEnd + outerPanelEnd;
}

function getInnerItineraryPanels(itinerary){
    var innerPanels = '';
    var innerPanelStart = '<div class="panel panel-default">';
    var innerPanelEnd = '</div>';

    if(itinerary != undefined){
        for(var destinationIndex = 0; destinationIndex < itinerary.destinations.length; destinationIndex++){
            var destination = itinerary.destinations[destinationIndex];
            innerPanels += innerPanelStart;
            innerPanels += getInnerPlacePanelHeading(destination.name);
            innerPanels += getItineraryPanels(destination);
            innerPanels += innerPanelEnd;

        }
        return innerPanels;
    }
    else {
        console.log('itinerary is undefined');
        return '';
    }
}


function getInnerHotelPanels(itinerary){
    var innerPanels = '';
    var innerPanelStart = '<div class="panel panel-default">';
    var innerPanelEnd = '</div>';

    if(itinerary != undefined){
        for(var destinationIndex = 0; destinationIndex < itinerary.destinations.length; destinationIndex++){
            var destination = itinerary.destinations[destinationIndex];
            if(destination.hotelDetails != undefined){
                innerPanels += innerPanelStart;
                var hotel = destination.hotelDetails;
                innerPanels += getInnerPlacePanelHeading(destination.name);
                innerPanels += getHotelPanel(hotel);
                innerPanels += innerPanelEnd;
            }
        }
        return innerPanels;
    }
    else {
        console.log('itinerary is undefined');
        return '';
    }
}

function getItineraryPanels(destination){
    var itineraryPanels = '';
    var itineraryPanelsStart = '<div class="panel panel-default">';
    var itineraryPanelsEnd = '</div>';
    var segmentPanelStart = '<div class="panel-body">';
    var segmentPanelEnd = '</div>';

    var arrivalPanelDiv = getArrivalPanelDiv(destination.lastMajorSegment);
    var departurePanelDiv = getDeparturePanelDiv(destination.firstMajorSegment);

    var hasHotel = (destination.isHotelRequired == 1);
    var hotel = destination.hotelDetails;

    itineraryPanels += arrivalPanelDiv;

    for(var dateWiseItineraryIndex = 0; dateWiseItineraryIndex < destination.dateWiseItinerary.length; dateWiseItineraryIndex++){
        var dateWiseItinerary = destination.dateWiseItinerary[dateWiseItineraryIndex];
        var dateWisePlaceData = dateWiseItinerary.dateWisePlaceData;
        var previousDateWiseItinerary, previousDateWisePlaceData;
        if(dateWiseItineraryIndex > 0){
            previousDateWiseItinerary = destination.dateWiseItinerary[dateWiseItineraryIndex-1];
            previousDateWisePlaceData = previousDateWiseItinerary.dateWisePlaceData;
        }
        if(dateWisePlaceData != undefined){
            if(dateWisePlaceData.typeOfDay == "0" || dateWisePlaceData.typeOfDay == "3"){
                if(!(dateWisePlaceData.noPlacesVisited != undefined && dateWisePlaceData.noPlacesVisited == 1)){
                    var morningCheckInHotelDiv = '';
                    if(hasHotel){
                        morningCheckInHotelDiv += getMorningCheckInDiv(hotel, dateWisePlaceData);
                    }
                    itineraryPanels += getCombinedPanel(itineraryPanelsStart, segmentPanelStart, morningCheckInHotelDiv, segmentPanelEnd, itineraryPanelsEnd);
                }
            }
            else {
                var hotelDiv = '';
                if(hasHotel){
                    hotelDiv += getHotelDiv(hotel, dateWisePlaceData, previousDateWisePlaceData);
                }
                itineraryPanels += getCombinedPanel(itineraryPanelsStart, segmentPanelStart, hotelDiv, segmentPanelEnd, itineraryPanelsEnd);
            }
        }
        else {
            console.log('dateWisePlaceData undefined');
        }
        for(var permutationIndex = 0; permutationIndex < dateWiseItinerary.permutation.length; permutationIndex++){
            var place = dateWisePlaceData.placesData[dateWiseItinerary.permutation[permutationIndex]];
            var placeDiv = getPlaceDiv(place);
            itineraryPanels += getCombinedPanel(itineraryPanelsStart, segmentPanelStart, placeDiv, segmentPanelEnd, itineraryPanelsEnd);
        }
        if(dateWisePlaceData != undefined){
            if(dateWisePlaceData.typeOfDay == "2" || dateWisePlaceData.typeOfDay == "3"){
                if(!(dateWisePlaceData.noPlacesVisited != undefined && dateWisePlaceData.noPlacesVisited == 1)){
                    var eveningCheckOutHotelDiv = '';
                    if(hasHotel){
                        eveningCheckOutHotelDiv += getEveningCheckOutDiv(hotel, dateWisePlaceData);
                    }
                    itineraryPanels += getCombinedPanel(itineraryPanelsStart, segmentPanelStart, eveningCheckOutHotelDiv, segmentPanelEnd, itineraryPanelsEnd);
                }
            }
        }
        else {
            console.log('dateWisePlaceData undefined');
        }
    }

    itineraryPanels += departurePanelDiv;
    return itineraryPanels;
}

function getCombinedPanel(itineraryPanelsStart, segmentPanelStart, panelDiv, segmentPanelEnd, itineraryPanelsEnd){
    if(panelDiv != ''){
        return itineraryPanelsStart + segmentPanelStart + panelDiv + segmentPanelEnd + itineraryPanelsEnd;
    }
    return '';
}

function getPlaceDiv(place){
    return getInnerItineraryPanelDiv(place.placeArrivalTime, place.placeDepartureTime, place.Name, place.AdultCharge);
}

function getMorningCheckInDiv(hotel, dateWisePlaceData){
    return getInnerItineraryPanelDiv(hotel.checkInTime, dateWisePlaceData.startSightSeeingTime, hotel.Name);
}

function getEveningCheckOutDiv(hotel, dateWisePlaceData){
    return getInnerItineraryPanelDiv(dateWisePlaceData.endSightSeeingTime, hotel.checkOutTime, hotel.Name);
}

function getHotelDiv(hotel, dateWisePlaceData, previousDateWisePlaceData){
    var arrivalTime, departureTime;
    if(previousDateWisePlaceData != undefined){
        if(previousDateWisePlaceData.noPlacesVisited != undefined && previousDateWisePlaceData.noPlacesVisited == 1){
            arrivalTime = hotel.checkInTime;
        }
        else {
            arrivalTime = previousDateWisePlaceData.endSightSeeingTime;
        }
    }
    else {
        arrivalTime = hotel.checkInTime;
    }
    if(dateWisePlaceData != undefined){
        if(dateWisePlaceData.typeOfDay == "2" || dateWisePlaceData.typeOfDay == "3"){
            if(dateWisePlaceData.noPlacesVisited != undefined && dateWisePlaceData.noPlacesVisited == 1){
                departureTime = hotel.checkOutTime;
            }
            else if(dateWisePlaceData.startSightSeeingTime != undefined){
                departureTime = dateWisePlaceData.startSightSeeingTime;
            }
            else {
                departureTime = hotel.checkOutTime;
            }
        }
        else {
            departureTime = dateWisePlaceData.startSightSeeingTime;
        }
    }
    else {
        console.log('dateWisePlaceData undefined');
    }
    return getInnerItineraryPanelDiv(arrivalTime, departureTime, hotel.Name);
}

function getInnerItineraryPanelDiv(arrivalDate, departureDate, placeName, placeCost){
    if(placeCost != undefined && placeCost != '' && placeCost > 0){
        placeCost = "Rs."+placeCost;
    }
    else {
        placeCost = '';
    }
    return '<div class="panel-body">'
                +'<div class="col-xs-3">'
                    +'<div class="row">'
                        +getFormattedDate(arrivalDate)
                    +'</div>'
                    +'<div class="row">'
                        +getFormattedTime(arrivalDate)
                    +'</div>'
                +'</div>'
                +'<div class="col-xs-3">'
                    +'<div class="row">'
                        +getFormattedDate(departureDate)
                    +'</div>'
                    +'<div class="row">'
                        +getFormattedTime(departureDate)
                    +'</div>'
                +'</div>'
                +'<div class="col-xs-4">'
                    +'<div class="row">'
                        +placeName
                    +'</div>'
                +'</div>'
                +'<div class="col-xs-2">'
                    +'<div class="row">'
                        +placeCost
                    +'</div>'
                +'</div>'
            +'</div>';
}

function getInnerPanels(trip){
    var innerPanels = '';
    var innerPanelStart = '<div class="panel panel-default">';
    var innerPanelEnd = '</div>';
    var segmentPanelStart = '<div class="panel-body">';
    var segmentPanelEnd = '</div>';

    if(trip != undefined){
        for(var legIndex = 0; legIndex < trip.rome2RioData.length; legIndex++){
            innerPanels += innerPanelStart;
            var fromPlace = trip.rome2RioData[legIndex].places[0].name;
            var toPlace = trip.rome2RioData[legIndex].places[1].name;
            var routes = trip.rome2RioData[legIndex].routes;
            for(var routesIndex = 0; routesIndex < routes.length; routesIndex++){
                var route = routes[routesIndex];
                if(route.isDefault == 1){
                    var mode = route.name;
                    innerPanels += getInnerPanelHeading(fromPlace,toPlace,mode);
                    innerPanels += segmentPanelStart;
                    for(var segmentIndex = 0; segmentIndex < route.segments.length; segmentIndex++){
                        var segment = route.segments[segmentIndex];
                        if(segment.isMajor == 1){
                            if(segment.kind == "flight"){
                                innerPanels += innerPanelStart;
                                innerPanels += getFlightSegmentPanel(segment);
                            }
                            else if(segment.kind == "train"){
                                innerPanels += innerPanelStart;
                                innerPanels += getTrainSegmentPanel(segment);
                            }
                            else if(segment.kind == "car" && segment.subkind == "cab"){
                                innerPanels += getCabSegmentPanel(segment, innerPanelStart);
                            }
                            innerPanels += innerPanelEnd;
                        }
                    }
                    innerPanels += segmentPanelEnd;
                }
            }
            innerPanels += innerPanelEnd;
        }
        return innerPanels;
    }
    else {
        console.log('trip is undefined');
        return '';
    }
}

function getArrivalPanelDiv(segment){
    var panelStart = '<div class="panel panel-default">';
    var panelEnd = '</div>';
    var arrivalDateFormatted = getFormattedDate(segment.endTime);
    var arrivalTimeFormatted = getFormattedTime(segment.endTime);
    var panelDiv =  '<div class="panel-body">'
                +'<div class="col-xs-4">'
                    +'<div class="row">'
                        +arrivalDateFormatted
                    +'</div>'
                    +'<div class="row">'
                        +arrivalTimeFormatted
                    +'</div>'
                +'</div>'
                +'<div class="col-xs-8">'
                    +'<div class="row">'
                        +getArrivalTitleText(segment)
                    +'</div>'
                +'</div>'
            +'</div>';
    return panelStart + panelDiv + panelEnd;
}

function getDeparturePanelDiv(segment){
    var panelStart = '<div class="panel panel-default">';
    var panelEnd = '</div>';
    var departureDateFormatted = getFormattedDate(segment.startTime);
    var departureTimeFormatted = getFormattedTime(segment.startTime);
    var panelDiv = '<div class="panel-body">'
                +'<div class="col-xs-4">'
                    +'<div class="row">'
                        +departureDateFormatted
                    +'</div>'
                    +'<div class="row">'
                        +departureTimeFormatted
                    +'</div>'
                +'</div>'
                +'<div class="col-xs-8">'
                    +'<div class="row">'
                        +getDepartureTitleText(segment)
                    +'</div>'
                +'</div>'
            +'</div>';
    return panelStart + panelDiv + panelEnd;
}

function getArrivalTitleText(segment){
    if(segment.kind == "flight"){
        return "Arrive at "+segment.tCode+" Airport";
    }
    else if(segment.kind == "train"){
        return "Arrive at "+segment.tName+" Station";
    }
    else if(segment.kind == "bus"){
        return "Arrive at "+segment.tName+" Bus Stand";
    }
    else if(segment.kind == "car"){
        return "Arrive at "+segment.tName;
    }
}

function getDepartureTitleText(segment){
    if(segment.kind == "flight"){
        return "Depart from "+segment.sCode+" Airport";
    }
    else if(segment.kind == "train"){
        return "Depart from "+segment.sName+" Station";
    }
    else if(segment.kind == "bus"){
        return "Depart from "+segment.sName+" Bus Stand";
    }
    else if(segment.kind == "car"){
        return "Depart from "+segment.sName;
    }
}

function getHotelPanel(hotel){
    var hotelPanelStart = '<div class="panel-body">';
    var hotelPanelEnd = '</div>';
    var hotelDataDiv = '<div class="col-xs-5">'
                            +'<div class="row">'
                                +hotel.Name
                            +'</div>'
                            +'<div class="row">'
                                +hotel.Locality
                            +'</div>'
                        +'</div>'
                        +'<div class="col-xs-5">'
                            +'<div class="row">'
                                +hotel.RoomType
                            +'</div>'
                            +'<div class="row">'
                                +'Check-In:'+getFormattedDate(hotel.checkInTime)+' '+getFormattedTime(hotel.checkInTime)
                            +'</div>'
                            +'<div class="row">'
                                +'Check-Out:'+getFormattedDate(hotel.checkOutTime)+' '+getFormattedTime(hotel.checkOutTime)
                            +'</div>'
                        +'</div>'
                        +'<div class="col-xs-2">'
                            +'<div class="row">'
                                +'Rs.'+hotel.pricePerPerson
                            +'</div>'
                        +'</div>';
    return hotelPanelStart + hotelDataDiv + hotelPanelEnd;
}

function getCabSegmentPanel(segment, innerPanelStart){
    var sCode = segment.sName;
    var tCode = segment.tName;
    var startTime = new Date(segment.startTime);
    var endTime = new Date(segment.endTime);
    var startDateFormatted = getFormattedDate(startTime);
    var endDateFormatted = getFormattedDate(endTime);
    var startTimeFormatted = getFormattedTime(startTime);
    var endTimeFormatted = getFormattedTime(endTime);
    var segmentPanelHeading = '<h6 class="text-center">'+sCode+' To '+tCode+' (Cab)</h6>';
    var segmentPanelStart = '<div class="panel-body">';
    var segmentPanelEnd = '</div>';
    var cabDetailsPanelStart = '<div class="panel panel-default">';
    var cabDetailsPanelHeading = '<h6 class="text-center">Combined Cab Details</h6>';
    var cabDetailsPanelEnd = '</div>';
    var cabDetailsPanel = '';
    var dataDiv = '';
    if(segment.CabDetails != undefined){
        for(var dataIndex = 0; dataIndex < segment.CabDetails.length; dataIndex++){
            var cabData = segment.CabDetails[dataIndex];
            if(cabData.isFinal != undefined && cabData.isFinal == 1){
                for(var operatorIndex = 0; operatorIndex < cabData.OperatorPrices.length; operatorIndex++){
                    var operator = cabData.OperatorPrices[operatorIndex];
                    if(operator.isFinal != undefined && operator.isFinal == 1){
                        cabDetailsPanel += cabDetailsPanelStart;
                        cabDetailsPanel += cabDetailsPanelHeading;
                        cabDetailsPanel += getCabOperatorDataDiv(cabData.SegmentType, cabData.NumberOfCabs, cabData.Seats, operator.Operator, operator.ActualCabPrice);
                        cabDetailsPanel += cabDetailsPanelEnd;
                    }
                }
            }
        }
    }
    dataDiv += getCabDataDiv(startTimeFormatted, endTimeFormatted, startDateFormatted, endDateFormatted);
    return cabDetailsPanel + innerPanelStart + segmentPanelHeading + segmentPanelStart + dataDiv + segmentPanelEnd;
}

function getCabDataDiv(startTimeFormatted, endTimeFormatted, startDateFormatted, endDateFormatted){
    var cabDataDiv = '<div class="panel-body">'
                        +'<div class="col-xs-6">'
                            +'<div class="row">'
                                +startDateFormatted
                            +'</div>'
                            +'<div class="row">'
                                +startTimeFormatted
                            +'</div>'
                        +'</div>'
                        +'<div class="col-xs-6">'
                            +'<div class="row">'
                                +endDateFormatted
                            +'</div>'
                            +'<div class="row">'
                                +endTimeFormatted
                            +'</div>'
                        +'</div>'
                    +'</div>';
    return cabDataDiv;
}

function getCabOperatorDataDiv(segmentType, numberOfCabs, seats, operator, actualCabPrice){
    var cabDataDiv = '<div class="panel-body">'
                        +'<div class="col-xs-5">'
                            +'<div class="row">'
                                +segmentType+' X '+numberOfCabs
                            +'</div>'
                            +'<div class="row">'
                                +seats+' Seater'
                            +'</div>'
                        +'</div>'
                        +'<div class="col-xs-5">'
                            +'<div class="row">'
                                +operator
                            +'</div>'
                        +'</div>'
                        +'<div class="col-xs-2">'
                            +'Rs.'+actualCabPrice
                        +'</div>'
                    +'</div>';
    return cabDataDiv;
}

function getTrainSegmentPanel(segment){
    var sCode = segment.sCode;
    var tCode = segment.tCode;
    var startTime = new Date(segment.startTime);
    var endTime = new Date(segment.endTime);
    var startTimeFormatted = getFormattedDate(startTime);
    var endTimeFormatted = getFormattedDate(endTime);
    var segmentPanelHeading = '<h6 class="text-center">'+sCode+' To '+tCode+' (Train)</h6>';
    var segmentPanelStart = '<div class="panel-body">';
    var segmentPanelEnd = '</div>';
    var dataDiv = '';
    for(var dataIndex = 0; dataIndex < segment.trainData.length; dataIndex++){
        var trainData = segment.trainData[dataIndex];
        if(trainData.isFinal != undefined && trainData.isFinal == 1){
            dataDiv += getTrainDataDiv(trainData.TrainName, trainData.TrainNo, trainData.OriginDepartureTime, trainData.DestArrivalTime, trainData.OriginStationCode, trainData.DestStationCode, trainData.fare, startTimeFormatted, endTimeFormatted);
        }
    }
    return segmentPanelHeading + segmentPanelStart + dataDiv + segmentPanelEnd;
}

function getFlightSegmentPanel(segment){
    var sCode = segment.sCode;
    var tCode = segment.tCode;
    var startTime = new Date(segment.startTime);
    var endTime = new Date(segment.endTime);
    var startTimeFormatted = getFormattedDate(startTime);
    var endTimeFormatted = getFormattedDate(endTime);
    var flightSegmentPanelHeading = '<h6 class="text-center">'+sCode+' To '+tCode+' (Flight)</h6>';
    var flightSegmentPanelStart = '<div class="panel-body">';
    var flightSegmentPanelEnd = '</div>';
    var flightDataDiv = '';
    for(var flightDataIndex = 0; flightDataIndex < segment.flightData.length; flightDataIndex++){
        var flightData = segment.flightData[flightDataIndex];
        if(flightData.isFinal != undefined && flightData.isFinal == 1){
            flightDataDiv += getFlightDataDiv(flightData.Operator, flightData.FlightNumber, flightData.OriginDepartureTime, flightData.DestArrivalTime, flightData.Hops, flightData.OriginAirportCode, flightData.DestinationAirportCode, flightData.OriginAirportName, flightData.DestinationAirportName, startTimeFormatted, endTimeFormatted);
        }
    }
    return flightSegmentPanelHeading + flightSegmentPanelStart + flightDataDiv + flightSegmentPanelEnd;
}

function getFlightDataDiv(operator, flightNumber, departureTime, arrivalTime, hops, originAirportCode, destinationAirportCode, originAirportName, destinationAirportName, startTimeFormatted, endTimeFormatted){
    var flightDataDiv = '<div class="panel-body">'
                            +'<div class="col-xs-4">'
                                +'<div class="row">'
                                    +operator
                                +'</div>'
                                +'<div class="row">'
                                    +flightNumber
                                +'</div>'
                            +'</div>'
                            +'<div class="col-xs-4">'
                                +'<div class="row">'
                                    +startTimeFormatted
                                +'</div>'
                                +'<div class="row">'
                                    +departureTime
                                +'</div>'
                                +'<div class="row">'
                                    +originAirportName+' ('+originAirportCode+')'
                                +'</div>'
                            +'</div>'
                            +'<div class="col-xs-4">'
                                +'<div class="row">'
                                    +endTimeFormatted
                                +'</div>'
                                +'<div class="row">'
                                    +arrivalTime
                                +'</div>'
                                +'<div class="row">'
                                    +destinationAirportName+' ('+destinationAirportCode+')'
                                +'</div>'
                            +'</div>'
                        +'</div>';
    return flightDataDiv;
}

function getTrainDataDiv(trainName, trainNo, originDepartureTime, destArrivalTime, originStationCode, destStationCode, fare, startTimeFormatted, endTimeFormatted){
    var trainDataDiv = '<div class="panel-body">'
                            +'<div class="col-xs-4">'
                                +'<div class="row">'
                                    +trainNo
                                +'</div>'
                                +'<div class="row">'
                                    +trainName
                                +'</div>'
                            +'</div>'
                            +'<div class="col-xs-3">'
                                +'<div class="row">'
                                    +startTimeFormatted
                                +'</div>'
                                +'<div class="row">'
                                    +originDepartureTime
                                +'</div>'
                                +'<div class="row">'
                                    +originStationCode
                                +'</div>'
                            +'</div>'
                            +'<div class="col-xs-3">'
                                +'<div class="row">'
                                    +endTimeFormatted
                                +'</div>'
                                +'<div class="row">'
                                    +destArrivalTime
                                +'</div>'
                                +'<div class="row">'
                                    +destStationCode
                                +'</div>'
                            +'</div>'
                            +'<div class="col-xs-2">'
                                +fare
                            +'</div>'
                        +'</div>';
    return trainDataDiv
}

function getInnerPanelHeading(fromPlace, toPlace, mode){
    return '<h5 class="text-center">'+fromPlace+' To '+toPlace+' ('+mode+')</h5>';
}

function getInnerPlacePanelHeading(name){
    return '<h5 class="text-center">'+name+'</h5>';
}

function addTravelPlaces(fromPlace, toPLace, index){
    doc.fontSize(12)
        .text((index+1) + '. '+ fromPlace + ' To '+toPLace);
}

function addTravelKind(kind){
    doc.fontSize(12)
        .text(kind);
}

function addFlightData(operator, flightNumber, departureTime, arrivalTime, hops, originAirportCode, destinationAirportCode, originAirportName, destinationAirportName){
    doc.fontSize(10)
        .text(departureTime + '-' + arrivalTime + ' ' + flightNumber + ' ' + operator);

    doc.fontSize(10)
        .text(originAirportCode + '-' + destinationAirportCode);

}

function getDefaultTrip(travelData){
    var travelDataSet = false;
    if(travelData.withTaxiRome2rioData == undefined || travelData.withTaxiRome2rioData == null){
        travelData = travelData.withoutTaxiRome2rioData;
        travelDataSet = true;
    }
    else if(travelData.withoutTaxiRome2rioData == undefined || travelData.withoutTaxiRome2rioData == null){
        travelData = travelData.withTaxiRome2rioData;
        travelDataSet = true;
    }

    if((!travelDataSet) || travelData.isMajorDefault != 1){
        //There is some problem with the data
        console.log('There is some problem with the data. Aborting.');
        //tripNotPossibleResponse(res);
    }

    return travelData;
}

function getFormattedDate(date){
    if(!(date instanceof Date)){
        date = new Date(date);
    }
    return date.toFormat('D') +' '+ date.toFormat('MMM') +' '+ date.toFormat('YYYY');
}

function getFormattedTime(date){
    if(!(date instanceof Date)){
        date = new Date(date);
    }
    return date.toFormat('HH') + ':' + date.toFormat('MI') + ' ' + date.toFormat('PP');
}

module.exports.getItineraryPDF = getItineraryPDF;
