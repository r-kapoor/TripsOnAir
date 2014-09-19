/**
 * @author rahul and rajat
 * TODO:scrolling,if all cities of group than green,if remove a city that is in group then black,update on group cities
 *
 */

	var selectedCityId=[];
	var countofselections = 0;
	var orgLat;//Lat of the origin
	var orgLong;//Long of the origin
	var range;//Range that can be travelled by user
	var LoadedCityLen=0;//represents the length of the current loaded suggested cities as per the user scrolling

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
				update(1);

				/*for(var j=0;j<selectedCityId.length;j++)
				{
					console.log("cityID "+selectedCityId[j].cityId+","+selectedCityId[j].lat);
				}*/
				
			}
		}
	});

	$("#suggestedDest").on("click",".groupDestination",function () {

		var groupId=$(this).attr('id');
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
		//update(mark);
	});

	$("#selectedDest").on("click",".cancel",function () {
		var cityId = cityIn($(this).attr('id'));

		document.getElementById("selects-"+cityId).remove();
		document.getElementById(cityId).className="destination";
		document.getElementById(cityId).style.cursor="pointer";
		document.getElementById(cityId).style.color="black";
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

	function update(startLen)
	{
		var i=parseInt(startLen);var jq = $([1]);
		list= $(document.getElementsByClassName('destination'));
		var endLen=list.length;
		while (i < parseInt(endLen)) {
			jq.context = jq[0] = list[i];
			var cityId=jq.attr("id");
			var checkingDestLat=$("#"+cityId).data("lat");
			var checkingDestLong=$("#"+cityId).data("long");

			checkAndMark(range,checkingDestLat,checkingDestLong,function(Mark)
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
	};

	function checkAndMark(range,checkingDestLat,checkingDestLong,callback)
	{
		var startLat=orgLat;var startLong=orgLong;var endLat,endLong;
		var dist=0;var totalDistCovered=0;
		
		for(var i=0;i<selectedCityId.length;i++){
			
			endLat=selectedCityId[i].lat;endLong=selectedCityId[i].long;
			//console.log(startLat+","+startLong+","+endLat+","+endLong);
			dist=parseInt(calcDist(startLat,startLong,endLat,endLong));
			console.log("dist "+dist);
			totalDistCovered=totalDistCovered+parseInt(dist);
			startLat=endLat;startLong=endLong;	
		}
		totalDistCovered=totalDistCovered+parseInt(calcDist(endLat,endLong,checkingDestLat,checkingDestLong))+parseInt(calcDist(checkingDestLat,checkingDestLong,orgLat,orgLong));
		(totalDistCovered>range)?callback(true):callback(false);		
	}
	
	function toRad(Value) {
	    /** Converts numeric degrees to radians */
	    return Value * Math.PI / 180;
	}
	
	
	function afterScroll(callback) {
		list= $(document.getElementsByClassName('destination'));
		var startLen=length;
		var endLen=list.length;
		length=endLen;
		console.log(startLen+","+endLen);
		if((count>0)&&(endLen>length)){
			console.log("afterScroll");
			mark(range,lat,long,startLen,endLen,function(){
				callback();
			});
		}
	}