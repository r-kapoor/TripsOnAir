/**
 * New node file
 */

function showRoutes()
{
	//createMetaData();
	//$("#placesOrder").remove();
	var url=document.URL;
	var urlAttrs=url.split("?")[1];
	console.log(urlAttrs);
	var query=createQuery();
	//console.log("query:"+query);
	var ajaxQuery = $.getJSON('/showRoutes?'+query+"&"+urlAttrs);

	console.log("query:"+'/showRoutes?'+query+"&"+urlAttrs);

	ajaxQuery.done(function(data) {

        if(data.tripNotPossible!=undefined && data.tripNotPossible==1)
        {
            console.log("TRIP IS NOT POSSIBLE");
        }
		console.log("GotData:"+data);
		console.log("GotData:"+JSON.stringify(data));

		$("#page3Input").val(JSON.stringify(data));

		var oneWayData = [
		                  { CityName: "Delhi", City2City: "Delhi-Bangalore",
		                	RouteOfTravelData:[
		                	    {
		                	    	uniqueId:"1",
									routeName:"fly",
									totalDistance:"456km",
									totalDuration:"2hr",
									stopsArray:[{stops:"delhi",duration:"1hr",price:"1200rs"},{stops:"mumbai"},{stops:"bangalore"}]
								},
								{
									uniqueId:"2",
									routeName:"train",
									stopsArray:[{stops:"delhi",duration:"1hr",price:"1200rs"},{stops:"mumbai1"},{stops:"bangalore"}]
								},
								{
									uniqueId:"3",
									routeName:"bus",
                          			stopsArray:[{stops:"delhi",duration:"1hr",price:"1200rs"},{stops:"mumbai2"},{stops:"bangalore"}]
								}
								]
		                  },
		                  { CityName: "Bangalore", City2City: "Bangalore-Chennai",
		                	  RouteOfTravelData:[
		         		                	    {
		         		                	    	uniqueId:"4",
		         									routeName:"fly",
		         									stopsArray:[{stops:"delhi"},{stops:"mumbai"},{stops:"bangalore"}]
		         								},
		         								{
		         									uniqueId:"5",
		         									routeName:"train",
		         									stopsArray:[{stops:"delhi"},{stops:"mumbai1"},{stops:"bangalore"}]
		         								},
		         								{
		         									uniqueId:"6",
		                                   		routeName:"bus",
		                                   			stopsArray:[{stops:"delhi"},{stops:"mumbai2"},{stops:"bangalore"}]
		         								}
		         								]

		                  },
		                  { CityName: "Chennai", City2City: "Chennai-Delhi",
		                	  RouteOfTravelData:[
		         		                	    {
		         		                	    	uniqueId:"7",
		         									routeName:"fly",
		         									stopsArray:[{stops:"delhi"},{stops:"mumbai"},{stops:"bangalore"}]
		         								},
		         								{
		         									uniqueId:"8",
		         									routeName:"train",
		         									stopsArray:[{stops:"delhi"},{stops:"mumbai1"},{stops:"bangalore"}]
		         								},
		         								{
		         									uniqueId:"9",
		                                   		routeName:"bus",
		                                   			stopsArray:[{stops:"delhi"},{stops:"mumbai2"},{stops:"bangalore"}]
		         								}
		         								]


		                  }
		              ];
		var returnRouteData = [{CityName: "Delhi"}];

		var RouteOfTravelData=[{
											routeName:"fly",
											stopsArray:[{stops:"delhi"},{stops:"mumbai"},{stops:"bangalore"}]
										},
		                               {
											routeName:"train",
											stopsArray:[{stops:"delhi"},{stops:"mumbai1"},{stops:"bangalore"}]
		                            	},
		                               {
		                            		routeName:"bus",
		                            			stopsArray:[{stops:"delhi"},{stops:"mumbai2"},{stops:"bangalore"}]
		                            	}
		                            	];


		//var markup = "<li><b>${first}</b> (${last})</li>";
		var commonTemplate=getCommonTemplate();
		$(commonTemplate).appendTo("#travelOptions");
		var oneWayRouteTemplate=getOneWayRouteTemplate();
		$.template( "oneWayRouteTemplate", oneWayRouteTemplate);
		$.tmpl( "oneWayRouteTemplate", oneWayData ).appendTo("#common-template-ui");

		var returnRouteTemplate=getReturnRouteTemplate();
		$.template( "returnRouteTemplate", returnRouteTemplate);
		$.tmpl( "returnRouteTemplate", returnRouteData).appendTo("#common-template-ui");


		var collapseRouteOfTravelTemplate=getCollapseRouteOfTravelTemplate();
		$.template( "collapseRouteOfTravelTemplate",collapseRouteOfTravelTemplate);

		var modeOfTravelTemplate=getModeOfTravelTemplate();
		$.template( "modeOfTravelTemplate",modeOfTravelTemplate);

		for(var i=0;i<oneWayData.length;i++)
		{
			var City2CityId=oneWayData[i].City2City;
			$.tmpl( "collapseRouteOfTravelTemplate",oneWayData[i].RouteOfTravelData).appendTo("#"+City2CityId);
			for(var j=0; j<oneWayData[i].RouteOfTravelData.length; j++)
			{
				//var routeNameId = oneWayData[i].RouteOfTravelData[j].routeName;
				$.tmpl( "modeOfTravelTemplate",oneWayData[i].RouteOfTravelData[j].stopsArray).insertAfter("#"+oneWayData[i].RouteOfTravelData[j].uniqueId);
			}
		}
		console.log("data:"+JSON.stringify(oneWayData[0].RouteOfTravelData[0].stopsArray));
		console.log('hello');
		//$.tmpl( "modeOfTravelTemplate",oneWayData[0].RouteOfTravelData[0].stopsArray).appendTo("#1");

		//$.template( "clientTemplate", markup);
		/*$.tmpl( "clientTemplate", clientData ).appendTo("#travelOptions");*/
		createScript('classie');
		createScript('mlpushmenu');
		//$("#clientTemplate").tmpl(clientData).appendTo("div");
	});
}

function createQuery()
{
	var query="cities=";
	var cityIDParam="cityIDs=";
	var items = [];
    $("ul.citiesOrder").children().each(function() {
      var item = $(this).text();
      var id=$(this).attr('id');
      query+=item+",";
      cityIDParam+=id+",";
      //items.push(item);
    });
    return (query.substring(0,(query.length-1))+"&"+cityIDParam.substring(0,(cityIDParam.length-1)));
}

function createScript(attribute)
{
	var Element = document.createElement('script');
	Element.setAttribute('src','js/page2JSFunctions/'+attribute+'.js');
  	document.head.appendChild(Element);
}

function createMetaData()
{

	var E2=document.createElement('meta');
	E2.setAttribute('http-equiv','X-UA-Compatible');
	E2.setAttribute('content','IE=edge,chrome=1');
	document.head.appendChild(E2);
	var Element = document.createElement('meta');
	Element.setAttribute('name','viewport');
	Element.setAttribute('content','width=device-width, initial-scale=1.0');
	/*var Element='<meta charset="UTF-8" />'
	+'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'
	+'<meta name="viewport" content="width=device-width, initial-scale=1.0">';*/
	document.head.appendChild(Element);



}


function getRouteTemplate()
{
	var template='<div class="container">'
		+'<!-- Push Wrapper -->'
	+'<div class="mp-pusher" id="mp-pusher">'

		+'<!-- mp-menu -->'
		+'<nav id="mp-menu" class="mp-menu">'
			+'<div class="mp-level">'
				+'<h2 class="icon icon-world">Trip Overview</h2>'
				+'<ul>'


					+'<li class="icon icon-arrow-left">'
						+'<a class="icon icon-display" href="#">Devices</a>'
						+'<div class="mp-level">'
							+'<h2 class="icon icon-display">Devices</h2>'
							+'<a class="mp-back" href="#">back</a>'
							+'<ul>'

								+'<li class="icon icon-arrow-left">'
									+'<a class="icon icon-phone" href="#">Mobile Phones</a>'
									+'<div class="mp-level">'
										+'<h2>Mobile Phones</h2>'
										+'<a class="mp-back" href="#">back</a>'
										+'<ul>'
											+'<li><a href="#">Super Smart Phone</a></li>'
											+'<li><a href="#">Thin Magic Mobile</a></li>'
											+'<li><a href="#">Performance Crusher</a></li>'
											+'<li><a href="#">Futuristic Experience</a></li>'
										+'</ul>'
									+'</div>'
								+'</li>'

								+'<li class="icon icon-arrow-left">'
									+'<a class="icon icon-tv" href="#">Televisions</a>'
									+'<div class="mp-level">'
										+'<h2>Televisions</h2>'
										+'<a class="mp-back" href="#">back</a>'
										+'<ul>'
											+'<li><a href="#">Flat Superscreen</a></li>'
											+'<li><a href="#">Gigantic LED</a></li>'
											+'<li><a href="#">Power Eater</a></li>'
											+'<li><a href="#">3D Experience</a></li>'
											+'<li><a href="#">Classic Comfort</a></li>'
										+'</ul>'
									+'</div>'
								+'</li>'
								+'<li class="icon icon-arrow-left">'
									+'<a class="icon icon-camera" href="#">Cameras</a>'
									+'<div class="mp-level">'
										+'<h2>Cameras</h2>'
										+'<a class="mp-back" href="#">back</a>'
										+'<ul>'
											+'<li><a href="#">Smart Shot</a></li>'
											+'<li><a href="#">Power Shooter</a></li>'
											+'<li><a href="#">Easy Photo Maker</a></li>'
											+'<li><a href="#">Super Pixel</a></li>'
											+'</ul>'
										+'</div>'
									+'</li>'
							+'</ul>'
						+'</div>'
					+'</li>'
				+'<li><a class="icon icon-photo" href="#">Collections</a></li>'
				+'<li><a class="icon icon-wallet" href="#">Credits</a></li>'



				+'</ul>'

				+'	</div>'
				+'</nav>'
				+'<!-- /mp-menu -->'

				+'<div class="scroller">'
				+'<div class="scroller-inner">'
				+'<header class="codrops-header">'
				+'<h1>Google Map <span>show destinations</span></h1>'
				+'</header>'
				+'<div class="content clearfix">'
				+'<div class="block block-40 clearfix">'
				+'	<p><a href="#" id="trigger" class="menu-trigger">Open/Close Menu</a></p>'
				+'</div>'
				+'</div>'
				+'</div>'
			+'</div><!-- /scroller -->'
		+'</div><!-- /pusher -->'
	+'</div><!-- /container -->';
	//+'<script src="js/page2JSFunctions/classie.js"></script>'
	//+'<script src="js/page2JSFunctions/mlpushmenu.js"></script>';

	return template;
}

function getCommonTemplate(){

	var template='<!-- Push Wrapper -->'
		+'<div class="mp-pusher" id="mp-pusher">'

			+'<!-- mp-menu -->'
			+'<nav id="mp-menu" class="mp-menu">'
				+'<div class="mp-level">'
					+'<h2 class="icon icon-world">Trip Overview</h2>'
					+'<ul id="common-template-ui">'
					+'</ul>'

					+'	</div>'
					+'</nav>'
					+'<!-- /mp-menu -->'

					+'<div class="scroller">'
					+'<div class="scroller-inner">'
					+'<header class="codrops-header">'
					+'<h1>Google Map <span>show destinations</span></h1>'
					+'</header>'
					+'<div class="content clearfix">'
					+'<div class="block block-40 clearfix">'
					+'	<p><a href="#" id="trigger" class="menu-trigger">Open/Close Menu</a></p>'
					+'</div>'
					+'</div>'
					+'</div>'
				+'</div><!-- /scroller -->'
			+'</div><!-- /pusher -->'

	return template;

}


function getOneWayRouteTemplate()
{
	var template='<li><a class="icon icon-photo" href="#">${CityName}</a></li>'
	+'<li class="icon icon-arrow-left">'
	+'<a class="icon icon-display" href="#">modes</a>'
	+'<div class="mp-level">'
		+'<h2 class="icon icon-display">${City2City}</h2>'
		+'<a class="mp-back" href="#">back</a>'
		+'<ul id="${City2City}">'
		+'</ul>'
		+'</div>'
		+'</li>'
return template;
}

function getReturnRouteTemplate()
{
	var template='<li><a class="icon icon-photo" href="#">${CityName}</a></li>';
	return template;
}


function getCollapseRouteOfTravelTemplate()
{
	var template='<li id="${uniqueId}"><a href="#">${routeName}</a></li>';
	return template;
}


function getModeOfTravelTemplate()
{
	var template='<li class="icon icon-arrow-left">'
	+'<a class="icon icon-phone" href="#">'
	//+'${stops}'
	+'<h9>${stops},${duration},${price}</h9>'
	//+'<h6>${duration}</h6>'
	//+'<h7>${price}</h7>'
	+'</a>'
	+'<div class="mp-level">'
		+'<h2>${stops}</h2>'
		+'<a class="mp-back" href="#">back</a>'
		+'<ul>'
		+'</ul>'
	+'</div>'
+'</li>';

	return template;
}


