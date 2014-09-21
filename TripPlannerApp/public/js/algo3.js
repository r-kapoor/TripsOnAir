/**
 * @author rahul and rajat
 * TODO:Test scrolling,if all cities of group than green,update on group cities
 *
 */

	var selectedCityId=[];
	var countofselections = 0;
	var orgLat;//Lat of the origin
	var orgLong;//Long of the origin
	var range;//Range that can be travelled by user
	var LoadedCityLen=0;//represents the length of the old loaded suggested cities as per the user scrolling
	var LoadedGroupLen=0;
	var cityData=function(cityId,lat,long){
		
		this.cityId=cityId;
		this.lat=lat;
		this.long=long;
	}
	
	$("#suggestedDest").on("click",".destination",function () {

		
		orgLat=$("#TextBoxDiv").data("orgLat");
		orgLong=$("#TextBoxDiv").data("orgLong");
		range=$("#TextBoxDiv").data("range");
		
		var cityId = $(this).attr('id');
		var cityName=$(this).text();
		console.log(cityName);
		console.log(countofselections);
		document.getElementById(cityId).className="destination-selected";
		document.getElementById(cityId).style.cursor="initial";
		document.getElementById(cityId).style.color="green";
		if(countofselections==0)
		{
			var div = document.createElement('div');
			div.innerHTML='YOUR SELECTED DESTINATIONS:';
			div.id="selected-top";
			document.getElementById("selectedDest").appendChild(div);
		}
		
		if(countofselections>=10){
            alert("Only 10 destinations are allowed");
            return false;
		}
		else{

			if(document.getElementById("selects-"+cityId)==null)
			{
				var tableDes= document.createElement('tr');
				tableDes.id="selects-"+cityId;
				document.getElementById("selectedDest").appendChild(tableDes);
				var cityselected = document.createElement('td');
				cityselected.innerHTML=cityName;
				cityselected.id="selected-"+cityId;
				cityselected.className='clect';//change
				document.getElementById(tableDes.id).appendChild(cityselected);
				var canceldiv = document.createElement('td');
				canceldiv.innerHTML='Cancel';
				canceldiv.id='Cancel-'+cityId;
				canceldiv.className='cancel';
				canceldiv.style.cursor="pointer";
				document.getElementById(tableDes.id).appendChild(canceldiv);
				
				/**Track appended city through selectedCityID array */
				
				var lat=$("#"+cityId).data("lat");
				var long=$("#"+cityId).data("long");
				//console.log("cityData "+cityId+","+lat+","+long);
				var city_data = new cityData(cityId, lat, long);
				selectedCityId.push(city_data);
				countofselections++;
				
				//if all the cities of the group get selected then select the group
				selectGroupIfAllCitiesSelected();
				
				//
				update(1);

				/*for(var j=0;j<selectedCityId.length;j++)
				{
					console.log("cityID "+selectedCityId[j].cityId+","+selectedCityId[j].lat);
				}*/
				
			}
		}
	});

	$("#suggestedDest").on("click",".group",function () {

		var groupId=$(this).attr('id');
		document.getElementById(groupId).className="group-selected";
		document.getElementById(groupId).style.cursor="initial";
		document.getElementById(groupId).style.color="green";
		
		var numCity=$("#"+groupId).data("count");
		
		for(var i=0;i<numCity;i++)
		{
			var cityId=$("#"+groupId).data("cityId"+i);
			if(selectedCityId.indexOf(cityId)!=-1)
			{
				var cityName=$("#"+groupId).data("cityName"+i);
				//append the city in the html				

				var singlecity=document.getElementById(cityId);
				if(singlecity!=null)
				{
					singlecity.className="destination-selected";
					singlecity.style.cursor="initial";
					singlecity.style.color="green";
				}
				
				if(document.getElementById("selects-"+cityId)==null)
				{
					var tableDes= document.createElement('tr');
					tableDes.id="selects-"+cityId;
					document.getElementById("selectedDest").appendChild(tableDes);
					var cityselected = document.createElement('td');
					cityselected.innerHTML=cityName;
					cityselected.id="selected-"+cityId;
					cityselected.className='clect';//change
					document.getElementById(tableDes.id).appendChild(cityselected);
					var canceldiv = document.createElement('td');
					canceldiv.innerHTML='Cancel';
					canceldiv.id='Cancel:'+groupId+':'+cityId;
					canceldiv.className='cancelGroup';
					canceldiv.style.cursor="pointer";
					document.getElementById(tableDes.id).appendChild(canceldiv);
					countofselections++;
				}

				//Add the cityId in the selectedCityId array
				selectedCityId.push(cityId);
			}
		}

		//if all the cities of the group get selected then select the group
		selectGroupIfAllCitiesSelected();
		
		//update(mark);
	});

	$("#selectedDest").on("click",".cancel",function () {
		var cityId = cityIn($(this).attr('id'));

		document.getElementById("selects-"+cityId).remove();
		document.getElementById(cityId).className="destination";
		document.getElementById(cityId).style.cursor="pointer";
		document.getElementById(cityId).style.color="black";
		
		
		//if the cancel city is in the selected group then make the group unselected
		var groupList=$(document.getElementsByClassName('group'));
		var i=0,j;
		while(i<groupList.length)
		{
			jq.context = jq[0] = groupList[i];
			var groupId=jq.attr('id');
			if(jq.attr('class')=="group-selected")
			{
				var numCity=$("#"+groupId).data("count");j=0;
				while(j<numCity)
				{
					if(cityId==$("#"+groupId).data("cityId"+j))
					{
						document.getElementById(groupId).className="group";
						document.getElementById(groupId).style.cursor="pointer";
						document.getElementById(groupId).style.color="black";
						break;
					}
					j++;
				}
				
			}
			i++;
		}

		countofselections--;
		if(countofselections==0)
		{
			document.getElementById("selected-top").remove();
		}
		removeByAttr(selectedCityId,"cityId",cityId);
		
		update(1);
		
		/*for(var i=0;i<selectedCityId.length;i++)
		{
			console.log("after "+selectedCityId[i].cityId+","+selectedCityId[i].lat);
		}*/
		
		
     });
	
	var removeByAttr = function(arr, attr, value){
	    var i = arr.length;
	    while(i--){
	       if(arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value )){
	           arr.splice(i,1);//The second parameter of splice is the number of elements to remove
	       }
	    }
	    return arr;
	}
	
	function calcDist(orgLat,orgLong,destLat,destLong)
	{
		return (parseInt( 6371 * Math.acos( Math.cos( toRad(orgLat) ) * Math.cos( toRad( destLat ) ) * Math.cos( toRad( destLong ) - toRad(orgLong) ) + Math.sin( toRad(orgLat) ) * Math.sin( toRad( destLat ) ) ) ));
	}

	function update(startLenForCity,startLenForGroup)
	{
		var i=parseInt(startLenForCity);var jq = $([1]);
		var j=parseInt(startLenForGroup);
		var cityList= $(document.getElementsByClassName('destination'));
		var groupList=$(document.getElementsByClassName('group'));
		LoadedCityLen=cityList.length;
		LoadedGroupLen=groupList.length;
		var endLenForCity=cityList.length;
		var endLenForGroup=groupList.length;
		
		var startLat=orgLat;var startLong=orgLong;var endLat,endLong,distCovered=0;
		//find the distance from origin to last selected city
		for(var i=0;i<selectedCityId.length;i++){
			
			endLat=selectedCityId[i].lat;
			endLong=selectedCityId[i].long;
			//console.log(startLat+","+startLong+","+endLat+","+endLong);
			dist=parseInt(calcDist(startLat,startLong,endLat,endLong));
			console.log("dist "+dist);
			distCovered=distCovered+parseInt(dist);
			startLat=endLat;startLong=endLong;	
		}

		while (i < parseInt(endLenForCity)) {
			jq.context = jq[0] = cityList[i];
			var cityId=jq.attr("id");
			var checkingDestLat=$("#"+cityId).data("lat");
			var checkingDestLong=$("#"+cityId).data("long");
			
			checkAndMark(range,distCovered,endLat,endLong,checkingDestLat,checkingDestLong,function(Mark)
			{
				jq.css('color','');
				if(Mark==true)
				{
					//make a red mark
					jq.css('color','red');
				}
				else
				{
					console.log("false");
				}
			});
			i++;
		}
		
		/** TODO: checkAndMark for groups*/
		
		/*while(j< parseInt(endLenForGroup))
		{
			
			jq.context = jq[0] = groupList[i];
			var groupId=jq.attr("id");
			var numCity=$("#"+groupId).data("count");
			var k=0;
			while(k<numCity)
			{
				var cityId=$("#"+groupId).data("cityId"+k); 
				if(selectedCityId.indexOf(cityId)==-1)
				{
					var lat=$("#"+groupId).data("lat"+k);
					var long=$("#"+groupId).data("long"+k);
					
				}
			}
			
		}*/
		
	};

	function checkAndMark(range,distCovered,endLat,endLong,checkingDestLat,checkingDestLong,callback)
	{
		//var dist=0;var totalDistCovered=0;
		distCovered=distCovered+parseInt(calcDist(endLat,endLong,checkingDestLat,checkingDestLong))+parseInt(calcDist(checkingDestLat,checkingDestLong,orgLat,orgLong));
		(distCovered>range)?callback(true):callback(false);		
	}
	
	function toRad(Value) {
	    /** Converts numeric degrees to radians */
	    return Value * Math.PI / 180;
	}

	function afterScroll() {
		
		console.log("after scroll");
		/**TODO: afterscroll for groups*/
		cityList= $(document.getElementsByClassName('destination'));
		var startLen=LoadedCityLen;
		var endLen=cityList.length;
		LoadedCityLen=endLen;
		console.log("len Testing "+startLen+","+endLen);
		if((countofselections>0)&&(endLen>startLen)){
			console.log("yes u can call");
			/*mark(range,lat,long,startLen,endLen,function(){
				//callback();
			});*/
			update(startLen);
		}
	}
	
	
	function selectGroupIfAllCitiesSelected()
	{
		var groupList=$(document.getElementsByClassName('group'));		
		var i=0,j;
		while(i<groupList.length)
		{
			jq.context = jq[0] = groupList[i];
			var groupId=jq.attr('id');
			if(jq.attr('class')=="group")
			{
				var numCity=$("#"+groupId).data("count");
				j=0;
				while(j<numCity)
				{
					var cityId=$("#"+groupId).data("cityId"+j);
					if(selectedCityId.indexOf(cityId)==-1)
					{
							break;
					}
					j++;
				}
				if(j==numCity)
				{
					document.getElementById(groupId).className="group-selected";
					document.getElementById(groupId).style.cursor="initial";
					document.getElementById(groupId).style.color="green";
				}				
			}
			i++;
		}
	}
	
	