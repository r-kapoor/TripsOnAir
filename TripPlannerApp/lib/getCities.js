module.exports = function getCityList(conn, category,start,batchsize) {

	var connection=conn.conn();
	connection.connect();
	//str = 'as';
	//var queryString = 'SELECT distinct(Name) FROM Places';
	var queryString ='SELECT CItyID, CityName, State, Category, Rating, Latitude, Longitude FROM City WHERE Category like("%?%") ORDER BY Rating LIMIT '+ connection.escape(start) +', '+ connection.escape(batchsize)+';';
	console.log('test');
	
	connection.query(queryString, [category], function(err, rows, fields) {
	    if (err) throw err;

	    else{
	    
	    	for (var i in rows) {
	        console.log(rows[i]);
	    }	    
	  }
});	 
	connection.end();
};