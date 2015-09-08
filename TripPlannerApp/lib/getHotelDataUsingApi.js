/**
 * Created by rajat on 9/2/2015.
 */
require('date-utils');
var getHotelList = require('../lib/getHotelListFromApi');
var async  = require('async');
var hashidEncoder =  require('../lib/hashEncoderDecoder');

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
                console.log("testcity:"+JSON.stringify(citiesWhereHotelIsRequired[i]));
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

    async.parallel(
        fns,
        //callback
        function(err, results) {

            for (var i = 0; i < results.length; i++)
            {
                if(results[i].isFromApi)
                {
                    for(var j=0;j<results[i].HotelListResponse.HotelList['@size'];j++)
                    {
                        var hotel=results[i].HotelListResponse.HotelList.HotelSummary[j];
                        var room = hotel.RoomRateDetailsList.RoomRateDetails;
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
                            Price:room.RateInfo.ChargeableRateInfo['@total'],
                            isFromApi:true
                        };
                        console.log(row);

                        if(hotelData[i]==undefined)
                        {
                            hotelData[i] = row;
                            hotels[i] = [];
                            hotels[i].push(row);
                        }
                        else
                        {
                            if(isHotelInBudget(row.Price,row.MaxPersons,perDayHotelBudget,numOfPeople))
                            {
                                //console.log("Hotel Is already there and is in budget");
                                if(row.Rating>hotelData[i].Rating)
                                {
                                    hotelData[i]=row;
                                    hotels[i].splice(0,0,row);
                                }
                                else {
                                    hotels[i].push(row);
                                }
                            }
                            else
                            {
                                if(row.Price<hotelData[i].Price)
                                {
                                    hotelData[i]=row;
                                    hotels[i].splice(0,0,row);
                                }
                                else {
                                    hotels[i].push(row);
                                }
                            }
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
                            if(isHotelInBudget(row.Price,row.MaxPersons,perDayHotelBudget,numOfPeople))
                            {
                                //console.log("Hotel Is already there and is in budget");
                                if(row.Rating>hotelData[i].Rating)
                                {
                                    hotelData[i]=row;
                                    hotels[i].splice(0,0,row);
                                }
                                else {
                                    hotels[i].push(row);
                                }
                            }
                            else
                            {
                                if(row.Price<hotelData[i].Price)
                                {
                                    hotelData[i]=row;
                                    hotels[i].splice(0,0,row);
                                }
                                else {
                                    hotels[i].push(row);
                                }
                            }
                        }
                    }
                }
            }

            for(var k=0;k<destinationsAndStops.destinations.length;k++)
            {
                var destIndex=destinationsAndStops.destinations.indexOf(citiesWhereHotelIsRequired[k]);
                console.log("DestIndex:"+destIndex);
                console.log(JSON.stringify(hotelData[k]));
                destinationsAndStops.destinations[destIndex].hotelDetails=hotelData[k];
                destinationsAndStops.destinations[destIndex].hotelDetails.hotelAdded = true;
                destinationsAndStops.destinations[destIndex].hotels = hotels[k];
                setHotelIndices(destinationsAndStops.destinations[destIndex].hotels);
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

function setHotelIndices(hotels){
    for(var hotelIndex = 0; hotelIndex < hotels.length; hotelIndex++){
        hotels[hotelIndex].hotelIndex = hotelIndex;
    }
}

module.exports.getHotelData = getHotelData;
