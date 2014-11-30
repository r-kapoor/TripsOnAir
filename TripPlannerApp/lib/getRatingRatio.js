/*
 * Gets the Ratings of the cities from db. The ratings would be used to get the time which is spent in each city during the trip
 */

/*
 * Gets the Ratio of Ratings of the cities passed and passes into callback
 * Params :
 * conn - Connection Object
 * cities - Array containing the destinations. NOTE : Should not contain the origin as one of the cities
 * callback(err, data) - The array of ratios is passed to this function
 */
function getRatingRatio(conn,cities,callback)
{
	//Number of cities
	var num_city=cities.length;
	
	//Establishing the db connection
	var connection=conn.conn();
	connection.connect();
	
	//The array will contain the ratio of the ratings in the same order as the cities passed
	var ratio= Array.apply(null, new Array(num_city)).map(Number.prototype.valueOf, 0);
	
	//Making the db query
	var subQuery='';
	var queryString='SELECT CityID, CityName, Rating FROM City WHERE CityName IN (' + connection.escape(cities) + ');';
	
	//Contains the sum of ratings - in order to get the ratio
	var totalRating=0;
	
	//Sending the query to the db
	connection.query(queryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
	    	//Adding the ratings
	    	for (var i in rows) {
				totalRating+=parseFloat(rows[i].Rating);
	    	}
	    	
	    	//Getting the ratio of ratings and putting into ratio array in the same order as the cities input
	    	for(var j in rows)
	    	{
	    			ratio[cities.indexOf(rows[j].CityName)]=((parseFloat(rows[j].Rating)/totalRating));
	    	}
	    }
		callback(null,ratio);
	});
	connection.end();
}

module.exports.getRatingRatio=getRatingRatio;