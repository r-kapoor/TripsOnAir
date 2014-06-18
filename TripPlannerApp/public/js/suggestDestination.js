/**
 * 
 * @author rajat
 * frontend interact with backend using ajax call
 */


function createQueryString(){
	var origin = document.getElementById("origin").value;
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	var numDays= (new Date(endDate)-new Date(startDate))/(1000*60*60*24); 
	var budget = document.getElementById("range").value;
	var tastes = document.getElementsByName('category');
	var userTastes=[];var j=0;
	for (var i=0, n=tastes.length;i<n;i++) {
	  if (tastes[i].checked) 
	  {
		 userTastes[j] = tastes[i].value;
		 j++;
	  }
	}
	var query="origin="+origin+"&"+"numDays="+numDays+"&"+"taste="+userTastes+"&"+"budget="+budget;
	return query;
}

function suggestDest()
{
	console.log("In suggest");
	var xmlhttp;
	var query = createQueryString();

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }

	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
		  console.log("in ready state");
		  document.getElementById("suggestedDest").innerHTML=xmlhttp.responseText;
	    }
	  }
		xmlhttp.open("GET","/suggestDest?"+query,true);
		xmlhttp.send();

}