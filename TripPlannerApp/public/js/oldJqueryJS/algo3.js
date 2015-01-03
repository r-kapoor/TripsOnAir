/**
 * @author rahul and rajat
 * TODO: change the class through jq in afterscroll function
 *	Test Cases:
 *			1)If a city is selected then
 *				a)its color in list should be green;
 *				b)check if the all of the cities of groups selected or not(through selectGroupIfAllCitiesSelected() function),if yes then group color in the list should be green
 *				c)Make the cities/groups red which can't be covered now(through update() function)
 *			2)If a group is selected then
 *				a)cities/group color-green;only non-selected cities of that group should be appended into the selected list
 *				b)Make the cities/groups red which can't be covered now(through update() function)
 *				c)check if the all of the cities of groups selected or not(through selectGroupIfAllCitiesSelected() function)
 *			3)After scroll:
 *				a)update(),selectGroupIfAllCitiesSelected(),select cities which are already selected from group
 *			4)Remove:
 *				a)update();Make the removed cities black and accordingly groups too
 */

	var selectedCityData=[];
	var orgLat;//Lat of the origin
	var orgLong;//Long of the origin
	var range;//Range that can be travelled by user
	var LoadedCityLen=0;//represents the length of the old loaded suggested cities as per the user scrolling
	var LoadedGroupLen=0;
	var distRemaining=0;

	var cityData=function(cityId,lat,long){

		this.cityId=cityId;
		this.lat=lat;
		this.long=long;
	}

	function onFirstSelection()
	{
		var div = document.createElement('div');
		div.innerHTML='YOUR SELECTED DESTINATIONS:';
		div.id="selected-top";
		document.getElementById("selectedDest").appendChild(div);

		//Append the submit button
		var submitBtn = document.createElement("BUTTON");
		var buttonText = document.createTextNode("Submit");
		submitBtn.appendChild(buttonText);
		submitBtn.setAttribute("id","nextPageSubmitOnChoose");
		submitBtn.setAttribute("onClick","dtoOnChoose()");
		var input2Form=document.getElementById("selectedDest");
		input2Form.appendChild(submitBtn);
	}

	$("#suggestedDest,#suggestedNearbyDest").on("click",".destination",function () {

		orgLat=$("#TextBoxDiv").data("orgLat");
		orgLong=$("#TextBoxDiv").data("orgLong");
		range=$("#TextBoxDiv").data("range");
		var cityId = $(this).attr('id');
		if(cityId.indexOf("nearby-")!=-1)
		{
			cityId=cityId.substring(7);
		}
		var cityName=$(this).text();

		if(document.getElementById(cityId))
		{
			document.getElementById(cityId).className="destination-selected";
			document.getElementById(cityId).style.cursor="initial";
			document.getElementById(cityId).style.color="green";
		}
		if(selectedCityData.length==0)
		{
			onFirstSelection();
		}

		if(selectedCityData.length>=10){
            alert("Only 10 destinations are allowed");
            return false;
		}
		else{

			if(document.getElementById("selects-"+cityId)==null)
			{
				var tableDes= document.createElement('tr');
				tableDes.id="selects-"+cityId;
				//document.getElementById("selectedDest").appendChild(tableDes);
				var submitBtn=document.getElementById("nextPageSubmit");
				document.getElementById("selectedDest").insertBefore(tableDes,submitBtn);

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

				/**Push the selected city data into the selectedCityData array */
				console.log("cityid:"+cityId);
				console.log("lat ::"+$("#"+cityId).data("lat"));
				var lat=$("#"+cityId).data("lat");
				var long=$("#"+cityId).data("long");
				var city_data = new cityData(cityId, lat, long);
				selectedCityData.push(city_data);

				//if all the cities of the group get selected then select the group
				selectGroupIfAllCitiesSelected();

				//Make the cities/groups red which can't be covered now
				update(1,0);
			}
		}
		suggestDestinationsAccordingToSelections(0);
	});

	$("#suggestedDest").on("click",".group",function () {

		//Initialize origin lat/long and range that can be covered by the user
		orgLat=$("#TextBoxDiv").data("orgLat");
		orgLong=$("#TextBoxDiv").data("orgLong");
		range=$("#TextBoxDiv").data("range");

		var groupId=$(this).attr('id');
		document.getElementById(groupId).className="group-selected";
		document.getElementById(groupId).style.cursor="initial";
		document.getElementById(groupId).style.color="green";
		var numCity=$("#"+groupId).data("numofcities");

		if(selectedCityData.length==0)
		{
			onFirstSelection();
		}

		for(var i=0;i<numCity;i++)
		{
			var cityId=$("#"+groupId).data("cityId"+i);
			if(!searchByAttr(selectedCityData,"cityId",cityId))
			{
				var cityName=$("#"+groupId).data("cityName"+i);
				var singlecity=document.getElementById(cityId);

				if(singlecity!=null)
				{
					singlecity.className="destination-selected";
					singlecity.style.cursor="initial";
					singlecity.style.color="green";
				}

					var tableDes= document.createElement('tr');
					tableDes.id="selects-"+cityId;
					//document.getElementById("selectedDest").appendChild(tableDes);
					var submitBtn=document.getElementById("nextPageSubmit");
					document.getElementById("selectedDest").insertBefore(tableDes,submitBtn);
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


				//Add the cityId in the selectedCityData array
				var lat=$("#"+groupId).data("lat"+i);
				var long=$("#"+groupId).data("long"+i);
				var city_data = new cityData(cityId, lat, long);
				selectedCityData.push(city_data);
			}
		}

		//if all the cities of the group get selected then select the group
		selectGroupIfAllCitiesSelected();
		//Make the cities/groups red which can't be covered now
		update(1,0);

		suggestDestinationsAccordingToSelections(0);

	});

	$("#selectedDest").on("click",".cancel",function () {
		var cityId = cityIn($(this).attr('id'));
		document.getElementById("selects-"+cityId).remove();
		var cityElement=document.getElementById(cityId);
		if(cityElement!=null){
			cityElement.className="destination";
			cityElement.style.cursor="pointer";
			cityElement.style.color="black";
		}

		//if the cancel city is in the selected group then make the group unselected
		var groupList=$(document.getElementsByClassName('group-selected'));
		var i=0,j;
		while(i<groupList.length)
		{
			var jq = $([1]);
			jq.context = jq[0] = groupList[i];
			var groupId=jq.attr('id');
			var numCity=$("#"+groupId).data("numofcities");
			j=0;
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
			i++;
		}

		//remove the city from selectedCityData array
		removeByAttr(selectedCityData,"cityId",cityId);
		if(selectedCityData.length==0)
		{
			document.getElementById("selected-top").remove();
			document.getElementById("nextPageSubmit").remove();
		}
		update(1,0);

		//suggestDestinationsAccordingToSelections();
     });


	function update(startLenForCity,startLenForGroup)
	{
		var i=parseInt(startLenForCity);var jq = $([1]);
		var j=parseInt(startLenForGroup);
		var cityList= $(document.getElementsByClassName('destination'));
		var groupList=$(document.getElementsByClassName('group'));
		LoadedCityLen=cityList.length;
		LoadedGroupLen=groupList.length;

		var startLat=orgLat;var startLong=orgLong;var endLat,endLong,distCovered=0;
		//find the distance from origin to last selected city
		for(var k=0;k<selectedCityData.length;k++){

			endLat=selectedCityData[k].lat;
			endLong=selectedCityData[k].long;
			//console.log("start and end lat/long:"+startLat+","+startLong+","+endLat+","+endLong);
			totalDistance=parseInt(calcDist(startLat,startLong,endLat,endLong));
			//console.log("totalDistance for city"+(k-1)+","+k+":"+totalDistance);
			distCovered=distCovered+parseInt(totalDistance);
			startLat=endLat;startLong=endLong;
		}

		distRemaining=range-distCovered;

		//console.log("From origin to last selected city "+distCovered);
		//console.log("Lat selected Lat/long:"+endLat+","+endLong);

		while (i < parseInt(LoadedCityLen)) {
			var jq = $([1]);
			jq.context = jq[0] = cityList[i];
			var cityId=jq.attr("id");
			var checkingDestLat=$("#"+cityId).data("lat");
			var checkingDestLong=$("#"+cityId).data("long");
			jq.css('color','');

			if(checkAndMark(range,distCovered,endLat,endLong,checkingDestLat,checkingDestLong))
			{
				jq.css('color','red');
			}
			i++;
		}

		/** CheckAndMark for groups*/
		while(j< parseInt(LoadedGroupLen))
		{
			var distCoveredFromGroupCity=distCovered;
			var jq = $([1]);
			jq.context = jq[0] = groupList[j];
			var groupId=jq.attr("id");
			//console.log("groupId "+groupId);
			var numCity=$("#"+groupId).data("numofcities");
			//console.log("numCity "+numCity);
			var k=0;
			jq.css('color','');//intialized to black only
			var lastSelectedLat=endLat;//lat of the last selected city
			var lastSelectedLong=endLong;

			while(k<numCity)
			{
				var cityId=$("#"+groupId).data("cityId"+k);
				var cityName=$("#"+groupId).data("cityName"+k);

				if(!searchByAttr(selectedCityData,"cityId",cityId))
				{	//console.log("cityNotFound:"+cityName);
					var groupCityLat=$("#"+groupId).data("lat"+k);
					var groupCityLong=$("#"+groupId).data("long"+k);

					if(k!=(numCity-1))//if not the last city of the group
					{
						//console.log("Already covered:"+distCoveredFromGroupCity);
						distCoveredFromGroupCity=distCoveredFromGroupCity+parseInt(calcDist(lastSelectedLat,lastSelectedLong,groupCityLat,groupCityLong));
						lastSelectedLat=groupCityLat;
						lastSelectedLong=groupCityLong;
						//console.log("Covered after new groupCity:"+distCoveredFromGroupCity);
						//console.log("range:"+range);
						if(distCoveredFromGroupCity>range)
						{
							jq.css('color','red');
							break;
						}
					}
					else//last group city to origin totalDistance has to be added to check whole group coverage
					{
						if(checkAndMark(range,distCoveredFromGroupCity,lastSelectedLat,lastSelectedLong,groupCityLat,groupCityLong))
							{
								jq.css('color','red');
							}
					}
				}
				k++;
			}
			j++;
		}
	};

	function checkAndMark(range,distCovered,endLat,endLong,checkingDestLat,checkingDestLong)
	{
			distCovered=parseInt(distCovered)+parseInt(calcDist(endLat,endLong,checkingDestLat,checkingDestLong))+parseInt(calcDist(checkingDestLat,checkingDestLong,orgLat,orgLong));
			//console.log("Total distCovered from to and fro:"+distCovered);
			//console.log("range:"+range)
			if(distCovered>range)
			{
				return(true);
			}
			return(false);
	}

	function afterScroll() {

		var cityList= $(document.getElementsByClassName('destination'));
		var startLenForCity=LoadedCityLen;
		LoadedCityLen=cityList.length;
		//select cities which are already selected from group
		if(selectedCityData.length>0){
			for(var i=startLenForCity;i<LoadedCityLen;i++)
			{
				var jq = $([1]);
				jq.context = jq[0] = cityList[i];
				var cityId=jq.attr("id");
				if(searchByAttr(selectedCityData,"cityId",cityId))
				{
					//jq.className="destination-selected";
					//jq.style.cursor="initial";
					jq.css('color','green');
					//jq.toggleClass("destination-selected");
				}
			}
		}
		//some cities class might become "destination-selected"
		var cityList= $(document.getElementsByClassName('destination'));
		var groupList=$(document.getElementsByClassName('group'));
		var startLenForGroup=LoadedGroupLen;
		LoadedCityLen=cityList.length;
		LoadedGroupLen=groupList.length;
		if((selectedCityData.length>0)&&(LoadedCityLen>startLenForCity)){
			update(startLenForCity,startLenForGroup);
		}
		selectGroupIfAllCitiesSelected();
	}

	function selectGroupIfAllCitiesSelected()
	{
		var groupList=$(document.getElementsByClassName('group'));
		var i=0,j;
		while(i<groupList.length)
		{
			var jq = $([1]);
			jq.context = jq[0] = groupList[i];
			var groupId=jq.attr('id');

			if(jq.attr('class')=="group")
			{
				var numCity=$("#"+groupId).data("numofcities");
				j=0;
				while(j<numCity)
				{
					var cityId=$("#"+groupId).data("cityId"+j);
					if(!searchByAttr(selectedCityData,"cityId",cityId))
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

	var searchByAttr = function(arr, attr, value){
	    var i = arr.length;
	    while(i--){
	       if(arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value )){
	          return true;
	       }
	    }
	}

	var removeByAttr = function(arr, attr, value){
	    var i = arr.length;
	    while(i--){
	       if(arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value )){
	           arr.splice(i,1);//The second parameter of splice is the number of elements to remove
	       }
	    }
	    return arr;
	}

	function toRad(Value) {
	    /** Converts numeric degrees to radians */
	    return Value * Math.PI / 180;
	}

	function calcDist(orgLat,orgLong,destLat,destLong)
	{
		return (parseInt( 6371 * Math.acos( Math.cos( toRad(orgLat) ) * Math.cos( toRad( destLat ) ) * Math.cos( toRad( destLong ) - toRad(orgLong) ) + Math.sin( toRad(orgLat) ) * Math.sin( toRad( destLat ) ) ) ));
	}
