/**
 * @author rajat
 * Find the groups from db batch wise according to the inputs
 */


function getGroupList(conn,category,range,start,batchsize,callback) {

	var connection=conn.conn();
	connection.connect();
	var subQuery='';
	var category=category.split(",");
	for(var i=0;i<(category.length-1);i++)
	{
		subQuery+='(GroupCategory like "' +category[i]+ '%") OR ';
	}
	subQuery+='(GroupCategory like "' +category[category.length-1]+ '%")';
	var queryString='SELECT GroupName, (( 6371 * acos( cos( radians(28.635308) ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians(77.22496) ) + sin( radians(28.635308) ) * sin( radians( Latitude ) ) ) )+DistFactor) AS distance FROM Groups WHERE '+subQuery+' HAVING distance < '+range+' ORDER BY GroupRating DESC LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';
	
	connection.query(queryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
	    	for (var i in rows) {
	        console.log(rows[i]);
	    	}
	  }
		callback(rows);
});
	connection.end();
	
}
module.exports.getGroupList = getGroupList;