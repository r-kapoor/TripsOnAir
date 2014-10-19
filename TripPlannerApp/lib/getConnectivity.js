var conn = require('../lib/database');

function getConnectivity(cities, callback)
{
	console.log("getConnectivity called");
	var connection=conn.conn();
	connection.connect();
	queryString = '';
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

module.exports.getConnectivity=getConnectivity;