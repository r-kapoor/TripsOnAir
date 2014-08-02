/**
 * @author rajat
 * Algo3:
 * 
 * TODO:after selecting a group remove all of its cities in the uploaded cities list or gives warning before selection
 * TODO:select group after group
 *
 */

	var count=0;/**maintain the count of selected cities and group*/
	var flag=0;
	var orgLat;var orgLong;/**orgin city lat/long*/
	var lat;var long;/**Last selected city/group lat/long*/
	var range;/**range that can be travelled after each selection or removal*/
	var length=0;/**length of current loaded cities*/

	$("#suggestedDest").on("click",".destination",function () {
		var fact=parseInt($(this).attr('fact'));
		var id=$(this).attr("id");
		lat=$(this).attr("lat");
		long=$(this).attr("long");
		var name=$(this).text();
		var list = $(document.getElementsByClassName('destination'));length=list.length;
		orgLat=$("#values").attr("orgLat");
		orgLong=$("#values").attr("orgLong");
		var i=0;
		if((fact>0)&&(count>0))/**if selection is a group and  */
		{
			checkAndRemove(id)/**if group has already selected city and remove the common city*/
		}
		/**hide the selected city/group from the suggested city list*/
		$(this).parent().parent().hide();
		/**append the selected city/group in selected-top id and increase the count of selection*/
		append(name,id,lat,long,fact,function(){
			count++;
			/**update the range that can be travelled*/
			/**check if uploaded cities can be travelled from appended city/group and mark if not*/
			Update(mark);
			//call function that will send range,lat,long,category,start,batchsize to the backend	
		});
	});

	function checkAndMark(range,orgLat,orgLong,destLat,destLong,fact,callback)
	{
		var dist=calcDist(orgLat,orgLong,destLat,destLong,fact);
		(dist>range)?callback(true):callback(false);		
	}

	function mark(range,lat,long,startLen,endLen,callback)
	{
		console.log(range+","+lat+","+long+","+startLen+","+endLen);
		var i=parseInt(startLen);var jq = $([1]);
		list= $(document.getElementsByClassName('destination'));
		while (i < parseInt(endLen)) {
			jq.context = jq[0] = list[i];
			//console.log(jq.attr("lat"));
			checkAndMark(range,lat,long,jq.attr("lat"),jq.attr("long"),jq.attr("fact"),function(Mark)
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
	
	function toRad(Value) {
	    /** Converts numeric degrees to radians */
	    return Value * Math.PI / 180;
	}

	function calcDist(orgLat,orgLong,destLat,destLong,fact)
	{
		return (parseInt( 6371 * Math.acos( Math.cos( toRad(orgLat) ) * Math.cos( toRad( destLat ) ) * Math.cos( toRad( destLong ) - toRad(orgLong) ) + Math.sin( toRad(orgLat) ) * Math.sin( toRad( destLat ) ) ) )+parseInt(fact));
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
	
	function Update(callback){
		var list = $(document.getElementsByClassName('clect'));
		var jq = $([1]);
		var i=0;
		var totalDist=0;var startLen=0;
		var startLat=orgLat;var startLong=orgLong;var endLat,endLong,fact;
		while (i < list.length) {
			jq.context = jq[0] = list[i];
			endLat=jq.attr("lat");endLong=jq.attr("long");fact=jq.attr("fact");
			var dist=calcDist(startLat,startLong,endLat,endLong,fact);
			totalDist=totalDist+parseInt(dist);
			startLat=endLat;startLong=endLong;
			i++;
		}
		console.log("totalDist "+totalDist);
		console.log("oldRange "+$("#values").attr("range"));
		range=$("#values").attr("range")-totalDist;
		console.log("newR "+range);
		callback(range,endLat,endLong,startLen,length,function(){});
	}
	
	function checkAndRemove(id)
	{	var list = $(document.getElementsByClassName('clect'));
		var jq = $([1]);
		var i=0;var check=false;
		while (i < list.length) {
			jq.context = jq[0] = list[i];
			var Id=jq.attr("id");
			if(id.indexOf(Id)!=-1)
			{
				check=true;
				jq.parent().parent().remove();
				count--;
			}
			i++;
		}
	}

	function append(name,id,lat,long,fact,callback)
	{
		if(flag==0)
		{
			var div = document.createElement('div');
			div.innerHTML='YOUR SELECTED DESTINATIONS:';
			div.id="selected-top";
			var table=document.createElement("TABLE");
			table.setAttribute('id','sTable');
			var row = table.insertRow(0);
			row.appendChild(div);
			document.getElementById("selectedDest").appendChild(table);
			flag=1;
		}
			var div = document.createElement('div');
			div.innerHTML=name;
			div.id=id;
			div.className="clect";
			div.setAttribute('lat',lat);
			div.setAttribute('long',long);
			div.setAttribute('fact',fact);
			var close=document.createElement('div');
			close.innerHTML="X";
			close.className="remove";
			close.setAttribute('style','cursor:pointer');
			
			var table=document.getElementById("sTable");
			var row = table.insertRow(count+1);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			cell1.appendChild(div);
			cell2.appendChild(close);
			callback();
	}
	
	$(document).on("click",".remove",function () {
		var id=$(this).parent().prev().children().attr('id');
		$(this).parent().parent().remove();
		count--;
		/**show the removed city/group in the loaded city*/
		$("#"+id).parent().parent().show();
		/**update the range that can be travelled*/
		/**check if uploaded cities can be travelled from appended city/group and mark if not*/
		Update(mark);
		//call the daddy function dude
		
	});