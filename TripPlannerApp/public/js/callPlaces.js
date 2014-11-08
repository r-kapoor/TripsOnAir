var weight = [];
var cityIDs = [];
var minWeight = 0;
$(document).ready(function(){
	console.log("URL:"+document.URL);
	
	var currentURL=document.URL;
	var pathArray = currentURL.split('?');
	if(pathArray.length>1){
		var ajaxQuery = $.getJSON( '/places?'+pathArray[1]);
	}
	else
	{
		var ajaxQuery = $.getJSON( '/places'+$.cookie('getTravelOptions'));
	}
	//TODO:if cookie not find then redirect to invalid url
	ajaxQuery.done(function(data) {
		console.log("data:"+JSON.stringify(data));
		weight = data.weight;
		cityIDs = data.cityIDs;
		minWeight = data.minWeight;
		/*
		<li id="{OriginID}">{OriginName}</li>
		{#trip}
      	<li style="cursor:pointer" class="source" id="{.CityID}">{.CityName}</li>
  		{/trip}
		<li id="{OriginID}">{OriginName}</li>
		*/
		
		//var data1 = [{CityName:"PATNITOP",CityID:33},{CityName:"GULMARG",CityID:31}];
		var markupWithReorder = '<li style="cursor:pointer" class="source cityBorder" id="${CityID}">${CityName}</li>';
		var markupWithoutReorder = '<li class="cityBorder" id="${OriginID}">${OriginName}</li>';
		// Compile the markup as a named template
	    $.template( "orderTemplate", markupWithReorder );
	    $.template( "WOOrderTemplate", markupWithoutReorder );	    
	    // the rendered HTML
	    $.tmpl( "WOOrderTemplate", data ).appendTo( "#ordered" );
	    $.tmpl( "orderTemplate", data.trip ).appendTo( "#ordered" );
	    $.tmpl( "WOOrderTemplate", data ).appendTo( "#ordered" );
	
	    var button='<button id="orderSubmit" type="button" onclick="showRoutes()">ShowRoutes</button>';
	    $(button).appendTo("#placesOrder");
	
	});
});