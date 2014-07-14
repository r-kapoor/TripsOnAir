/**
 * 
 * @author rajat
 * frontend interact with backend using ajax call
 */

var cityBatch=0;
var groupBatch=0;
var flag=0;//Either changes do by done by suggestDest() or suggestGroups()

function onSubmit(){
	cityBatch=0;groupBatch=0;
	document.getElementById("suggestedDest").innerHTML="";
	$(window).data('ajaxready', false);//to avoid scroll call
	suggestDest();
	suggestGroups();
}

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
	var xmlhttp;
	var query = createQueryString();
	var Sender = window.event.srcElement;
	query=query+"&next="+cityBatch;
	cityBatch+=5;

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
		if(xmlhttp.readyState==4 && xmlhttp.status==200)
	    	{
			  if((Sender.id=="dest")&&(flag==0)){
				  createScript('scroll');
				  createScript('selectedDestinations');
				  flag=1;  	
			  }
			  makediv(xmlhttp.responseText,appendResults);
			  $(window).data('ajaxready', true);
	    }
	  }
		xmlhttp.open("GET","/suggestDest?"+query,true);
		xmlhttp.send();
}

function makediv(response,callback)
{
	var div = document.createElement('div');
	div.innerHTML=response;
	callback(div);
}

function createScript(attribute)
{
	var Element = document.createElement('script');
	Element.setAttribute('src','js/'+attribute+'.js');
  	document.head.appendChild(Element);
	
}
function appendResults(responseDiv)
{
	document.getElementById("suggestedDest").appendChild(responseDiv);
}

function suggestGroups()
{
	var xmlhttp;
	var query = createQueryString();
	var Sender = window.event.srcElement;
	query=query+"&next="+groupBatch;
	groupBatch+=5;

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
	  if(xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
		  if((Sender.id=="dest")&&(flag==0)){
			    createScript('scroll');
			    createScript('selectedDestinations');
			  	flag=1;
			  }
			  makediv(xmlhttp.responseText,appendResults);
			  $(window).data('ajaxready', true);
	    }
	  }
		xmlhttp.open("GET","/suggestGroups?"+query,true);
		xmlhttp.send();
}