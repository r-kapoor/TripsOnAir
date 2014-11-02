/**
 * @author rajat
 * Data transfer object
 */


function dto()
{
	var destElements=document.getElementsByClassName('destination');
	var origin = document.getElementById("origin").value;
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	var numDays= (new Date(endDate)-new Date(startDate))/(1000*60*60*24); 
	var budget = document.getElementById("range").value;
	var dsts="";	
	var tst=getTastes();
	for(var j=0;j<destElements.length-1;j++)
	{
		dsts+=destElements[j].value+",";
	}
	dsts+=destElements[destElements.length-1].value;
	
	var dto={
			
			"o":origin,
			"stD":startDate,
			"enD":endDate,
			"no":numDays,
			"bdg":budget,
			"tst":tst,
			"dsts":dsts
	};
	onSubmit(dto,"getTravelOptions","getTravelOptions");
}

function dtoOnChoose()
{	
	var origin = document.getElementById("origin").value;
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	var numDays= (new Date(endDate)-new Date(startDate))/(1000*60*60*24); 
	var budget = document.getElementById("range").value;
	var chooosenDestinations=document.getElementsByClassName('clect');
	var dsts="";
	
	var tst=getTastes();
	for(var j=0;j<chooosenDestinations.length-1;j++)
	{
		dsts+=chooosenDestinations[j].innerHTML+",";
	}
	dsts+=chooosenDestinations[chooosenDestinations.length-1].innerHTML;
	var dto={
			
			"o":origin,
			"stD":startDate,
			"enD":endDate,
			"no":numDays,
			"bdg":budget,
			"tst":tst,
			"dsts":dsts
	};
	onSubmit(dto,"getTravelOptions", "getTravelOptions");
}

function getTastes()
{	
	var tastes = document.getElementsByName('category');
	var tasteLen=tastes.length;
	var tst="";
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
	return tst;
}