/**
 * @author rajat
 * Calling suggestDest() & suggestGroups() on scrolling which makes batch ahead by desired size
 */
$(window).data('ajaxready', true).scroll(function (e) {
	if ($(window).data('ajaxready') == false) return;
        if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {
        	$(window).data('ajaxready', false);//To avoid multiple calls on scrolling
        	suggestDest();
        	suggestGroups();
        }
    });