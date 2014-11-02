/**
 * New node file
 */

var IndexModel = require('../models/index');
var getDataRome2rio=require('../lib/getDataRome2rio');
var mergeJson=require('../lib/mergeJson');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/showRoutes',function(req,res)
	{
		console.log("showRoutes");
		var cities=req.param('cities').split(',');
		var fns=[];
		var test=Array.apply(null, new Array(cities.length-1)).map(Number.prototype.valueOf, 0);
		var funct = function (callback){
			for(var i=0;i<test.length;i++)
			{
				if(test[i]==0)
				{
					test[i]=1;
					console.log("in fun:"+cities[i]+":"+cities[i+1]);
		        	getDataRome2rio.getDataRome2rio(cities[i],cities[i+1],callback);
		        	break;
				}	
			}			
        };
		for(var i=0;i<cities.length-1;i++)
		{
			console.log("city:"+cities[i]);		
            fns.push(funct);
		}
    	var async  = require('async');
    	console.log("after for loop:" + fns.length);
    	
    	async.parallel(fns,
    	            //callback
    	            function(err, results) {
    					console.log("in parallel callback:");
    					mergeJson.mergeJson(results, function(mergedJsonString){
    				    	console.log("Merged done");
    						var model = {
    								mergedJsonString:mergedJsonString
    						}
    				    	//res.json(model);
    						});
    				});
		
		//getDataRome2rio.getDataRome2rio();
		
		
		
	});
}