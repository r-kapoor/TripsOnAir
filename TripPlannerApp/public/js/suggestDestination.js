/**
 * 
 * @author rajat
 * frontend interact with backend using ajax call
 */

var cityBatch=0;
var groupBatch=0;
var addScripts=0;//To be done once when submit is clicked

function onSubmit(){
	cityBatch=0;groupBatch=0;
	document.getElementById("suggestedDest").innerHTML="";
	$(window).data('ajaxready', false);//to avoid scroll call
	suggestDest();
	suggestGroups();
	if(addScripts==0)
	{
		createScript('selectedDestinations');
		createScript('scroll');
	}
	addScripts=1;
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

function suggestDest(){

	createQueryString(function(query){
		query=query+"&next="+cityBatch;
		cityBatch+=5;
		var i=0;
		var list ='<ul>';
		var ajaxQuery = $.getJSON( '/suggestDest?'+query);

		ajaxQuery.done(function(data) {
			$.each(data.CityList, function(key,value){
				list+='<li>';
	        	list+='<h3><div class="destination" id="'+ value.CityID+'" style="cursor:pointer" >'+value.CityName+'</div></h3>';
                list+='</li>'
				i++;
			});
			list+='</ul>';
			makediv(list,appendResults);
	        i=0;
	        $.each(data.CityList, function(key,value) {
	        	var cityId=value.CityID;
	        	console.log("cityId "+cityId+","+value.Latitude+","+value.Longitude);
	        	$("#"+cityId).data("lat",value.Latitude);
	        	$("#"+cityId).data("long",value.Longitude);
	        });
	        $.each(data.CityList, function(key,value) {
	        	var cityId=value.CityID;
	        	console.log("testLat"+i+" "+$("#"+cityId).data("lat"));
	        	console.log("testLong"+i+" "+$("#"+cityId).data("long"));	
	        	i++;
	        });
		});
	});
}

/*function suggestGroups(){
	createQueryString(function(query){
		query=query+"&next="+groupBatch;
		groupBatch+=5;
		var i=0;
		var list ='<ul>';
		$.getJSON( '/suggestGroups?'+query, function(data ) {
	        $.each(data, function(){
	        	//if(data.CityList[i]!="undefined"){
	        		console.log(data);
	        	list+='<li>';
	        	list+='<h3><div class="destination" id="'+data.CityList[i].CityName+'" lat="'+data.CityList[i].Latitude+'" long="'+data.CityList[i].Longitude+'" fact="0" style="cursor:pointer" >'+data.CityList[i].CityName+'</div></h3>';
                list+='</li>';
	            console.log("i "+i);
	            //afterScroll(function(){});
				//$(window).data('ajaxready', true);
	            i++;
	        	//}
	        });
	        makediv(list,appendResults);
	        i=0;
	        $.each(data, function(){
	        	var cityName=data.CityList[i].CityName;
	        	$("#"+cityName).data("lat",data.CityList[i].Latitude);
	        	$("#"+cityName).data("long",data.CityList[i].Longitude);
	        	console.log("long"+i+" "+data.CityList[i].Longitude);
	        	console.log("testLat"+i+" "+$("#"+data.CityList[i].CityName).data("long"));
	        	i++;
	        });
		});
		list+='</ul>';
	});
}*/

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