/**
 * New node file
 */

function extractStationCode(stationString)
{
	return stationString.substring(stationString.indexOf('(')+1,stationString.indexOf(')'));
}

module.exports.extractStationCode=extractStationCode;