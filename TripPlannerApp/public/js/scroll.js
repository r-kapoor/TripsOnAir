$(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            console.log('Called');
			suggestDest();
        }
    });