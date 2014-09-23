/**
 * @author rahul
 * 
 */

var Hashids=require('hashids');
var hashidscity = new Hashids("encrypting the cityid", 8);


function getCityList(conn,orgLat,orgLong,category,range,start,batchsize,callback) {
	var connection=conn.conn();
	connection.connect();
	var subQuery='';
	var category=category.split(",");
	for(var i=0;i<(category.length-1);i++)
	{
		subQuery+='(Category like "' +category[i]+ '%") OR ';
	}
	subQuery+='(Category like "' +category[category.length-1]+ '%")';
	var queryString='SELECT CityName,CityID,Latitude,Longitude,( 6371 * acos( cos( radians('+orgLat+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+orgLong+') ) + sin( radians('+orgLat+') ) * sin( radians( Latitude ) ) ) ) AS distance FROM City WHERE '+subQuery+' HAVING distance < '+range+' ORDER BY Rating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';
	
	connection.query(queryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
	    	for (var i in rows) {
				var id = hashidscity.encode(rows[i].CityID);
				rows[i].CityID = id;
				console.log(rows[i]);
	    	}
	  }
		callback(rows);
});
	connection.end();
}
module.exports.getCityList = getCityList;