var Hashids=require('hashids');
var hashidsgroup = new Hashids("encrypting the groupid using hash", 16, "0123456789abcdefghijklmnopqrstuvxyz");
var hashidscity = new Hashids("encrypting the cityid", 16, "0123456789abcdefghijklmnopqrstuvxyz");
var hashidshotel = new Hashids("encrypting the hotelid", 16, "0123456789abcdefghijklmnopqrstuvxyz");
var hashidsplace = new Hashids("encrypting the placeid", 16, "0123456789abcdefghijklmnopqrstuvxyz");
var hashidsitinerary = new Hashids("encrypting the itineraryid", 16, "0123456789abcdefghijklmnopqrstuvxyz");
var hashidspermalink = new Hashids("encrypting the permalink", 16, "0123456789abcdefghijklmnopqrstuvxyz");

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

function encodePermalink(ID){
    if(!Array.isArray(ID))
    {
        return hashidspermalink.encode(ID);
    }
    else
    {
        var IDsEncoded = [];
        for(var i = 0; i < ID.length; i++)
        {
            IDsEncoded.push(encodePermalink(ID[i]));
        }
        return IDsEncoded;
    }
}

function encodeItineraryID(itineraryID){
    if(!Array.isArray(itineraryID))
    {
        return hashidsitinerary.encode(itineraryID);
    }
    else
    {
        itineraryIDencoded = [];
        for(var i = 0; i < itineraryID.length; i++)
        {
            itineraryIDencoded.push(encodeItineraryID(itineraryID[i]));
        }
        return itineraryIDencoded;
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

function encodePlaceID(placeID){
    if(!Array.isArray(placeID))
    {
        return hashidsplace.encode(placeID);
    }
    else
    {
        placeIDencoded = [];
        for(var i = 0; i < placeID.length; i++)
        {
            placeIDencoded.push(encodePlaceID(placeID[i]));
        }
        return placeIDencoded;
    }
}

function decodeCityID(cityID){
	if(!Array.isArray(cityID))
	{
		return parseInt(hashidscity.decode(cityID));
	}
	else
	{
		cityIDdecoded = [];
		for(var i = 0; i < cityID.length; i++)
		{
			cityIDdecoded.push(decodeCityID(cityID[i]));
		}
		return cityIDdecoded;
	}
}

function decodePermalink(ID){
    if(!Array.isArray(ID))
    {
        return parseInt(hashidspermalink.decode(ID));
    }
    else
    {
        var IDsDecoded = [];
        for(var i = 0; i < ID.length; i++)
        {
            IDsDecoded.push(decodePermalink(ID[i]));
        }
        return IDsDecoded;
    }
}

function decodePlaceID(placeID){
    if(!Array.isArray(placeID))
    {
        return parseInt(hashidsplace.decode(placeID));
    }
    else
    {
        placeIDdecoded = [];
        for(var i = 0; i < placeID.length; i++)
        {
            placeIDdecoded.push(decodePlaceID(placeID[i]));
        }
        return placeIDdecoded;
    }
}

module.exports.encodeCityID = encodeCityID;
module.exports.encodeItineraryID = encodeItineraryID;
module.exports.encodeGroupID = encodeGroupID;
module.exports.encodeHotelID = encodeHotelID;
module.exports.encodePlaceID = encodePlaceID;
module.exports.decodeCityID = decodeCityID;
module.exports.decodePlaceID = decodePlaceID;
module.exports.encodePermalink = encodePermalink;
module.exports.decodePermalink = decodePermalink;
