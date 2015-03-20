var conn = require('../lib/database');
var decodeCityID = require('../lib/hashEncoderDecoder');

function getConnectivity(cities,callback)
{
	console.log("getConnectivity called");
	var connection=conn.conn();
	connection.connect();
	var numberOfCities = cities.length;
	var citiesIDArray = [];
    var subQuery1 ="";
    var subQuery2="";
	//citiesString += ' \''+cities.join('\', \'')+'\' ';
    for(var cityIndex=0;cityIndex<cities.length-1;cityIndex++)
    {
        citiesIDArray.push( decodeCityID.decodeCityID(cities[cityIndex].CityID));
        subQuery1+=" SELECT "+ decodeCityID.decodeCityID(cities[cityIndex].CityID) + " as a UNION ";
        subQuery2+=" SELECT "+ decodeCityID.decodeCityID(cities[cityIndex].CityID) + " as b UNION ";
    }
    citiesIDArray.push(decodeCityID.decodeCityID(cities[cities.length-1].CityID));
    subQuery1+=" SELECT "+ decodeCityID.decodeCityID(cities[cities.length-1].CityID) + " as a";
    subQuery2+=" SELECT "+ decodeCityID.decodeCityID(cities[cities.length-1].CityID) + " as b";

    var connectivities = [];
	for(var i = 0 ; i < numberOfCities ; i++)
	{
		connectivities[i] = Array.apply(null, new Array(numberOfCities)).map(Number.prototype.valueOf, 0);
	}

	//console.log("citiesString:"+citiesString);
	var queryString = 'SELECT c.CityIDOrigin, c.CityIDDestination, IF(AirConnectivity IS NULL,0,AirConnectivity) as AirConnectivity, IF(BusConnectivity IS NULL,0,BusConnectivity) as BusConnectivity, IF(RailwayConnectivity IS NULL,0,RailwayConnectivity) as RailwayConnectivity FROM'
		+' (SELECT a as CityIDOrigin,b as CityIDDestination FROM ('+subQuery1+') a, ('+subQuery2+') b) c'
        +' LEFT OUTER JOIN'
		+' (SELECT CityIDOrigin, CityIDDestination, NormalizedConnectivity AS AirConnectivity FROM City_Connectivity_Between_Air) d ON (c.CityIDOrigin = d.CityIDOrigin) AND (c.CityIDDestination = d.CityIDDestination)'
		+' LEFT OUTER JOIN'
		+' (SELECT CityIDOrigin, CityIDDestination, NormalizedConnectivity AS BusConnectivity FROM City_Connectivity_Between_Bus) e ON (c.CityIDOrigin = e.CityIDOrigin) AND (c.CityIDDestination = e.CityIDDestination)'
		+' LEFT OUTER JOIN'
		+' (SELECT CityIDOrigin, CityIDDestination, NormalizedConnectivity AS RailwayConnectivity FROM City_Connectivity_Between_Railway) f ON (c.CityIDOrigin = f.CityIDOrigin) AND (c.CityIDDestination = f.CityIDDestination);';

	console.log(queryString);
	connection.query(queryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
	    	for (var i in rows) {
	    		console.log("Returned Connectivity from db:"+rows[i].CityIDOrigin+','+rows[i].CityIDDestination+','+rows[i].AirConnectivity+','+rows[i].BusConnectivity+','+rows[i].RailwayConnectivity);
	    		connectivities[citiesIDArray.indexOf(rows[i].CityIDOrigin)][citiesIDArray.indexOf(rows[i].CityIDDestination)] = rows[i].AirConnectivity + rows[i].BusConnectivity + rows[i].RailwayConnectivity;
	    	}
	    }
		var resultsarray = [connectivities, cities, citiesIDArray];
		callback(null, resultsarray);
	});
	connection.end();
}

module.exports.getConnectivity=getConnectivity;
