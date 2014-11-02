$(document).ready(function(){
	var ajaxQuery = $.getJSON( '/places'+$.cookie('getTravelOptions'));
	ajaxQuery.done(function(data) {
		console.log("data:"+JSON.stringify(data));
		/*
		<li id="{OriginID}">{OriginName}</li>
		{#trip}
      	<li style="cursor:pointer" class="source" id="{.CityID}">{.CityName}</li>
  		{/trip}
		<li id="{OriginID}">{OriginName}</li>
		*/
		
		//var data1 = [{CityName:"PATNITOP",CityID:33},{CityName:"GULMARG",CityID:31}];
		var markupWithReorder = "<li style=\"cursor:pointer\" class=\"source\" id=\"${CityID}\">${CityName}</li>";
		var markupWithoutReorder = "<li id=\"${OriginID}\">${OriginName}</li>";
		// Compile the markup as a named template
	    $.template( "orderTemplate", markupWithReorder );
	    $.template( "WOOrderTemplate", markupWithoutReorder );	    
	    // the rendered HTML
	    $.tmpl( "WOOrderTemplate", data ).appendTo( "#ordered" );
	    $.tmpl( "orderTemplate", data.trip ).appendTo( "#ordered" );
	    $.tmpl( "WOOrderTemplate", data ).appendTo( "#ordered" );
	});
});