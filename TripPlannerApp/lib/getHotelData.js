require('date-utils');
var hashidEncoder =  require('../lib/hashEncoderDecoder');
function getHotelData (destinationsAndStops,hotelBudget, numOfPeople,connection) {
	
	var HotelsInCity=[];
	var numOfDaysInHotel = 0;
	console.log("hotelBudget:"+hotelBudget);
	for(var i=0;i<destinationsAndStops.destinations.length;i++)
	{	console.log("TESTING");
		if(destinationsAndStops.destinations[i].isHotelRequired==1)
		{
			console.log("for:"+destinationsAndStops.destinations[i].name);
			HotelsInCity.push(destinationsAndStops.destinations[i].name);
			var numOfHoursInHotel = destinationsAndStops.destinations[i].arrivalTime.getHoursBetween(destinationsAndStops.destinations[i].departureTime);
			numOfDaysInHotel+=Math.ceil(numOfHoursInHotel/24);
		}
	}
	for(var k=0;k<destinationsAndStops.destinationsWiseStops.length;k++){
		if(destinationsAndStops.destinationsWiseStops[k].isHotelRequired==1)
		{
			HotelsInCity.push(destinationsAndStops.destinationsWiseStops[k].name);
			var numOfHoursInHotel = destinationsAndStops.destinationsWiseStops[k].arrivalTime.getHoursBetween(destinationsAndStops.destinationsWiseStops[k].departureTime);
			numOfDaysInHotel+=Math.ceil(numOfHoursInHotel/24);
		}
	}

	var perDayHotelBudget=hotelBudget/numOfDaysInHotel;

var queryString="";
for(var j=0;j<HotelsInCity.length;j++)
{
	if(j!=0)
	{
		queryString+=" UNION ALL ";
	}
	if(numOfPeople==1)
	{
		queryString+="(SELECT * FROM "
					+"(SELECT HotelID, Name, Latitude, Longitude, Locality, Rating, NumReviews, PhotoLink, HotelUrl, RoomType, Price AS PricePerPerson, MaxPersons FROM Hotels_Details WHERE CityID IN "
					+"(SELECT CityID FROM City WHERE CityName IN (" +connection.escape(HotelsInCity[j])+ " )) "
					+"AND MaxPersons <= 2 AND MaxPersons > 0) a "
					+"WHERE PricePerPerson < "+ connection.escape(perDayHotelBudget) 
					+" ORDER BY Rating DESC "
					+"LIMIT 1 )";
	}
	else
	{	
		queryString+="(SELECT * FROM (SELECT HotelID, Name, Latitude, Longitude, Locality, Rating, NumReviews, PhotoLink, HotelUrl, RoomType, "
					+"Price/MaxPersons AS PricePerPerson, MaxPersons FROM Hotels_Details WHERE CityID IN "
					+"(SELECT CityID FROM City WHERE CityName IN ("+connection.escape(HotelsInCity[j])+")) "
					+"AND MaxPersons <= " + connection.escape(numOfPeople) +" AND MaxPersons > 0) a "
					+"WHERE PricePerPerson < "+ connection.escape(perDayHotelBudget) 
					+" ORDER BY Rating DESC LIMIT 1 )";

	}				

}
queryString+=";";
console.log("HotelQuery:"+queryString);

connection.query(queryString, function(err, rows, fields) {
		if (err)
		{
			throw err;
		}
	    else{
	    	for (var i in rows) {
				//var id = hashidscity.encode(rows[i].CityID);
	    		var id = hashidEncoder.encodeHotelID(rows[i].HotelID);
				rows[i].HotelID = id;
				console.log(rows[i]);
	    	}
	    	var k=0;
	    	for(var i=0;i<destinationsAndStops.destinations.length;i++)
			{	
				if(destinationsAndStops.destinations[i].name==HotelsInCity[k])
				{
					destinationsAndStops.destinations[i].hotelDetails=rows[k];
					k++;
				}
			}
			for(var i=0;i<destinationsAndStops.destinationsWiseStops.length;i++)
			{
				if(destinationsAndStops.destinationsWiseStops[i].name==HotelsInCity[k])
				{
					destinationsAndStops.destinationsWiseStops[i].hotelDetails=rows[k];
					k++;
				}
			}
			//Testing
			for(var i=0;i<destinationsAndStops.destinations.length;i++)
			{
				console.log("destinations with Hotels:"+JSON.stringify(destinationsAndStops.destinations[i]));
				console.log("stops with hotel:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[i]));
			}
			console.log("LastStop with hotel:"+JSON.stringify(destinationsAndStops.destinationsWiseStops[destinationsAndStops.destinationsWiseStops.length-1]));	
	  }
		//callback(rows);
});
	connection.end();

}
module.exports.getHotelData=getHotelData;