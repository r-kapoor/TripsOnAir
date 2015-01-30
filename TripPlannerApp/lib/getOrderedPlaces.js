var hashidEncoder =  require('../lib/hashEncoderDecoder');
function getOrderedPlaces(destinationsForPlaces,taste,connection,placesDataCallback){
	var CityIDsForPlaces=[];
	var cityWisePlaces=[];
	var tastesSubQuery='(Taste & '+connection.escape(taste.tasteInteger)+'!=0 )'
    var familyFriendsSubQuery = '(Taste & '+connection.escape(taste.familyFriendsInteger)+'!=0 )';
	for(var i=0;i<destinationsForPlaces.destinations.length;i++)
		{
			CityIDsForPlaces.push(destinationsForPlaces.destinations[i].cityID);
			cityWisePlaces[i]=[];
		}
	//CityIDsForPlacesDecrypted = hashidEncoder.CityIDsForPlaces
	var decodedCityIDsForPlaces=hashidEncoder.decodeCityID(CityIDsForPlaces);
	var queryString = "SELECT a.PlaceID, Taste, Name, Address, CityID, Description, Score, IF(("+tastesSubQuery+"),1,0) AS TasteOrderAttribute, IF(("+familyFriendsSubQuery+"),1,0) AS FamilyFriendsOrderAttribute, Latitude, Longitude, Time2Cover, UnescoHeritage, TimeStart, TimeEnd, Days, ChildCharge, AdultCharge, ForeignerCharge FROM "
					+"(SELECT * FROM Places WHERE CityID IN ("+connection.escape(decodedCityIDsForPlaces)+")) a LEFT OUTER JOIN "
					+"(SELECT * FROM Place_Charges WHERE PlaceID IN (SELECT PlaceId FROM Places WHERE CityID IN ("+connection.escape(decodedCityIDsForPlaces)+"))) b"
					+" ON (a.PlaceID = b.PlaceID) LEFT OUTER JOIN "
					+"(SELECT * FROM PlaceTimings WHERE PlaceID IN (SELECT PlaceId FROM Places WHERE CityID IN ("+connection.escape(decodedCityIDsForPlaces)+"))) c "
					+" ON (a.PlaceID = c.PlaceID)"
					+" ORDER BY TasteOrderAttribute DESC, FamilyFriendsOrderAttribute DESC, Score DESC, a.PlaceID DESC LIMIT 100;";

	/*SELECT * FROM (SELECT * FROM `Places` WHERE `CityID`=6) a LEFT OUTER JOIN (SELECT * FROM Place_Charges WHERE PlaceID IN (SELECT PlaceId FROM `Places` WHERE `CityID`=6)) b  ON (a.PlaceID = b.PlaceID) LEFT OUTER JOIN (SELECT * FROM PlaceTimings WHERE PlaceID IN (SELECT PlaceId FROM `Places` WHERE `CityID`=6)) c ON (a.PlaceID = c.PlaceID) LEFT OUTER JOIN (SELECT * FROM Place_Image WHERE PlaceID IN (SELECT PlaceId FROM `Places` WHERE `CityID`=6)) d ON (a.PlaceID = d.PlaceID)*/

	console.time("dbsave");
	console.log(":PLaces query"+queryString);
connection.query(queryString, function(err, rows, fields) {
				console.timeEnd("dbsave");
				if (err)
				{
					throw err;
				}
			    else{
			    	for (var i in rows) {
                        rows[i].PlaceTimings = [];
                        rows[i].PlaceTimings.push({
                            TimeStart : rows[i].TimeStart,
                            TimeEnd : rows[i].TimeEnd,
                            Days : rows[i].Days
                        });
                        delete rows[i].TimeStart;
                        delete rows[i].TimeEnd;
                        delete rows[i].Days;
			    		//console.log(rows[i]);
                        var indexOfCity = decodedCityIDsForPlaces.indexOf(rows[i].CityID);
                        if(cityWisePlaces[indexOfCity].length > 0 && cityWisePlaces[indexOfCity][cityWisePlaces[indexOfCity].length-1].PlaceID == rows[i].PlaceID) {
                            cityWisePlaces[indexOfCity][cityWisePlaces[indexOfCity].length-1].PlaceTimings.push(rows[i].PlaceTimings[0]);
                        }
                        else {
                            cityWisePlaces[indexOfCity].push(rows[i]);
                        }
			    	}
			    }
    placesDataCallback(null, cityWisePlaces);
			  });
    //connection.end();

}
module.exports.getOrderedPlaces=getOrderedPlaces;
