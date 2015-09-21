/**
 * @author rajat
 */

function conn(database, type)
{
    var mysql = require('mysql');
    if(database== undefined){
        database = 'Holiday';
    }

    if(type == undefined){
        var connection = mysql.createConnection(
            {
                host     : 'singapore-mysql-instance1.cp4adwqmzvxv.ap-southeast-1.rds.amazonaws.com',
                port     : '3306',
                user     : 'adminTripsonair1',
                password : 'adminDB!master',
                database : database
            }
        );
    }
    else {
        connection = mysql.createConnection(
            {
                host     : '127.0.0.1',
                port     : '3306',
                user     : 'adminzESTl5F',
                password : 'duKiwg4kLMSV',
                database : database
            }
        );
    }
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
