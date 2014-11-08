/**
 * New node file
 */

var IndexModel = require('../models/index');
var getDataRome2rio=require('../lib/getDataRome2rio');
var mergeJson=require('../lib/mergeJson');
var getRatingRatio=require('../lib/getRatingRatio');
var conn = require('../lib/database');

module.exports=function (app){

	var model = new IndexModel();

	app.get('/showRoutes',function(req,res)
	{
		console.log("showRoutes");
		var cities=req.param('cities').split(',');
		var startDate=req.param("stD");
    	var endDate=req.param("enD");
    	var dates=[startDate,endDate];
    	var startTime=req.param("stT");
    	var endTime=req.param("enT");
    	var times=[startTime,endTime];
    	var  numPeople=req.param("numP");
		console.log(startTime+":"+endTime+":"+numPeople);
		
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
		
		fns.push(function (callback){
			getRatingRatio.getRatingRatio(conn,cities.slice(1,cities.length-1),dates,times,callback);
			});
		
    	var async  = require('async');
    	console.log("after for loop:" + fns.length);
    	
    	async.parallel(fns,
    	            //callback
    	            function(err, results) {
    					console.log("in parallel callback:");
    					var ratio=results[results.length-1];
    					for(var i in ratio)
    					{
    						console.log("ratio after async");
    						console.log(ratio[i]);
    					}
    					//mergeJson.mergeJson(results, function(mergedJsonString){
    				    	//console.log("Merged done");
    						/*var model = {
    								mergedJsonString:mergedJsonString
    						}*/
    				    	//res.json(model);
    						//};
    				});
		
		//getDataRome2rio.getDataRome2rio();
		
		
		
	});
}