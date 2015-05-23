/**
 * Created by rkapoor on 21/05/15.
 */

var tasteMapping = {

    RELIGIOUS 	: 0x1,
    ADVENTURE 	: 0x2,
    BEACHES 	: 0x4,
    LANDMARKS 	: 0x8,
    NATURE 		: 0x10,
    LIVE_EVENTS	: 0x20,
    HILL_STATION: 0x40,
    ROMANTIC	: 0x200,
    SHOPPING    : 0x400,
    UNIQUE_EXPERIENCES:0x800,
    SPA         :0x1000,
    NIGHTLIFE   :0x2000
};
var familyFriendsMapping={
    FAMILY		: 0x80,
    FRIENDS		: 0x100
};
//var allTastes = 639;
var allTastes = 15999;
var allFamilyFriends = 384;

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

function tasteIntegerToObject(tasteInteger) {
    var tasteObject = {
        RELIGIOUS   : false,
        ADVENTURE   : false,
        BEACHES     : false,
        LANDMARKS   : false,
        NATURE      : false,
        LIVE_EVENTS : false,
        HILL_STATION: false,
        ROMANTIC    : false,
        FAMILY      : false,
        FRIENDS     : false,
        SHOPPING    : false,
        UNIQUE_EXPERIENCES:false,
        SPA         :false,
        NIGHTLIFE   :false
    };

    for(var i in tasteObject) {
        if((i.toUpperCase() == "FAMILY")||(i.toUpperCase() == "FRIENDS")) {
            if(parseInt(familyFriendsMapping[i] & tasteInteger) != 0) {
                tasteObject[i] = true;
            }
        }
        else{
            if(parseInt(tasteMapping[i] & tasteInteger) != 0){
                tasteObject[i] = true;
            }
        }
    }
    return tasteObject;
}

module.exports.tasteObjectToInteger=tasteObjectToInteger;
module.exports.tasteIntegerToObject=tasteIntegerToObject;

