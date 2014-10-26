$(document).ready(function () {
    $('.test').each(function () {
        var $elem = $(this);
        $elem.popover({
            placement: 'right',
            trigger: 'click',
            html: true,
            container: $elem,
            //delay: {hide: 1500},
            animation: false,
            title: 'Name goes here',
            content: 'This is the popover content. You should be able to mouse over HERE.'
        });
    });
   // $('.popover').css('top',parseInt($('.popover').css('top')) + 150 + 'px');
    
    $('[data-toggle=popover]').popover();

    //$('[data-toggle=popover]').on('shown.bs.popover', function () {
      $('.popover').css('top',parseInt($('.popover').css('top')) + 100 + 'px')
    //})

});