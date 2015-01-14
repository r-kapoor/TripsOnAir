/**
 * @author rahul
 *
 */
var hashidEncoder =  require('../lib/hashEncoderDecoder');
//var Hashids=require('hashids');
//var hashidscity = new Hashids("encrypting the cityid", 8);


function getCityList(conn,orgLat,orgLong,taste,range,start,batchsize,callback) {
	var connection=conn.conn();
	connection.connect();
	var subQuery='';
	range=range/2;//Range is round trip but we need here for one side
	
	subQuery+='(Taste & '+connection.escape(taste.tasteInteger)+'!=0 ) AND (Taste & '+connection.escape(taste.familyFriendsInteger)+'!=0 )';
	var queryString='SELECT CityName as name,CityID,Latitude,Longitude,State, Description, Rating,CityImage as Image,( 6371 * acos( cos( radians('+orgLat+') ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians('+orgLong+') ) + sin( radians('+orgLat+') ) * sin( radians( Latitude ) ) ) ) AS distance FROM City WHERE '+subQuery+' HAVING distance < '+range+' ORDER BY Rating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';

	connection.query(queryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
	    	for (var i in rows) {
				//var id = hashidscity.encode(rows[i].CityID);
	    		var id = hashidEncoder.encodeCityID(rows[i].CityID);
				rows[i].CityID = id;
				console.log(rows[i]);
	    	}
	  }
		callback(rows);
});
	connection.end();
}
module.exports.getCityList = getCityList;
