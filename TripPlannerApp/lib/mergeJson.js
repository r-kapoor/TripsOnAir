/**
 * New node file
 */

function mergeJson(results,callback)
{
	var mergedString="{";
	for(var i=0;i<results.size-1;i++){
	
		mergedString+="{result["+i+"]:"+JSON.stringify(results[i])+"},";		
	}
	mergedString+="{result["+i+"]:"+JSON.stringify(results[i])+"}}";
	console.log("mergedString:"+mergedString);
	/*var mergedArray=[];
	for(var i=0;i<results.length;i++)
	{
		var result={"result"+i:results[i]};
		mergedArray.push(result);
	}
	var mergedJson=JSON.stringify(mergedArray);*/
	callback(mergedString);
}
module.exports.mergeJson = mergeJson;