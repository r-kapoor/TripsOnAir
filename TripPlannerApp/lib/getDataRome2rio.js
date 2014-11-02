/**
 * New node file
 */

var APP_KEY="R1hcHt58";

function getDataRome2rio(origin,dest,callback)
{
	console.log('rome2rio called');
	var url=getURL(origin,dest);
	url=url.replace('YOUR_KEY_HERE', APP_KEY);
	console.log("requestedUrl:"+url);
	var Client = require('node-rest-client').Client;
	client = new Client();
	client.registerMethod("jsonMethod", url, "GET");
	client.methods.jsonMethod(function(data,response){	
		
		console.log("originDest:"+origin+","+dest);
		callback(null, data);
	});
}
function getURL(origin,dest)
{
	var HOST_URL="http://free.rome2rio.com";
    var rome2RioUrl = HOST_URL + '/api/1.2/json/Search?key=YOUR_KEY_HERE';
    rome2RioUrl += '&oName='+origin+'&dName='+dest;
    return rome2RioUrl;
}

module.exports.getDataRome2rio=getDataRome2rio;