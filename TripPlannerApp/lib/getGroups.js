/**
 * @author rahul
 * Find the groups from db batch wise according to the inputs
 * TODO: Remove the scaling factor and store last city lat/long to calculate dist from last city to origin 
 */

var Hashids=require('hashids');
var hashidsgroup = new Hashids("encrypting the groupid using hash", 8);
var hashidscity = new Hashids("encrypting the cityid", 8);
function getGroupList(conn,orgLat,orgLong,category,range,start,batchsize,callback) {

	var connection=conn.conn();
	connection.connect();
	var subQuery='';
	var DistScale=0.3;
	var category=category.split(",");
	for(var i=0;i<(category.length-1);i++)
	{
		subQuery+='(GroupCategory like "%' +category[i]+ '%") OR ';
	}
	subQuery+='(GroupCategory like "%' +category[category.length-1]+ '%")';
	
	/*var queryString='SELECT GroupName, PopularName, GroupID, DistFactor, CityName, c.CityID, Latitude, Longitude FROM' 
		+ '(SELECT GroupName,PopularName,a.GroupID, DistFactor, b.CityID FROM' 
		+'(SELECT GroupName,PopularName,GroupID, DistFactor, (( 6371 * acos( cos( radians('+orgLat+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+orgLong+') ) + sin( radians('+orgLat+') ) * sin( radians( Latitude ) ) ) )+('+DistScale+'*DistFactor))' 
		+'AS distance FROM Groups WHERE (GroupCategory like '+subQuery+') HAVING distance < '+range+' ORDER BY GroupRating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+')' 
		+'AS a JOIN (SELECT * FROM GroupsCity) AS b ON (a.GroupID = b.GroupID)) AS c JOIN (SELECT CityID, CityName, Latitude, Longitude FROM City) AS d ON(c.CityID = d.CityID);';
*/
	var queryString='SELECT GroupName, PopularName, GroupID, DistFactor, CityName, c.CityID, Latitude, Longitude FROM'
		+ '(SELECT GroupName,PopularName,a.GroupID, DistFactor, b.CityID FROM'
		+'(SELECT GroupName,PopularName,GroupID, DistFactor, (( 6371 * acos( cos( radians('+orgLat+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+orgLong+') ) + sin( radians('+orgLat+') ) * sin( radians( Latitude ) ) ) )+('+DistScale+'*DistFactor))'
		+'AS distance FROM Groups WHERE ('+subQuery+') HAVING distance < '+range+' ORDER BY GroupRating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+')'
		+'AS a JOIN (SELECT * FROM GroupsCity) AS b ON (a.GroupID = b.GroupID)) AS c JOIN (SELECT CityID, CityName, Latitude, Longitude FROM City) AS d ON(c.CityID = d.CityID);';

	//var queryString ='SELECT * FROM Groups;';
	
	
	connection.query(queryString, function(err, rows, fields) {
		console.log(queryString);
		if (err)
		{
			console.log('err');
			throw err;
		}
	    else{
			for (var i in rows) {
		        var id = hashidsgroup.encode(rows[i].GroupID);
		        rows[i].GroupID = id;
		        var id = hashidscity.encode(rows[i].CityID);
		        rows[i].CityID = id;
		        console.log(rows[i]);
	    	}
	  }
		callback(rows);
});
	connection.end();
	
}
module.exports.getGroupList = getGroupList;