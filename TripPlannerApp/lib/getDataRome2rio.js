/*
 * Calls the rome2rio API for the cities passed in origin and dest and gets the JSON object
 */

//The API Key used for Rome2Rio
var APP_KEY="R1hcHt58";

/*
 * Calls the Rome2Rio API to get the mode of travel between cities
 * Params :
 * origin - Origin City
 * dest - Destination City
 * callback(err, data) - The JSON data is passed to this function
 */
function getDataRome2rio(origin,dest,originID,destID,callback)
{
	//Getting the request URL for rome2rio
	var url=getURL(origin,dest);

	//Replacing the key
	url=url.replace('YOUR_KEY_HERE', APP_KEY);
    console.log(url);

	var Client = require('node-rest-client').Client;
	client = new Client();
	client.registerMethod("jsonMethod", url, "GET");

	console.log('Calling rome2rio');
	//Calling the rome2rio API
	client.methods.jsonMethod(function(data,response){
		console.log('got data from rome2rio');
		var parsedData = JSON.parse(data);
		parsedData.places[0].cityID = originID;
		parsedData.places[1].cityID = destID;
		callback(null, parsedData);
	});
}

/*
 * Returns the URL for rome2rio API
 * Params :
 * origin - Origin City
 * dest - Destination City
 */
function getURL(origin,dest)
{
	var HOST_URL="http://free.rome2rio.com";
    var rome2RioUrl = HOST_URL + '/api/1.2/json/Search?key=YOUR_KEY_HERE';
    rome2RioUrl += '&oName='+origin+'&dName='+dest+'&currencyCode=INR';
    return rome2RioUrl;
}

module.exports.getDataRome2rio=getDataRome2rio;
