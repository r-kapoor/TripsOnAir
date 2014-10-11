/**
 * @author rajat
 * Calling suggestDest() & suggestGroups() on scrolling which makes batch ahead by desired size
 */
$(window).data('ajaxready', true).scroll(function (e) {
	//console.log("1");
	if ($(window).data('ajaxready') == false){
		//console.log("2");
		return;
	}
        if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {
        	//console.log("3");
        	$(window).data('ajaxready', false);//To avoid multiple calls on scrolling
        	suggestDest();
        	suggestGroups();
        }
    });