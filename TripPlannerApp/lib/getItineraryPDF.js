/**
 * Created by rkapoor on 02/05/15.
 */
//var PDFDocument = require('pdfkit');
var fs = require('fs');
var doc;
function getItineraryPDF(travelData, itineraryData){
    //doc = new PDFDocument;
    //doc.pipe(fs.createWriteStream('output.pdf'));
    //
    //doc.image('public/images/logoB.png', {fit: [100, 100]});
    //
    //doc.fontSize(18)
    //    .text('Your Trip-On-Air Details', {align: 'center'});
    //
    //doc.fontSize(14)
    //    .text('Travel Details', {align: 'left'});
    //
    //var defaultTrip = getDefaultTrip(travelData);
    //
    //for(var legIndex = 0; legIndex < defaultTrip.rome2RioData.length; legIndex++){
    //    var fromPlace = defaultTrip.rome2RioData[legIndex].places[0].name;
    //    var toPlace = defaultTrip.rome2RioData[legIndex].places[1].name;
    //    addTravelPlaces(fromPlace,toPlace,legIndex);
    //    console.log("-1");
    //    var routes = defaultTrip.rome2RioData[legIndex].routes;
    //    for(var routesIndex = 0; routesIndex < routes.length; routesIndex++){
    //        console.log("0");
    //        var route = routes[routesIndex];
    //        if(route.isDefault == 1){
    //            console.log("1");
    //            for(var segmentIndex = 0; segmentIndex < route.segments.length; segmentIndex++){
    //                console.log("2");
    //                var segment = route.segments[segmentIndex];
    //                if(segment.isMajor == 1){
    //                    console.log("3");
    //                    if(segment.kind == "flight"){
    //                        addTravelKind("Flight");
    //                        for(var flightDataIndex = 0; flightDataIndex < segment.flightData.length; flightDataIndex++){
    //                            var flightData = segment.flightData[flightDataIndex];
    //                            if(flightData.isFinal != undefined && flightData.isFinal == 1){
    //                                addFlightData(flightData.Operator, flightData.FlightNumber, flightData.OriginDepartureTime, flightData.DestArrivalTime, flightData.Hops, flightData.OriginAirportCode, flightData.DestinationAirportCode, flightData.OriginAirportName, flightData.DestinationAirportName);
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}
    //
    //doc.end();
}

//function addTravelPlaces(fromPlace, toPLace, index){
//    doc.fontSize(12)
//        .text((index+1) + '. '+ fromPlace + ' To '+toPLace);
//}
//
//function addTravelKind(kind){
//    doc.fontSize(12)
//        .text(kind);
//}
//
//function addFlightData(operator, flightNumber, departureTime, arrivalTime, hops, originAirportCode, destinationAirportCode, originAirportName, destinationAirportName){
//    doc.fontSize(10)
//        .text(departureTime + '-' + arrivalTime + ' ' + flightNumber + ' ' + operator);
//
//    doc.fontSize(10)
//        .text(originAirportCode + '-' + destinationAirportCode);
//
//}
//
//function getDefaultTrip(travelData){
//    if(travelData.withTaxiRome2rioData.isMajorDefault == 0){
//        return travelData.withTaxiRome2rioData;
//    }
//    else {
//        return travelData.withoutTaxiRome2rioData;
//    }
//}

module.exports.getItineraryPDF = getItineraryPDF;
