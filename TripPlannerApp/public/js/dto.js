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

function dtoOnChoose()
{	
	var origin = document.getElementById("origin").value;
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	var numDays= (new Date(endDate)-new Date(startDate))/(1000*60*60*24); 
	var budget = document.getElementById("range").value;
	var tastes = document.getElementsByName('category');
	//var chooosenDestinations=document.getElementsByName('clect');
	var chooosenDestinations=document.getElementsByClassName('clect');
	console.log("chooosenDestinationsLen:"+chooosenDestinations.length);
	var tst="";
	var dsts="";
	var tasteLen=tastes.length;
	for(var i=0;i<tasteLen-1;i++)
	{
		if(tastes[i].checked){		
			tst+=tastes[i].value+",";
		}
	}
	if(tastes[tasteLen-1].checked)
	{
		tst+=tastes[tasteLen-1].value;
	}
	else
	{
		tst=tst.substring(0,(tst.length-1));
	}	
	
	for(var j=0;j<chooosenDestinations.length-1;j++)
	{
		dsts+=chooosenDestinations[j].innerHTML+",";
	}
	dsts+=chooosenDestinations[chooosenDestinations.length-1].innerHTML;
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