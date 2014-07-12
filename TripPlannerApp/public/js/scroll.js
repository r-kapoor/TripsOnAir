$(window).data('ajaxready', true).scroll(function (e) {
	if ($(window).data('ajaxready') == false) return;
        if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {
        	$(window).data('ajaxready', false);
        	suggestDest();
        }
    });