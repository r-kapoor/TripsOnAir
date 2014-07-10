/**
 * New node file
 */


function getGroupList(conn,callback) {

	//var test="";
	var connection=conn.conn();
	connection.connect();
	/*var subQuery='';
	var category=category.split(",");
	for(var i=0;i<(category.length-1);i++)
	{
		//console.log(category[i]);
		subQuery+='(Category like "' +category[i]+ '%") OR ';
	}
	subQuery+='(Category like "' +category[category.length-1]+ '%")';
	//var queryString ='SELECT CityID, CityName, State, Category, Rating, Latitude, Longitude FROM City WHERE '+subQuery+' ORDER BY Rating LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';
	var queryString='SELECT Name, ( 6371 * acos( cos( radians(28.635308) ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians(77.22496) ) + sin( radians(28.635308) ) * sin( radians( Latitude ) ) ) ) AS distance FROM City WHERE '+subQuery+' HAVING distance < '+range+' ORDER BY Rating LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';
	*/var queryString2='SELECT Name FROM Groups;';
	
	connection.query(queryString2, function(err, rows, fields) {
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