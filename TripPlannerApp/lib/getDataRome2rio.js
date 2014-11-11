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
		
		//console.log("originDest:"+origin+","+dest);
		/*var routeOfTravelObject={
				uniqueId:"1",
				routeName:"fly",
				totalDistance:"456km",
				totalDuration:"2hr",
				stopsArray:[{stops:"delhi",duration:"1hr",price:"1200rs"},{stops:"mumbai"},{stops:"bangalore"}]
		}
		var dataObject={
				CityName: data.places[0].name, 
				City2City: data.places[0].name+"-"+data.places[1].name,
            	RouteOfTravelData:routeOfTravelObject
		}
		
		for(var j=0;j<data.routes.length;j++)
		{
			for(var k=0; k < data.routes[j].stops.length; k++)
			{
				data.routes[j].stops[k].name;
			}
			var route={ 
					uniqueId:(j+1),
					routeName:data.routes[j].name,
					totalDistance:data.routes[j].distance,
					TotalDuration:data.routes[j].duration,
					stopsArray:stopsArrayObject
			}
		}*/
		callback(null, JSON.parse(data));
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