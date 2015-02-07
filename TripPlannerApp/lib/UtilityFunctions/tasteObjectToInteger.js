
var tasteMapping = {

	RELIGIOUS 	: 0x1,
	ADVENTURE 	: 0x2,
	BEACHES 	: 0x4,
	LANDMARKS 	: 0x8,
	NATURE 		: 0x10,
	LIVE_EVENTS	: 0x20,
	HILL_STATION: 0x40,
	ROMANTIC	: 0x200
};
var familyFriendsMapping={
	FAMILY		: 0x80,
	FRIENDS		: 0x100
};
var allTastes = 639;
var allFamilyFriends = 384

function tasteObjectToInteger(tasteObject)
{
	var tasteInteger=0;
	var familyFriendsInteger=0;
	for(var i in tasteObject)
        {
            if(tasteObject[i] === true) {
            	if((i.toUpperCase() == "FAMILY")||(i.toUpperCase() == "FRIENDS"))
            	{
            		familyFriendsInteger|=familyFriendsMapping[i.toUpperCase()];
            	}
            	else
            	{
            		 tasteInteger |= tasteMapping[i.toUpperCase()];
            	}
            }
        }
    //if user has not entered any taste
    if(tasteInteger==0)
    {
    	tasteInteger=allTastes;
    }
    if(familyFriendsInteger==0)
    {
    	familyFriendsInteger=allFamilyFriends;
    }
    return {
    	tasteInteger:tasteInteger,
    	familyFriendsInteger:familyFriendsInteger
    };
}

module.exports.tasteObjectToInteger=tasteObjectToInteger;
