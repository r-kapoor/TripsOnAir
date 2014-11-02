var Hashids=require('hashids');
var hashidsgroup = new Hashids("encrypting the groupid using hash", 8);
var hashidscity = new Hashids("encrypting the cityid", 8);

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

module.exports.encodeCityID = encodeCityID;
module.exports.encodeGroupID = encodeGroupID;


