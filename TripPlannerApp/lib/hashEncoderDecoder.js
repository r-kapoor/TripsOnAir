var Hashids=require('hashids');
var hashidsgroup = new Hashids("encrypting the groupid using hash", 8);
var hashidscity = new Hashids("encrypting the cityid", 8);
var hashidshotel = new Hashids("encrypting the hotelid", 8);

function encodeCityID(cityID){
	if(!Array.isArray(cityID))
	{
		return hashidscity.encode(cityID);
	}
	else
	{
		cityIDencoded = [];
		for(var i = 0; i < cityID.length; i++)
		{
			cityIDencoded.push(encodeCityID(cityID[i]));
		}
		return cityIDencoded;
	}
}

function encodeGroupID(groupID){
	if(!Array.isArray(groupID))
	{
		return hashidsgroup.encode(groupID);
	}
	else
	{
		groupIDencoded = [];
		for(var i = 0; i < groupID.length; i++)
		{
			groupIDencoded.push(encodeGroupID(groupID[i]));
		}
		return groupIDencoded;
	}
}

function encodeHotelID(ID){
	if(!Array.isArray(ID))
	{
		return hashidshotel.encode(ID);
	}
	else
	{
		IDencoded = [];
		for(var i = 0; i < ID.length; i++)
		{
			IDencoded.push(encodeHotelID(ID[i]));
		}
		return IDencoded;
	}
}

module.exports.encodeCityID = encodeCityID;
module.exports.encodeGroupID = encodeGroupID;
module.exports.encodeHotelID = encodeHotelID;


