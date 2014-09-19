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
	//if(addScripts==0)
	//{
		//createScript('algo3');
		createScript('scroll');
	//}
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
	        
	      //store lat,long of origin city using suggestedDest id
	        $("#TextBoxDiv").data("orgLat",data.orgLat);
	        $("#TextBoxDiv").data("orgLong",data.orgLong);
	        $("#TextBoxDiv").data("range",data.range);
	        
	        
	        $.each(data.CityList, function(key,value) {
	        	var cityId=value.CityID;
	        	console.log("cityId "+cityId+","+value.Latitude+","+value.Longitude);
	        	$("#"+cityId).data("lat",value.Latitude);
	        	$("#"+cityId).data("long",value.Longitude);
	        });
	        
	        //console.log("can we call?");
	        //afterScroll();
	 
	        $.each(data.CityList, function(key,value) {
	        	var cityId=value.CityID;
	        	//console.log("testLat"+i+" "+$("#"+cityId).data("lat"));
	        	//console.log("testLong"+i+" "+$("#"+cityId).data("long"));	
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
			makediv(list,appendResults);
			var numOfCitiesCopy = numOfCities.slice(0);
	        $.each(data.GroupList, function(key,value) {
	        	var groupId=value.GroupID;
				citynum = numOfCities[groupIDs.indexOf(groupId)]-numOfCitiesCopy[groupIDs.indexOf(groupId)];
				numOfCitiesCopy[groupIDs.indexOf(groupId)]--;
				if(citynum == 0)
				{
					$("#"+groupId).data("numofcities",numOfCities[groupIDs.indexOf(groupId)]);
				}
	        	console.log("groupId "+groupId+","+value.CityName+","+value.CityID, ","+value.Latitude+","+value.Longitude);
	        	$("#"+groupId).data("lat"+citynum,value.Latitude);
	        	$("#"+groupId).data("long"+citynum,value.Longitude);
				$("#"+groupId).data("cityname"+citynum,value.CityName);
				$("#"+groupId).data("cityid"+citynum,value.CityName);
	        });
		});
	});
}