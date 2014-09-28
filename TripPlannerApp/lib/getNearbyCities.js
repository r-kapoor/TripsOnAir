/**
 * @author rahul
 * Find the nearby cities from db batch wise according to the selected cities
 */

var Hashids=require('hashids');
var hashidsgroup = new Hashids("encrypting the groupid using hash", 8);
var hashidscity = new Hashids("encrypting the cityid", 8);
function getNearbyCityList(conn,selectedIDs,selectedLats,selectedLongs,category,range,start,batchsize,callback) {

	var maxDistance = 250;//The distance between the current and suggested city should not exceed the value
	var connection=conn.conn();
	connection.connect();
	var subQuery='',distanceSubQuery = '', distanceHavingClause = '';
	var category=category.split(",");
	var selectedIDs=selectedIDs.split(",");
	var selectedLats=selectedLats.split(",");
	var selectedLongs=selectedLongs.split(",");
	var nearTheCity = (start/batchsize)%selectedIDs.length;
	if(range > maxDistance){
		range = maxDistance;
	}
	
	for(var i=0;i<(category.length-1);i++)
	{
		subQuery+='(Category like "' +category[i]+ '%") OR ';
	}
	subQuery+='(Category like "' +category[category.length-1]+ '%")';
	
	for(var i=0;i<selectedIDs.length-1;i++)
	{
		distanceSubQuery += ' ( 6371 * acos( cos( radians('+selectedLats[i]+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+selectedLongs[i]+') ) + sin( radians('+selectedLats[i]+') ) * sin( radians( Latitude ) ) ) ) AS distance'+i+',';
		distanceHavingClause += ' (distance'+i+' > 10 AND distance'+i+' < '+range+') OR ';
	}
	distanceSubQuery += ' ( 6371 * acos( cos( radians('+selectedLats[selectedIDs.length-1]+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+selectedLongs[selectedIDs.length-1]+') ) + sin( radians('+selectedLats[selectedIDs.length-1]+') ) * sin( radians( Latitude ) ) ) ) AS distance'+(selectedIDs.length-1);
	distanceHavingClause += ' ( distance'+(selectedIDs.length-1)+' > 10 AND distance'+(selectedIDs.length-1)+' < '+range+') ';
	
	var queryString='SELECT CityName,CityID,Latitude,Longitude,'+ distanceSubQuery + ' FROM City WHERE '+subQuery+' HAVING ( '+distanceHavingClause+' ) ORDER BY Rating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';

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