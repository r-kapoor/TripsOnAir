/**
 * Created by rajat on 5/7/2015.
 */
routesModule.filter('formatTime', function() {
    return function(input) {
        if(input.length!=8)
        {
            return input;
        }
        return input.substring(0,5);
    };
});
