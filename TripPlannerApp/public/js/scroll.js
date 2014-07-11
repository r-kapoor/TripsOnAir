$(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            suggestDest();
        }
    });