/**
 * Created by rkapoor on 14/03/15.
 */
var conn = require('../../lib/database');
var encodeCityID = require('../../lib/hashEncoderDecoder');

function populateCityDataService() {
    var connection=conn.conn();
    connection.connect();
    var queryString = "SELECT CityID, CityName, State, CityImage, Tier as tier, Latitude, Longitude, IsDestination FROM City;"
    connection.query(queryString, function(err, rows, fields) {
        if (err)
        {
            throw err;
        }
        else{

            for(var i=0;i<rows.length;i++)
            {
                rows[i].CityID=encodeCityID.encodeCityID(rows[i].CityID);
            }

            var fs = require('fs');
            var writeContent = "inputModule.service('cityData', function () { var data = " + JSON.stringify(rows) + "; return {getProperty: function () {"
            +"return data;}};});";
            fs.writeFile("../../public/js/angularService/cityDataService.js", writeContent, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file cityDataService was saved!");
                }
            });
        }
        connection.end();
    });
}

populateCityDataService();
