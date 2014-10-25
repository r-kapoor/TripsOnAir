var conn = require('../lib/database');

function getConnectivity(cities, callback)
{
	console.log("getConnectivity called");
	var connection=conn.conn();
	connection.connect();
	var citiesString = '';
	citiesString += ' \''+cities.split('\', \'')+'\' ';
	console.log(citiesString);
	queryString = 'SELECT c.CityIDOrigin, c.CityIDDestination, IF(AirConnectivity IS NULL,0,AirConnectivity) as AirConnectivity, IF(BusConnectivity IS NULL,0,BusConnectivity) as BusConnectivity, IF(RailwayConnectivity IS NULL,0,RailwayConnectivity) as RailwayConnectivity FROM'
		+' (SELECT CityIDOrigin, CityIDDestination FROM'
		+' (SELECT CityID as CityIDOrigin FROM City WHERE CityName IN ('+citiesString+')) a'
		+' JOIN'
		+' (SELECT CityID as CityIDDestination FROM City WHERE CityName IN ('+citiesString+')) b) c'
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
	    		console.log(rows[i].CityIDOrigin+','+rows[i].CityIDDestination+','+rows[i].AirConnectivity','+rows[i].BusConnectivity','+rows[i].RailwayConnectivity);
	    	}
	    }
	callback(null, );
	});
	connection.end();
}

module.exports.getConnectivity=getConnectivity;