var hashidEncoder =  require('../lib/hashEncoderDecoder');
function getOrderedPlaces(destinationsForPlaces,taste,connection,placesDataCallback){
	var CityIDsForPlaces=[];
	var cityWisePlaces=[];
	var subQuery='(Taste & '+connection.escape(taste.tasteInteger)+'!=0 ) AND (Taste & '+connection.escape(taste.familyFriendsInteger)+'!=0 )';
	for(var i=0;i<destinationsForPlaces.destinations.length;i++)
		{	
			CityIDsForPlaces.push(destinationsForPlaces.destinations[i].cityID);
			cityWisePlaces[i]=[];
		}
	//CityIDsForPlacesDecrypted = hashidEncoder.CityIDsForPlaces
	var decodedCityIDsForPlaces=hashidEncoder.decodeCityID(CityIDsForPlaces);
	queryString = "SELECT a.PlaceID, Taste, Name, Address, CityID, Description, Score, IF(("+subQuery+"),1,0) AS OrderAttribute, Latitude, Longitude, Time2Cover, UnescoHeritage, TimeStart, TimeEnd, Days, ChildCharge, AdultCharge, ForeignerCharge FROM "
					+"(SELECT * FROM Places WHERE CityID IN ("+connection.escape(decodedCityIDsForPlaces)+")) a LEFT OUTER JOIN "
					+"(SELECT * FROM Place_Charges WHERE PlaceID IN (SELECT PlaceId FROM Places WHERE CityID IN ("+connection.escape(decodedCityIDsForPlaces)+"))) b"
					+" ON (a.PlaceID = b.PlaceID) LEFT OUTER JOIN "
					+"(SELECT * FROM PlaceTimings WHERE PlaceID IN (SELECT PlaceId FROM Places WHERE CityID IN ("+connection.escape(decodedCityIDsForPlaces)+"))) c "
					+" ON (a.PlaceID = c.PlaceID)"
					+" ORDER BY OrderAttribute DESC, Score DESC LIMIT 100;";

	/*SELECT * FROM (SELECT * FROM `Places` WHERE `CityID`=6) a LEFT OUTER JOIN (SELECT * FROM Place_Charges WHERE PlaceID IN (SELECT PlaceId FROM `Places` WHERE `CityID`=6)) b  ON (a.PlaceID = b.PlaceID) LEFT OUTER JOIN (SELECT * FROM PlaceTimings WHERE PlaceID IN (SELECT PlaceId FROM `Places` WHERE `CityID`=6)) c ON (a.PlaceID = c.PlaceID) LEFT OUTER JOIN (SELECT * FROM Place_Image WHERE PlaceID IN (SELECT PlaceId FROM `Places` WHERE `CityID`=6)) d ON (a.PlaceID = d.PlaceID)*/

	console.time("dbsave");	
	console.log("PLaces query:"+queryString);
connection.query(queryString, function(err, rows, fields) {
				console.timeEnd("dbsave");
				if (err)
				{
					throw err;
				}
			    else{
			    	for (var i in rows) {

			    		console.log(rows[i]);
			    		cityWisePlaces[decodedCityIDsForPlaces.indexOf(rows[i].CityID)].push(rows[i]);
			    	}
			    }
			  }); 	
placesDataCallback(cityWisePlaces);
}
module.exports.getOrderedPlaces=getOrderedPlaces;