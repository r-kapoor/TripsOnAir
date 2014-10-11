/**
 * @author rajat
 * Data transfer object
 */


function dto()
{
	console.log("INDTO");
	var origin = document.getElementById("origin").value;
	var destElements=document.getElementsByClassName('destination');
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	var numDays= (new Date(endDate)-new Date(startDate))/(1000*60*60*24); 
	var budget = document.getElementById("range").value;
	var tastes = document.getElementsByName('category');
	
	var dto={
			
			"origin":origin,
			"startDate":startDate,
			"endDate":endDate,
			"numDays":numDays,
			"budget":budget,
			"tastes":tastes
	};

	onSubmit(dto,"places");
}

function dtoOnChoose()
{	
	var origin = document.getElementById("origin").value;
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	var numDays= (new Date(endDate)-new Date(startDate))/(1000*60*60*24); 
	var budget = document.getElementById("range").value;
	var tastes = document.getElementsByName('category');
	var chooosenDestinations=document.getElementsByName('clect');
	var tst="";
	var dsts="";
	for(var i=0;i<tastes.length-1;i++)
	{
		tst+=tastes[i].value+",";
	}
	tst+=tastes[length-1];
	
	for(var j=0;j<chooosenDestinations.length-1;i++)
	{
		dsts+=chooosenDestinations[i].value+",";
	}
	dsts+=chooosenDestinations[chooosenDestinations.length-1];
	//console.log("tastes"+tst);
	//console.log();
	var dto={
			
			"o":origin,
			"stD":startDate,
			"enD":endDate,
			"no":numDays,
			"bdg":budget,
			"tst":tst,
			"dsts":dsts
	};
	onSubmit(dto,"places");
}