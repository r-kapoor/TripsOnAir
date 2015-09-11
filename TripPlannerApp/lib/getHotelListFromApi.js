/**
 * Created by rajat on 9/2/2015.
 */

var api_key = "3j29o4srt79e7fbeevm20po34e";
var shared_secret = "avt2schlknnbc";
var cid="495344";
var countryCode="IN";
var currencyCode="INR";
var md5 = require('md5');
var Client = require('node-rest-client').Client;
var hashidEncoder =  require('../lib/hashEncoderDecoder');
//var errorCount = 0;

function getSignature()
{
    var timeStamp = Math.floor((new Date()).getTime()/1000);
    return (md5(api_key+shared_secret+timeStamp));
}

function getHotelList(arrivalDate,departureDate,cityName,cityID,latitude,longitude,numOfPeople,connection,err,callback)
{
    var url=getURL(arrivalDate,departureDate,cityName,latitude,longitude,err);
    console.log("url:"+url);
    var client = new Client();
    client.registerMethod("jsonMethod", url, "GET");

    client.methods.jsonMethod(function(data,response){
        if(data.HotelListResponse.EanWsError!=undefined)
        {
            var errorObj = data.HotelListResponse.EanWsError;
            if(errorObj.handling.toLowerCase().indexOf("recoverable")!=-1 && errorObj.presentationMessage.toLowerCase().indexOf("multiple locations found"))
            {
                console.log("Multiple location found for "+city);
                getHotelList(arrivalDate,departureDate,cityName,cityID,latitude,longitude,true,callback);
            }
            //else if(errorCount==0 && errorObj.presentationMessage.toLowerCase().indexOf("no results available")!=-1)
            //{
            //    console.log("No results found for "+city);
            //    errorCount++;
            //    getHotelList(arrivalDate,departureDate,city,latitude,longitude,true,callback);
            //}
            else
            {
                console.log("trying from database..");
                var decodedCityIDWhereHotelIsRequired=hashidEncoder.decodeCityID(cityID);
                var queryString ="";
                if(numOfPeople==1){
                    queryString+=" SELECT * FROM Hotels_Details WHERE CityID IN ("+connection.escape(decodedCityIDWhereHotelIsRequired) +") AND MaxPersons <= 2 AND MaxPersons > 0 ORDER BY Price";
                }
                else
                {
                    queryString+=" SELECT * FROM Hotels_Details WHERE CityID IN ("+connection.escape(decodedCityIDWhereHotelIsRequired) +") AND MaxPersons <= "+connection.escape(numOfPeople)+" AND MaxPersons > 0 ORDER BY Price";
                }
                queryString+=";";
                console.log("HotelQuery:"+queryString);

                connection.query(queryString, function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    else {
                        rows.isFromApi = false;
                          callback(null,rows);
                    }
                });
                //callback(null);
            }
        }
        else
        {
            console.log('got data');
            data.isFromApi = true;
            callback(null, data);
        }
    });
}

function getURL(arrivalDate,departureDate,city,latitude,longitude,err)
{
    var baseURL= "http://api.ean.com/ean-services/rs/hotel/v3/list?";
    var sig = getSignature();
    var numberOfResults = 30;
    console.log(latitude+","+longitude);
    if(!err)
    {
        return(baseURL+"arrivalDate="+arrivalDate+"&departureDate="+departureDate+"&apiKey="+api_key+"&sharedSecret="+shared_secret+"&city="+city+"&sig="+sig+"&cid="+cid+"&countryCode="+countryCode+"&currencyCode="+currencyCode+"&sort=PRICE"+"&numberOfResults="+numberOfResults);
    }
    else
    {
        return(baseURL+"arrivalDate="+arrivalDate+"&departureDate="+departureDate+"&apiKey="+api_key+"&sharedSecret="+shared_secret+"&latitude="+latitude+"&longitude="+longitude+"&searchRadius=30"+"&searchRadiusUnit=KM"+"&sig="+sig+"&cid="+cid+"&countryCode="+countryCode+"&currencyCode="+currencyCode+"&sort=PRICE"+"&numberOfResults="+numberOfResults);
    }
}

module.exports.getHotelList = getHotelList;
//getHotelList("09/08/2015","09/09/2015","ooty");
