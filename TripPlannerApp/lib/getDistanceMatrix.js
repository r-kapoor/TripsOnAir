/**
 * @author rajat
 */

var APP_KEY="Fmjtd%7Cluurnuuznd%2Cbg%3Do5-9wrshz";

function getDistanceMatrix(dests, callback)
{	
	var url=getURL(dests);
	url=url.replace('YOUR_KEY_HERE', APP_KEY);
	console.log("nURL"+url);
	var Client = require('node-rest-client').Client;
	client = new Client();
	client.registerMethod("jsonMethod", url, "GET");
	client.methods.jsonMethod(function(data,response){		
		console.log("Alldata:%j",data);
		console.log("distance:"+data.distance);
		/*var distanceMatrix = data.distance;
		for(var i = 0; i < distanceMatrix.length; i++)
		{
			for(var j = 0; j < distanceMatrix.length; j++)
			{
				console.log("i:"+i+":j:"+j+":"+distanceMatrix[i][j]);
			}
		}*/
		
	callback(null, data);
	});
}
function getURL(dests)
{
	
	var HOST_URL="http://open.mapquestapi.com";
    var matrixUrl = HOST_URL + '/directions/v2/routematrix?key=YOUR_KEY_HERE';
    dests=dests.join("\",\"");
    matrixUrl += '&json={';
    matrixUrl += 'locations:["'+dests+'"]';
    matrixUrl += ',options: {allToAll:\'true\',unit:\'k\'}}';
    //TODO:set session variables for ID

    return matrixUrl;
}

module.exports.getDistanceMatrix=getDistanceMatrix;