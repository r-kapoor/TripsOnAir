/**
 * @author rahul
 * Find the nearby cities from db batch wise according to the selected cities
 */
'use strict';
var Hashids=require('hashids');
var hashidsgroup = new Hashids("encrypting the groupid using hash", 8);
var hashidscity = new Hashids("encrypting the cityid", 8);
function getNearbyCityList(conn,destinations,orgLat,orgLong,taste,distRemaining,start,batchsize,callback) {

	var maxDistance = 250;//The distance between the current and suggested city should not exceed the value
	var connection=conn.conn();
	connection.connect();
	var subQuery,distanceFromSelectionsSubQuery = '', distanceMinHavingClause = '', distanceMaxHavingClause = '', distanceFromOriginSubQuery = '', distanceRemainingHavingClause = '';

    var numDestinations=destinations.length;
	var nearTheCity = (start/batchsize)%numDestinations;

	/*for(var i=0;i<(category.length-1);i++)
	{
		subQuery+='(Category like "' +category[i]+ '%") OR ';
	}*/
	//subQuery+='(Category like "' +category[category.length-1]+ '%")';

	subQuery='(Taste & '+connection.escape(taste.tasteInteger)+'!=0 ) AND (Taste & '+connection.escape(taste.familyFriendsInteger)+'!=0 AND IsDestination = 1)';

	for(var i=0;i<numDestinations-1;i++)
	{
		distanceFromSelectionsSubQuery += ' ( 6371 * acos( cos( radians('+destinations[i].Latitude+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+destinations[i].Longitude+') ) + sin( radians('+destinations[i].Latitude+') ) * sin( radians( Latitude ) ) ) ) AS distance'+i+',';
		distanceMinHavingClause += ' (distance'+i+' > 20) AND ';
        distanceMaxHavingClause += ' (distance'+i+' < '+maxDistance+') OR ';
	}
	distanceFromSelectionsSubQuery += ' ( 6371 * acos( cos( radians('+destinations[numDestinations-1].Latitude+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+destinations[numDestinations-1].Longitude+') ) + sin( radians('+destinations[numDestinations-1].Latitude+') ) * sin( radians( Latitude ) ) ) ) AS distance'+(numDestinations-1);
	distanceMinHavingClause += ' ( distance'+(numDestinations-1)+' > 20) ';
    distanceMaxHavingClause += ' ( distance'+(numDestinations-1)+' < '+maxDistance+') ';

	distanceFromOriginSubQuery += ' ( 6371 * acos( cos( radians('+orgLat+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+orgLong+') ) + sin( radians('+orgLat+') ) * sin( radians( Latitude ) ) ) ) AS distanceFromOrigin ';

	distanceRemainingHavingClause += ' (distanceFromOrigin + distance'+(numDestinations-1)+' < '+distRemaining+' AND distanceFromOrigin > 20) ';

	var queryString='SELECT CityName,CityID,Latitude,Longitude,'+ distanceFromSelectionsSubQuery +", "+ distanceFromOriginSubQuery+ ' FROM City WHERE '+subQuery+' HAVING ( ( '+distanceMinHavingClause+' ) AND ( '+distanceMaxHavingClause+' ) AND ( '+distanceRemainingHavingClause+' ) ) ORDER BY Rating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';

	connection.query(queryString, function(err, rows, fields) {
		console.log('Nearby Query:'+queryString);
		if (err)
		{
			console.log('err');
			throw err;
		}
	    else{
			console.log('Getting result');
			for (var i in rows) {
				console.log('Rows Returned Nearby');
		        var id = hashidscity.encode(rows[i].CityID);
				rows[i].CityID = id;
				console.log(rows[i]);
	    	}
	  }
		callback(rows);
});
	connection.end();

}
module.exports.getNearbyCityList = getNearbyCityList;
