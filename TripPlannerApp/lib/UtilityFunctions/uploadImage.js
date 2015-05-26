/**
 * Created by rajat on 5/21/2015.
 */

var cloudinary = require('cloudinary');
var fs = require('fs');
var encodePlaceID = require('../../lib/hashEncoderDecoder');
var lineReader = require('line-reader');
var conn = require('../../lib/database');

cloudinary.config({
    cloud_name: 'picsonair',
    api_key: '541873482133688',
    api_secret: 'R9WfEeCpaAgt4YUbd3Ag_F5YtGA'
});

function uploadImages()
{
    var folder = process.argv[3];
    var path = "../../public/images/"+folder;
    var files = fs.readdirSync(path);
    var filePath;
    var encodedPlaceID;
    for(var i in files)
    {
        filePath = path+"/"+files[i];
        console.log(filePath);
        //console.log(files[i]);
        if(files[i].indexOf("png")!=-1||files[i].indexOf("jpg")!=-1) {
            var idWithImageNumber = files[i].split("-");
            var placeID = idWithImageNumber[0];
            var imageNumber = idWithImageNumber[1].replace ( /[^\d]/g, '' );
            console.log(placeID+","+imageNumber);
            encodedPlaceID = encodePlaceID.encodePlaceID(parseInt(placeID))+"-"+imageNumber;

            console.log("encodePlaceID:"+encodedPlaceID);
            //console.log(files[i]);
            cloudinary.uploader.upload(
                filePath,
                function(result) { console.log(result); },
                {
                    public_id: encodedPlaceID,
                    eager: [
                        { width: 300, height: 150, crop: 'limit', format: 'png' }
                        //{ width: 400, height: 50, crop: 'limit', format: 'png' }
                    ]
                }
            )
        }
    }
}

function updateData()
{
    var filePath;
    var folder = process.argv[3];
    var path = "\\..\\..\\public\\images\\"+folder;
    var files = fs.readdirSync(__dirname+path);
    var connection=conn.conn();
    connection.connect();
    console.log("__dirname:"+__dirname);
    for(var i in files) {
        filePath = __dirname + path + files[i];
        console.log(filePath);
        if (files[i].indexOf("txt") != -1) {
            var queryString = 'LOAD DATA LOCAL INFILE '+connection.escape(filePath)+' '
                + ' INTO TABLE Place_Image '
                + ' FIELDS TERMINATED BY \',\' '
                + ' OPTIONALLY ENCLOSED BY \'"\';';

            connection.query(queryString, function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                else {
                    //for (var i in rows) {
                    //    console.log("Returned Cities from db:"+rows[i].CityID+','+rows[i].CityName);
                    //    cityIDs[cityNames.indexOf(rows[i].CityName)] = rows[i].CityID;
                    //}
                    console.log("Query Success!!");
                }
                //callback();
            });
            connection.end();
        }
    }
}
//uploadImages();
//updateData();

//lineReader.eachLine(filePath, function(line, last) {
//    console.log(line);
//    console.log("Read one line");
    //if (0) {
    //    return false; // stop reading
    //}
//});

function onCommandLine()
{
    var functionName = process.argv[2];
    if(functionName.toLowerCase()=='uploadimages')
    {
        uploadImages();
    }
    else if(functionName.toLowerCase() =='updatedata')
    {
        updateData();
    }
}

onCommandLine();
