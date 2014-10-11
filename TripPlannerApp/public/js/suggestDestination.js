/**
 * 
 * @author rajat
 * frontend interact with backend using ajax call
 */

var cityBatch=0;
var groupBatch=0;
var cityNearbyBatch=0;
var addScripts=0;//To be done once when submit is clicked
var userTastes=[];//To reuse the tastes both queries

function createQueryStringForNextDestinations(callback){
	var selectedIDs = [], selectedLats = [], selectedLongs = [];
	var startDate = document.getElementById("startdate").value;
	var endDate = document.getElementById("enddate").value;
	/*var j=0;
		for (var i=0, n=tastes.length;i<n;i++) {
	  if (tastes[i].checked) 
	  {
		 userTastes[j] = tastes[i].value;
		 j++;
	  }
	}*/
	for( var i = 0; i < selectedCityData.length; i++)
	{
		selectedIDs[i] = selectedCityData[i].cityId;
		selectedLats[i] = selectedCityData[i].lat;
		selectedLongs[i] = selectedCityData[i].long;
	}
	var query="selectedIDs="+selectedIDs+"&"+"selectedLats="+selectedLats+"&"+"selectedLongs="+selectedLongs+"&"+"orgLat="+orgLat+"&"+"orgLong="+orgLong+"&"+"taste="+userTastes+"&"+"distRemaining="+distRemaining;
	callback(query);
}

function suggestDestinationsAccordingToSelections(calledFrom)
{
	console.log('function suggestDestinationsAccordingToSelections called');
	if(calledFrom==0)//Called Because of City/Group Selection
	{
		if(document.getElementById("nearbycities-top"))
		{
			document.getElementById("nearbycities-top").remove();
		}
		if(document.getElementById('nearbycities'))
		{
			document.getElementById("nearbycities").remove();
		}
		if(document.getElementById('more-cities'))
		{
			document.getElementById("more-cities").remove();
		}
		if(document.getElementById('loading-text'))
		{
			document.getElementById("loading-text").remove();
		}
		if(document.getElementById('no-more-cities'))
		{
			document.getElementById("no-more-cities").remove();
		}
	}
	else if(calledFrom==1)
	{
		if(document.getElementById('more-cities'))
		{
			document.getElementById("more-cities").remove();
		}
		var loadingText = '<h4><div style="color:grey">LOADING..</div></h4>';
		makediv(loadingText,appendTo,"loading-text","suggestedNearbyDest");
	}
	
	createQueryStringForNextDestinations(function(query){
		if(calledFrom==0)//Called Because of City/Group Selection
		{
			cityNearbyBatch=0;
		}
		query=query+"&next="+cityNearbyBatch;
		cityNearbyBatch+=5;
		var i=0;
		var list ='';
		var ajaxQuery = $.getJSON( '/suggestNearbyDest?'+query);

		ajaxQuery.done(function(data) {
			if(document.getElementById('loading-text'))
			{
				document.getElementById("loading-text").remove();
			}
			
			if(cityNearbyBatch==5)
			{	
				var div = document.createElement('div');
				div.innerHTML='BASED ON YOUR SELECTIONS YOU MAY WANT TO ADD THESE CITIES TO YOUR TRIP:';
				div.id="nearbycities-top";
				div.style.color="blue";
				document.getElementById("suggestedNearbyDest").appendChild(div);
			}
			$.each(data.NearbyCityList, function(key,value){
				if(!searchByAttr(selectedCityData,"cityId",value.CityID))
				{
					list+='<h4><div class="destination" id="nearby-'+ value.CityID+'" style="cursor:pointer; color:blue">'+value.CityName+'</div></h4>';
					if(calledFrom==1)
					{
						makediv(list,appendTo,"nearbycities-sub","nearbycities");
						list='';
					}
					i++;
				}
			});
			if(calledFrom==0)
			{
				makediv(list,appendTo,"nearbycities","suggestedNearbyDest");
			}
			if(jQuery.isEmptyObject(data.NearbyCityList))
			{
				var loadingText = '<h4><div style="color:grey">No More Results to show :(</div></h4>';
				makediv(loadingText,appendTo,"no-more-cities","suggestedNearbyDest");
			}
			else
			{
				var moreButton = '<button id="MoreNearbyCities" type="button" onclick="suggestDestinationsAccordingToSelections(1)">More..</button>';
				makediv(moreButton,appendTo,"more-cities","suggestedNearbyDest");	
			}
			i=0;	        
	        
	        $.each(data.NearbyCityList, function(key,value) {
	        	var cityId=value.CityID;
	        	//console.log("cityId "+cityId+","+value.Latitude+","+value.Longitude)
	        	console.log("LAT:"+value.Latitude);
	        	console.log("cityid::"+cityId);
	        	$("#"+cityId).data("lat",value.Latitude);
	        	$("#"+cityId).data("long",value.Longitude);
	        	console.log("retrie:"+$("#"+cityId).data("lat"));
	        });
	        
	        //console.log("can we call?");

		});
	});
	
}
function onSubmitChoose(){
	cityBatch=0;groupBatch=0;
	document.getElementById("suggestedDest").innerHTML="";
	$(window).data('ajaxready', false);//to avoid scroll call
	if(addScripts==0)
	{
		createScript('algo3');
		
	}
	//TODO:check the soln for scroll.js problem
	createScript('scroll');
	suggestDest();
	suggestGroups();
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
	userTastes=[];var j=0;
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
			makediv(list,appendTo,"suggested-destination-set","suggestedDest");
			$(window).data('ajaxready', true);
	        i=0;
	        
	      //store lat,long of origin city using suggestedDest id
	        $("#TextBoxDiv").data("orgLat",data.orgLat);
	        $("#TextBoxDiv").data("orgLong",data.orgLong);
	        $("#TextBoxDiv").data("range",data.range);
	        
	        
	        $.each(data.CityList, function(key,value) {
	        	var cityId=value.CityID;
	        	//console.log("cityId "+cityId+","+value.Latitude+","+value.Longitude);
	        	$("#"+cityId).data("lat",value.Latitude);
	        	$("#"+cityId).data("long",value.Longitude);
	        });
	        
	        //console.log("can we call?");
	        afterScroll();
	 
	        $.each(data.CityList, function(key,value) {
	        	var cityId=value.CityID;
	        	//console.log("testLat"+i+" "+$("#"+cityId).data("lat"));
	        	//console.log("testLong"+i+" "+$("#"+cityId).data("long"));	
	        	i++;
	        });
		});
	});
}

function makediv(response,callback,idString,parentId)
{
	var div = document.createElement('div');
	div.innerHTML=response;
	if(idString)
	{
		div.id=idString;
	}
	callback(div,parentId);
}

function createScript(attribute)
{
	var Element = document.createElement('script');
	Element.setAttribute('src','js/'+attribute+'.js');
  	document.head.appendChild(Element);
}

function appendTo(responseDiv,parentId)
{
	document.getElementById(parentId).appendChild(responseDiv);
}

function suggestGroups(){

	createQueryString(function(query){
		
		query=query+"&next="+groupBatch;
		groupBatch+=5;
		var groupIDs = [];
		var numOfCities = [];
		var list ='<ul>';
		var ajaxQuery = $.getJSON( '/suggestGroups?'+query);

		ajaxQuery.done(function(data) {
			$.each(data.GroupList, function(key,value){
				if(groupIDs.indexOf(value.GroupID) == -1)
				{
					list+='<li>';
					if(!value.PopularName)
					{
						list+='<h3><div class="group" id="'+ value.GroupID+'" style="cursor:pointer" >'+value.GroupName+'</div></h3>';
					}
					else
					{
						list+='<h3><div class="group" id="'+ value.GroupID+'" style="cursor:pointer" >'+value.PopularName +":"+value.GroupName+'</div></h3>';
					}
					list+='</li>';
					groupIDs.push(value.GroupID);
					numOfCities.push(1);
				}
				else
				{
					numOfCities[groupIDs.indexOf(value.GroupID)]++;
				}
				
			});
			list+='</ul>';
			makediv(list,appendTo,"suggested-destination-set","suggestedDest");
			$(window).data('ajaxready', true);
			var numOfCitiesCopy = numOfCities.slice(0);
	        $.each(data.GroupList, function(key,value) {
	        	var groupId=value.GroupID;
				citynum = numOfCities[groupIDs.indexOf(groupId)]-numOfCitiesCopy[groupIDs.indexOf(groupId)];
				numOfCitiesCopy[groupIDs.indexOf(groupId)]--;
				if(citynum == 0)
				{
					$("#"+groupId).data("numofcities",numOfCities[groupIDs.indexOf(groupId)]);
				}
	        	//console.log("groupId "+groupId+","+value.CityName+","+value.CityID, ","+value.Latitude+","+value.Longitude);
	        	$("#"+groupId).data("lat"+citynum,value.Latitude);
	        	$("#"+groupId).data("long"+citynum,value.Longitude);
				$("#"+groupId).data("cityName"+citynum,value.CityName);
				$("#"+groupId).data("cityId"+citynum,value.CityID);
	        });
		});
	});
}