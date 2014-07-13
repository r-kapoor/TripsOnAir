$(window).data('ajaxready', true).scroll(function (e) {
	console.log("doc "+$(document).height());
	console.log("win "+$(window).height());
	console.log("scroll "+$(window).scrollTop());
	if ($(window).data('ajaxready') == false) return;
        if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {
        	$(window).data('ajaxready', false);
        	console.log("function calling");
        	suggestDest();
        }
    });