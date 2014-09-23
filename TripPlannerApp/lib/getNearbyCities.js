/**
 * @author rahul
 * Find the nearby cities from db batch wise according to the selected cities
 */

var Hashids=require('hashids');
var hashidsgroup = new Hashids("encrypting the groupid using hash", 8);
var hashidscity = new Hashids("encrypting the cityid", 8);
function getNearbyCityList(conn,selectedIDs,selectedLats,selectedLongs,category,range,start,batchsize,callback) {

	var connection=conn.conn();
	connection.connect();
	var subQuery='';
	var category=category.split(",");
	var selectedIDs=selectedIDs.split(",");
	var selectedLats=selectedLats.split(",");
	var selectedLongs=selectedLongs.split(",");
	
	for(var i=0;i<(category.length-1);i++)
	{
		subQuery+='(Category like "' +category[i]+ '%") OR ';
	}
	subQuery+='(Category like "' +category[category.length-1]+ '%")';
	var queryString='SELECT CityName,CityID,Latitude,Longitude,( 6371 * acos( cos( radians('+selectedLats[0]+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+selectedLongs[0]+') ) + sin( radians('+selectedLats[0]+') ) * sin( radians( Latitude ) ) ) ) AS distance FROM City WHERE '+subQuery+' HAVING distance < '+range+' ORDER BY Rating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';
	
/*	var queryString='SELECT GroupName, PopularName, GroupID, DistFactor, CityName, c.CityID, Latitude, Longitude FROM'
		+ '(SELECT GroupName,PopularName,a.GroupID, DistFactor, b.CityID FROM'
		+'(SELECT GroupName,PopularName,GroupID, DistFactor, (( 6371 * acos( cos( radians('+orgLat+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+orgLong+') ) + sin( radians('+orgLat+') ) * sin( radians( Latitude ) ) ) )+('+DistScale+'*DistFactor))'
		+'AS distance FROM Groups WHERE ('+subQuery+') HAVING distance < '+range+' ORDER BY GroupRating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+')'
		+'AS a JOIN (SELECT * FROM GroupsCity) AS b ON (a.GroupID = b.GroupID)) AS c JOIN (SELECT CityID, CityName, Latitude, Longitude FROM City) AS d ON(c.CityID = d.CityID);';	
*/	
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