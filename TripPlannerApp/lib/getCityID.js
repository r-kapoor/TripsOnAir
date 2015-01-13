var conn = require('../lib/database');
//An array of CityNames can be passed. The corresponding cityids will be passed to the callback. -1 Indicates not found
function getCityID(cityNames, callback)
{
	console.log("getCityID called");
	var connection=conn.conn();
	connection.connect();
	var numberOfCities = cityNames.length;
	var cityIDs = Array.apply(null, new Array(numberOfCities)).map(Number.prototype.valueOf,-1);
	var citiesString = '';
	citiesString += ' \''+cityNames.join('\', \'')+'\' ';
	//citiesString = citiesString.toUpperCase();
	//console.log("citiesString:"+citiesString);
	var queryString = 'SELECT CityID, CityName FROM City WHERE CityName IN ('+citiesString+')';	
	console.log("getCityID query:"+queryString);
	connection.query(queryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
	    	for (var i in rows) {
	    		console.log("Returned Cities from db:"+rows[i].CityID+','+rows[i].CityName);
	    		cityIDs[cityNames.indexOf(rows[i].CityName)] = rows[i].CityID;
	    	}
	    }
	callback(null, cityIDs);
	});
	connection.end();
}

module.exports.getCityID=getCityID;