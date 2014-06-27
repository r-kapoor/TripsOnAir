$(window).scroll(function () {
    console.log("testing");
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            suggestDest();
        }
    });