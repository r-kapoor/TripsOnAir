/**
 * Created by rajat on 9/2/2015.
 */
require('date-utils');
var getHotelList = require('../lib/getHotelListFromApi');
var async  = require('async');
var hashidEncoder =  require('../lib/hashEncoderDecoder');
var getDistance = require('../lib/UtilityFunctions/getDistance');

function getHotelData (destinationsAndStops,hotelBudget, numOfPeople,connection,hotelDataCallback) {

    console.log("in getHOtelData using api");
    var citiesWhereHotelIsRequired = [];
    var numOfDaysInHotel = 0;
    var hotelData=[];
    var hotels=[];

    for(var i=0;i<destinationsAndStops.destinations.length;i++)
    {
        if(destinationsAndStops.destinations[i].isHotelRequired==1)
        {
            citiesWhereHotelIsRequired.push(destinationsAndStops.destinations[i]);
            var numOfHoursInHotel = destinationsAndStops.destinations[i].arrivalTime.getHoursBetween(destinationsAndStops.destinations[i].departureTime);
            numOfDaysInHotel+=Math.ceil(numOfHoursInHotel/24);
        }
    }
    var perDayHotelBudget=hotelBudget/numOfDaysInHotel;
    console.log("citiesWhereHotelIsRequired:"+citiesWhereHotelIsRequired.length);
    var fns=[];
    var semaphore=Array.apply(null, new Array(citiesWhereHotelIsRequired.length)).map(Number.prototype.valueOf, 0);

    var funct = function (callback){
        for(var i=0;i<semaphore.length;i++)
        {
            if(semaphore[i]==0)
            {
                semaphore[i]=1;
                var arrDate = new Date(citiesWhereHotelIsRequired[i].arrivalTime);
                var arrivalDate = (arrDate.getMonth() + 1) + '/' + arrDate.getDate() + '/' +  arrDate.getFullYear();
                var deptDate = new Date(citiesWhereHotelIsRequired[i].arrivalTime);
                var departureDate = (deptDate.getMonth() + 1) + '/' + (deptDate.getDate()+1) + '/' +  deptDate.getFullYear();
                var latitude  = citiesWhereHotelIsRequired[i].LocationOfArrival.Latitude;
                var longitude  = citiesWhereHotelIsRequired[i].LocationOfArrival.Longitude;
                getHotelList.getHotelList(arrivalDate,departureDate,citiesWhereHotelIsRequired[i].name,citiesWhereHotelIsRequired[i].cityID,latitude,longitude,numOfPeople,connection,false,callback);
                break;
            }
        }
    };

    //Pushing the functions in an array
    for(var i=0;i<citiesWhereHotelIsRequired.length;i++)
    {
        fns.push(funct);
    }

    function getBetterHotelAndAdd(row, cityLatitude, cityLongitude, i) {
        if (isHotelIsInDistanceLimit(row.Latitude, row.Longitude, cityLatitude, cityLongitude)) {
            //Hotel within limits. Check the budget.
            if (isHotelInBudget(row.Price, row.MaxPersons, perDayHotelBudget, numOfPeople)) {
                //console.log("Hotel Is already there and is in budget");
                //Checking the budget of the hotel now
                if (row.Rating > hotelData[i].Rating) {
                    //Current hotel's rating is better than selected one
                    hotelData[i] = row;
                    hotels[i].splice(0, 0, row);
                }
                else {
                    //Selected one better. just add to list and continue
                    hotels[i].push(row);
                }
            }
            else {
                if (row.Price < hotelData[i].Price) {
                    hotelData[i] = row;
                    hotels[i].splice(0, 0, row);
                }
                else {
                    hotels[i].push(row);
                }
            }
        }
        else {
            //The current hotel is outside the distance limit. Check if the selected hotel is within limit
            if (!isHotelIsInDistanceLimit(hotelData[i].Latitude, hotelData[i].Longitude, cityLatitude, cityLongitude)) {
                //Current hotel is also outside limits. Check the usual and select
                if (isHotelInBudget(row.Price, row.MaxPersons, perDayHotelBudget, numOfPeople)) {
                    //console.log("Hotel Is already there and is in budget");
                    //Checking the budget of the hotel now
                    if (row.Rating > hotelData[i].Rating) {
                        //Current hotel's rating is better than selected one
                        hotelData[i] = row;
                        hotels[i].splice(0, 0, row);
                    }
                    else {
                        //Selected one better. just add to list and continue
                        hotels[i].push(row);
                    }
                }
                else {
                    if (row.Price < hotelData[i].Price) {
                        hotelData[i] = row;
                        hotels[i].splice(0, 0, row);
                    }
                    else {
                        hotels[i].push(row);
                    }
                }
            }
            else {
                //The selected is within limits. Just add to list and continue
                hotels[i].push(row);
            }
        }
    }

    async.parallel(
        fns,
        //callback
        function(err, results) {

            for (var i = 0; i < results.length; i++)
            {
                if(results[i].isFromApi)
                {
                    //Getting lat long for distance of hotel from city
                    var cityLatitude = citiesWhereHotelIsRequired[i].pos.split(',')[0];
                    var cityLongitude = citiesWhereHotelIsRequired[i].pos.split(',')[1];
                    citiesWhereHotelIsRequired[i].latitude = cityLatitude;
                    citiesWhereHotelIsRequired[i].longitude = cityLongitude;

                    var hotelLength = results[i].HotelListResponse.HotelList['@size'];
                    for(var j=0;j<hotelLength;j++)
                    {
                        var hotel;
                        if(hotelLength==1)
                        {
                            hotel=results[i].HotelListResponse.HotelList.HotelSummary;
                        }
                        else
                        {
                            hotel=results[i].HotelListResponse.HotelList.HotelSummary[j];
                        }

                        var room = hotel.RoomRateDetailsList.RoomRateDetails;
                        if(hotel.name!=undefined && hotel.name.indexOf("amp;")!=-1)//remove unnecessary chars
                        {
                            hotel.name = hotel.name.replace("amp;","");
                        }
                        if(hotel.name!=undefined && hotel.name.indexOf("&apos;")!=-1)//remove unnecessary chars
                        {
                            hotel.name = hotel.name.replace("&apos;","'");
                        }

                        var row = {
                            HotelID:hotel.hotelId,
                            Name:hotel.name,
                            CityID:citiesWhereHotelIsRequired[i].cityID,
                            Address:hotel.address1,
                            Rating:hotel.hotelRating,
                            Latitude:hotel.latitude,
                            Longitude:hotel.longitude,
                            HotelUrl:hotel.thumbNailUrl.replace("_t.jpg","_l.jpg"),
                            HotelDeepLink:hotel.deepLink,
                            RoomType:room.roomDescription,
                            MaxPersons:room.quotedRoomOccupancy,
                            Price:parseInt(room.RateInfo.ChargeableRateInfo['@total']),
                            isFromApi:true
                        };

                        //if(row.HotelUrl=="")//if pic not available from api
                        //{
                        //    row.HotelUrl = "http://res.cloudinary.com/picsonair/image/upload/v1445451772/NA_vjx1ej.png";
                        //}
                        console.log(row);

                        if(hotelData[i]==undefined)
                        {
                            hotelData[i] = row;
                            hotels[i] = [];
                            hotels[i].push(row);
                        }
                        else
                        {
                            getBetterHotelAndAdd(row, cityLatitude, cityLongitude, i);
                        }
                    }
                }
                else//from db
                {
                    console.log("FROM DB DATA");
                    for(var j=0;j<results[i].length;j++)
                    {
                        var row = results[i][j];
                        var id = hashidEncoder.encodeHotelID(row.HotelID);
                        row.HotelID = id;
                        row.hotelAdded = false;
                        row.Rating = (row.Rating)*0.5;//db rating is out of 10 but we need out of 5
                        row.isFromApi = false;
                        if(hotelData[i]==undefined)
                        {
                            hotelData[i] = row;
                            hotels[i] = [];
                            hotels[i].push(row);
                        }
                        else
                        {
                            getBetterHotelAndAdd(row, cityLatitude, cityLongitude, i);
                        }
                    }
                }
            }

            for(var k=0;k<destinationsAndStops.destinations.length;k++)
            {
                destIndex=destinationsAndStops.destinations.indexOf(citiesWhereHotelIsRequired[k]);
                console.log("DestIndex:"+destIndex);
                console.log(JSON.stringify(hotelData[k]));
                if(destIndex != -1){
                    //The is hotel required for the destination
                    destinationsAndStops.destinations[destIndex].hotelDetails=hotelData[k];
                    destinationsAndStops.destinations[destIndex].hotelDetails.hotelAdded = true;
                    destinationsAndStops.destinations[destIndex].hotels = hotels[k];
                    setHotelIndices(destinationsAndStops.destinations[destIndex].hotels);
                }
            }
            console.log("--------------------------");
            for(var i=0;i<destinationsAndStops.destinations.length;i++)
            {
                console.log("destinations with Hotels:"+JSON.stringify(destinationsAndStops.destinations[i]));
                console.log("stops with hotel:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[i]));
            }
            console.log("LastStop with hotel:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[destinationsAndStops.destinationsWiseStops.length-1]));

            hotelDataCallback(null, destinationsAndStops);
        });
}

function isHotelInBudget(price,maxPersons,perDayHotelBudget,numOfPeople)
{
    if(numOfPeople==1)
    {
        if(price<=perDayHotelBudget)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        if((price/maxPersons)<=perDayHotelBudget)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

function isHotelIsInDistanceLimit(hotelLatitude, hotelLongitude, cityLatitude, cityLongitude){
    var DISTANCE_LIMIT = 20;
    var distance = getDistance.getDistance(hotelLatitude, hotelLongitude, cityLatitude, cityLongitude);
    return (distance <= DISTANCE_LIMIT);
}

function setHotelIndices(hotels){
    for(var hotelIndex = 0; hotelIndex < hotels.length; hotelIndex++){
        hotels[hotelIndex].hotelIndex = hotelIndex;
    }
}

module.exports.getHotelData = getHotelData;
