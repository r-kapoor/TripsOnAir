/**
 * @author rahul
 * @param conn
 * @param category
 * @param start
 * @param batchsize
 */

function getCityList(conn, category,start,batchsize) {

	var connection=conn.conn();
	connection.connect();
	var subQuery='';
	var category=category.split(",");
	for(var i=0;i<(category.length-1);i++)
	{
		console.log(category[i]);
		subQuery+='(Category like "' +category[i]+ '%") OR ';
	}
	subQuery+='(Category like "' +category[category.length-1]+ '%")';
	var queryString ='SELECT CityID, CityName, State, Category, Rating, Latitude, Longitude FROM City WHERE '+subQuery+' ORDER BY Rating LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';
	
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
});	 
	connection.end();
}
module.exports.getCityList = getCityList;