/**
 * 
 * @author rajat
 * frontend interact with backend using ajax call
 */

var cityBatch=0;
var groupBatch=0;
var flag=0;//To be done once when submit is clicked

function onSubmit(){
	cityBatch=0;groupBatch=0;
	document.getElementById("suggestedDest").innerHTML="";
	$(window).data('ajaxready', false);//to avoid scroll call
	suggestDest();
	suggestGroups();
	if(flag==0)
	{
		createScript('selectedDestinations');
		createScript('scroll');
	}
	flag=1;
}

function createQueryString(callback){
	var origin = document.getElementById("origin").value;
	var originLocation = "http://maps.googleapis.com/maps/api/geocode/json?address="+origin+"&sensor=true";
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	var numDays= (new Date(endDate)-new Date(startDate))/(1000*60*60*24); 
	var budget = document.getElementById("range").value;
	var tastes = document.getElementsByName('category');
	var userTastes=[];var j=0;
	$.getJSON(originLocation, function(data){
		var orgLat = data.results[0].geometry.location.lat;
		var orgLong =data.results[0].geometry.location.lng;
		for (var i=0, n=tastes.length;i<n;i++) {
		  if (tastes[i].checked) 
		  {
			 userTastes[j] = tastes[i].value;
			 j++;
		  }
		}
		var query="orgLat="+orgLat+"&"+"orgLong="+orgLong+"&"+"numDays="+numDays+"&"+"taste="+userTastes+"&"+"budget="+budget;
		callback(query);
	});
}

/*function suggestDest(){

	createQueryString(function(query){
		var xmlhttp;
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
				  makediv(xmlhttp.responseText,appendResults);
				  afterScroll(function(){});
				  $(window).data('ajaxready', true);
		    }
		  }
			xmlhttp.open("GET","/suggestDest?"+query,true);
			xmlhttp.send();
	});
}*/

function suggestDest(){
	
	createQueryString(function(query){
		
		query=query+"&next="+cityBatch;
		cityBatch+=5;
		var i=0;
		var tableContent ='';
		$.getJSON( '/suggestDest?'+query, function(data ) {
	        // For each item in our JSON, add a table row and cells to the content string
	        $.each(data, function(){
	        	tableContent ='';
	        	tableContent += '<tr>';
	            tableContent += '<td>' + data.CityList[i].CityName + '</td>';
	            tableContent += '</tr>';
	            console.log("i "+i);
	            makediv(tableContent,appendResults);
	            i++;
	        });
	       
		});
	});
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

function suggestGroups(){

	createQueryString(function(query){
		var xmlhttp;
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
				  makediv(xmlhttp.responseText,appendResults);
				  $(window).data('ajaxready', true);
		    }
		  }
			xmlhttp.open("GET","/suggestGroups?"+query,true);
			xmlhttp.send();
		});
}