/**
 * New node file
 */

function showRoutes()
{
	
	var query=createQuery();
	console.log("query:"+query);
	//var ajaxQuery = $.getJSON('/showRoutes?'+query);
	//ajaxQuery.done(function(data) {
		
		//console.log("GotData:"+data);		
		
		var clientData = [
		                  { first: "Rey", last: "Bango", age: 42, id: 1, phone: [ "954-600-1234", "954-355-5555" ] }
		              ];
		//var markup = "<li><b>${first}</b> (${last})</li>";
		var markup=getRouteTemplate();
		$.template( "clientTemplate", markup);
		$.tmpl( "clientTemplate", clientData ).appendTo("#travelOptions");
		createScript('classie');
		createScript('mlpushmenu');
		//$("#clientTemplate").tmpl(clientData).appendTo("div");
	//});
}

function createQuery()
{
	query="cities=";
	var items = [];
    $("ul.citiesOrder").children().each(function() {
      var item = $(this).text();
      query+=item+",";
      //items.push(item);
    });
    return (query.substring(0,(query.length-1)));
}

function createScript(attribute)
{
	var Element = document.createElement('script');
	Element.setAttribute('src','js/page2JSFunctions/'+attribute+'.js');
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