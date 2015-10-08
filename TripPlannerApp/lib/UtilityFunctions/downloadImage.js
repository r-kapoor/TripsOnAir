/**
 * Created by rajat on 6/19/2015.
 */

var fs = require('fs');
var request = require('request');
var conn = require('../../lib/database');

//function getHotelUrl(cityIDs, callback)
//{
//    var connection=conn.conn();
//    connection.connect();
//    var queryString = 'SELECT HotelID,PhotoLink FROM Hotels_Details WHERE CityID IN ('+cityIDs+')';
//    connection.query(queryString, function(err, rows, fields) {
//        if (err)
//        {
//            throw err;
//        }
//        else{
//            for (var i in rows) {
//                console.log("links:"+rows[i].PhotoLink);
//                if(rows[i].PhotoLink.indexOf("http")!=-1)
//                {
//                    rows[i].PhotoLink = rows[i].PhotoLink.replace("square200","max400");
//                    download(rows[i].PhotoLink,'../../public/images/Hotels/'+rows[i].HotelID+'.png',function(){});
//                }
//            }
//        }
//        //callback(null, cityIDs);
//    });
//    connection.end();
//}

function getPlaceUrl(cityIDs, callback)
{
    var connection=conn.conn();
    connection.connect();
    var queryString = 'SELECT a.PlaceID as PlaceID,ImageURL FROM ((SELECT PlaceID FROM Places WHERE CityID IN ('+cityIDs+')) a' +
        ' JOIN (SELECT * from Place_Images) b)' +
        ' WHERE a.PlaceID = b.PlaceID';

    connection.query(queryString, function(err, rows, fields) {
        if (err)
        {
            throw err;
        }
        else{
            for (var i in rows) {
                console.log("links:"+rows[i].ImageURL);
                if(rows[i].ImageURL.indexOf("http")!=-1)
                {
                    download(rows[i].ImageURL,'../../public/images/Places/'+rows[i].PlaceID+'-1.jpg',function(){});
                }
            }
        }
        //callback(null, cityIDs);
    });
    connection.end();
}

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

//download('https://upload.wikimedia.org/wikipedia/commons/0/04/Golden_Temple%2CAmritsar.JPG', '../../public/images/Hotels/test123.png', function(){
//    console.log('done');
//});

function onCommandLine()
{
    var cityIDs = process.argv[2];
   if(cityIDs==undefined||cityIDs==null||cityIDs=="")
   {
       console.log("ENTER THE Correct CITY ID FOR WHICH YOU WANT Place IMAGES");
   }
   else
   {
       //getHotelUrl(cityIDs,function(){
       //    console.log("DONE with download...Check 'public/images/Hotels' folder");
       //});
        getPlaceUrl(cityIDs,function()
        {
           console.log("DONE with download...Check 'public/images/Places' folder");
        });
   }
}

onCommandLine();
