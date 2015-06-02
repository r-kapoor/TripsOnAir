/**
 * Created by rkapoor on 01/06/15.
 */
'use strict';

module.exports = function concat(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Options
    return {
        dist : {
            src : [
                'public/js/angularController/travelPageAngularController/routesApp.js',
                'public/js/angularController/travelPageAngularController/shabari.js',
                'public/js/angularController/travelPageAngularController/sanjaya.js',
                'public/js/angularController/travelPageAngularController/sarathi.js',
                'public/js/angularController/travelPageAngularController/surya.js',
                'public/js/angularController/travelPageAngularController/indra.js',
                'public/js/angularService/travelPageAngularService/orderedCitiesService.js',
                'public/js/angularFilter/titleCase.js',
                'public/js/angularFilter/formatTime.js',
                'public/js/angularJS/angular-pageslide-directive.js',
                'public/js/angularJS/ngDraggable.js',
                'public/js/angularController/travelPageAngularController/balarama.js',
                'public/js/jscrollPaneJS/jquery.mousewheel.js',
                'public/js/jscrollPaneJS/jquery.jscrollpane.min.js',
                'public/js/angularJS/angular-jscrollpane.js'
            ],
            dest : 'public/js/production/travelPage.js'
        }
    };
};
