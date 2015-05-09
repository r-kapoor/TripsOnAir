/**
 * Created by rkapoor on 09/05/15.
 */
//The function gets the cities corresponding to the airports
var toTitleCase = require('../lib/UtilityFunctions/toTitleCase');
function getAirportCities(conn, airportList, callback){
    if(airportList.length > 0){
        var connection=conn.conn();
        connection.connect();
        var airportCodeList = [];
        for(var airportIndex = 0; airportIndex < airportList.length; airportIndex++){
            var code = airportList[airportIndex].code;
            //Seeing whether the code has already been entered in the list
            var alreadyEntered = false;
            for(var airportCodeIndex = 0; airportCodeIndex < airportCodeList.length; airportCodeIndex++){
                if(airportCodeList[airportCodeIndex] == code){
                    alreadyEntered = true;
                    break;
                }
            }
            if(!alreadyEntered){
                airportCodeList.push(code);
            }
        }

        var queryString = "SELECT a.CityName, b.AirportCode FROM "
        +"(SELECT CityID, CityName FROM City) a JOIN "
        +"(SELECT CityID, AirportCode FROM Airport_In_City WHERE AirportCode IN ("+connection.escape(airportCodeList)+")) b "
        +"ON (a.CityID = b.CityID) ";
        console.log("Airport Query:"+queryString);

        connection.query(queryString, function(err, rows, fields) {
            if (err)
            {
                throw err;
            }
            else{
                for (var i in rows) {
                    console.log(rows[i]);
                    for(var airportIndex = 0; airportIndex < airportList.length; airportIndex++){
                        if(airportList[airportIndex].code == rows[i].AirportCode){
                            airportList[airportIndex].name = toTitleCase.toTitleCase(rows[i].CityName);
                        }
                    }
                }
            }
            callback();
        });
        connection.end();
    }
    else {
        callback();
    }
}

module.exports.getAirportCities = getAirportCities;
