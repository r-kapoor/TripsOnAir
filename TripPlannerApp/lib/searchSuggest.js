var conn = require('../lib/database');

module.exports = function search(str) {

	var connection=conn.conn();
	connection.connect();
	//str = 'as';
	//var queryString = 'SELECT distinct(Name) FROM Places';
	var queryString ='SELECT Name FROM Places WHERE Name like("' +str+ '%")';
	console.log('test');
	
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;

	    else{
	    
	    	for (var i in rows) {
	        console.log(rows[i]);
	    }	    
	  }
});	 
	connection.end();
};