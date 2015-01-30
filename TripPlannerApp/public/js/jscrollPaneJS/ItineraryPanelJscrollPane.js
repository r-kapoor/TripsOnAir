$(window).load(function(){
	console.log("t1");
	 var orgElement=angular.element(document.querySelector("#destinationsPanel"));
	 console.log("orgElement:"+orgElement);
	 var destE=document.getElementById("#destinationsPanel");
	 console.log("destE:"+destE);
	$('#destinationsPanel').jScrollPane({
	horizontalGutter:5,
	verticalGutter:5,
	'showArrows': false
	});
	 jQuery("#destinationsPanel").jScrollPane({
	horizontalGutter:5,
	verticalGutter:5,
	'showArrows': false
	});
	orgElement.css( "background-color:black" );
	$('.jspDrag').hide();
	$('.jspScrollable').mouseenter(function(){
		console.log("t3");
		$('.jspDrag').stop(true, true).fadeIn('slow');
	});
	$('.jspScrollable').mouseleave(function(){
		$('.jspDrag').stop(true, true).fadeOut('slow');
	});

});