/**
 * @author rajat
 */

function conn()
{
var mysql = require('mysql');
 
var connection = mysql.createConnection(
    {
      host     : '127.0.0.1',
      port     : '3307',
      user     : 'adminzESTl5F',
      password : 'duKiwg4kLMSV',
      database : 'Holiday',
    }
);

return connection;
}
module.exports.conn = conn;

/*conn.connect();

var queryString = 'SELECT * FROM Places';

connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    else{
    
    	for (var i in rows) {
        console.log('Name: ', rows[i].Name);
    }
    
    }
});
 
connection.end();*/