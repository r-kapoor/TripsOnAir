/**
 * Created by rajat on 5/21/2015.
 */

var cloudinary = require('cloudinary');
var fs = require('fs');
var encodeID = require('../../lib/hashEncoderDecoder');
//var lineReader = require('line-reader');
var conn = require('../../lib/database');

cloudinary.config({
    cloud_name: 'picsonair',
    api_key: '541873482133688',
    api_secret: 'R9WfEeCpaAgt4YUbd3Ag_F5YtGA'
});

function uploadPlaceImages()
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
            encodedPlaceID = encodeID.encodePlaceID(parseInt(placeID))+"-"+imageNumber;

            console.log("encodePlaceID:"+encodedPlaceID);
            //console.log(files[i]);
            cloudinary.uploader.upload(
                filePath,
                function(result) { console.log(result); },
                {
                    public_id: encodedPlaceID,
                    eager: [
                        { height: 300, crop: 'limit', format: 'png' },
                        { width: 250, crop: 'limit', format: 'png' }
                    ]
                }
            )
        }
    }
}

function uploadHotelImages()
{
    var folder = process.argv[3];
    var path = "../../public/images/"+folder;
    var files = fs.readdirSync(path);
    var filePath;
    var encodedHotelID;
    for(var i in files)
    {
        filePath = path+"/"+files[i];
        console.log(filePath);
        //console.log(files[i]);
        if(files[i].indexOf("png")!=-1||files[i].indexOf("jpg")!=-1) {
            var hotelID = files[i];
            encodedHotelID = encodeID.encodeHotelID(parseInt(hotelID));

            console.log("encodedHotelID:"+encodedHotelID);
            cloudinary.uploader.upload(
                filePath,
                function(result) { console.log(result); },
                {
                    public_id: encodedHotelID,
                    eager: [
                        { width: 250, crop: 'limit', format: 'png' }
                    ]
                }
            )
        }
    }
}

function uploadCityImages()
{
    /*
        large = 1, image size is of suggestDestination panel
        if large not passed, then image size would be of destination panel on left
     */
    var folder = process.argv[3];
    var large = process.argv[4];
    var path = "../../public/images/"+folder;
    var files = fs.readdirSync(path);
    var filePath;
    var encodedCityID;
    if(large==undefined)
    {
        large = 0;
    }

    for(var i in files)
    {
        filePath = path+"/"+files[i];
        console.log(filePath);
        //console.log(files[i]);
        if(files[i].indexOf("png")!=-1||files[i].indexOf("jpg")!=-1) {
            var hotelID = files[i];
            encodedCityID = encodeID.encodeCityID(parseInt(hotelID));
            if(parseInt(large)==1)
            {
                var cropImage = {
                    public_id: encodedCityID
                };
            }
            else
            {
                cropImage = {
                    public_id: encodedCityID,
                    eager: [
                        { width: 200, crop: 'limit', format: 'png' }
                    ]
                };
            }

            console.log("encodedCityID:"+encodedCityID);
            cloudinary.uploader.upload(
                filePath,
                function(result) { console.log(result); },cropImage
            )
        }
    }
}

function uploadGroupImages()
{
    var folder = process.argv[3];
    var path = "../../public/images/"+folder;
    var files = fs.readdirSync(path);
    var filePath;
    var encodeGroupID;
    for(var i in files)
    {
        filePath = path+"/"+files[i];
        console.log(filePath);
        //console.log(files[i]);
        if(files[i].indexOf("png")!=-1||files[i].indexOf("jpg")!=-1) {

            var idWithImageNumber = files[i].split("-");
            var groupID = idWithImageNumber[0];
            var imageNumber = idWithImageNumber[1].replace ( /[^\d]/g, '' );
            console.log(groupID+","+imageNumber);
            encodeGroupID = encodeID.encodeGroupID(parseInt(groupID))+"-"+imageNumber;

            console.log("encodeGroupID:"+encodeGroupID);
            cloudinary.uploader.upload(
                filePath,
                function(result) { console.log(result); },
                {
                    public_id: encodeGroupID
                    //eager: [
                    //    { width: 616, height:282, crop: 'limit', format: 'png' }
                    //]
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

function onCommandLine()
{
    var functionName = process.argv[2];
    if(functionName.toLowerCase()=='uploadplaceimages')
    {
        uploadPlaceImages();
    }
    else if(functionName.toLowerCase()=='uploadhotelimages')
    {
        uploadHotelImages();
    }
    else if(functionName.toLowerCase() =='updatedata')
    {
        updateData();
    }
    else if(functionName.toLowerCase() == 'uploadcityimages')
    {
        uploadCityImages();
    }
    else if(functionName.toLowerCase() == 'uploadgroupimages')
    {
        uploadGroupImages();
    }
}

onCommandLine();
