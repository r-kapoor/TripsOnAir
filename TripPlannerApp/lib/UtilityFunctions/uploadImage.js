/**
 * Created by rajat on 5/21/2015.
 */

var cloudinary = require('cloudinary');
var fs = require('fs');

cloudinary.config({
    cloud_name: 'picsonair',
    api_key: '541873482133688',
    api_secret: 'R9WfEeCpaAgt4YUbd3Ag_F5YtGA'
});

//cloudinary.uploader.upload("../../public/images/nature.png", function(result) {
//    console.log(result);
//});

//cloudinary.uploader.upload();

//var files = fs.readdirSync('../../public/images/');
//for (var i in files) {
//    console.log(files[i]);
//}

//process.argv.forEach(function (val, index, array) {
//    console.log(index + ': ' + val);
//});

function uploadImages()
{
    var folder = process.argv[2];
    var path = "../../public/images/"+folder;
    var files = fs.readdirSync(path);
    var filePath;
    for(var i in files)
    {
        console.log(files[i]);
        if(files[i].indexOf("png")!=-1||files[i].indexOf("jpg")!=-1) {
            filePath = path+"/"+files[i];
            //console.log(files[i]);
            //cloudinary.uploader.upload(
            //    filePath,
            //    function(result) { console.log(result); },
            //    {
            //        public_id: '123',
            //        crop: 'limit',
            //        width: 600,
            //        height: 250,
            //        eager: [
            //            { width: 200, height: 200, crop: 'thumb', gravity: 'face',
            //                radius: 20, effect: 'sepia' },
            //            { width: 100, height: 150, crop: 'fit', format: 'png' }
            //        ],
            //        tags: ['myPic', 'NamePerson']
            //    }
            //)
        }
        else
        {
            console.log("----------Error---------");
            console.log("Convert "+files[i]+" to jpg or png");
        }
    }
}

uploadImages();
